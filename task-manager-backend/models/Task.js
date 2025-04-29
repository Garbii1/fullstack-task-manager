const mongoose = require('mongoose');

        const TaskSchema = new mongoose.Schema({
          user: { // Link task to a user
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference the User model
          },
          title: {
            type: String,
            required: [true, 'Please add a task title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
          },
          description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot be more than 500 characters'],
          },
          category: {
            type: String,
            enum: ['Work', 'Personal', 'Hobby', 'Other'],
            default: 'Personal',
          },
          priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
          },
          status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            default: 'Not Started',
          },
          deadline: {
            type: Date,
          },
        }, { timestamps: true }); // Adds createdAt and updatedAt timestamps

        module.exports = mongoose.model('Task', TaskSchema);