require("dotenv").config();
const redisClient = require("../config/redis");
const User = require("../models/users");
const Validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Submission = require("../models/submission");

// Common cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // only https in production
  sameSite: "none", // allow cross-origin cookies
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// -------------------- SIGNUP --------------------
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    Validate(req.body);

    // Check if user exists
    const isUserExists = await User.exists({ email });
    if (isUserExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";

    // Save user
    const user = await User.create(req.body);

    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, cookieOptions);

    const reply = {
      firstName: user.firstName,
      email: user.email,
      _id: user._id,
      role: user.role,
    };

    console.log("Signup Successful");
    res.status(201).json({
      success: true,
      message: "Signup Successful",
      user: reply,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// -------------------- SIGNIN --------------------
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Please fill up required fields");

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error("Invalid credentials");

    const reply = {
      firstName: user.firstName,
      email: user.email,
      _id: user._id,
      role: user.role,
    };

    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("token", token, { ...cookieOptions, maxAge: 60 * 60 * 1000 });

    res.status(200).json({
      success: true,
      user: reply,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Login Failed !!!",
    });
  }
};

// -------------------- LOGOUT --------------------
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (token) {
      const payload = jwt.decode(token);

      // Add token to blocklist
      await redisClient.set(`token:${token}`, "Blocked");
      await redisClient.expireAt(`token:${token}`, payload.exp);
    }

    // Clear cookie
    res.cookie("token", "", {
      ...cookieOptions,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: error.message || "Something went wrong !!!",
    });
  }
};

// -------------------- ADMIN REGISTER --------------------
const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    Validate(req.body);

    // Check if user exists
    const isUserExists = await User.exists({ email });
    if (isUserExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    req.body.password = await bcrypt.hash(password, 10);

    // Save admin
    const user = await User.create(req.body);

    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("token", token, { ...cookieOptions, maxAge: 60 * 60 * 1000 });

    res.status(201).json({
      success: true,
      message: "Admin Register Successful",
      token: token,
      user: user.firstName,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// -------------------- DELETE PROFILE --------------------
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete from user schema
    await User.findByIdAndDelete(userId);

    // Delete related submissions
    await Submission.deleteMany({ userId });

    res.status(200).json({
      message: "User account deleted successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
      success: false,
    });
  }
};

module.exports = {
  signup,
  signin,
  logout,
  adminRegister,
  deleteProfile,
};
