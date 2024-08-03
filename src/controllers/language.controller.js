import createHttpError from "http-errors";
import LanguageModel from "../models/language.model.js";

export const addLanguage = async (req, res, next) => {
  try {
    const data = req.body;

    const ifExists = await LanguageModel.findOne({ user: data.user });

    if (ifExists) {
      return res.status(200).json({
        status: "success",
        message: "User's language already exists",
      });
    }

    const usersLang = await LanguageModel.create(data);
    if (!usersLang) {
      return next(
        createHttpError.BadRequest(`User's language couldn't be created`)
      );
    }

    return res.status(201).json(usersLang);
  } catch (error) {
    next(error);
  }
};

export const changeLanguage = async (req, res, next) => {
  try {
    const data = req.body;

    const ifExists = await LanguageModel.findOne({ user: data.user });

    if (!ifExists) {
      return next(createHttpError.BadRequest(`User's language doesn't exist`));
    }

    const updatedUserLanguage = await LanguageModel.findByIdAndUpdate(
      ifExists._id,
      { language: data.language },
      { new: true } // Return the updated document
    );

    if (!updatedUserLanguage) {
      return next(
        createHttpError.BadRequest(`Couldn't update user's language`)
      );
    }

    return res.status(200).json(updatedUserLanguage);
  } catch (error) {
    next(error);
  }
};
