const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route    POST /api/users
// @desc     Register a new user
// @access   Public
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate request
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if user already exists by email
    let existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Check if username is already taken
    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ 
        error: 'Username is already taken' 
      });
    }

    // Create new user
    const user = new User({ username, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create and return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT generation error:', err);
          return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ 
          token, 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            role: user.role
          } 
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Server error during registration' });
  }
});
// @route    POST /api/users/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            role: user.role
          } 
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route    GET /api/users/me
// @desc     Get current user
// @access   Private
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;