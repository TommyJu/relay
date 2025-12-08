import { MIN_PASSWORD_LENGTH } from "../models/user.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


/*
Handles the requests and business logic for the
user authentication endpoints.
*/ 

// Handles a user signup POST request
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Enforces non-empty signup fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: `All fields are required.` });
        }

        // Enforces the minimum password length
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
        }

        // Checks if the email already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists." });

        // Hashes the given password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creates a new user given the data from the request body
        const newUser = new User(
            {
                fullName: fullName,
                email: email,
                password: hashedPassword
            }
        );

        if (newUser) {
            // Generates JWT token and saves the new user.
            generateToken(newUser._id, res);
            await newUser.save();

            // Indicates successful user creation.
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
        console.error("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Handles a user login POST request
export const login = async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
        // Verifies that a user with the given email exists.
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Checks if the given password is correct.
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generates a JWT token for the user on successful login.
        generateToken(user._id, res);

        // Indicates a successful login.
        res.status(200).json(
            {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            }
        );
    
    } catch (error) {
        console.error("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error." });
    }    
};


// Handles a user logout POST request.
export const logout = (req, res) => {
    try {
        // Expires the user's JWT token to log them out.
        res.cookie("jwt", "", { maxAge:0 });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Handles a user update profile information PUT request.
export const updateProfile = async (req, res) => {
    try {
        // Retrieves user details.
        const { profilePic } = req.body;
        const userId = req.user._id;

        // Ensures that the user has a profile picture.
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required." });
        }

        // Uploads the new profile picture to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        
        // Updates the user's profile picture URL in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in update profile controller.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Checks if the user is authenticated by verifing that the request body contains a user.
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
                console.error("Error in check authentication controller.", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};
