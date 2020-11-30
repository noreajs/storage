import { NoreaBootstrap } from "@noreajs/core";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { downloadLocalFile } from "../storage/download";
import GoogleCloudStorage from "../storage/GoogleCloudStorage";

const storage = new GoogleCloudStorage({
  bucketName: "gitfama-storage",
  keyFilePath: "./google-cloud-key.json",
});

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
        multer({
          storage: storage,
        }).single("image"),
        (req: Request, res: Response) => {
          res.send(req.file);
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
