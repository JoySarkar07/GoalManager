const goalService = require('../services/goalService');

// Functions for goals
const createGoal = async (req, res)=>{
    try{
        const userId = req.user.id;
        const { title, isGroup, parentGoalId } = req.body;
        const createdGoal = await goalService.createGoal(userId, title, isGroup, parentGoalId);
        res.status(createdGoal.code).send({status: createdGoal.status, message: createdGoal.message, data: createdGoal.data});
    }
    catch(e){
        res.status(500).send({status:'Error', message:'Internal Server Error', error: e.message});
    }
}

const getGoals = async (req, res)=>{
    try{
        const userId = req.user.id;
        // get query
        const query = req.query;
        const goalData = await goalService.getGoals(userId, query);
        res.status(goalData.code).send({status: goalData.status, data: goalData.data, total: goalData.total});
    }
    catch(e){
        res.status(500).send({status:'Error', data:'Internal Server Error', error: e.message});
    }
}

const updateGoals = async (req, res)=>{
    try{
        const goalId = req.params.goalId;
        const updates = req.body;
        const updatedGoalData = await goalService.updateGoals( goalId, updates );
        res.status(updatedGoalData.code).send({status: updatedGoalData.status, data: updatedGoalData.data});
    }
    catch(e){
        res.status(500).send({status:'Error', data:'Internal Server Error', error: e.message});
    }
}

const deleteGoal = async (req, res)=>{
    try{
        const goalId = req.params.goalId;
        const deletedGoalData = await goalService.deleteGoal( goalId );
        res.status(deletedGoalData.code).send({status: deletedGoalData.status, data: deletedGoalData.data});
    }
    catch(e){
        res.status(500).send({status:'Error', data:'Internal Server Error', error: e.message});
    }
}

// Functions for works
const createWork = async (req, res)=>{
    try{
        const goalId = req.params.goalId;
        const inpData = req.body;
        const workData = await goalService.createWork(goalId, inpData);
        res.status(workData.code).send({status: workData.status, message: workData.message, data: workData.data});
    }catch(e){
        res.status(500).send({status:'Error', message:'Internal Server Error', error: e.message});
    }
}

const getWork = async (req, res)=>{
    try{
        const goalId = req.params.goalId;
        // get query
        const query = req.query;
        const workData = await goalService.getWork(goalId, query);
        res.status(workData.code).send({status: workData.status, message:workData.message, data: workData.data, total: workData.total});
    }catch(e){
        res.status(500).send({status:'Error', data:'Internal Server Error', error: e.message});
    }
}

const updateWork = async (req, res)=>{
    try{
        const goalId = req.params.goalId;
        const workId = req.params.workId;
        const updates = req.body;
        const updatedWorkData = await goalService.updateWork( goalId, workId, updates );
        res.status(updatedWorkData.code).send({status: updatedWorkData.status, data: updatedWorkData.data});
    }
    catch(e){
        res.status(500).send({status:'Error', data:'Internal Server Error', error: e.message});
    }
}

const deleteWork = async (req, res)=>{
    try{
        const goalId = req.params.goalId;
        const workId = req.params.workId;
        const deletedWorkData = await goalService.deleteWork( goalId, workId );
        res.status(deletedWorkData.code).send({status: deletedWorkData.status, data: deletedWorkData.data});
    }
    catch(e){
        res.status(500).send({status:'Error', data:'Internal Server Error', error: e.message});
    }
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