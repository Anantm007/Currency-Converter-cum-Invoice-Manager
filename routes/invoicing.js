const express = require('express');
const router = express();

// Utility packages
const https = require('https');
require('dotenv').config();



/*************************************             ROUTES               *********************************/


// @route   GET /invoicing 
// @desc    Home page for invoicing
// @access  Public
router.get('/', async(req, res) => {
    return res.json({
        success: true,
        message: "This is the invoicing dashboard, we will add a password page here"
    })
})

module.exports = router;