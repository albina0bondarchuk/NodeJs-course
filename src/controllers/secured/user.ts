import { NextFunction } from "express";
import { log } from "../../utils/logger";
import { getUserById } from "../../repositories/users";

export const getUser = async (req: any, res: any, next: NextFunction) => {
  try {
    log.info(`GET request: ${req.method} /user`);

    const userId = req.auth.userId;
    const user = await getUserById(userId);
    console.log(user);

    const {
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      nickname,
      avatar,
      createdAt,
      contacts,
    } = await getUserById(userId);

    res.successRequest({
      id,
      fullName: `${firstName} ${lastName}`,
      nickname,
      email,
      phoneNumber,
      avatar,
      createdAt,
      contacts: contacts.map((user) => ({
        id: user.contact.id,
        name: user.name,
        fullname: `${user.contact.firstName} ${user.contact.lastName}`,
        avatar: user.contact.avatar,
      })),
    });
  } catch (error: any) {
    log.error(error);
    res.serverError({ message: error.message });
    next(error);
  }
};
