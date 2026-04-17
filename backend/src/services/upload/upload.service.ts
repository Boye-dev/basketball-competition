import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "./cloudinary";
import { ApplicationError } from "../../utils/responseHandler";

const DEFAULT_OPTIONS = {
  folder: "basketball-competition",
  allowedFormats: ["jpg", "jpeg", "png", "pdf"],
  maxFileSize: 5 * 1024 * 1024,
};

class UploadService {
  public async uploadFile(
    file: Express.Multer.File,
    options: Partial<typeof DEFAULT_OPTIONS> = {},
  ): Promise<UploadApiResponse> {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    if (mergedOptions.maxFileSize && file.size > mergedOptions.maxFileSize) {
      throw new ApplicationError(
        `File size exceeds the maximum allowed size of ${mergedOptions.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    const isPdf = file.mimetype === "application/pdf";

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: mergedOptions.folder,
          allowed_formats: mergedOptions.allowedFormats,
          resource_type: isPdf ? "raw" : "image",
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error || !result) {
            return reject(new ApplicationError("File upload failed"));
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  public async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch {
      throw new ApplicationError("Failed to delete file from cloud storage");
    }
  }
}

export default new UploadService();
