import { ACTIVE_STATUS } from "../constants/settings";
import { Chats } from "../entities/Chats";
import { Token } from "../entities/Token";
import { AppDataSource } from "../ormconfig";

export const TokensRepository = AppDataSource.getRepository(Token);

export const refreshToken = async (userId: string) => {
  await TokensRepository.delete({ userId });
  await TokensRepository.create({ userId });
};

export const findToken = async (userId: string) =>
  await TokensRepository.findOneBy({ userId });
