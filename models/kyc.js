import mongoose from "mongoose";
const Schema = mongoose.Schema;

const KycSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  recentPhoto: { type: String, required: true },
  callToBarCertificate: { type: String, required: true },
  cacRegNumber: { type: String, required: true },
  CacCertificate: { type: String, required: true },
  verificationStatus: { type: String, default: "unverified" },
});

const Kyc = mongoose.model("Kyc", KycSchema);

export default Kyc;
