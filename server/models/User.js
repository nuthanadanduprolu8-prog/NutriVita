import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { memoryStore, getDBStatus } from '../config/db.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  dateOfBirth: {
    type: String,
    trim: true,
    default: null,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
    default: 25,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male',
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate',
  },
  dietaryPreference: {
    type: String,
    enum: ['vegetarian', 'vegan', 'non_vegetarian', 'eggetarian'],
    default: 'vegetarian',
  },
  healthGoals: [{
    type: String,
  }],
  languagePreference: {
    type: String,
    enum: ['en', 'te'],
    default: 'en',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Password hash hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

// Unified user repository supporting both Mongoose and In-Memory fallback
export const UserRepository = {
  async findByEmail(email, includePassword = false) {
    const status = getDBStatus();
    if (status.connected) {
      const query = UserModel.findOne({ email: email.toLowerCase() });
      if (includePassword) query.select('+password');
      return await query.exec();
    }
    // Fallback
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return {
      ...user,
      matchPassword: async (pwd) => await bcrypt.compare(pwd, user.password),
      toObject: () => ({ ...user })
    };
  },

  async findById(id) {
    const status = getDBStatus();
    if (status.connected) {
      return await UserModel.findById(id).select('-password').exec();
    }
    const user = memoryStore.users.find(u => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async create(userData) {
    const status = getDBStatus();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    if (status.connected) {
      const user = new UserModel({
        ...userData,
        password: hashedPassword
      });
      return await user.save();
    }

    // In-memory creation
    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      dateOfBirth: userData.dateOfBirth || null,
      age: userData.age || 25,
      gender: userData.gender || 'male',
      activityLevel: userData.activityLevel || 'moderate',
      dietaryPreference: userData.dietaryPreference || 'vegetarian',
      healthGoals: userData.healthGoals || ['Daily Vitality', 'Prevent Deficiencies'],
      languagePreference: userData.languagePreference || 'en',
      createdAt: new Date()
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  async updateProfile(id, updateData) {
    const status = getDBStatus();
    if (status.connected) {
      return await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    const index = memoryStore.users.findIndex(u => u._id === id || u.id === id);
    if (index === -1) return null;
    memoryStore.users[index] = { ...memoryStore.users[index], ...updateData };
    const { password, ...safeUser } = memoryStore.users[index];
    return safeUser;
  }
};

export default UserModel;
