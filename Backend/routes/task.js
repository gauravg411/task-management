const express = require('express');
const Task = require('../models/task');
const { authenticateToken, authorizeRole } = require('../middlware/auth');
const router = express.Router();

// Create a new task
router.post('/', authenticateToken, authorizeRole(['Manager', 'Team Lead', 'Employee']), async (req, res) => {
  console.log(req)
  const { title, description, assignedTo } = req.body;
  const newTask = new Task({ title, description, assignedTo: assignedTo || req.user.userId });
  await newTask.save();
  res.status(201).json(newTask);
});

// Get tasks for the logged-in user or team
router.get('/', authenticateToken, authorizeRole(['Manager', 'Team Lead', 'Employee']), async (req, res) => {
  const query = req.user.role === 'Employee' ? { assignedTo: req.user.userId } : {};
  const tasks = await Task.find(query);
  res.json(tasks);
});

// Update a task
router.put('/:id', authenticateToken, authorizeRole(['Manager', 'Team Lead', 'Employee']), async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findById(req.params.id);
  
  if (task.assignedTo.toString() !== req.user.userId.toString() && req.user.role !== 'Manager') {
    return res.status(403).json({ message: 'Permission denied' });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  task.updatedAt = Date.now();
  await task.save();
  res.json(task);
});

// Delete a task
router.delete('/:id', authenticateToken, authorizeRole(['Manager', 'Employee']), async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task.assignedTo.toString() !== req.user.userId.toString()) {
    return res.status(403).json({ message: 'Permission denied' });
  }

  await task.remove();
  res.status(200).json({ message: 'Task deleted successfully' });
});

module.exports = router;
