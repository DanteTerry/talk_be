import { sign, verify } from "../utils/token.utils.js";

export const generateToken = async (payload, expiriesIn, secret) => {
  const token = await sign(payload, expiriesIn, secret);
  return token;
};

export const verifyToken = async (refreshToken, secret) => {
  const check = await verify(refreshToken, secret);
  return check;
};
