const express = require('express');
const router = express();

// Utility packages
const https = require('https');
require('dotenv').config();

// Models
const Client = require("../models/Client");
const Invoice = require("../models/Invoice");

// Set up body-parser
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json({type: 'application/json'}));


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



/*************************************       CLIENT ROUTES        *********************************/



// @route   POST /invoicing 
// @desc    Register a new client
// @access  Public
router.post('/', async(req, res) => {
    const {name, clientId} = req.body;     //  Destructure the body

    // Check for empty or undefined fields
    if(!name || !clientId || name === "" || clientId === "")
    {
        return res.json({
            success: false,
            message: "Please fill all the fields"
        })
    }

    // Check that the clientId is unique
    var c = await Client.findOne({clientId: clientId});
    if(c)
    {
        return res.json({
            success: false,
            message: "Please enter a unique clientId"
        })
    }
        
    // if everything is valid, create and save a new client object in the database
    try {   
        // create new client object
        var client = new Client(req.body);

        // Save to the database
        await client.save();
        
        return res.json({
            success: true,
            client
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }

})


// @route   GET /invoicing/client/delete/:clientId 
// @desc    Delete a client using MONGOOSE clientId
// @access  Public
router.post('/client/delete/:clientId', async(req, res) => {
    
    // *this clientId is mongoose generated and not ours

    // Check if the client exists or not
    const client = await Client.findById(req.params.clientId, newDetails);
    if(!client)
    {
        return res.json({
            success: false,
            message: "Client does not exist"
        })
    }

    try {   
        //* this clientId is mongoose generated and not ours
        
        // Delete the client
        await Client.findByIdAndDelete(req.params.clientId);
        
        return res.json({
            success: true,
            message: "Client successfully deleted"
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }
})

// @route   GET /invoicing/client/edit/:clientId
// @desc    Update a client using MONGOOSE clientId
// @access  
router.post("/client/edit/:clientId",async(req, res) => {
   const newDetails = req.body.newDetails;

   //updating client with new details.
   const clientId = await Client.findByIdAndUpdate(req.params.clientId, newDetails, {new: true});

   //check if client exists or not.
   if(!clientId){
       return res.json({
       success : false,
       message : "Client doesn't exist."
       });
   } 

    return res.json({
        success : true,
        clientId
    })
})

// @route   GET /invoicing/client/findOne/:clientId
// @desc    Search client using clientId
// @access  
router.post("/client/findOne/:clientId", async(req, res) => {

    //Finding client details via client ID
    // const client = 
    await Client.findById({_id: req.params.clientId})
    .then ( client => {
        //check if client exists or not.
        if(!client) {
            return res.json({
                success : false,
                message : "Client not found. ! Recheck ID"
            })
        }

        return res.json({
            success: true,
            client
        });
    })
    .catch(err => {return err;});
});


// @route   GET /invoicing/client/findAll/:clientInfo
// @desc    Search all clients
// @access  

// PS: I didnot understand the working of findALL, so just did smth. dekhle ek baar. 
router.post("/client/findAll/:clientInfo", async(req, res) => {


    //Finding client details via client ID
    const client = await Client.find({_id : req.params.clientInfo});    // YAHAN PROBLEM HAI

    //check if client(s) exist(s) or not.
    if(!client){
        return res.json({
            success : false,
            message : "Client not found. ! Recheck ID"
        })
    }

    return res.json({
        success: true,
        client
    })
});



/*************************************      INVOICE ROUTES       *********************************/


// ROUTES


module.exports = router;