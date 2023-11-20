import { Messages } from "../entities/Messages";
import { AppDataSource } from "../ormconfig";

export const MessagesRepository = AppDataSource.getRepository(Messages);

export const findForwardedBy = async (messageId: number) => {
  const forwardedMessage = await MessagesRepository.findOneBy({
    id: messageId,
  });
  return forwardedMessage.creatorId;
};
