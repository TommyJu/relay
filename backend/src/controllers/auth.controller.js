import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/token.js";
import cloudinary from "../lib/cloudinary.js";
import { validateSignupInput, hashPassword, createAndSaveUser} from "../services/auth.service.js"
import { sendErrorResponse } from "../utils/errorHandling.js";
import { parseUserToJSON } from "../utils/jsonFormatting.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await validateSignupInput(fullName, email, password);

    const hashedPassword = await hashPassword(password);

    await createAndSaveUser(fullName, email, hashedPassword);
    res.status(201).json(parseUserToJSON(newUser));
  
} catch (error) {
    sendErrorResponse(res, error, "auth controller signup");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    generateToken(user._id, res);
    res.status(200).json(parseUserToJSON(user));
  } catch (error) {
    console.error(
      "Error in authentication controller login function.",
      error.message
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = (req, res) => {
  try {
    // Expires the user's JWT token to log them out.
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error(
      "Error in authentication controller logout function.",
      error.message
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(
      "Error in authentication controller update profile function.",
      error.message
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(
      "Error in authentication controller check authentication function.",
      error.message
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

