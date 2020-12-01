import path from "path";

/**
 * Mime Types
 */
const imageMimeTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/x-icon",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
];

const imageExtensions = [
  ".webp",
  ".tif",
  ".tiff",
  ".svg",
  ".png",
  ".pjp",
  ".pjpeg",
  ".jfif",
  ".jpeg",
  ".jpg",
  ".ico",
  ".cur",
  ".gif",
  ".bmp",
  ".apng",
];

/**
 * Filter image files
 * 
 * @param req express request
 * @param file uploaded file
 * @param cb callback
 */
export const imageFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, allowed: boolean) => void
) {
  // mime type of extension is valid
  if (
    imageMimeTypes.includes(file.mimetype.toLowerCase()) ||
    (file.mimetype === "application/octet-stream" &&
      imageExtensions.includes(path.extname(file.originalname).toLowerCase()))
  ) {
    return cb(null, true);
  } else {
    cb(
      {
        message: "The file must be an image",
      },
      true
    );
  }
};
