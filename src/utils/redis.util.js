import redis from "../redisClient.js";

export const cacheConversation = async (conversationId, messages) => {
  await redis.setex(conversationId, 3600, JSON.stringify(messages));
};

export const getCachedConversation = async (conversationId) => {
  const data = await redis.get(conversationId);
  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (conversationId) => {
  await redis.del(conversationId);
};
