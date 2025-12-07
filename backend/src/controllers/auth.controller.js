import { MIN_PASSWORD_LENGTH } from "../models/user.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js" 


/*
Handles the requests and business logic for the
user authentication endpoints.
*/ 


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

export const login = (req, res) => {
    res.send("login route");
};

export const logout = (req, res) => {
    res.send("logout route");
};