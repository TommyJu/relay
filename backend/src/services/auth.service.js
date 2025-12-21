import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { MIN_PASSWORD_LENGTH } from "../constants/auth.constants.js";


export const validateSignupInput = (fullName, email, password) => {
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
};

// Helper functions
const throwError = (message, statusCode) => {
  const error = new Error(message);
  error.status = statusCode;
  throw error;
};
