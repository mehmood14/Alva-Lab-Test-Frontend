const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema
let TransactionRequest = new Schema(
  {
    account_id: {
      type: String,
    },

    amount: {
      type: Number,
    },
    transaction_id: {
      type: String,
    },
  },
  {
    collection: "transactionsRequests",
  }
);
module.exports = mongoose.model("TransactionRequest", TransactionRequest);
