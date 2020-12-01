import path from "path";
import { Storage } from "@google-cloud/storage";

export type DeleteGCSFileOptions = {
  storage: Storage;
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
  // delete the file
  return await options.storage
    .bucket(options.bucketName)
    .file(fileName)
    .delete({
      ignoreNotFound: true,
    });
};
