const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define collection and schema
let Account = new Schema(
  {
    account_id: {
      type: String,
    },
    balance: {
      type: Number,
    },
  },
  {
    collection: "accounts",
  }
);
module.exports = mongoose.model("Account", Account);
