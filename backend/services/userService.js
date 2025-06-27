/**
 * Internal dependencies
 */
const user = require('../database/user');

/**
 * login functionality to authenticate a existing user.
 * 
 * @async
 * @function
 * @param {string} email - Email address of the user
 * @param {string} password - Password chosen by the user
 * 
 * @returns {Promise<Object>} Returns a promise that resolves to an object containing status code, message, and user data
 */
const login= async ( email, password )=>{
    const userData = await user.login( email, password );
    return userData;
}

/**
 * Signup functionality to create a new user account.
 * 
 * @async
 * @function
 * @param {string} name - Name of the user
 * @param {string} email - Email address of the user
 * @param {string} password - Password chosen by the user
 * 
 * @returns {Promise<Object>} Returns a promise that resolves to an object containing status code, message, and user data
 */
const signup = async (name, email, password, emailPreference, pushPreference)=>{
    const userData = await user.signup(name, email, password, emailPreference, pushPreference);
    return userData;
}

/**
 * Updates user details based on the provided fields.
 * 
 * @async
 * @function
 * @param {string} userId - ID of the user to be updated
 * @param {Object} updates - An object containing the fields to be updated
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing the status code, message, and updated user data
 */
const updateUser = async (userId, updates)=>{
    const userData = await user.updateUser(userId, updates);
    return userData;
}

/**
 * Deletes a user account by user ID.
 * 
 * @async
 * @function
 * @param {string} userId - ID of the user to be deleted
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing the status code and message
 */
const deleteUser = async (userId)=>{
    const userData = await user.deleteUser(userId);
    return userData;
}

const saveSubscription = async (userId, data)=>{
    const userData = await user.saveSubscription(userId, data);
    return userData;
}

// export all the functions
module.exports = {
    login,
    signup,
    updateUser,
    deleteUser,
    saveSubscription
}
