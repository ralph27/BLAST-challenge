import mongoose, { models } from "mongoose";

const TeamsSchema = new mongoose.Schema({
  teams: [
    {
      name: { type: String },
      initialSide: { type: String },
    },
  ],
});

const Teams = models.teams || mongoose.model("teams", TeamsSchema);
export default Teams;
