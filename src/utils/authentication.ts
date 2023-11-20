import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { refreshToken } from "../repositories/tokens";

const SALT_ROUND = 10;
const SECRET_KEY = process.env.JWT_SECRET_KEY ?? "my-secret-key";

export const passwordHash = async (password: string) =>
  await bcrypt.hash(password, SALT_ROUND);

export const passwordCompare = async (
  password: string,
  encryptedPassword: string,
) => await bcrypt.compare(password, encryptedPassword);

export const generateAccessToken = (userId: string) => {
  const payload = { userId, type: "access" };
  const option = { expiresIn: process.env.JWT_EXPIRES_IN ?? "20m" };

  return jwt.sign(payload, SECRET_KEY, option);
};

export const generateRefreshToken = () => {
  const payload = {
    type: "refresh",
  };
  const option = { expiresIn: process.env.JWT_EXPIRES_IN ?? "30m" };

  return jwt.sign(payload, SECRET_KEY, option);
};

export const replaceDbRefreshToken = async (userId: string) =>
  await refreshToken(userId);

export const validateToken = (token: string) => jwt.verify(token, SECRET_KEY);
