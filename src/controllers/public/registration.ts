import { Request, NextFunction } from "express";

import { log } from "../../utils/logger";
import {
  UsersRepository,
  getUserByNicknameAndPassword,
  isUserExist,
} from "../../repositories/users";

import { passwordHash } from "../../utils/authentication";
import { SettingsRepository } from "../../repositories/settings";
import { DefaultUserSettings } from "../../constants/settings";

export const registration = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /registration${req.url}`);

    const { email, nickname, password, firstName, lastName, phoneNumber } =
      req.body;

    const isExist = await isUserExist(nickname, email);

    if (!isExist) {
      const hashedPassword = await passwordHash(password);
      const user = {
        firstName,
        lastName,
        nickname,
        email,
        phoneNumber,
        password: hashedPassword,
        createdAt: new Date(),
      };

      await UsersRepository.save(user);
      const newUser = await getUserByNicknameAndPassword(
        nickname,
        hashedPassword,
      );

      await SettingsRepository.save({
        userId: newUser.id,
        chatSetting: DefaultUserSettings,
      });
      res.successRequest();
    } else {
      res.badRequest({
        message: "A user with this nickname or email already exists",
      });
    }
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
