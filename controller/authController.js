const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // FIXED: This should be `jsonwebtoken` not your user model
const userModel = require("../models/userModel")

//  SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role, // make sure role is coming from req.body or set a default
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to register user",
      success: false,
      error: error.message,
    });
  }
};

//  LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both email and password",
        success: false,
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User does not exist",
        success: false,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // Generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    const userObject = user.toObject();
    userObject.token = token;
    delete userObject.password;

    // Set cookie
    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: userObject,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to login",
      success: false,
      error: error.message,
    });
  }
};
