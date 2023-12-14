import { ACTIVE_STATUS } from "../constants/settings";
import { Messages } from "../entities/Messages";
import { AppDataSource } from "../ormconfig";

export const MessagesRepository = AppDataSource.getRepository(Messages);

export const getMessagesByChatId = async (chatId) =>
  await MessagesRepository.createQueryBuilder("messages")
    .innerJoinAndSelect("messages.creator", "users")
    .innerJoin("messages.chat", "chats")
    .where("chats.id =:chatId", { chatId })
    .andWhere("messages.status =:status", { status: ACTIVE_STATUS })
    .orderBy("messages.createdAt", "ASC")
    .getMany();

export const getMessageWithCreatorById = async (messageId: number) =>
  await MessagesRepository.createQueryBuilder("messages")
    .innerJoinAndSelect("messages.creator", "users")
    .where("messages.id =:messageId", { messageId })
    .getOne();

export const updateMessage = async (id, text) =>
  await MessagesRepository.createQueryBuilder("messages")
    .update(Messages)
    .set({ text, modifiedAt: new Date() })
    .where("id = :id", { id })
    .execute();

export const findForwardedBy = async (messageId: number) => {
  const forwardedMessage = await MessagesRepository.createQueryBuilder(
    "messages",
  )
    .innerJoin("messages.creator", "users")
    .where("messages.id =:messageId", { messageId })
    .getOne();

  return forwardedMessage.creator.id;
};
