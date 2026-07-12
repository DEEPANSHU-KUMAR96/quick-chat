import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    deliveredTo: {
      type: [String],
      default: [],
    },
    readBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Message", messageSchema);
