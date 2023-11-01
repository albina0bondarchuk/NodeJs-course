import { Request, NextFunction } from "express";
import { AppDataSource } from "../../ormconfig";
import { log } from "../../utils/logger";
import { Users } from "../../entities/Users";
import { Chats } from "../../entities/Chats";
import { ACTIVE_STATUS } from "../../constants/chat";

//add access and refresh tokens

export const registration = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /registration${req.url}`);

    const { email, nickname, password, firstName, lastName, phoneNumber } =
      req.body;
    const user = new Users();
    user.firstName = firstName;
    user.lastName = lastName;
    user.nickname = nickname;
    user.email = email;
    user.password = password;
    user.phoneNumber = phoneNumber;
    user.createdAt = new Date();
    console.log(nickname);

    const createdUser = await AppDataSource.getRepository(Users).save(user);
    res.successRequest(createdUser);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

// - Registration  - POST
// {
//   email, nickName, password, firstName, lastName, phoneNumber
// }
