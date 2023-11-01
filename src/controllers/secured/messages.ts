/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, NextFunction } from "express";
import { MOCKED_CHAT } from "../../mocked/MockedChat";
import { log } from "../../utils/logger";

export const getMessages = (req: Request, res: any, next: NextFunction) => {
  try {
    log.info(`GET request: ${req.method} /messages${req.url}`);
    res.successRequest(MOCKED_CHAT.messages);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const createNewMessage = (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`POST request: ${req.method} /messages${req.url}`);

    MOCKED_CHAT.messages.push({
      ...req.body,
      messageId: MOCKED_CHAT.messages.length + 1,
      timestamp: new Date().toISOString(),
      readStatus: "Unread",
    });

    res.successRequest(MOCKED_CHAT.messages[MOCKED_CHAT.messages.length - 1]);
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const deleteMessage = (req: Request, res: any, next: NextFunction) => {
  try {
    log.info(`DELETE request: ${req.method} /messages${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);

    res.successRequest(
      MOCKED_CHAT.messages.filter(
        (message) => message.messageId !== req.params.id,
      ),
    );
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};

export const changeMessageText = (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  try {
    log.info(`PATCH request: ${req.method} /messages${req.url}`);
    log.info(`Query parameters: ${JSON.stringify(req.params)}`);
    const changedMessage = MOCKED_CHAT.messages.find(
      (message) => message.messageId === req.params.id,
    );

    if (changedMessage) {
      changedMessage.text = req.body.text;
      res.successRequest(changedMessage);
    } else {
      log.error(`Message with id: ${req.params.id} is not found`);
      res.notFound({
        message: `Message with id: ${req.params.id} is not found`,
      });
    }
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
