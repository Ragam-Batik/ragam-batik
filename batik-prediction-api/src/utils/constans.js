const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// API Response Messages
const MESSAGES = {
  // Success messages
  SUCCESS: {
    REGISTRATION: 'Registration successful',
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    PROFILE_RETRIEVED: 'Profile retrieved successfully',
    PREDICTION_SUCCESS: 'Prediction completed successfully',
    HISTORY_RETRIEVED: 'History retrieved successfully',
    HISTORY_DELETED: 'History deleted successfully',
    ALL_HISTORY_DELETED: 'All history deleted successfully',
    MOTIFS_RETRIEVED: 'Motifs retrieved successfully',
    SEARCH_COMPLETED: 'Search completed successfully'
  },
  
  // Error messages
  ERROR: {
    INTERNAL_SERVER: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    NOT_FOUND: 'Resource not found',
    VALIDATION_FAILED: 'Validation failed',
    
    // Auth specific
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    TOKEN_INVALID: 'Invalid or expired token',
    TOKEN_MISSING: 'Missing authorization token',
    
    // File upload specific
    FILE_TOO_LARGE: 'File size too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    FILE_UPLOAD_FAILED: 'File upload failed',
    FILE_NOT_FOUND: 'File not found',
    FILE_DOWNLOAD_FAILED: 'File download failed',
    FILE_DELETE_FAILED: 'File delete failed',
  }
};

module.exports = {
  HTTP_STATUS,
  MESSAGES
};