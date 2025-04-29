const express = require('express');
        const {
          getTasks,
          createTask,
          getTask,
          updateTask,
          deleteTask,
        } = require('../controllers/taskController');
        const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

        const router = express.Router();

        // Apply the protect middleware to all routes in this file
        router.use(protect);

        router.route('/')
          .get(getTasks)
          .post(createTask);

        router.route('/:id')
          .get(getTask)
          .put(updateTask)
          .delete(deleteTask);

        module.exports = router;
