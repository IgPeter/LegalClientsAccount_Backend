import express from "express";
import bcrypt from "bcrypt";
import { MonnifyAPI } from "monnify-nodejs-lib";
import getMonnifyAuth from "../middlewares/loginMonnify.js";
import Admin from "../models/admin.js";
const router = express.Router();

router.post(`/`, getMonnifyAuth, async (req, res) => {
  //Generating the monnify token
  const monnifyClient = new MonnifyAPI({
    MONNIFY_APIKEY: process.env.MONNIFY_API_KEY,
    MONNIFY_SECRET: process.env.MONNIFY_SECRET,
    env: process.env.MONNIFY_ENV,
  });

  const { fullName, email, password, chamberName } = req.body;

  if (!fullName || !email || !password || !chamberName) {
    return res
      .status(400)
      .json({ message: "Please confirm that all fields are completed" });
  }

  const admin = new Admin({
    fullName: fullName,
    email: email,
    password: bcrypt.hashSync(password, 5),
    chamberName: chamberName,
  });

  //creating admin monify account

  try {
    const createdAdmin = await admin.save();

    const monnifyAccountPayload = {
      accountReference: "createdAdmin.fullName",
      accountName: createdAdmin.chamberName,
      currencyCode: "NGN",
      contractCode: "3373026524",
      customerName: createdAdmin.fullName,
      customerEmail: createdAdmin.email,
      bvn: "22215847416", // Required (or NIN)
      getAllAvailableBanks: true, // optional
    };

    const [status, body] =
      await monnifyClient.reservedAccount.createReservedAccount(
        req.monnifyToken,
        monnifyAccountPayload
      );

    if (status == 200) {
      res.status(201).json({
        message: "Created an admin successfully",
        admin: createdAdmin,
        adminWalletInfo: body,
      });
    } else {
      throw new Error(console.log(body) || "Failed to create reserved account");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(`/login`, async (req, res) => {
  const secret = process.env.SECRET;
  const { email, password } = req.body;

  const admin = await Admin.find({ email: email });

  if (!admin) {
    return res.status(404).json({ message: "You don't have an account" });
  }

  try {
    const result = await bcrypt.compare(password, admin.password);

    if (!result) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ admin: admin.id, isAdmin: true }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Auth Success", token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while comparing password" });
  }
});

export default router;
