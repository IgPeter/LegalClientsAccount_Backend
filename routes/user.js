import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(`/`, async (req, res) => {
  //creating a junior lawyer's account
  const userDetails = req.body;

  const user = new User({
    fullName: userDetails.fullName,
    chamberName: userDetails.chamberName,
    enrolleeNUmber: userDetails.enrolleeNUmber,
    gender: userDetails.gender,
    nin: userDetails.nin,
    email: userDetails.email,
    phone: userDetails.phone,
    password: bcrypt.hashSync(userDetails.password, 4),
  });

  try {
    const createdUser = user.save();
    if (!createdUser) {
      return res.status(400).json("user creation failed");
    }

    //saving user detailss
    res.status(201).json({
      message: "new user created successfully",
      createdUser: createdUser,
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});

router.post(`/login`, async (req, res) => {
  const secret = process.env.SECRET;
  const { email, password } = req.body;

  const user = await User.find({ email: email });

  if (!user) {
    return res.status(404).json({ message: "You don't have an account" });
  }

  try {
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

    res.status(200).json({ message: "Auth Success", token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while comparing password" });
  }
});

router.get(`/:id`, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json({ message: "Found User", user: user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

export default router;
