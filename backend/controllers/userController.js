/**
 * Internal dependencies
 */
const userService = require('../services/userService');

/** 
 * This is for login functionality
 *  
 * @param {Object} req - Express request object
 * @param {Object} req.body - Body containing email and password
 * @param {Object} res - Express response object
 * 
 * @returns {Object} - Returns a JSON response with status code, status, message, and user data
 */
const login = async (req, res)=>{
    try{
        const { email, password } = req.body;
        const userData = await userService.login( email, password );
        res.status(userData.code).send({ status: userData.status, message: userData.message, data: userData.data })
    }catch(e){
        res.status(500).json({ status:'Error', message:'Internal Server error' });
    }
}

/** 
 * This is for signup functionality
 *  
 * @param {Object} req - Express request object
 * @param {Object} req.body - Body containing name, email and password
 * @param {Object} res - Express response object
 * 
 * @returns {Object} - Returns a JSON response with status code, status, message, and user data
 */
const signup = async (req, res)=>{
    try{
        // get Input
        const { name, email, password } = req.body;
        const userData = await userService.signup(name, email, password, req.body?.emailPreference, req.body?.pushPreference);
        res.status(userData.code).send({ status: userData.success, message: userData.message, user: userData.createdUser });
    }catch(e){
        res.status(500).json({ status:'Error', message:'Internal Server error' });
    }
}

/** 
 * This is for update functionality
 *  
 * @param {Object} req - Express request object
 * @param {Object} req.user.id - user.id containing user id of the user
 * @param {Object} req.body - Body containing updates for the user account
 * @param {Object} res - Express response object
 * 
 * @returns {Object} - Returns a JSON response with status code, status, message, and user data
 */
const updateUser = async (req, res)=>{
    try{
        const userId = req.user.id;
        const updates = req.body;
        const userData = await userService.updateUser(userId, updates);
        res.status(userData.code).send({status : userData.status, message: userData.message, updatedUser: userData.updatedUser});
    }catch(e){
        res.status(500).send({status : 'Error', message: 'Failed to update user', error: e.message});
    }
}

/** 
 * This is for delete functionality
 *  
 * @param {Object} req - Express request object
 * @param {Object} req.user.id - user.id containing user id of the user
 * @param {Object} res - Express response object
 * 
 * @returns {Object} - Returns a JSON response with status code, status, message, and user data
 */
const deleteUser = async (req, res)=>{
    try{
        const userId = req.user.id;
        const userData = await userService.deleteUser(userId);
        res.status(userData.code).send({ status : userData.status, message: userData.message });
    }
    catch(e){
        res.status(500).send({status : 'Error', message: 'Failed to delete user', error: e.message});
    }
}

const saveSubscription = async (req, res)=>{
    try{
        const userId = req.user.id;
        const data = req.body;
        const subscriptionData = await userService.saveSubscription(userId, data);
        res.status(subscriptionData.code).send({ status : subscriptionData.status, message: subscriptionData.message });
    }
    catch(e){
        res.status(500).send({status : 'Error', message: 'Failed to subscribe user', error: e.message});
    }
}

// Export functions
module.exports = {
    login,
    signup,
    updateUser,
    deleteUser,
    saveSubscription
}