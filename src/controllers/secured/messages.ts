/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, NextFunction } from "express";
import { MOCKED_CHAT } from "../../mocked/MockedChat";
import { log } from "../../utils/logger";
import { AppDataSource } from "../../ormconfig";
import { Messages } from "../../entities/Messages";
import { Chats } from "../../entities/Chats";
import { Users } from "../../entities/Users";
import { ACTIVE_STATUS, DELETED_STATUS } from "../../constants/chat";

export const getMessages = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`GET request: ${req.method} /messages${req.url}`);

    const { chatId } = req.query;
    const messages = await AppDataSource.getRepository(Messages).find({
      where: {
        chat: { id: Number(chatId) },
        status: ACTIVE_STATUS,
      },
    });

    res.successRequest(messages);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const createNewMessage = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /messages${req.url}`);

    const { text, chatId, userId } = req.body;
    const newMessage = {
      text: text,
      creator: userId,
      chat: chatId,
      readBy: [],
      createdAt: new Date(),
      status: ACTIVE_STATUS,
    };
    // const message = new Messages();
    // message.text = text;
    // message.creator = await AppDataSource.getRepository(Users).findOneBy({
    //   id: userId,
    // });
    // message.chat = await AppDataSource.getRepository(Chats).findOneBy({
    //   id: chatId,
    // });
    // message.readBy = [];
    // message.createdAt = new Date();
    // message.status = ACTIVE_STATUS;

    const successAddedMessage =
      await AppDataSource.getRepository(Messages).save(newMessage);
    res.successRequest(successAddedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const deleteMessage = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`DELETE request: ${req.method} /messages${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);

    const { id: messageId } = req.params;
    const deletedMessage = await AppDataSource.getRepository(
      Messages,
    ).findOneBy({ id: Number(messageId) });
    deletedMessage.status = DELETED_STATUS;
    const successDeletedMessage =
      await AppDataSource.getRepository(Messages).save(deletedMessage);

    res.successRequest(successDeletedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const changeMessageText = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`PATCH request: ${req.method} /messages${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);
    const { id: messageId } = req.params;
    const { entity } = req.body;
    const updatedMessage = await AppDataSource.getRepository(
      Messages,
    ).findOneBy({ id: Number(messageId) });
    updatedMessage.text = entity;
    updatedMessage.modifiedAt = new Date();
    const successUpdatedMessage =
      await AppDataSource.getRepository(Messages).save(updatedMessage);

    res.successRequest(successUpdatedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
