const express = require("express");
const router = express();

// Utility packages
const axios = require("axios");
const moment = require("moment-timezone");
require("dotenv").config();

const { EXCHANGE_API_ACCESS_KEY } = process.env;

/*************************************             ROUTES               *********************************/

// @route   GET /
// @desc    Render the homepage
// @access  Public
router.get("/", async (req, res) => {
  var now = moment().utc();

  const ist = now.tz("Asia/Kolkata").toString();
  const gmt = now.tz("Africa/Abidjan").toString();
  var germanTime = now.tz("Europe/Berlin").toString();
  var adelaideTime = now.tz("Australia/Adelaide").toString();

  return res.render("../views/home", {
    ist,
    gmt,
    germanTime,
    adelaideTime,
  });
});

// @route   POST /convert
// @desc    Call convert money function and return the converted amounts
// @access  Public
router.post("/convert", async (req, res) => {
  const { amount, fromCurrency } = req.body;
  const url = `http://api.exchangeratesapi.io/latest?access_key=${EXCHANGE_API_ACCESS_KEY}from=${fromCurrency}`;
  var inr, usd, eur;

  if (fromCurrency === "USD") {
    axios
      .get(url)
      .then((data) => {
        console.log(data.data.rates);
        inr = data.data.rates.INR * Number(amount);
        eur = data.data.rates.EUR * Number(amount);
        return res.render("../views/response", {
          usd: Number(amount).toFixed(2),
          inr: inr.toFixed(2),
          eur: eur.toFixed(2),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (fromCurrency === "EUR") {
    axios
      .get(url)
      .then((data) => {
        inr = data.data.rates.INR * Number(amount);
        usd = data.data.rates.USD * Number(amount);
        return res.render("../views/response", {
          eur: Number(amount).toFixed(2),
          inr: inr.toFixed(2),
          usd: usd.toFixed(2),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (fromCurrency === "INR") {
    axios
      .get(url)
      .then((data) => {
        usd = data.data.rates.USD * Number(amount);
        eur = data.data.rates.EUR * Number(amount);
        return res.render("../views/response", {
          inr: Number(amount).toFixed(2),
          usd: usd.toFixed(2),
          eur: eur.toFixed(2),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

module.exports = router;
