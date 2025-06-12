import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: { type: String, required: true },
  chamberName: { type: String, required: true },
  enrolleeNUmber: { type: Number, required: true },
  gender: { type: String, required: true },
  nin: { type: BigInt, required: true },
  email: { type: String, required: true },
  phone: String,
  password: { type: String, required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
  kyc: { type: mongoose.Schema.Types.ObjectId, ref: "Kyc" },
});

UserSchema.virtual("id").get(() => {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("User", UserSchema);

export default User;
