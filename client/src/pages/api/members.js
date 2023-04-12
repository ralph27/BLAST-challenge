import mongoose from "mongoose";
import Members from "../../../Schemas/Members";

export default async function handler(req, res) {
  mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL);
  const response = await Members.find();
  res.json(response);
}
