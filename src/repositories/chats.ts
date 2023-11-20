import { ChatType, UserRole } from "../constants/chats";
import { ACTIVE_STATUS } from "../constants/settings";
import { ChatUser } from "../entities/ChatUser";
import { Chats } from "../entities/Chats";
import { AppDataSource } from "../ormconfig";
import { log } from "../utils/logger";

type createChatProps = {
  creatorId: number;
  type: ChatType;
  users: number[];
  createdAt: Date;
  status: number;
};

export const ChatsRepository = AppDataSource.getRepository(Chats);
export const ChatUserRepository = AppDataSource.getRepository(ChatUser);

export const getChatsByUser = async (userId: number) =>
  await ChatUserRepository.createQueryBuilder("chat_user")
    .innerJoinAndSelect("chat_user.chatId", "chats")
    .where("user_id = :userId", { userId: userId })
    .andWhere("status = :status", { status: ACTIVE_STATUS })
    .getMany();

export const createChat = async (chat: createChatProps) => {
  try {
    const newChat = await ChatsRepository.save(chat);

    const userPromises = chat.users.map(async (user) => {
      try {
        await ChatUserRepository.save({
          userId: user,
          role: user === chat.creatorId ? UserRole.ADMIN : UserRole.DEFAULT,
          chatId: newChat.id,
        });
      } catch (e) {
        log.error(e);
        throw e;
      }
    });

    await Promise.all(userPromises);

    return newChat;
  } catch (e) {
    log.error(e);

    throw e;
  }
};

export const findUserInChat = async (userId: string, chatId: string) => {
  try {
    const result = await ChatUserRepository.createQueryBuilder("chatUser")
      .where("chatUser.userId = :userId", { userId })
      .andWhere("chatUser.chatId = :chatId", { chatId })
      .getOne();

    return result;
  } catch (error) {
    // Handle the error as needed
    console.error(error);
    throw error;
  }
};
