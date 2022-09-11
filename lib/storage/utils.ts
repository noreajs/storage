import { UploadedFileType } from "./GoogleCloudStorage";

/**
 * Extract public url
 * @param file file meta data from google cloud
 * @returns
 */
export function extractGcsPublicUrl(file: UploadedFileType) {
    return `https://storage.googleapis.com/${file.meta.bucket
        }/${file.meta.name}`;
}