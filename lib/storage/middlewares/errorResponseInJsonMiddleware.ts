import { Request, Response, NextFunction } from "express";

/**
 * Error middleware
 *
 * @param err error
 * @param req request
 * @param res response
 * @param next next function
 */
const errorResponseInJsonMiddleware = function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    return res.status(500).json(err);
  } else {
    return next();
  }
};

export default errorResponseInJsonMiddleware;
