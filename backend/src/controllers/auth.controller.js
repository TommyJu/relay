import { MIN_PASSWORD_LENGTH } from "../models/user.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: `All fields are required.` });
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                fullName: fullName,
                email: email,
                password: hashedPassword
            }
        );

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json(
                {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
                }
            );

        } else {
            res.status(400).json({ message: "Invalid user data." });
        }

    } catch (error) {
        console.error("Error in authentication controller signup function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        generateToken(user._id, res);
        res.status(200).json(
            {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }
        );
    
    } catch (error) {
        console.error("Error in authentication controller login function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }    
};


export const logout = (req, res) => {
    try {
        // Expires the user's JWT token to log them out.
        res.cookie("jwt", "", { maxAge:0 });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error in authentication controller logout function.", error.message);
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
        console.error("Error in authentication controller update profile function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in authentication controller check authentication function.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};
