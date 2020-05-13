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
    const client = await Client.findById(req.params.clientId);
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
// @access  Public
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
// @access  Public
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


// @route   GET /invoicing/client/findAll
// @desc    Search all clients
// @access  Public
// PS: I did not understand the working of findALL, so just did smth. dekhle ek baar. ----- CHILL BABE JUST READ IT ONCE 
router.post("/client/findAll", async(req, res) => {

    //Finding client details via client ID
    const clients = await Client.find();    // YAHAN PROBLEM HAI ------ AB NAHI HOGI :)
    // console.log(clients);
    //check if client(s) exist(s) or not.
    if(!clients){
        return res.json({
            success : false,
            message : "Clients not found"
        })
    }

    return res.json({
        success: true,
        clients
    })
});



/*************************************      INVOICE ROUTES       *********************************/


// ROUTES

// @route   POST /invoicing/invoice/create
// @desc    Create a new invoice
// @access  Public
router.post("/invoice/create", async(req, res) => {
    const {invoiceNumber, client, amount} = req.body;

    if(invoiceNumber === "" || client === "" || amount === "" ||
        !invoiceNumber || !client || !amount) {
        return res.json({
            success : false,
            message : "Please enter the required fields"
        })
    }

    Invoice.findOne({invoiceNumber : invoiceNumber}, async (err, foundInvoice) => {
        if(!err){
            if(foundInvoice){
                return res.json({
                    success : false,
                    message : "Please enter a unique Invoice Number"
                })
            }

            try {
            const invoice = new Invoice(req.body);
            await invoice.save();
                return res.json({
                    success : true,
                    message : "Successfully added",
                    invoice
                })
            } catch (err) {
            return res.json({
                success : false,
                message : "ERROR : "+ err
            })
        }
        }
    })
})


// @route   POST /invoicing/invoice/deleteInvoice
// @desc    Delete existing invoice
// @access  Public
router.post("/invoice/deleteInvoice", (req, res) => {
    const invoiceNumber = req.body.invoiceNumber;
    const deleted = false;
    if(invoiceNumber === "" || !invoiceNumber){
        return res.json({
            message : "Enter Invoice number"
        })
    }

    // deleting invoice from Invoices collection.
    Invoice.deleteOne({invoiceNumber: invoiceNumber}, function(err) {
        if(!err){
            deleted = true;
            return res.json({
                success : true,
                message : "Deleted from database"
            })
        } else {
            return res.json ({
                success : false,
                message : err
            });
        }
    })

    // deleting invoice from Clients collection
    
    //------------ Don't even dare look the code below XD. -------  ///
    
            // Client.findOne({invoiceNumber: invoiceNumber}, function(err, foundClient) {
    //     if(!err) {
    //         if(foundClient) {
    //             console.log(foundClient);
    //             return res.json({
    //                 success : true,
    //                 message : "Found in Clients",
    //             })
    //         }  else {
    //             return res.json({
    //                 success : false,
    //                 message : "Not Found in Clients",
    //             })
    //         }
    //     }
    })
}) 


// @route   POST /invoicing/invoice/updateStatus
// @desc    Edit status of an invoice
// @access  Public
router.post("/invoice/updateStatus", (req, res) => {
    const {invoiceNumber, status} = req.body;

    if(invoiceNumber === "" || !invoiceNumber ||status === "" || !status ){
        return res.json({
            success : false,
            message : "Enter all fields"        
        })        
    }
    
    Invoice.findOne({invoiceNumber : invoiceNumber}, (err, foundInvoice) => {
        if(!err){
            if(foundInvoice){
                foundInvoice.status = status;
                foundInvoice.save();
                return res.json({
                    success : true,
                    message : "Successfully status updated"
                });
            } else {
                return res.json ({
                    success : false,
                    message : "Invoice not found"
                });
            }
        } else {
            return err
        }
    })
});

//exporting
module.exports = router;