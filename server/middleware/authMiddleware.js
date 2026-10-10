import jwt from 'jsonwebtoken';
import { UserRepository } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'nutrivita_super_secret_jwt_key_2026_secure';
    const decoded = jwt.verify(token, secret);
    
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired. Please sign in again.',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'nutrivita_super_secret_jwt_key_2026_secure';
    const decoded = jwt.verify(token, secret);
    const user = await UserRepository.findById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // If token invalid, proceed gracefully without req.user
  }
  next();
};

