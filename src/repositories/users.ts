import { Users } from "../entities/Users";
import { AppDataSource } from "../ormconfig";

export const UsersRepository = AppDataSource.getRepository(Users);

export const isUserExist = async (nickname: string, email: string) =>
  await UsersRepository.createQueryBuilder("users")
    .where("nickname = :nickname", { nickname })
    .orWhere("email = :email", { email })
    .getExists();
