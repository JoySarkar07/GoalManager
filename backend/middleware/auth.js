/**
 * External dependencies
 */
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate a user based on the JWT token in the Authorization header.
 * 
 * @function
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {void} Sends a 401 response if the token is missing or invalid; otherwise, proceeds to the next middleware
 */
const authenticateUser = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(! authHeader || ! authHeader.startsWith("Bearer ")){
        return res.status(401).json({status:'Error', message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(e){
        return res.status(401).json({status:'Error', message: "Unauthorized: Invalid token" });
    }
}

// exports the middleware functions
module.exports = authenticateUser;