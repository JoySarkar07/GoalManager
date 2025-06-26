/**
 * External dependencies
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Internal dependencies
 */
const User = require('../models/User');

/** 
 * This is for login functionality
 *  
 * @param {String} email - email of the user
 * @param {String} password - password of the user
 * 
 * @returns {Object} - return status code with message
 */
const login = async ( email, password )=>{
    try{
        // Find user
        const user = await User.findOne({ email });
        if( ! user ){
            return ({code: 400, status: 'Error', message: 'Invalid email or Password'});
        }

        // Check password
        const isMatch = await bcrypt.compare( String(password), user.password );
        if( ! isMatch ) return ({code: 400, status: 'Error', message: 'Invalid email or Password'});

        // create jwt
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, notificationPreferences:user.notificationPreferences },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        return ({code: 200, status: 'Ok', message: 'User logged in successfully', data:{token, ...user._doc}});
    }catch(e){
        return ({code: 500, status: 'Error', message: 'Internal server error'});
    }
}

/** 
 * This is for signup( create a user ) functionality . This function helps a new user to create his/her account .
 *  
 * @param {String} name - name of the user
 * @param {String} email - email of the user
 * @param {String} password - password of the user
 * 
 * @returns {Object} - return status code with message
 */
const signup = async (name, email, password, emailPreference, pushPreference)=>{
    try{
        // validate Input
        if( !name || !email || !password ){
            return ({ code:400, success: false, message: 'All fields are required' });
        }

        // check user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return ({ code:409, success: false, message: 'Duplicate Entry , Email already in use' });
        }
        
        const hashedPassword = await bcrypt.hash(String(password), 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            notificationPreferences:{
                email: emailPreference,
                push: pushPreference,
            }
        })

        const createdUser = await newUser.save();

        return ({ code:201, success: true, message: 'User created successfully', createdUser});
    }catch(e){
        console.log({e});
        return ({ code:500, success: false, message:'Internal Server error' });
    }
}

/** 
 * This function helps a user to update his/her details .
 *  
 * @param {String} userId - id of the user
 * @param {Object} updates - this object store the value of the updated feilds .
 * 
 * @returns {Object} - return status code with message
 */
const updateUser = async (userId, updates)=>{
    try{
        // check is updates object has password key then fist encrypt the password then store it
        if('password' in updates){
            updates.password = await bcrypt.hash( String(updates.password), 10 );
        }

        // update the user using id
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates},
            { new: true, runValidators: true}
        );
        return ({code: 201, status : 'Ok', message: 'User updated successfully', updatedUser});
    }catch(e){
        return ({code: 400, status : 'Error', message: 'Failed to update user'});
    }
}

/** 
 * This function helps a user to delete his/her account .
 *  
 * @param {String} userId - id of the user
 * 
 * @returns {Object} - return status code with message
 */
const deleteUser = async (userId)=>{
    try{
        await User.findByIdAndDelete(userId);
        return ({code: 201, status : 'Ok', message: 'User deleted successfully' });
    }catch(e){
        return ({code: 400, status : 'Error', message: 'Failed to delete user'});
    }
}

// export all the functions
module.exports = {
    login,
    signup,
    updateUser,
    deleteUser
}