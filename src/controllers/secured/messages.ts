/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, NextFunction } from "express";
import { MOCKED_CHAT } from "../../mocked/MockedChat";
import { log } from "../../utils/logger";
import {
  MessagesRepository,
  findForwardedBy,
  getMessageWithCreatorById,
  getMessagesByChatId,
  updateMessage,
} from "../../repositories/messages";
import { ACTIVE_STATUS, DELETED_STATUS } from "../../constants/settings";
import { DEFAULT_MESSAGE_PROPS } from "../../constants/messages";
import { getUserById } from "../../repositories/users";
import { getChatById } from "../../repositories/chats";

export const getMessages = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`GET request: ${req.method} /messages${req.url}`);

    const { chatId } = req.query;
    const messages = await getMessagesByChatId(chatId);

    const preparedMessages = messages.map((message) => ({
      ...message,
      creator: {
        id: message.creator.id,
        fullname: `${message.creator.firstName} ${message.creator.lastName}`,
        nickname: message.creator.nickname,
        avatar: message.creator.avatar,
        email: message.creator.email,
        phoneNumber: message.creator.phoneNumber,
      },
    }));

    res.successRequest(preparedMessages);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const createNewMessage = async (
  req: any,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /messages${req.url}`);

    const { text, chatId } = req.body;
    const creatorId = req.auth.userId;

    const chat = await getChatById(chatId);
    const creator = await getUserById(creatorId);

    const newMessage = {
      text,
      creator,
      chat,
      ...DEFAULT_MESSAGE_PROPS,
    };

    const successAddedMessage = await MessagesRepository.save(newMessage);
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
    const deletedMessage = await MessagesRepository.findOneBy({
      id: Number(messageId),
    });
    deletedMessage.status = DELETED_STATUS;

    const successDeletedMessage = await MessagesRepository.save(deletedMessage);

    res.successRequest(successDeletedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const changeMessageText = async (
  req: any,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`PATCH request: ${req.method} /messages${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);

    const { id: messageId } = req.params;

    const { entity } = req.body;
    const updatedMessage = await getMessageWithCreatorById(Number(messageId));
    console.log(updatedMessage.creator.id, req.auth.userId);

    if (updatedMessage.creator.id !== req.auth.userId) {
      return res.forbidden({
        message: "You do not have permission to edit the message",
      });
    }

    const successUpdatedMessage = await updateMessage(
      updatedMessage.id,
      entity,
    );

    res.successRequest(successUpdatedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const forwardMessage = async (
  req: any,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /messages${req.url}`);

    const { referenceTo, text, chatId, creator: forwardedBy } = req.body;

    const chat = await getChatById(chatId);
    const creator = await getUserById(req.auth.userId);

    const newMessage = {
      text,
      creator,
      forwardedBy, 
      chat,
      referenceTo,
      ...DEFAULT_MESSAGE_PROPS,
    };

    const successAddedMessage = await MessagesRepository.save(newMessage);
    res.successRequest(successAddedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
