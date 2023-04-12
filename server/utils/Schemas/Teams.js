import mongoose from "mongoose";

const TeamsSchema = new mongoose.Schema({
  teams: [
    {
      name: { type: String },
      initialSide: { type: String },
    },
  ],
});

export const TeamsModel = mongoose.model("team", TeamsSchema);
