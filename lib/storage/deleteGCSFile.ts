import path from "path";
import { GoogleCloudStorage } from "./GoogleCloudStorage";

export type DeleteGCSFileOptions = {
  storage: GoogleCloudStorage;
  bucketName?: string;
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
  return await options.storage.storage
    .bucket(options.bucketName ?? options.storage.bucketName)
    .file(fileName)
    .delete({
      ignoreNotFound: true,
    });
};
