import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  chamberName: { type: String, required: true },
  accountNumber: { type: String },
});

AdminSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

AdminSchema.set("toJSON", {
  virtuals: true,
});

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
