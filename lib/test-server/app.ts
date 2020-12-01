import { NoreaBootstrap } from "@noreajs/core";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { downloadLocalFile } from "../storage/download";
import { StorageFilter } from "../storage/filters";
import { GoogleCloudStorage } from "../storage/GoogleCloudStorage";
import { StorageMiddleware } from "../storage/middlewares";

const storage = new GoogleCloudStorage({
  bucketName: "gitfama-storage",
  keyFilePath: "./google-cloud-key.json",
});

const upload = multer({
  storage: storage,
  fileFilter: StorageFilter.image,
}).single("image");

const api = new NoreaBootstrap(
  {
    routes: (app) => {
      app.route("/files/:name").get([
        (req: Request, res: Response) => {
          console.log(req.params.name);

          downloadLocalFile(res, {
            path: path.resolve(`uploads/${req.params.name}`),
            conentType: "image/png",
            originalName: "mortel.png",
          });
        },
      ]);
      app.route("/upload").post([
        upload,
        StorageMiddleware.errorResponseInJson,
        (req: Request, res: Response) => {
          return res.send(req.file);
        },
      ]);
    },
    middlewares: (app) => {},
  },
  {
    beforeStart: (app) => {},
  }
);

api.start();
