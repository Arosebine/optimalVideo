import { Request, Response } from 'express';
const cloudinary = require('cloudinary').v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary, 
  params: {
    resource_type: "auto",
    type: "upload",
    allowed_formats: async (req: Request, file: any)=> ["jpg", "png", "jpeg", "gif"],
    unique_filename: true,
    folder: "lampnets",
  },
}as any);

const upload = multer({
    storage: cloudStorage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
}).array("files", 4);



export default upload;