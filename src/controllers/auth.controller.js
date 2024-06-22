import { createUser } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, status, picture } = req.body;
    const newUser = await createUser({
      name,
      email,
      password,
      status,
      picture,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
export const logOut = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
