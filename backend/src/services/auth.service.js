import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/token.js";
import {
  MIN_PASSWORD_LENGTH,
  NUM_SALT_ROUNDS_FOR_PASSWORD_HASH,
} from "../constants/auth.constants.js";
import { throwError } from "../utils/errorHandling.js";

export const validateSignupInput = async (fullName, email, password) => {
  const isInputFieldEmpty = !fullName || !email || !password;
  if (isInputFieldEmpty) {
    throwError((message = `All fields are required.`), (statusCode = 400));
  }

  const isPasswordTooShort = password.length < MIN_PASSWORD_LENGTH;
  if (isPasswordTooShort) {
    throwError(
      (message = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
      (statusCode = 400)
    );
  }

  const user = await User.findOne({ email });
  if (user) {
    throwError((message = "Email already exists."), (statusCode = 400));
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(NUM_SALT_ROUNDS_FOR_PASSWORD_HASH);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createAndSaveUser = async (fullName, email, hashedPassword) => {
  const newUser = new User({
    fullName: fullName,
    email: email,
    password: hashedPassword,
  });

  if (newUser) {
    generateToken(newUser._id, res);
    await newUser.save();
  } else {
    throwError((message = "Error creating a new user."), (statusCode = 400));
  }
};

