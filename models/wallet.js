import mongoose from "mongoose";
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId },
  chamberName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountBalance: { type: Number, required: true },
});

const Wallet = mongoose.model("Wallet", WalletSchema);

export default Wallet;
