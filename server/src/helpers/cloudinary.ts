import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

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

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const publicId = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)?.[1];
  if (publicId) await cloudinary.uploader.destroy(publicId);
};