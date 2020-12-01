import path from "path";
import { Storage } from "@google-cloud/storage";

export type DeleteGCSFileOptions = {
  keyFilePath: string;
  bucketName: string;
  fileName: string;
};

/**
 * Delete a google cloud storage file
 * @param options options
 */
export const deleteGCSFile = async (options: DeleteGCSFileOptions) => {
  // real file name
  const fileName = path.basename(options.fileName);
  // init storage instance
  const storage = new Storage({ keyFilename: options.keyFilePath });
  // delete the file
  return await storage.bucket(options.bucketName).file(fileName).delete({
    ignoreNotFound: true,
  });
};
