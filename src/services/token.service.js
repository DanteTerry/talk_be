import { sign } from "../utils/token.utils.js";

export const generateToken = async (payload, expiriesIn, secret) => {
  const token = await sign(payload, expiriesIn, secret);
  return token;
};
