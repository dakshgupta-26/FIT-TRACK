import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Helper to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, birthDate } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      birthDate,
    });

    // User is created and password is hashed by pre-save middleware
    // We can now safely send the user object back (password is not selected)
    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password" });
    }

    // Find user by email and explicitly include the password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.comparePassword(password))) {
      // Create a clean user object to send back, excluding the password
      const userResponse = await User.findById(user._id);

      res.json({
        token: generateToken(user._id),
        user: userResponse,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};