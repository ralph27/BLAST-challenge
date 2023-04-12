import mongoose from "mongoose";
import Winner from "../../../Schemas/Winner";

export default async function handler(req, res) {
  mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL);
  const response = await Winner.find();
  res.json(response);
}
