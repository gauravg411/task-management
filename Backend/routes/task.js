const express = require('express');
const Task = require('../models/task');
const { authenticateToken, authorizeRole } = require('../middlware/auth');
const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    console.log('Request body:', req.body);
    console.log('Current user:', req.body.userId);

    // Validate if the user can assign tasks to others
    // Employees can only create tasks for themselves
    // if (assignedTo && assignedTo !== req.user.userId && req.user.role === 'Employee') {
    //   return res.status(403).json({
    //     message: 'Employees can only create tasks for themselves'
    //   });
    // }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      assignedTo: assignedTo || req.body.userId, // If no assignedTo is provided, assign it to the current user
      status: status || 'pending', // Default to pending if no status is provided
      createdBy: req.body.userId // Track the user who created the task
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Populate the task with user details for both assignedTo and createdBy
    // const populatedTask = await Task.findById(savedTask._id)
    //   .populate('assignedTo', 'name email role') // Populate assigned user's details
    //   .populate('createdBy', 'name email role'); // Populate creator's details

    // Return the created task with populated data
    res.status(201).json({
      message: 'Task created successfully',
      // task: populatedTask
    });
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(400).json({
      message: 'Failed to create task',
      error: error.message
    });
  }
});

// Get tasks for a specific user based on userId query parameter
router.get('/', async (req, res) => {
  try {
    // Get userId from query parameter (if provided)
    const userId = req.query['current-user'] || req.user.userId; // Use query parameter or fallback to authenticated user
    // Only fetch tasks assigned to the user or created by the user
    const query = { $or: [{ assignedTo: userId }, { createdBy: userId }] };
    const tasks = await Task.find(query)
      // .populate('assignedTo', 'name email role') // Populate assigned user's details
      // .populate('createdBy', 'name email role'); // Populate creator's details

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

// Get a task by id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
});


// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findById(req.params.id);

    // Check if the user has permission to update the task
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure only the assigned user or a manager can update the task
    // if (task.assignedTo.toString() !== req.user.userId.toString() && req.user.role !== 'Manager') {
    //   return res.status(403).json({ message: 'Permission denied' });
    // }

    // Update the task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.updatedAt = Date.now(); // Update timestamp
    await task.save();

    // Return the updated task
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure only the assigned user or a manager can delete the task
    // if (task.assignedTo.toString() !== req.user.userId.toString()) {
    //   return res.status(403).json({ message: 'Permission denied' });
    // }

    // Delete the task
    // Delete the task using deleteOne() or delete() method
    await task.deleteOne();  // or task.delete(); 
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(400).json({ message: 'Failed to delete task', error: error.message });
  }
});

module.exports = router;
