import { Request, Response, NextFunction } from "express";

const handleServerError = (
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("SERVER-ERROR", error.message);
  res.status(500).send({ message: error.message });
  next();
};

export default handleServerError;
