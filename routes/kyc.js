import express from "express";
import multer from "multer";
import fs from "fs";
import Kyc from "../models/kyc.js";
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

export default router;
