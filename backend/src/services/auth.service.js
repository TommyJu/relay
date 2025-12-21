import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/token.js";
import {
  MIN_PASSWORD_LENGTH,
  NUM_SALT_ROUNDS_FOR_PASSWORD_HASH,
} from "../constants/auth.constants.js";
import { throwError } from "../utils/errorHandling.js";
import cloudinary from "../lib/cloudinary.js";



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
    return newUser;
  } else {
    throwError((message = "Error creating a new user."), (statusCode = 400));
  }
};


export const validateLoginInput = async(email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throwError("Invalid credentials.", 400);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throwError("Invalid credentials.", 400);
        }
    
    return user;
};


export const uploadProfilePicture = async(profilePic) => {
    if (!profilePic) {
      throwError("Profile picture is required.", 400);
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    return uploadResponse.secure_url;
};

export const updateUserProfilePicture = async(secureUrl, userId) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: secureUrl },
        { new: true }
    );

    return updatedUser;
}


