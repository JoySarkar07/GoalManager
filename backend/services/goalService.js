const goal = require('../database/goal');

// Functions for goals
const createGoal = async (userId, title, isGroup, parentGoalId)=>{
    const createdGoal = await goal.createGoal(userId, title, isGroup, parentGoalId);
    return createdGoal;
}
const getGoals = (userId, query)=>{
    const goalData = goal.getGoals(userId, query);
    return goalData;
}

const updateGoals = (goalId, updates)=>{
    const updatedGoalData = goal.updateGoals(goalId, updates);
    return updatedGoalData;
}

const deleteGoal = ( goalId )=>{
    const deletedGoalData = goal.deleteGoal( goalId );
    return deletedGoalData;
}

// Functions for works
const createWork = async (goalId, inpData)=>{
    const workData = await goal.createWork(goalId, inpData);
    return workData;
}

const getWork = async (goalId, query)=>{
    const workData = await goal.getWork(goalId, query);
    return workData;
}

const updateWork = (goalId, workId, updates)=>{
    const updatedWorkData = goal.updateWork(goalId, workId, updates);
    return updatedWorkData;
}

const deleteWork = (goalId, workId)=>{
    const deletedWorkData = goal.deleteWork(goalId, workId);
    return deletedWorkData;
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