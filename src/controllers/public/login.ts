import { Request, NextFunction } from "express";
import { AppDataSource } from "../../ormconfig";
import { log } from "../../utils/logger";
import { Users } from "../../entities/Users";
import { Chats } from "../../entities/Chats";
import { ACTIVE_STATUS } from "../../constants/chat";

//add access and refresh tokens

export const login = async (req: Request, res: any, next: NextFunction) => {
  try {
    log.info(`GET request: ${req.method} /messages${req.url}`);

    const { nickname, password } = req.body;
    const user = await AppDataSource.getRepository(Users).findOneBy({
      nickname,
      password,
    });

    const chats = await AppDataSource.getRepository(Chats)
      .createQueryBuilder("chats")
      .innerJoin("chats.users", "chat_user")
      .where("user_id = :userId", { userId: Number(user.id) })
      .andWhere("status = :status", { status: ACTIVE_STATUS })
      .take(10)
      .getMany();

    res.successRequest({ user, chats });
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
