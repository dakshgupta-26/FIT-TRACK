import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Uploads a file buffer to Cloudinary with fallback to local disk storage.
 * @param {Buffer} buffer - File buffer from multer
 * @param {Object} options - { folder: string, resource_type: 'image' | 'video' | 'auto', originalname: string }
 * @returns {Promise<string>} - Public accessible URL
 */
export const uploadBufferToStorage = async (buffer, options = {}) => {
  const { folder = "fittrack_social", resource_type = "auto", originalname = "upload.jpg" } = options;

  // 1. Try Cloudinary if API key is provided
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url || result.url);
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    } catch (cloudErr) {
      console.warn("[Media Storage] Cloudinary upload notice, falling back to local storage:", cloudErr.message);
    }
  }

  // 2. Fallback to Local Disk Storage
  const ext = path.extname(originalname) || (resource_type === "video" ? ".mp4" : ".jpg");
  const filename = `${folder.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  // Return relative or configured URL
  return `/uploads/${filename}`;
};
