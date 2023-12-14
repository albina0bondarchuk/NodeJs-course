import { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { log } from "../../utils/logger";
import {
  generateAccessToken,
  generateRefreshToken,
  passwordCompare,
  replaceDbRefreshToken,
  validateToken,
} from "../../utils/authentication";

import { UsersRepository } from "../../repositories/users";
import { findToken } from "../../repositories/tokens";

const updateTokens = async (userId: number) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  await replaceDbRefreshToken(userId, refreshToken);

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: any, next: NextFunction) => {
  try {
    log.info(`POST request: ${req.method} /login${req.url}`);

    const { nickname, password } = req.body;
    const user = await UsersRepository.findOneBy({
      nickname,
    });

    const match = await passwordCompare(password, user.password);

    if (match) {
      const tokens = await updateTokens(user.id);
      res.successRequest({
        tokens,
      });
    } else {
      res.notFound({ message: "uncorrect login or password" });
    }
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /${req.url}`);

    const { refreshToken } = req.body;
    console.log(refreshToken);
    const token = await findToken(refreshToken);

    const newTokens = await updateTokens(token.userId);
    res.successRequest({
      newTokens,
    });
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
