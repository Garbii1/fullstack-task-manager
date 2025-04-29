const Task = require('../models/Task');

        // Utility function to emit socket events
        const emitTaskUpdate = (io, eventName, taskData) => {
          if (io && taskData.user) {
            // Emit globally for simplicity, or target specific users/rooms if needed
            io.emit(eventName, taskData);
            console.log(`Socket event emitted: ${eventName} for user ${taskData.user}`);
          } else {
              console.log("Socket or user info missing, skipping emit for", eventName);
          }
        };


        // @desc    Get all tasks for the logged-in user
        // @route   GET /api/tasks
        // @access  Private
        exports.getTasks = async (req, res) => {
          try {
            // Find tasks belonging to the logged-in user (req.user._id comes from auth middleware)
            const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by newest first
            res.status(200).json({ success: true, count: tasks.length, data: tasks });
          } catch (error) {
            console.error("Get Tasks Error:", error);
            res.status(500).json({ success: false, message: 'Server Error fetching tasks' });
          }
        };

        // @desc    Create a new task
        // @route   POST /api/tasks
        // @access  Private
        exports.createTask = async (req, res) => {
          // Add user id from protect middleware to the request body
          req.body.user = req.user._id;

          try {
            const task = await Task.create(req.body);
            // Emit event via Socket.IO
            const io = req.app.get('socketio'); // Get io instance from app settings
            emitTaskUpdate(io, 'taskCreated', task);

            res.status(201).json({ success: true, data: task });
          } catch (error) {
             console.error("Create Task Error:", error);
             if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ success: false, message: messages.join(', ') });
             }
             res.status(500).json({ success: false, message: 'Server Error creating task' });
          }
        };

        // @desc    Get single task by ID
        // @route   GET /api/tasks/:id
        // @access  Private
        exports.getTask = async (req, res) => {
          try {
            const task = await Task.findById(req.params.id);

            if (!task) {
              return res.status(404).json({ success: false, message: `Task not found with id ${req.params.id}` });
            }

            // Ensure the task belongs to the logged-in user
            if (task.user.toString() !== req.user._id.toString()) {
              return res.status(401).json({ success: false, message: 'Not authorized to access this task' });
            }

            res.status(200).json({ success: true, data: task });
          } catch (error) {
             console.error("Get Single Task Error:", error);
              if (error.kind === 'ObjectId') {
                  return res.status(404).json({ success: false, message: `Invalid task ID format` });
              }
             res.status(500).json({ success: false, message: 'Server Error fetching task' });
          }
        };


        // @desc    Update task by ID
        // @route   PUT /api/tasks/:id
        // @access  Private
        exports.updateTask = async (req, res) => {
          try {
            let task = await Task.findById(req.params.id);

            if (!task) {
              return res.status(404).json({ success: false, message: `Task not found with id ${req.params.id}` });
            }

            // Ensure the task belongs to the logged-in user
            if (task.user.toString() !== req.user._id.toString()) {
              return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
            }

            // Update the task
            // Exclude user field from being updated directly via body
            const { user, ...updateData } = req.body;
            task = await Task.findByIdAndUpdate(req.params.id, updateData, {
              new: true, // Return the updated document
              runValidators: true, // Run schema validators on update
            });

            // Emit event via Socket.IO
            const io = req.app.get('socketio');
            emitTaskUpdate(io, 'taskUpdated', task);

            res.status(200).json({ success: true, data: task });
          } catch (error) {
            console.error("Update Task Error:", error);
             if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ success: false, message: messages.join(', ') });
             }
             if (error.kind === 'ObjectId') {
                 return res.status(404).json({ success: false, message: `Invalid task ID format` });
             }
            res.status(500).json({ success: false, message: 'Server Error updating task' });
          }
        };


        // @desc    Delete task by ID
        // @route   DELETE /api/tasks/:id
        // @access  Private
        exports.deleteTask = async (req, res) => {
          try {
            const task = await Task.findById(req.params.id);

            if (!task) {
              return res.status(404).json({ success: false, message: `Task not found with id ${req.params.id}` });
            }

            // Ensure the task belongs to the logged-in user
            if (task.user.toString() !== req.user._id.toString()) {
              return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
            }

            const deletedTaskData = { _id: task._id, user: task.user }; // Capture necessary info before deletion
            await task.deleteOne(); // Use deleteOne() method on the document

            // Emit event via Socket.IO
            const io = req.app.get('socketio');
            // Send back minimal info needed for frontend removal (like the ID and user)
            emitTaskUpdate(io, 'taskDeleted', deletedTaskData );

            res.status(200).json({ success: true, message: 'Task deleted successfully', data: {} }); // Return empty data on successful delete
          } catch (error) {
            console.error("Delete Task Error:", error);
            if (error.kind === 'ObjectId') {
                 return res.status(404).json({ success: false, message: `Invalid task ID format` });
            }
            res.status(500).json({ success: false, message: 'Server Error deleting task' });
          }
        };