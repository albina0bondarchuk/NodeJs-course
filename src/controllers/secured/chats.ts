/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, NextFunction } from "express";
import { log } from "../../utils/logger";
import { AppDataSource } from "../../ormconfig";
import { Messages } from "../../entities/Messages";
import { Chats } from "../../entities/Chats";
import { Users } from "../../entities/Users";
import { ACTIVE_STATUS, DELETED_STATUS } from "../../constants/chat";
import { In } from "typeorm";

export const getChats = async (req: Request, res: any, next: NextFunction) => {
  try {
    log.info(`GET request: ${req.method} /chats${req.url}`);

    const { userId } = req.query;
    const chats = await AppDataSource.getRepository(Chats)
      .createQueryBuilder("chats")
      .innerJoin("chats.users", "chat_user")
      .where("user_id = :userId", { userId: Number(userId) })
      .andWhere("status = :status", { status: ACTIVE_STATUS })
      .getMany();

    res.successRequest(chats);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const createNewChat = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /chats${req.url}`);

    const { type, creatorId, users } = req.body;
    console.log(req.body);

    const chat = new Chats();
    chat.creator = await AppDataSource.getRepository(Users).findOneBy({
      id: Number(creatorId),
    });
    chat.type = type;
    chat.users = await AppDataSource.getRepository(Users).findBy({
      id: In(JSON.parse(users).map((user) => Number(user))),
    });
    chat.createdAt = new Date();
    chat.status = ACTIVE_STATUS;

    const successAddedChat =
      await AppDataSource.getRepository(Chats).save(chat);
    res.successRequest(successAddedChat);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const deleteChat = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`DELETE request: ${req.method} /chats${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);

    const { id: chatId } = req.params;
    const deletedChat = await AppDataSource.getRepository(Chats).findOneBy({
      id: Number(chatId),
    });
    deletedChat.status = DELETED_STATUS;
    const successDeletedChat =
      await AppDataSource.getRepository(Chats).save(deletedChat);

    res.successRequest(successDeletedChat);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const changeChat = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`PATCH request: ${req.method} /messages${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);

    const { id: chatId } = req.params;
    const updatedChat = await AppDataSource.getRepository(Chats).findOneBy({
      id: Number(chatId),
    });

    if (req.body.icon) {
      log.info(`Change chat type`);
      updatedChat.icon = req.body.icon;
    }

    if (req.body.type) {
      log.info("Change chat icon");
      updatedChat.type = +req.body.type;
    }

    updatedChat.modifiedAt = new Date();
    const successUpdatedMessage =
      await AppDataSource.getRepository(Chats).save(updatedChat);

    res.successRequest(successUpdatedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
