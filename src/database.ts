import mongoose, { Schema } from "mongoose";

const URI = process.env.MONGODB_URI;
export const database = mongoose.connect(URI, { useNewUrlParser: true });

export interface ILotteryRow extends mongoose.Document {
  team_id: string;
  week: number;
  row: string;
}

const LotteryRowSchema: Schema = new Schema({
  team_id: { type: String, required: true },
  week: { type: Number, required: true },
  row: { type: String, required: true }
});

export const LotteryRow = mongoose.model<ILotteryRow>(
  "LotteryRow",
  LotteryRowSchema
);
