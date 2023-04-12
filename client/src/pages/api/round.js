import mongoose from "mongoose";
import RoundsSummary from "../../../Schemas/RoundsSummary";

export default async function handler(req, res) {
  mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL);
  const response = await RoundsSummary.find();
  res.json(response);
}
