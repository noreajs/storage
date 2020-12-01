import { Request } from "express";
import path from "path";

/**
 * Mime Types
 */
const audioMimeTypes = [
  "audio/wave",
  "audio/wav",
  "audio/x-wav",
  "audio/x-pn-wav",
  "audio/webm",
  "audio/3gpp",
  "audio/3gpp2",
  "audio/3gp2",
  "audio/aac",
  "audio/mpeg",
  "audio/flac",
  "audio/x-flac",
  "audio/mpeg",
  "audio/mp4",
];

const audioExtensions = [
  ".acc",
  ".flac",
  ".mp3",
  ".3gp",
  ".3g2",
  ".weba",
  ".wav",
  ".oga",
];

/**
 * Filter audio files
 *
 * @param req request
 * @param file file
 * @param cb callback
 */
export const audioFilter = function (
  req: Request,
  file: Express.Multer.File,
  cb: (error: any, allowed: boolean) => void
) {
  // mime type of extension is valid
  if (
    audioMimeTypes.includes(file.mimetype.toLowerCase()) ||
    (file.mimetype === "application/octet-stream" &&
      audioExtensions.includes(path.extname(file.originalname).toLowerCase()))
  ) {
    return cb(null, true);
  } else {
    cb(
      {
        message: "The file must be an audio",
      },
      true
    );
  }
};
