import mongoose, { models } from "mongoose";

const WinnerSchema = new mongoose.Schema({
  winner: { type: String },
});

const Winner = models.winners || mongoose.model("winners", WinnerSchema);

export default Winner;
