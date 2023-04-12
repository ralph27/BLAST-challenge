import mongoose from "mongoose";
import Teams from "../../../Schemas/Teams";

export default async function handler(req, res) {
  mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL);
  const response = await Teams.find();
  res.json(response);
}
