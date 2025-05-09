const mongoose = require('mongoose');
        const bcrypt = require('bcryptjs');

        const UserSchema = new mongoose.Schema({
          username: {
            type: String,
            required: [true, 'Please provide a username'],
            unique: true,
            trim: true,
          },
          email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              'Please provide a valid email',
            ],
            trim: true,
            lowercase: true,
          },
          password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false, // Do not return password by default
          },
        }, { timestamps: true });

        // Hash password before saving
        UserSchema.pre('save', async function (next) {
          if (!this.isModified('password')) {
            return next();
          }
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          next();
        });

        // Method to compare entered password with hashed password
        UserSchema.methods.matchPassword = async function (enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        };

        module.exports = mongoose.model('User', UserSchema);