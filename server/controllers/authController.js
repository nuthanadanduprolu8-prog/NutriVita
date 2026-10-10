import jwt from 'jsonwebtoken';
import { UserRepository } from '../models/User.js';

// Generate JWT Helper
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'nutrivita_super_secret_jwt_key_2026_secure';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, age, gender, activityLevel, dietaryPreference, healthGoals, languagePreference } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await UserRepository.create({
      name,
      email,
      password,
      age: Number(age) || 25,
      gender: gender || 'male',
      activityLevel: activityLevel || 'moderate',
      dietaryPreference: dietaryPreference || 'vegetarian',
      healthGoals: healthGoals || ['Immunity Support', 'Balanced Nutrition'],
      languagePreference: languagePreference || 'en',
    });

    const token = generateToken(user._id || user.id);

    const safeUser = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      activityLevel: user.activityLevel,
      dietaryPreference: user.dietaryPreference,
      healthGoals: user.healthGoals,
      languagePreference: user.languagePreference,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await UserRepository.findByEmail(email, true);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = generateToken(user._id || user.id);

    const safeUser = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      activityLevel: user.activityLevel,
      dietaryPreference: user.dietaryPreference,
      healthGoals: user.healthGoals,
      languagePreference: user.languagePreference,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, age, gender, activityLevel, dietaryPreference, healthGoals, languagePreference } = req.body;
    
    const updated = await UserRepository.updateProfile(req.user._id || req.user.id, {
      ...(name && { name }),
      ...(age && { age: Number(age) }),
      ...(gender && { gender }),
      ...(activityLevel && { activityLevel }),
      ...(dietaryPreference && { dietaryPreference }),
      ...(healthGoals && { healthGoals }),
      ...(languagePreference && { languagePreference }),
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};
