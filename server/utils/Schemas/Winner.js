import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema({
  winner: { type: String },
});

export const WinnerModel = mongoose.model("winner", WinnerSchema);
