import { translate } from "bing-translate-api";

export const translatedMessage = async (req, res, next) => {
  try {
    const data = await req.body;
    let { message, lang } = data;

    const translateMessage = await translate(message.message, null, lang);
    message.message = translateMessage?.translation;

    lang = "";

    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export const translateAllMessage = async (req, res, next) => {
  const data = await req.body;

  const { userId } = req.user;

  const { messages, lang } = data;

  try {
    // Process all translations in parallel using Promise.all
    const translatedMessages = await Promise.all(
      messages.map(async (message) => {
        try {
          // If message is a Mongoose document, convert it to a plain object
          if (message.toObject) {
            message = message.toObject();
          }
          // Translate the message text
          const res = await translate(message.message, null, lang);
          message.message = res?.translation; // Update the message text with the translated text

          return message; // Return the modified message object
        } catch (error) {
          console.error(`Error translating message: ${message.message}`, error);
          return message; // Return the original message in case of an error
        }
      })
    );

    return res.status(200).json(translatedMessages);
  } catch (error) {
    next(error);
  }
};
