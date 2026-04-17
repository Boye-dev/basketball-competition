import multer, { FileFilterCallback, Multer, StorageEngine } from "multer";
import { Request, RequestHandler } from "express";
import { BadRequestError } from "../utils/responseHandler";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

class MulterService {
  public upload: Multer;
  public storage: StorageEngine;
  constructor() {
    this.storage = multer.memoryStorage();

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    });
  }

  private fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError("Only .jpg, .png, and .pdf formats are allowed"),
      );
    }
  }
}

const upload = new MulterService().upload;

export const ensureBody: RequestHandler = (req, _res, next) => {
  req.body = req.body || {};
  next();
};

export default upload;
