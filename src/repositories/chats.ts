import { ChatType, UserRole } from "../constants/chats";
import { ACTIVE_STATUS } from "../constants/settings";
import { ChatUser } from "../entities/ChatUser";
import { Chats } from "../entities/Chats";
import { Users } from "../entities/Users";
import { AppDataSource } from "../ormconfig";
import { log } from "../utils/logger";

type createChatProps = {
  creator: Users;
  type: ChatType;
  users: number[];
  createdAt: Date;
  status: number;
};

export const ChatsRepository = AppDataSource.getRepository(Chats);
export const ChatUserRepository = AppDataSource.getRepository(ChatUser);
export const UsersRepository = AppDataSource.getRepository(Users);

export const getChatById = async (chatId: number) =>
  await ChatsRepository.findOneBy({ id: chatId });

export const getChatsByUser = async (userId: number) =>
  await ChatUserRepository.createQueryBuilder("chat_user")
    .innerJoinAndSelect("chat_user.chatId", "chats")
    .innerJoin("chat_user.user", "users")
    .where("users.id = :userId", { userId: userId })
    .andWhere("status = :status", { status: ACTIVE_STATUS })
    .getMany();

export const createChat = async (chat: createChatProps) => {
  try {
    const newChat = await ChatsRepository.save(chat);

    const userPromises = chat.users.map(async (user) => {
      try {
        const dbUser = await UsersRepository.findOneBy({ id: user });
        console.log(dbUser);

        await ChatUserRepository.save({
          user: dbUser,
          role: user === chat.creator.id ? UserRole.ADMIN : UserRole.DEFAULT,
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
    log.error(error);
    throw error;
  }
};
