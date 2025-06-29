/**
 * External dependencies
 */
require('dotenv').config();
const express = require('express');
const cors = require("cors");

/**
 * Internal dependencies
 */
const connectDB = require('./database/connection');

// routes for specific tasks
const v1UserRouter = require('./v1/routes/userRoutes');
const v1goalRouter = require('./v1/routes/goalRoutes');

// initialize an express app
const app = express();
app.use(express.json());
app.use(cors({origin:'goal-manager-five.vercel.app'}));
// app.use(cors());
const PORT = process.env.PORT || 3001;

// api/v1 router for users
app.use('/api/v1/user', v1UserRouter);
// api/v1 router for goals
app.use('/api/v1/goals', v1goalRouter);

try{
    // connect database with server
    connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${ PORT }`);
    });
}
catch (error) {
    console.error('Error starting the server:', error);
}