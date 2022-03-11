const express = require("express");
const router = express.Router();
let TransactionRequest = require("../models/transaction-request");
let Account = require("../models/account");
let Transaction = require("../models/transaction");
var uuid = require("uuid");

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/transactions", (req, res) => {
  try {
    let newTransId = uuid.v4();
    let { account_id, amount } = req.body;

    let pattern =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    let result = pattern.test(account_id);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "account_id must be a valid UUID v4",
      });
    }
    let positiveAmount;
    amount > 0 ? (positiveAmount = 1) : (positiveAmount = -1);

    //add a transaction
    let transactionRequest = new TransactionRequest();
    transactionRequest.account_id = account_id;
    transactionRequest.amount = amount * positiveAmount;
    transactionRequest.transaction_id = newTransId;

    transactionRequest.save((error, result) => {
      errorHandling(error, result);

      //find account if exist in account schema
      Account.find({ account_id: account_id }, (error, data2) => {
        errorHandling(error, data2);

        //if account doesn't exist add new account in account schema and set balance as amount
        if (data2.length == 0) {
          let account = new Account();
          account.account_id = account_id;
          account.balance = amount * positiveAmount;

          account.save((error, result) => {
            errorHandling(error, result);
          });
        } else {
          //update balance depending on if amount is withdrawn or deposited
          Account.findOneAndUpdate(
            { account_id: account_id },
            {
              balance:
                amount > 0
                  ? data2[0].balance + amount * positiveAmount
                  : data2[0].balance - amount * positiveAmount,
            },
            (error, data) => {
              errorHandling(error, data);
            }
          );
        }
      });

      //finally add the transaction with transaction id in transaction schema
      let transaction = new Transaction();
      transaction.transaction_id = newTransId;
      transaction.account_id = account_id;
      transaction.amount = amount;

      transaction.save((error, data) => {
        errorHandling(error, data);
      });

      res.status(201).send(result);
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/transactions", (req, res) => {
  Transaction.find((error, data) => {
    errorHandling(error, data);
    res.status(200).send({
      success: true,
      message: "user orders",
      data: data,
    });
  }).sort({ created_at: -1 });
});

router.get("/accounts/:account_id", (req, res) => {
  try {
    Account.findOne({ account_id: req.params.account_id }, (error, data) => {
      errorHandling(error, data);

      res.status(200).send(data);
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/transactions/:transaction_id", (req, res) => {
  try {
    TransactionRequest.findOne(
      { transaction_id: req.params.transaction_id },
      (error, data) => {
        errorHandling(error, data);

        res.status(200).send(data);
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

errorHandling = async (error, data) => {
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid data.",
    });
  }
  return data;
};

module.exports = router;
