import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const cfg = cloudinary.config();
console.log("Cloudinary cfg — cloud:", cfg.cloud_name, "| key:", cfg.api_key, "| secret length:", cfg.api_secret?.length);

export const uploadToCloudinary = (buffer: Buffer): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "al-afikey-maim" },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Upload failed"));
        else resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(stream);
  });