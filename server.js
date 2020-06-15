// Express app
const express = require('express');
const app = express();
// Utility packages
const bodyParser = require('body-parser');
require('dotenv').config();
// Mongoose 
const mongoose = require('mongoose');

// Getting data in json format
app.use(bodyParser.urlencoded({extended:true}));

// Setting express engine
app.set('view engine', 'ejs');
app.use(express.static("views"));

//Connecting to the database
mongoose.promise = global.Promise;
mongoose.connect(process.env.MongoURI,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}, (err,db)=> {
    console.log(MongoURI);
    if(err)
    console.log(err);

    else
    console.log('Database Connected...');
});


// Mounting the routes
app.use('/', require('./routes/converter'));
app.use('/invoicing', require('./routes/invoicing'));

// Start the server and listen to PORT
app.listen(process.env.PORT || 3000, async(req, res) => {
    console.log(`Server running on PORT ${3000 || process.env.PORT}`)
})