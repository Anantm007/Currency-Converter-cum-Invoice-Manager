const express = require('express');
var app = express();

app.get('/api', async(req, res) => {
    return res.json({
        success: true,
        message: "API running succesfully"
    })
})

app.listen(3000, async(req, res) => {
    console.log('Server running on PORT 3000')
})