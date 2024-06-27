import { createUser } from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";

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

    const accessToken = await generateToken(
      { userId: newUser._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    console.table({ accessToken, refreshToken });

    res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/api/v1/auth/refreshToken",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "User created successfully",
        accessToken: accessToken,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          picture: newUser.picture,
          status: newUser.status,
        },
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
