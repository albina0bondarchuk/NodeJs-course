/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, NextFunction } from "express";
import { MOCKED_CHAT } from "../../mocked/MockedChat";
import { log } from "../../utils/logger";
import {
  MessagesRepository,
  findForwardedBy,
} from "../../repositories/messages";
import { ACTIVE_STATUS, DELETED_STATUS } from "../../constants/settings";
import { DEFAULT_MESSAGE_PROPS } from "../../constants/messages";

export const getMessages = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`GET request: ${req.method} /messages${req.url}`);

    const { chatId } = req.query;
    const messages = await MessagesRepository.find({
      where: {
        chatId: { id: Number(chatId) },
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
  req: any,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /messages${req.url}`);

    const { text, chatId } = req.body;
    const creatorId = req.auth.userId;
    const newMessage = {
      text,
      creatorId,
      chatId,
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
    const updatedMessage = await MessagesRepository.findOneBy({
      id: Number(messageId),
    });

    if (updatedMessage.creatorId !== req.auth.userId) {
      return res.forbidden({
        message: "You do not have permission to edit the message",
      });
    }

    updatedMessage.text = entity;
    updatedMessage.modifiedAt = new Date();
    const successUpdatedMessage = await MessagesRepository.save(updatedMessage);

    res.successRequest(successUpdatedMessage);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const forwardMessage = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /messages${req.url}`);

    const { referenceTo, text, chatId, creator } = req.body;
    const forwardedBy = await findForwardedBy(referenceTo);

    const newMessage = {
      text,
      creator,
      chatId,
      referenceTo,
      forwardedBy,
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
