const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema
let Transaction = new Schema(
  {
    transaction_id: {
      type: String,
    },
    account_id: {
      type: String,
    },
    amount: {
      type: Number,
    },
    created_at: {
      type: Date,
      default: Date,
    },
  },
  {
    collection: "transactions",
  }
);
module.exports = mongoose.model("Transaction", Transaction);
