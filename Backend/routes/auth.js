const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  
  if (!['Manager', 'Team Lead', 'Employee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword, role });
  
  try {
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
});

// Get current user (protected route)
router.get('/current-user', async (req, res) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_secret_key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user details (including ID and role)
    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
});


module.exports = router;
