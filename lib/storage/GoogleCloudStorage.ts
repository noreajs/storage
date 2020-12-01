import { Storage } from "@google-cloud/storage";
import { Request } from "express";
import path from "path";

type StorageCallbackType = (error: any, data?: any) => void | Promise<void>;

type DestinationCallbackFunc = (
  error: Error | null,
  destination: string
) => void | Promise<void>;

type DestinationFuncType = (
  req: Request,
  file: any,
  cb: DestinationCallbackFunc
) => void;

type FilenameCallbackFunc = (
  error: Error | null,
  filename: string
) => void | Promise<void>;

type FilenameFuncType = (
  req: Request,
  file: any,
  cb: FilenameCallbackFunc
) => void;

interface GoogleCloudStorageOptions {
  destination?: DestinationFuncType;
  filename?: FilenameFuncType;
  keyFilePath: string;
  bucketName: string;
}

interface File {
  fieldname: "image";
  originalname: "34209333.jfif";
  encoding: "7bit";
  mimetype: "application/octet-stream";
}

/**
 * Google cloud storage
 */
class GoogleCloudStorage {
  keyFilePath: string;
  bucketName: string;
  storage: Storage;
  currentFileName?: string;

  constructor(opts: GoogleCloudStorageOptions) {
    this.keyFilePath = opts.keyFilePath;
    this.bucketName = opts.bucketName;
    this.getFileName = opts.filename ?? this.getFileName;
    this.getDestination = opts.destination ?? this.getDestination;

    // initialize storage instance
    this.storage = new Storage({ keyFilename: this.keyFilePath });
  }

  /**
   * Get file destination
   * @param req express request
   * @param file file
   * @param cb storage callback type
   */
  getDestination(req: Request, file: any, cb: DestinationCallbackFunc) {
    cb(null, "/dev/null");
  }

  getFileName(
    req: Request,
    file: Express.Multer.File,
    cb: FilenameCallbackFunc
  ) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname
        .toLowerCase()
        .replace(/\s/g, "-")}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  }

  /**
   * Handle a file
   *
   * @param req expres request
   * @param file file
   * @param cb callback
   */
  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: StorageCallbackType
  ) {
    this.getFileName(req, file, async (err: any, fileName: string) => {
      // failed to get file name
      if (err) return cb(err);

      // set the current file name
      this.currentFileName = fileName;

      try {
        // bucket file
        const bucketFile = this.storage.bucket(this.bucketName).file(fileName);

        // initiate stream on bucket
        const stream = bucketFile.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        // write to the bucket
        file.stream.pipe(stream);

        // on finish
        stream.on("finish", async () => {
          // Need to make the file public before you can access it.
          await bucketFile.makePublic();

          // load meta data
          const meta = await bucketFile.getMetadata();

          stream.end(file.buffer);

          cb(null, {
            path: meta[0].mediaLink,
            meta: meta[0],
          });
        });

        // on error
        stream.on("error", cb);
      } catch (error) {
        cb(error);
      }
    });
  }

  /**
   * Remove a file
   *
   * @param req express request
   * @param file file
   * @param cb callback
   */
  async _removeFile(req: Request, file: any, cb: StorageCallbackType) {
    // if current file exists
    if (this.currentFileName) {
      try {
        // try to delete the current file if already saved
        await this.storage
          .bucket(this.bucketName)
          .file(this.currentFileName)
          .delete({
            ignoreNotFound: true,
          });
      } catch (error) {}
    }
  }
}

export default GoogleCloudStorage;
