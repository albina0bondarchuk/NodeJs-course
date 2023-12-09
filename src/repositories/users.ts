import { Users } from "../entities/Users";
import { AppDataSource } from "../ormconfig";

export const UsersRepository = AppDataSource.getRepository(Users);

export const getUserByNicknameAndPassword = async (
  nickname: string,
  password: string,
) => await UsersRepository.findOneBy({ nickname, password });

export const getUserById = async (id): Promise<Users> =>
  await UsersRepository.createQueryBuilder("users")
    .leftJoinAndSelect("users.contacts", "user_contacts")
    .leftJoin("user_contacts.contact", "user")
    .addSelect(["user.id", "user.firstName", "user.lastName", "user.avatar"])
    .where("users.id =:id", { id })
    .getOne();

export const isUserExist = async (nickname: string, email: string) =>
  await UsersRepository.createQueryBuilder("users")
    .where("nickname = :nickname", { nickname })
    .orWhere("email = :email", { email })
    .getExists();
