const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Check env-based admin first (no DB needed for initial setup)
    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;

    if (username === envUser && password === envPass) {
      const token = generateToken({ username, role: 'admin' });
      return res.json({ success: true, token, username });
    }

    // Fall back to DB admin
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({ id: admin._id, username: admin.username, role: 'admin' });
    res.json({ success: true, token, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login };
