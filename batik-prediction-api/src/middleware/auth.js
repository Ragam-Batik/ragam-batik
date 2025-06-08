// File: src/middleware/auth.js
const Boom = require('@hapi/boom');
const supabase = require('../config/supabase');

const authMiddleware = async (request, h) => {
  try {
    const authorization = request.headers.authorization;
    
    if (!authorization) {
      throw Boom.unauthorized('Missing authorization header');
    }

    const token = authorization.replace('Bearer ', '');
    
    if (!token) {
      throw Boom.unauthorized('Invalid authorization format');
    }

    // Verify token dengan Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth error:', error);
      throw Boom.unauthorized('Invalid or expired token');
    }

    // Attach user info ke request
    request.auth = {
      user: {
        id: user.id,
        email: user.email,
        ...user.user_metadata
      },
      token
    };

    return h.continue;
  } catch (error) {
    if (error.isBoom) {
      throw error;
    }
    
    console.error('Auth middleware error:', error);
    throw Boom.unauthorized('Authentication failed');
  }
};

module.exports = authMiddleware;