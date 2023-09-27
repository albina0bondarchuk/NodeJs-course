import { Request, Response } from "express";
import { MOCKED_CHAT } from "../mocked/MockedChat";

export const getMessages = (req: Request, res: Response) => {
  res.json(MOCKED_CHAT.messages);
};

export const getUnreadMessagesFromOneUser = (req: Request, res: Response) => {
  res.json(
    MOCKED_CHAT.messages.filter(
      (message) =>
        message.senderId === req.params.userId &&
        message.readStatus === "Unread",
    ),
  );
};

export const createNewMessage = (req: Request, res: Response) => {
  MOCKED_CHAT.messages.push({
    ...req.body,
    messageId: MOCKED_CHAT.messages.length + 1,
    timestamp: new Date().toISOString(),
    readStatus: "Unread",
  });

  res.json(MOCKED_CHAT.messages[MOCKED_CHAT.messages.length - 1]);
};

export const deleteMessage = (req: Request, res: Response) => {
  res.json(
    MOCKED_CHAT.messages.filter(
      (message) => message.messageId !== req.params.id,
    ),
  );
};

export const changeMessageText = (req: Request, res: Response) => {
  const changedMessage = MOCKED_CHAT.messages.find(
    (message) => message.messageId === req.params.id,
  );

  if (changedMessage) {
    changedMessage.text = req.body.text;
    res.status(200).json(changedMessage);
  } else {
    res.status(404);
  }
};
