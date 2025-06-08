const { s3, bucketName } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');
const Boom = require('@hapi/boom');
const mime = require('mime-types'); // untuk ContentType

class S3Service {
  async uploadImage(buffer, originalName, userId) {
    const fileExtension = originalName.split('.').pop();
    const filename = `predictions/${userId}/${uuidv4()}.${fileExtension}`;
    const contentType = mime.lookup(originalName) || 'application/octet-stream';
    
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: contentType
    };

    try {
      await s3.upload(params).promise();
      return {
        url: `https://${bucketName}.s3.amazonaws.com/${filename}`,
        key: filename
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw Boom.internal('Failed to upload image');
    }
  }

  async deleteImage(key) {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('S3 delete error:', error);
      throw Boom.internal('Failed to delete image from S3');
    }
  }
}

module.exports = new S3Service();