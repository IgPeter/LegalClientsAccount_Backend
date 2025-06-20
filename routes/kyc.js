import express from "express";
import multer from "multer";
import fs from "fs";
import Kyc from "../models/kyc.js";
import auth from "../middlewares/auth.js";

const router = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //const uploadDir = path.resolve(process.cwd(), "public", "upload");
    const uploadDir = "./public/upload/";

    //checking if directory exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync("./public");
      if (fs.existsSync("./public")) {
        fs.mkdirSync("./public/upload/");
      }
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: "recentPhoto", maxCount: 1 },
  { name: "callToBarCert", maxCount: 1 },
  { name: "cacCert", maxCount: 1 },
]);

//route used by the user to upload kyc documents
router.post(`/upload`, uploadFields, async (req, res) => {
  /*handling KYC data
   */
  const { cacRegNumber } = req.body;
  const { recentPhoto, cacCert, callToBarCert } = req.files;

  const recentPhotoFileName = recentPhoto[0].filename;
  const cacCertFileName = cacCert[0].filename;
  const callToBarCertFileName = callToBarCert[0].filename;

  const filePath = `http://${req.get("host")}/public/upload/`;

  const kycData = new Kyc({
    cacRegNumber: cacRegNumber,
    recentPhoto: `${filePath}${recentPhotoFileName}`,
    callToBarCertificate: `${filePath}${callToBarCertFileName}`,
    cacCertificate: `${filePath}${cacCertFileName}`,
  });

  try {
    const result = await kycData.save();

    res
      .status(201)
      .json({ message: "created kyc data successfully", kycData: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || error.toString(),
    });
  }
});

//routes used by the admin to view user's uploaded kyc documents
router.get(`/:userId`, auth, async (req, res) => {
  const isAdmin = req.user.isAdmin;
  const userId = req.params.userId;

  if (!isAdmin) {
    return res.status(403).json({ message: "You can't do this" });
  }

  try {
    const userKyc = await Kyc.find({ user: userId });

    if (!userKyc) {
      return res
        .status(404)
        .json({ message: "Found no kyc data for this users" });
    }

    res
      .status(200)
      .json({ message: "Found kyc data for this user", kycData: userKyc });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error.toString(),
    });
  }
});

//This route will be used by the admin after a period of 24h
router.patch(`/:userId/verify`, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await find({ user: userId });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    user.verifiedStatus = "verified";

    const modifiedUser = user.save();

    //activate user's account here before response
    res.status(200).json({ message: "Kyc verified", user: modifiedUser });
  } catch (error) {
    console.error(error);
  }
});

export default router;
