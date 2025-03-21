import mongoose from "mongoose";
import { User } from "../models/user_model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import generateAccessAndRefreshToken from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

const registerUserController = async (req, res) => {
  const { fullname, email, password, username } = req.body;

  // VALIDATING IF ALL THE FIELDS ARE SUPPLIED
  const allFieldsValidation = [fullname, email, password, username].every(
    (field) => field.trim() === ""
  );

  if (allFieldsValidation) {
    res.status(400).json({ message: "All Fields are required." });
  }

  // VALIDATING IF THE USER EXISTS
  const userExistsValidation = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExistsValidation)
    res.status(400).json({ message: "User Already exists." });

  try {
    const user = await User.create({
      fullname,
      email,
      username,
      password,
    });

    if (!user)
      res
        .status(404)
        .json({ message: "Something wen't wrong while registering the user." });

    return res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.error("Error creating user in user controller: ", error.message);

    res
      .status(404)
      .json({ message: "Error while registering the user. Please try again." });
  }
};

const logInUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(404).json({ message: "Email and password missing" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid)
      return res.status(404).json({ message: "Password Incorrect" });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!loggedInUser)
      return res.status(404).json({ message: "User not found!" });

    const options = {
      httpOnly: true,
      secure: false,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login Successful.",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("Login Controller errored out: ", error.message);
    res.status(401).json({ message: "Login Unsuccessful" });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { refreshToken: null },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Logged out" });
  } catch (error) {
    console.error(
      "Unable to logout user from logoutUser controller: ",
      error.message
    );
    res.status(404).json({ message: "Error occurred while logging out user." });
  }
};

const verifyToken = async (req, res) => {
  const incomingAccessToken = req.cookies.accessToken || req.body.accessToken;
  if (!incomingAccessToken)
    return res
      .status(401)
      .json({ message: "No Access Token found -- Try logging again" });

  try {
    const decodedUser = jwt.verify(
      incomingAccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({ isAuthenticated: true, user: decodedUser });
  } catch (error) {
    console.error("Errored out in verifyToken controller: ", error.message);
    res.status(401).json({ message: "Access token expired or not found." });
  }
};

const generateNewAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new Error("No refresh token found.");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new Error("No user found - Invalid refresh token");

    if (incomingRefreshToken !== user.refreshToken)
      throw new Error(
        "User refresh token doesn't match incoming refresh token."
      );

    // GENERATING NEW TOKENS
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // updating the new refresh token in database
    user.refreshToken = refreshToken;

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "New tokens generated" });
  } catch (error) {
    console.error("Error generating new access");
    res.status(404).json({
      message:
        "Something wen't wrong while generating new access & refresh tokens.",
    });
  }
};

const getProfileController = async (req, res) => {
  try {
    if (!req.user) throw new Error({ message: "No user found..." });

    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Errored in getProfileController: ", error.message);
    return res
      .status(404)
      .json({ message: "Something wen't wrong. Please login again" });
  }
};

const editAvatar = async (req, res) => {
  try {
    const { _id } = req.body;
    const avatarFilePath = req.file.path;
    if (!avatarFilePath)
      return res.status(404).json({ message: "No file provided!!" });

    const avatarFile = await uploadOnCloudinary(avatarFilePath);

    await User.findByIdAndUpdate(_id, {
      $set: { avatar: avatarFile.url },
    });

    return res.status(200).json({ message: "Avatar uploaded successfully." });
  } catch (error) {
    console.error(
      "Error while running edit avatar controller: ",
      error.message
    );
    return res.status(404).json({
      message: "Error occurred while updating the avatar. Please try again.",
    });
  }
};

// VERIFY PASSWORD
const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password)
      return res.status(404).json({ message: "No password provided!" });

    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "Unable to fetch the user." });

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid)
      return res.status(404).json({ message: "Password doesn't match." });

    return res.status(200).json({ message: "Password is correct." });
  } catch (error) {
    console.error("verify password controller errored out: ".error.message);
    return res.status(404).json({
      message:
        "Something wen't wrong while verifying your password. Please try again.",
    });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const { password } = req.body;

    if (!userId)
      return res
        .status(404)
        .json({ message: "No id available in the request!!" });

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(404).json({ message: "Invalid User Id.." });

    if (!password)
      return res
        .status(404)
        .json({ message: "No new password found in the request" });

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "No user found with this id" });

    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error in reset password controller: ", error.message);
    return res.status(404).json({
      message: "Something wen't wrong while updating your password!!",
    });
  }
};

export {
  registerUserController,
  logInUserController,
  logoutUser,
  verifyToken,
  generateNewAccessToken,
  getProfileController,
  editAvatar,
  verifyPassword,
  resetPassword,
};
