import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

export const uploadToS3 = async (buffer, filename) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `batik/${filename}`,
    Body: buffer,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };
  const data = await s3.upload(params).promise();
  return data.Location; // public URL
};
