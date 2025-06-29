import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../model/user.model";

const isUserAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.cookies);
    const accessToken =
      (req.cookies && req.cookies.accessToken) ||
      (req.header && req.header("accessToken")?.replace("Bearer ", ""));
    console.log("accessToken:=> ", accessToken);
    if (!accessToken) {
      res.status(401).json({
        status: false,
        error: "UNAUTHORIZED",
        message: "You must logged in to use this feature.",
      });
      return;
    }
    let decodedData: null | jwt.JwtPayload | string;
    try {
      if (!process.env.JWT_SECRET) {
        res.status(401).json({
          status: false,
          error: "UNAUTHORIZED",
          message: "JWT_SECRET is not defined",
        });
        return;
      }
      // decodedData = jwt.verify(accessToken, process.env.JWT_SECRET);
      decodedData = jwt.decode(accessToken);
      console.log(decodedData);
    } catch (error) {
      res.status(401).json({
        status: false,
        error: "Unauthorized",
        message: "Invalid access token",
      });
      return;
    }
    if (
      typeof decodedData !== "object" ||
      !decodedData ||
      !("id" in decodedData)
    ) {
      res.status(401).json({
        status: false,
        error: "Unauthorized",
        message: "Invalid access token payload",
      });
      return;
    }
    const user = await User.findById(decodedData.id);
    if (!user) {
      res.status(401).json({
        status: false,
        error: "Unauthorized",
        message: "User not found",
      });
      return;
    }
    req.user = user; // Assign the user to the extended Request object
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ status: false, message: errorMessage });
  }
};

export { isUserAuthenticated };
