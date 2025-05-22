import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const validateObjectId = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("valid object id middleware called");
    const id = req.params[param];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: `Invalid ${param}` });
      return;
    }
    next();
  };
};

export default validateObjectId;
