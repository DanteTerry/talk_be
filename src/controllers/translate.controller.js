import { translate } from "bing-translate-api";

export const translatedMessage = async (req, res, next) => {
  try {
    const data = await req.body;
    const { message, lang } = data;

    const translateMessage = await translate(message.message, null, lang);
    message.message = translateMessage?.translation;

    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};
