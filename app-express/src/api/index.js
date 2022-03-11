const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/transactions", (req, res) => {});

router.get("/accounts/:account_id", (req, res) => {
  try {
    Account.findOne({ account_id: req.params.account_id }, (error, data) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid data.",
        });
      }
      res.status(200).json({
        success: true,
        data: data,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
