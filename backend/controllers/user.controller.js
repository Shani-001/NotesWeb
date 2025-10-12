// import express from "express"
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Notes } from "../models/notes.model.js";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "password must be atleast 6 char long" }),
  });
  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    if (!newUser) {
      res.status(500).json({ message: "User Signup error" });
    }
    res.status(201).json({ message: "User Signup Successfully" });
  } catch (error) {
    console.log("user Signup error", error);
    res.status(400).json({ message: "user Signup error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // console.log(email,password)
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(403).json({ errors: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    // jwt code
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_USER_PASSWORD,
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, //  can't be accsed via js directly
      secure: process.env.NODE_ENV === "production", // true for https only
      sameSite: "Strict", // CSRF attacks
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
    console.log("error in login", error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, given_name, family_name } = payload;
    // console.log(payload)
    const password = "123456789";
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user if doesn't exist
      user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email: email,
        password: hashedPassword, // required field, but user logs in with Google
        // avatar: picture,
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign({ id: user._id }, config.JWT_USER_PASSWORD, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("jwt", jwtToken, cookieOptions);
    res
      .status(200)
      .json({ message: "Google login successful", user, token: jwtToken });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ errors: "Google login failed" });
  }
};

export const getUserSetting = async (req, res) => {
  const { userId } = req;
  // console.log(userId)
  if (!userId) {
    res.status(404).json({ message: "User is Not Authenticated" });
  }
  try {
    const user = await User.findById(userId).select(
      "firstName lastName email password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, settings: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching settings" });
  }
};

export const updateUserSetting = async (req, res) => {
  const { userId } = req;
  if (!userId) {
    res
      .status(404)
      .json({ success: false, message: "User is not authenticted" });
  }
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Settings updated", settings: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating settings" });
  }
};

export const purchases = async (req, res) => {
  const { userId } = req;

  try {
    const purchased = await Purchase.find({ userId });
    if (!purchased) {
      return res
        .status(500)
        .json({ message: "No detail found of purchased notes" });
    }
    let purchasedNotedId = [];
    for (let i = 0; i < purchased.length; i++) {
      purchasedNotedId.push(purchased[i].notesId);
    }
    const notesData = await Notes.find({
      _id: { $in: purchasedNotedId },
    });
    res
      .status(201)
      .json({ message: "Notes Extracted Successfully ", purchased, notesData });
  } catch (error) {
    console.log("Error in Purchases notes", error);
    return res.status(400).json({ errors: "Error in Purchases notes" });
  }
};
