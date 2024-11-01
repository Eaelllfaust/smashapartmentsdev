const mongoose = require("mongoose");

const actionsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dataId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["listing", "booking", "payment", "accounts", "general"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["resolved", "pending"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Adminactions', actionsSchema);