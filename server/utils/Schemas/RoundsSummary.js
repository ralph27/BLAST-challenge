import mongoose from "mongoose";

const RoundsSummarySchema = new mongoose.Schema({
  CT: {
    type: String,
    required: true,
  },
  TERRORIST: {
    type: String,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  endAt: {
    type: String,
    required: true,
  },
  matchLength: {
    type: String,
    required: true,
  },
  scores: {
    TeamVitality: { type: Number },
    Winner: { type: String },
    side: { type: String },
    "NAVI GGBET": { type: Number },
  },
  "NAVI GGBET": [
    {
      type: Map,
      of: new mongoose.Schema(
        {
          kills: { type: Number },
          dmg: { type: Number },
          username: { type: String },
        },
        { _id: false }
      ),
    },
  ],
  TeamVitality: [
    {
      type: Map,
      of: new mongoose.Schema(
        {
          kills: { type: Number },
          dmg: { type: Number },
          username: { type: String },
        },
        { _id: false }
      ),
    },
  ],
});

export const RoundsSummaryModel = mongoose.model(
  "roundSummary",
  RoundsSummarySchema
);
