/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, NextFunction } from "express";
import { log } from "../../utils/logger";
import { AppDataSource } from "../../ormconfig";
import { Chats } from "../../entities/Chats";
import { Users } from "../../entities/Users";
import { DEFAULT_CHAT_PROPS, UserRole } from "../../constants/chats";
import { In } from "typeorm";
import {
  ChatsRepository,
  createChat,
  findUserInChat,
  getChatsByUser,
} from "../../repositories/chats";
import { DELETED_STATUS } from "../../constants/settings";

export const getChats = async (req: any, res: any, next: NextFunction) => {
  try {
    log.info(`GET request: ${req.method} /chats${req.url}`);

    const userId = req.auth.userId;
    const chatsByUsers = await getChatsByUser(Number(userId));

    const preparedChats = chatsByUsers.map((chat) => chat.chatId);

    res.successRequest(preparedChats);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const createNewChat = async (req: any, res: any, next: NextFunction) => {
  try {
    log.info(`POST request: ${req.method} /chats${req.url}`);

    const { type, users } = req.body;
    const creatorId: number = req.auth.userId;

    const newChat = {
      creatorId,
      type,
      users: [...JSON.parse(users), creatorId],
      ...DEFAULT_CHAT_PROPS,
    };

    await createChat(newChat);

    res.successRequest("chat was added");
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const deleteChat = async (req: any, res: any, next: NextFunction) => {
  try {
    log.info(`DELETE request: ${req.method} /chats${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);

    const { id: chatId } = req.params;
    const deletedChat = await ChatsRepository.findOneBy({
      id: Number(chatId),
    });
    const currentUserWithRole = await findUserInChat(req.auth.userId, chatId);

    if (currentUserWithRole.role !== UserRole.ADMIN) {
      return res.forbidden({
        message: "You do not have permission to delete the chat",
      });
    }

    deletedChat.status = DELETED_STATUS;
    const successDeletedChat = await ChatsRepository.save(deletedChat);

    res.successRequest(successDeletedChat);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const changeChat = async (req: any, res: any, next: NextFunction) => {
  try {
    log.info(`PATCH request: ${req.method} /messages${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);

    const { id: chatId } = req.params;
    const updatedChat = await ChatsRepository.findOneBy({
      id: Number(chatId),
    });

    const currentUserWithRole = await findUserInChat(req.auth.userId, chatId);

    if (currentUserWithRole.role !== UserRole.ADMIN) {
      return res.forbidden({
        message: "You do not have permission to delete the chat",
      });
    }

    if (req.body.icon) {
      log.info(`Change chat type`);
      updatedChat.icon = req.body.icon;
    }

    if (req.body.type) {
      log.info("Change chat icon");
      updatedChat.type = +req.body.type;
    }

    if (req.body.title) {
      log.info("Change chat title");
      updatedChat.title = req.body.title;
    }

    updatedChat.modifiedAt = new Date();
    const successUpdatedMessage = await ChatsRepository.save(updatedChat);

    res.successRequest(successUpdatedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
