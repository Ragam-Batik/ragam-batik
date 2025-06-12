const crypto = require('crypto');

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateUniqueFilename = (originalName, userId) => {
  const timestamp = Date.now();
  const randomString = generateRandomString(8);
  const extension = originalName.split('.').pop();
  return `${userId}_${timestamp}_${randomString}.${extension}`;
};

const isValidImageType = (filename) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = filename.split('.').pop().toLowerCase();
  return validExtensions.includes(extension);
};


const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


const isValidBase64Image = (base64String) => {
  try {
    
    const validPrefixes = [
      'data:image/jpeg;base64,',
      'data:image/jpg;base64,',
      'data:image/png;base64,',
      'data:image/gif;base64,',
      'data:image/webp;base64,'
    ];
    
    const hasValidPrefix = validPrefixes.some(prefix => 
      base64String.startsWith(prefix)
    );
    
    if (!hasValidPrefix) {
      return false;
    }
    

    const base64Data = base64String.split(',')[1];
    

    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(base64Data);
  } catch (error) {
    return false;
  }
};


const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};


const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: offset + limit < total,
    hasPrevPage: page > 1,
    startIndex: offset + 1,
    endIndex: Math.min(offset + limit, total)
  };
};


const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 1) {
    return 'Baru saja';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 30) {
    return `${diffInDays} hari yang lalu`;
  } else {
    return formatDate(date);
  }
};


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const createErrorResponse = (message, statusCode = 500, details = null) => {
  const response = {
    status: false,
    message,
    statusCode
  };
  
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  
  return response;
};


const createSuccessResponse = (message, data = null, meta = null) => {
  const response = {
    status: true,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (meta !== null) {
    response.meta = meta;
  }
  
  return response;
};


const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  generateRandomString,
  generateUniqueFilename,
  isValidImageType,
  formatFileSize,
  isValidBase64Image,
  sanitizeString,
  createPaginationMeta,
  formatDate,
  timeAgo,
  isValidEmail,
  createErrorResponse,
  createSuccessResponse,
  sleep
};