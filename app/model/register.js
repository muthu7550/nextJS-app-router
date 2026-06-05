import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    // minlength: [6, 'Password must be at least 6 characters long'],
  }
}, { timestamps: true });

// FIXED: Model name, cache check, and collection name are all strictly 'register'
export default mongoose.models.register || mongoose.model('register', UserSchema, 'register');
