const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/transactions", (req, res) => {});

router.get("/accounts/:account_id", (req, res) => {});

module.exports = router;
