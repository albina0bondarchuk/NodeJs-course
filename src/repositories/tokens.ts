import { ACTIVE_STATUS } from "../constants/settings";
import { Chats } from "../entities/Chats";
import { Token } from "../entities/Token";
import { AppDataSource } from "../ormconfig";

export const TokensRepository = AppDataSource.getRepository(Token);

export const refreshToken = async (userId: number, tokenId: string) => {
  await TokensRepository.delete({ userId });
  TokensRepository.save({ userId, tokenId });
};

export const findToken = async (tokenId: string) =>
  await TokensRepository.findOneBy({ tokenId });
