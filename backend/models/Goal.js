const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: ""
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
      type: String,
      enum: ['high', 'mid', 'low'],
      default: 'low'
    },
    dueDate:{
      type: Date,
      default: Date.now
    }
},{strict: true});

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  // Normal goal or group
  isGroup: {
    type: Boolean,
    default: false
  },

  // Works (subtasks) under a goal
  works: [WorkSchema], // Embedded subdocuments

  // Nested goals if this is a group
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal', // Self-reference
    default: null
  },

  // Link to owner user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true, strict:true });

module.exports = mongoose.model('Goal', GoalSchema);