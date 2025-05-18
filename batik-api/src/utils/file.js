const path = require("path");

// Check if file has allowed extension
const allowedExtensions = ["jpg", "jpeg", "png"];

const fileUtils = {
  // Check if the file has an allowed extension
  isAllowedFile: (filename) => {
    if (!filename || !filename.includes(".")) return false;
    const extension = filename.split(".").pop().toLowerCase();
    return allowedExtensions.includes(extension);
  },

  // Check if file size is within allowed limit
  isAllowedSize: (
    fileSize,
    maxSize = parseInt(process.env.MAX_IMAGE_SIZE) || 2097152
  ) => {
    return fileSize <= maxSize;
  },

  // Generate a unique filename
  generateUniqueFilename: (email, filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedEmail = email.replace("@", "-at-").replace(/\./g, "-dot-");
    return `${sanitizedEmail}-${timestamp}.${extension}`;
  },
};

module.exports = fileUtils;
