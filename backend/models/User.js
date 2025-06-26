/**
 * External dependencies
 */
const mongoose = require('mongoose');


/**
 * Schema for user accounts, including personal info, credentials, and notification preferences.
 * 
 * @typedef {Object} User
 * @property {string} name - Name of the user (required)
 * @property {string} email - Email address of the user (required, unique, lowercase, trimmed)
 * @property {string} password - Hashed password for authentication (required)
 * @property {Object} notificationPreferences - User's notification settings
 * @property {NotificationChannel} notificationPreferences.email - Email notification settings
 * @property {NotificationChannel} notificationPreferences.push - Push notification settings
 * @property {Object} pushSubscription - Web push subscription details for push notifications
 * @property {string} pushSubscription.endpoint - Push endpoint URL
 * @property {Object} pushSubscription.keys - Encryption keys for secure push notifications
 * @property {string} pushSubscription.keys.p256dh - Client public key
 * @property {string} pushSubscription.keys.auth - Auth secret
 * 
 * Automatically includes `createdAt` and `updatedAt` timestamps.
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    notificationPreferences: {
        email: {
            type: Boolean, 
            default: true,
        },
        push: {
            type: Boolean,
            default: false
        },
    },
    pushSubscription: {
        endpoint: { type: String },
        keys: {
            p256dh: { type: String },
            auth: { type: String }
        }
    }
}, {timestamps: true, strict: true});

// Make the user model
const User = mongoose.model('User', UserSchema);

// Export the user model
module.exports = User;