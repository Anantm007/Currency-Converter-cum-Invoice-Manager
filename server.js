// Express app
const express = require('express');
const app = express();

// Utility packages
const bodyParser = require('body-parser');
require('dotenv').config();


// Getting data in json format
app.use(bodyParser.urlencoded({extended:true}));

// Setting express engine
app.set('view engine', 'ejs');
app.use(express.static("views"));



// Render home page
app.get('/', async(req, res) => {
    return res.render("../views/home")
})


// Mounting the routes
app.use('/', require('./routes/converter'));


// Start the server and listen to PORT
app.listen(3000 || process.env.PORT, async(req, res) => {
    console.log(`Server running on PORT ${3000 || process.env.PORT}`)
})