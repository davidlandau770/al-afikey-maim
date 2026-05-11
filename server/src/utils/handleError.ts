import { Response } from "express";

export class CustomError {
  status: number;
  message: string;
  tag: string;
  name: string;
  constructor(message: string, status: number, tag: string, name?: string) {
    this.message = message;
    this.status = status;
    this.tag = tag;
    this.name = name ?? message;
  }
}

const R = "\x1b[91m";   // bright red
const B = "\x1b[1m";    // bold
const DIM = "\x1b[2m";  // dim
const RST = "\x1b[0m";  // reset

export const handleError = (
  res: Response,
  error: CustomError | Error | any,
  status: number = 400,
  tag: string = "HTTP",
) => {
  if (error instanceof CustomError) {
    console.error(`${B}${R}[${error.tag}]${RST} ${R}${error.message}${RST}`);
    res.status(error.status).send({ message: error.message });
  } else {
    console.error(`${B}${R}[${tag}]${RST} ${DIM}${error?.message ?? error}${RST}`);
    res.status(status).send({ message: error.message });
  }
};
