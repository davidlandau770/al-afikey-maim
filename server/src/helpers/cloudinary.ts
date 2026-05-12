import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

export const FOLDERS = {
  shop: "al afikey maim/shop",
  banners: "al afikey maim/banners",
  blog: "al afikey maim/blog",
  documents: "al afikey maim/documents",
  assets: "al afikey maim/assets",
} as const;

export const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
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