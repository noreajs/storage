import { NoreaBootstrap } from "@noreajs/core";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { downloadLocalFile } from "../storage/download";

const storage = multer.diskStorage({});

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
          storage: multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, "uploads");
            },
            filename: function (req, file, cb) {
              const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
              cb(null, file.fieldname + "-" + uniqueSuffix);
            },
          }),
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
