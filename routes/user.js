import express from "express";
import User from "../models/user.js";
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
    password: userDetails.password,
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

router.get(`/`, (req, res) => {});

export default router;
