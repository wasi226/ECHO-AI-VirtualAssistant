import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import genToken from "../utils/genToken.js"; // Make sure this path is correct

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body; // FIXED: name (not username)
        
        // Check if email already exists
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // FIXED: Correct user creation
        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        // Generate token
        const token = await genToken(user._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false
        });

        return res.status(201).json({ message: "Signup successful", user });

    } catch (error) {
        return res.status(500).json({ message: `Signup error: ${error.message}` });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false
        });

        return res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        return res.status(500).json({ message: `Login error: ${error.message}` });
    }
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error.message}` });
    }
}
