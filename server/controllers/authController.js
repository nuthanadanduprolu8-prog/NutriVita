import jwt from 'jsonwebtoken';
import { UserRepository } from '../models/User.js';
import { calculateAgeFromDob } from '../utils/dateUtils.js';

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
    const { name, email, password, dateOfBirth, age, gender, activityLevel, dietaryPreference, healthGoals, languagePreference } = req.body;

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

    let calculatedAge = Number(age) || 25;
    const cleanDob = dateOfBirth && typeof dateOfBirth === 'string' ? dateOfBirth.trim() : null;

    if (cleanDob) {
      const { age: derivedAge, error: dobError } = calculateAgeFromDob(cleanDob);
      if (dobError) {
        return res.status(400).json({
          success: false,
          message: dobError,
        });
      }
      if (derivedAge !== null) {
        calculatedAge = derivedAge;
      }
    }

    const user = await UserRepository.create({
      name,
      email,
      password,
      dateOfBirth: cleanDob,
      age: calculatedAge,
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
      dateOfBirth: user.dateOfBirth || null,
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
      dateOfBirth: user.dateOfBirth || null,
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
    const { name, dateOfBirth, age, gender, activityLevel, dietaryPreference, healthGoals, languagePreference } = req.body;
    
    let computedAge = age !== undefined && age !== null && age !== '' ? Number(age) : undefined;
    let cleanDob = dateOfBirth !== undefined ? (typeof dateOfBirth === 'string' ? dateOfBirth.trim() : dateOfBirth) : undefined;

    if (cleanDob) {
      const { age: derivedAge, error: dobError } = calculateAgeFromDob(cleanDob);
      if (dobError) {
        return res.status(400).json({
          success: false,
          message: dobError,
        });
      }
      if (derivedAge !== null) {
        computedAge = derivedAge;
      }
    } else if (cleanDob === '') {
      cleanDob = null;
    }

    const updated = await UserRepository.updateProfile(req.user._id || req.user.id, {
      ...(name && { name }),
      ...(cleanDob !== undefined && { dateOfBirth: cleanDob }),
      ...(computedAge !== undefined && { age: computedAge }),
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
