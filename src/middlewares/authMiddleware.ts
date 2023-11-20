import { Request, NextFunction } from "express";
import { validateToken } from "../utils/authentication";

export const authMiddleware = (req: Request, res: any, next: NextFunction) => {
  if (req.url.includes("public")) {
    return next();
  }

  if (!req.headers.authorization) {
    return res.forbidden({ message: "No token!" });
  }
  const token = req.headers.authorization.split(" ")[2];
  console.log(token);

  try {
    const credential = validateToken(token);
    req.app.locals.credential = credential;
    return next();
  } catch (err) {
    res.forbidden({ message: err });
  }
};
