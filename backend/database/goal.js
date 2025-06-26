const GoalSchema = require('../models/Goal');
const User = require('../models/User');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer'); // if you're using email
const webPush = require('web-push'); // if you're using push notifications
const { DateTime } = require("luxon");

// Functions for goals
const createGoal = async (userId, title, isGroup, parentGoalId)=>{
    try{
        let parentGoal;
        if(parentGoalId){
            parentGoal = await GoalSchema.findById(parentGoalId).select('_id isGroup user');
            if (!parentGoal || !parentGoal.isGroup) {
                return ({ code: 404, status: 'Error', message: 'Goal not found or is not a group' });
            }

            if (String(parentGoal.user) !== userId) {
                return ({ code: 403, status: 'Error', message: "You don't have access rights to the content" });
            }
        }
        // save the data to the user
        const createdGoal = await GoalSchema.create({
            title,
            isGroup,
            user: userId,
            parent: parentGoal?._id
        });

        return ({code:201, status:'Ok', message:'Goal created Successfully', data:createdGoal})
    }
    catch(e){
        return ({code:500, status:'Error', message:'Enternal Server Error'});
    }
}

const getGoals = async (userId, query = {})=>{
    try{
        const { title, isGroup, page, limit } = query;

        let currentPage = Number(page) || 1;
        let itemsPerPage = Number(limit) || 10;

        // Build dynamic filter
        const filter = {
            user: userId,
            parent: null
        };

        // Add title search (case-insensitive partial match)
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        // Add isGroup filter if provided
        if (isGroup !== undefined && isGroup !== '') {
            filter.isGroup = isGroup === 'true'; // Convert string to boolean
        }

        // add pagination
        // formula : (page - 1) * itemsPerPage + 1
        const skip = (currentPage - 1) * itemsPerPage;
        console.log({skip});

        let rootGoals = await GoalSchema.find(filter).select('_id title isGroup').skip(skip).limit(itemsPerPage);
        if( !rootGoals ) return ({code:404, status:'Error', data: 'Goal not found or does not exist' });
        if(rootGoals.length === 0){
            delete filter.parent;
            rootGoals = await GoalSchema.find(filter).select('_id title isGroup');
        }
        const tree = await Promise.all(
            rootGoals.map(async (goal) => {
                return await buildGoalTree(goal, query);
            })
        );

        return ({code:201, status:'Ok', data:tree, total: rootGoals.length })
    }
    catch(e){
        return ({code:500, status:'Error', data:'Enternal Server Error', total: 0});
    }
}

const updateGoals = async (goalId, updates)=>{
    try{
        const updateGoalData = await GoalSchema.findByIdAndUpdate(
            goalId,
            { $set: updates},
            { new: true, runValidators: true}
        );
        if( !updateGoalData ) return ({code:404, status:'Error', data: 'Goal not found or does not exist' });
        return ({code:201, status:'Ok', data: updateGoalData })
    }
    catch(e){
        return ({code:500, status:'Error', data:'Enternal Server Error'});
    }
}

const deleteGoal = async ( goalId )=>{
    try{
        const deletedGoal = await GoalSchema.findByIdAndDelete( goalId );
        if( !deletedGoal ) return ({code:404, status:'Error', data: 'Goal not found or does not exist' });
        if( deletedGoal.isGroup ){
            const subGoals = await GoalSchema.find( { parent: goalId } ).select("_id");
            subGoals.map( goal=>{
                deleteGoal(goal._id);
            })
        }
        return ({ code:201, status:'Ok', data: "Goal successfully removed" })
    }
    catch(e){
        return ({ code:500, status:'Error', data:'Enternal Server Error' });
    }
}

// Functuions for works
const createWork = async (goalId, inpData)=>{
    try{
        const goal = await GoalSchema.findById( goalId );
        if( ! goal || goal.isGroup ){
            return ( { code:404, status:'Error', message:'Goal not found or is a group' } )
        }
        // 🔁 Convert dueDate string to Date object in IST
        const istDate = DateTime.fromFormat(inpData.dueDate, "yyyy-MM-dd'T'HH:mm", {
            zone: "Asia/Kolkata",
        });
        inpData.dueDate = istDate.toJSDate();

        const newWork = goal.works.create( inpData );
        goal.works.push( newWork );

        const user = await getUser( goal.user );
        scheduleJob( getAlertTime(inpData.dueDate, Number(inpData.emailTime)), getAlertTime(inpData.dueDate, Number(inpData.webTime)), user, newWork, goalId );

        const newGoal = await goal.save();
        return ({code:201, status:'Ok', message:'New work is added', data: newGoal })
    }
    catch(e){
        return ({code:500, status:'Error', message:'Enternal Server Error', data: null});
    }
}

const getWork = async (goalId, query)=>{
    try{
        const { title, priority, completed, dueDate, page, limit } = query;

        let currentPage = Number(page) || 1;
        let itemsPerPage = Number(limit) || 10;

        const skip = (currentPage - 1) * itemsPerPage ;

        const result = await GoalSchema.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(goalId),
                    isGroup: false // exclude group-type goals
                }
            },
            {
                $project: {
                    works: {
                        $filter: {
                            input: "$works",
                            as: "work",
                            cond: {
                                $and: [
                                {
                                    $regexMatch: {
                                    input: "$$work.title",
                                    regex: title || "",
                                    options: "i"
                                    }
                                },
                                ...(priority ? [{ $eq: ["$$work.priority", priority] }] : []),
                                ...(typeof completed !== "undefined"
                                    ? [{ $eq: ["$$work.completed", completed === "true"] }]
                                    : []),
                                ...(dueDate
                                    ? [{ $gte: ["$$work.dueDate", new Date(dueDate)] }]
                                    : [])
                                ]
                            }
                        }
                    }
                }
            },
            // Add pagination after filtering
            {
                $unwind: "$works"
            },
            {
                $skip: skip
            },
            {
                $limit: itemsPerPage
            },
            {
                $group: {
                _id: "$_id",
                isGroup: { $first: "$isGroup" },
                works: { $push: "$works" }
                }
            }
        ]);

        if( ! result ){
            return ({code:404, status:'Error', message:'Goal not found or is a group'});
        }

        if ( result.length === 0) {
            return ({
                code: 200,
                status: 'Ok',
                message: 'No works found',
                data: [],
                total: 0
            });
        }

        const works = result[0].works;
        return ({code:201, status:'Ok', message:'Fetched Successfully', data: works, total: works.length});
    }
    catch(e){
        return ({code:500, status:'Error', message:'Enternal Server Error', data: null, total: 0});
    }
}

const updateWork = async (goalId, workId, updates)=>{
    try{
        const updateWorkData = await GoalSchema.findOneAndUpdate(
            { _id: goalId, "works._id": workId },
            { $set: buildUpdateQuery('works', updates) },
            { new: true, runValidators: true }
        );
        if( !updateWorkData ) return ({code:404, status:'Error', data: 'Goal not found or Work does not exist' });
        return ({code:201, status:'Ok', data: updateWorkData })
    }
    catch(e){
        return ({code:500, status:'Error', data:'Enternal Server Error'});
    }
}

const deleteWork = async (goalId, workId)=>{
    try{
        const deletedGoal = await GoalSchema.findOneAndUpdate(
            { _id: goalId },
            { $pull: { works: { _id: workId } } },
            { new: true }
        );
        if( !deletedGoal ) return ({code:404, status:'Error', data: 'Goal not found or Work does not exist' });
        return ({code:201, status:'Ok', data: deletedGoal })
    }
    catch(e){
        console.log({e});
        return ({code:500, status:'Error', data:'Enternal Server Error'});
    }
}

// Recursive function to build goal tree
const buildGoalTree = async (goal,  query = {}) => {
    try{
        const { title } = query;

        // Build dynamic filter
        const filter = {
            parent: goal._id
        };

        // Add title search (case-insensitive partial match)
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        const children = await GoalSchema.find(filter).select('_id title isGroup');

        const childrenWithSubGoals = await Promise.all(
            children.map(async (child) => {
                return await buildGoalTree(child);
            })
        );

        return {
            ...goal.toObject(),
            subGoals: childrenWithSubGoals
        };
    }catch(e){
        return {}
    }
};

const buildUpdateQuery = (parent, updates) => {
  const setQuery = {};
  for (const key in updates) {
    if (updates[key] !== undefined) {
      setQuery[`${parent}.$.${key}`] = updates[key];
    }
  }
  return setQuery;
};

const scheduleJob = ( emailAlertTime, webAlertTime, user, workData, goalId )=>{
    if( user?.notificationPreferences?.email ){
        schedule.scheduleJob(emailAlertTime, async () => {
            const goal = await GoalSchema.findById( goalId ); // Ensure goalId is included in workData
            const work = goal?.works.id( workData._id ); // Fetch work by id from embedded array

            if (!work || work.completed) return; // 🛑 Don't send if work not exists or already completed
            // 🟢 You can send email here
            sendEmail(
                user.email, 
                'Reminder Mail From GoalManager', 
                `Hi there,
                Just a quick reminder that your task "${ workData.title }" is due soon.
                You've already made progress by planning it — now it's time to finish strong! 💪

                Stay focused and take one step at a time. Completing this task will bring you closer to your goals.

                ✅ You’ve got this!

                Best wishes,
                GoalManager Team`
            );
        });
    }
    if (user.pushSubscription && user.notificationPreferences?.push) {
        schedule.scheduleJob(webAlertTime, async () => {
            const goal = await GoalSchema.findById( goalId ); // Ensure goalId is included in workData
            const work = goal?.works.id( workData._id ); // Fetch work by id from embedded array

            if (!work || work.completed) return; // 🛑 Don't send if work not exists or already completed
            // 🟢 Or send a push notification
            await webPush.sendNotification(
                user.pushSubscription,
                JSON.stringify({
                    title: 'Work Reminder',
                    body: `Your task "${ workData.title }" is due, Please complete it.`
                })
            );
        });
    }
}

const getAlertTime = (dueDateInp, timeInHr)=>{
    const dueDate = new Date( dueDateInp || Date.now() );
    const alertTime = new Date( dueDate.getTime() - ( timeInHr * 60 ) * 60 * 1000 );
    return alertTime;
}

const sendEmail = (userEmail, subject, message)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APPPASSWORD
        }
    })

    // Define the email options
    const mailOptions = {
        from : 'GoalManager',
        to : userEmail,
        subject : subject,
        text : message,
    }

    // Send the email
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log("Error sending email : ",error);
        }else{
            console.log("Email send successfully");
        }
    })
}

const getUser = async ( userId )=>{
    const userData = await User.findById(userId).select('email notificationPreferences pushSubscription');
    return userData;
}


module.exports = {
    createGoal,
    getGoals,
    updateGoals,
    deleteGoal,
    createWork,
    getWork,
    updateWork,
    deleteWork
}