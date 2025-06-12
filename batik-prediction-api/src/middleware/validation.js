const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

const schemas = {
  // User validation schemas
  registerSchema: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(50).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 50 characters',
      'any.required': 'Password is required'
    }),
    fullName: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters',
      'any.required': 'Full name is required'
    })
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  updateProfileSchema: Joi.object({
    full_name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters'
    }),
    avatar_url: Joi.string().uri().optional().messages({
      'string.uri': 'Avatar URL must be a valid URL'
    })
  }),

  // Prediction validation schemas
  predictionSchema: Joi.object({
    image: Joi.string().base64().required().messages({
      'any.required': 'Image is required',
      'string.base64': 'Image must be a valid base64 string'
    }),
    originalName: Joi.string().default('image.jpg').messages({
      'string.base': 'Original name must be a string'
    })
  }),

  // Query parameter schemas
  paginationSchema: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    }),
    provinsi: Joi.string().optional().messages({
      'string.base': 'Provinsi must be a string'
    })
  }),

  searchSchema: Joi.object({
    q: Joi.string().min(1).required().messages({
      'string.min': 'Search query must be at least 1 character',
      'any.required': 'Search query is required'
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    })
  }),

  historySearchSchema: Joi.object({
    q: Joi.string().min(2).required().messages({
      'string.min': 'Search query must be at least 2 characters',
      'any.required': 'Search query is required'
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    })
  }),

  // Parameter validation schemas
  idParamSchema: Joi.object({
    id: Joi.string().required().messages({
      'any.required': 'ID parameter is required',
      'string.base': 'ID must be a string'
    })
  })
};

// Validation middleware factory
const validateSchema = (schema, source = 'payload') => {
  return (request, h) => {
    const dataToValidate = request[source];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown properties
      convert: true // Convert types when possible
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      throw Boom.badRequest('Validation failed', {
        errors: errorDetails,
        totalErrors: errorDetails.length
      });
    }

    // Replace the original data with validated and sanitized data
    request[source] = value;
    return h.continue;
  };
};

// Pre-configured validation middlewares
const validation = {
  // Auth validations
  validateRegister: validateSchema(schemas.registerSchema, 'payload'),
  validateLogin: validateSchema(schemas.loginSchema, 'payload'),
  validateUpdateProfile: validateSchema(schemas.updateProfileSchema, 'payload'),
  
  // Prediction validations
  validatePrediction: validateSchema(schemas.predictionSchema, 'payload'),
  
  // Query validations
  validatePagination: validateSchema(schemas.paginationSchema, 'query'),
  validateSearch: validateSchema(schemas.searchSchema, 'query'),
  validateHistorySearch: validateSchema(schemas.historySearchSchema, 'query'),
  
  // Parameter validations
  validateIdParam: validateSchema(schemas.idParamSchema, 'params'),

  // Custom validation helpers
  validateEmail: (email) => {
    const emailSchema = Joi.string().email();
    const { error } = emailSchema.validate(email);
    return !error;
  },

  validateBase64Image: (base64String) => {
    // Check if it's a valid base64 string
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (!base64Regex.test(base64String)) {
      return false;
    }
    
    // Extract base64 data without prefix
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    
    // Validate base64 format
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      return buffer.length > 0 && buffer.length <= 10 * 1024 * 1024; // Max 10MB
    } catch (error) {
      return false;
    }
  },

  // File upload validation
  validateFileUpload: (file, maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']) => {
    const errors = [];

    if (!file) {
      errors.push('File is required');
      return { isValid: false, errors };
    }

    if (file.bytes > maxSize) {
      errors.push(`File size cannot exceed ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.headers['content-type'])) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Custom validation for specific business rules
  validateConfidenceScore: (score) => {
    return typeof score === 'number' && score >= 0 && score <= 100;
  },

  validateProvinsiName: (provinsi) => {
    const validProvinsi = [
      'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DKI Jakarta',
      'DI Yogyakarta', 'Banten', 'Sumatera Utara', 'Sumatera Barat',
      'Sumatera Selatan', 'Riau', 'Jambi', 'Bengkulu', 'Lampung',
      'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'Aceh',
      'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan',
      'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
      'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
      'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara',
      'Papua', 'Papua Barat', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur'
    ];
    
    return provinsi ? validProvinsi.some(p => 
      p.toLowerCase().includes(provinsi.toLowerCase()) ||
      provinsi.toLowerCase().includes(p.toLowerCase())
    ) : true;
  }
};

// Error formatter for validation errors
const formatValidationError = (error) => {
  if (error.isJoi) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/"/g, ''),
      value: detail.context?.value
    }));

    return {
      status: false,
      message: 'Validation failed',
      errors: details,
      totalErrors: details.length
    };
  }
  
  return {
    status: false,
    message: error.message || 'Validation failed'
  };
};

module.exports = {
  validation,
  schemas,
  validateSchema,
  formatValidationError
};