const User = require('../models/User');
        const jwt = require('jsonwebtoken');
        require('dotenv').config();

        // Generate JWT
        const generateToken = (id) => {
          return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // Token expires in 30 days
          });
        };

        // @desc    Register a new user
        // @route   POST /api/auth/register
        // @access  Public
        exports.registerUser = async (req, res) => {
          const { username, email, password } = req.body;

          try {
            const userExists = await User.findOne({ email });

            if (userExists) {
              return res.status(400).json({ success: false, message: 'User already exists' });
            }

            const user = await User.create({
              username,
              email,
              password,
            });

            if (user) {
              res.status(201).json({
                success: true,
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
              });
            } else {
              res.status(400).json({ success: false, message: 'Invalid user data' });
            }
          } catch (error) {
            console.error("Registration Error:", error);
             // Check for duplicate key error (username or email)
            if (error.code === 11000) {
                 return res.status(400).json({ success: false, message: 'Username or Email already taken' });
            }
            res.status(500).json({ success: false, message: 'Server Error during registration' });
          }
        };

        // @desc    Authenticate user & get token (Login)
        // @route   POST /api/auth/login
        // @access  Public
        exports.loginUser = async (req, res) => {
          const { email, password } = req.body;

           if (!email || !password) {
             return res.status(400).json({ success: false, message: 'Please provide email and password' });
           }

          try {
            // Find user by email, including the password field
            const user = await User.findOne({ email }).select('+password');

            if (user && (await user.matchPassword(password))) {
              res.json({
                success: true,
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
              });
            } else {
              res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
          } catch (error) {
             console.error("Login Error:", error);
             res.status(500).json({ success: false, message: 'Server Error during login' });
          }
        };

        // @desc    Get user profile
        // @route   GET /api/auth/me
        // @access  Private
        exports.getMe = async (req, res) => {
          // req.user is set by the protect middleware
          res.status(200).json({ success: true, data: req.user });
        };