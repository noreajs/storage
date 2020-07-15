import { Response } from "express";
import path from "path";

/**
 * Send a file in a response
 * @param res response
 * @param file file informations
 * @param fn callback
 */
export const downloadLocalFile = (
  res: Response,
  file: { conentType?: string; originalName?: string; path: string },
  fn?: (error: Error) => void
) => {
  if (path.extname(file.path).length === 0) {
    if (file.conentType) res.setHeader("Content-Type", file.conentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName ?? path.basename(file.path)}"`
    );
    res.sendFile(path.resolve(file.path), fn);
  } else {
    res.download(file.path, fn);
  }
};
