import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";

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
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          picture: newUser.picture,
          status: newUser.status,
          accessToken: accessToken,
        },
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);

    const accessToken = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = await generateToken(
      { userId: user._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

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
        message: "User logged in successfully",

        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          status: user.status,
          accessToken: accessToken,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const logOut = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refreshToken" });
    res.json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw createHttpError.Unauthorized(
        "Please login before processing request"
      );
    }

    const check = await verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log(check.userId);

    const user = await findUser(check.userId);

    const accessToken = await generateToken(
      { userId: user._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
