import mongoose, { models } from "mongoose";

const MembersSchema = new mongoose.Schema({
  members: {
    type: Map,
    of: new mongoose.Schema({
      username: { type: String },
      initialSide: { type: String },
      kills: { type: Number },
      deaths: { type: Number },
      headshots: { type: Number },
      weapons: [
        {
          name: { type: String },
          kills: { type: Number },
        },
      ],
      grenades: [
        {
          name: { type: String },
          thrown: { type: Number },
        },
      ],
      deathLocations: [String],
      highestStreak: { type: Number },
      totalDmg: { type: Number },
      bombsDefused: { type: Number },
      bombsPlanted: { type: Number },
      blindedInSec: { type: Number },
      successfullFlashes: { type: Number },
      money: [
        {
          timestamp: { type: String },
          balance: { type: Number },
        },
      ],
      bodyPartsHit: { type: mongoose.Schema.Types.Mixed },
      team: { type: String },
    }),
  },
});

const Members = models.members || mongoose.model("members", MembersSchema);

export default Members;
