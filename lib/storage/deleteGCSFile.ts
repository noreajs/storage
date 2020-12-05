import path from "path";
import { parseUrl } from "query-string";
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
  // parse url
  const parsedUrl = parseUrl(options.fileName);

  // real file name
  const fileName = path.basename(parsedUrl.url);

  // delete the file
  return await options.storage.storage
    .bucket(options.bucketName ?? options.storage.bucketName)
    .file(fileName)
    .delete({
      ignoreNotFound: true,
    });
};
