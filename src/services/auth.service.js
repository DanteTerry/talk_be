import createHttpError from "http-errors";
import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const { DEFAULT_STATUS, DEFAULT_USER_PICTURE } = process.env;

export const createUser = async (userData) => {
  try {
    const { name, email, password, status, picture } = userData;
    if (!name || !email || !password) {
      throw createHttpError.BadRequest("Please provide all required fields");
    }

    // check name length
    if (!validator.isLength(name, { min: 3, max: 30 })) {
      throw createHttpError.BadRequest(
        "Name must be between 2 to 30 characters"
      );
    }

    // check status length

    if (status && !validator.isLength(status, { min: 5, max: 64 })) {
      throw createHttpError.BadRequest(
        "Status must be between 5 to 64 characters"
      );
    }

    // check email length
    if (email && !validator.isEmail(email)) {
      throw createHttpError.BadRequest("Please provide a valid email address");
    }

    // check pif email already exists
    if (email) {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) {
        throw createHttpError.Conflict("Email already exists");
      }
    }

    // check password length
    if (password && !validator.isLength(password, { min: 6, max: 128 })) {
      throw createHttpError.BadRequest(
        "Password must be between 6 to 128 characters"
      );
    }

    // hash password

    // adding user to database
    const newUser = await UserModel.create({
      name,
      email,
      password,
      status: status || DEFAULT_STATUS,
      picture: picture || DEFAULT_USER_PICTURE,
    });

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  if (!user) {
    throw createHttpError.NotFound("Invalid credentials");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw createHttpError.NotFound("Invalid credentials.");
  }

  return user;
};
