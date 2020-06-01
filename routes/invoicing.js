const express = require('express');
const router = express();

// Utility packages
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
    return res.render("../views/invoiceHome")
})


// @route   GET /invoicing/summary
// @desc    Summary of invoices and clients
// @access  Public
router.get('/summary', async(req, res) => {

    let sum = 0;

    const invoices = await Invoice.find( { inrReceived: { $gt: 0 } } );
    await invoices.forEach(invoice => {
        sum += invoice.inrReceived
    })

    return res.render("summary", {
        clients: await Client.countDocuments(),
        invoicesGenerated: await Invoice.countDocuments(),
        invoicesPaid: await Invoice.countDocuments() - await Invoice.countDocuments({status: 'pending'}) - await Invoice.countDocuments({status: 'cancelled'}),
        inrReceived: sum
    })
})


/*************************************       CLIENT ROUTES        *********************************/


// @route   GET /invoicing/client/findAll
// @desc    Search all clients
// @access  Public
router.get("/client/findAll", async(req, res) => {

    //Finding client details via client ID
    const clients = await Client.find().sort("clientId");    

    //check if client(s) exist(s) or not.
    if(!clients){
        return res.json({
            success : false,
            message : "Clients not found"
        })
    }

    return res.render("../views/clients", {
        success: true,
        clients
    })
});



// @route   GET /invoicing/client/:clientId
// @desc    Search client using clientId
// @access  Public
router.get("/client/:clientId", async(req, res) => {

    //Finding client details via client ID
    try {    
        await Client.findById(req.params.clientId)
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
    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }
});



// @route   GET /invoicing/client/create/new 
// @desc    Render page to register a new client
// @access  Public
router.get("/client/create/new", async(req, res) => {
    return res.render("../views/newClient");
})


// @route   GET /invoicing/:clientId/update
// @desc    Render page to update a client using MONGOOSE clientId
// @access  Public
router.get("/client/:clientId/update", async(req, res) => {
    const client = await Client.findById(req.params.clientId);
   
    //check if client exists or not.
    if(!client) 
    {
        return res.json({
            success : false,
            message : "Client doesn't exist."
            });
    }

    return res.render("../views/editClient", {
        Client: client
    })
})


// @route   POST /invoicing/client 
// @desc    Register a new client
// @access  Public
router.post('/client', async(req, res) => {
    const {name, clientId} = req.body;     //  Destructure the body, companyName is not required to be destrcutured

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
        
        return res.redirect("/invoicing/client/findAll");

    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }

})


// @route   POST /invoicing/client/update/:clientId
// @desc    Update a client using MONGOOSE clientId
// @access  Public
router.post("/client/update/:clientId", async(req, res) => {
   const newDetails = req.body; // MOMO: this will only be req.body

   // updating client with new details.
   const client = await Client.findByIdAndUpdate(req.params.clientId, newDetails, {new: true});

   // check if client exists or not.
   if(!client){
       return res.json({
       success : false,
       message : "Client doesn't exist."
       });
   }

    return res.redirect("/invoicing/client/findAll");
})


// @route   POST /invoicing/client/delete/:clientId 
// @desc    Delete a client using MONGOOSE clientId
// @access  Public
router.get('/client/delete/:clientId', async(req, res) => {
    
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
        
        return res.redirect("/invoicing/client/findAll");

    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }
})



/*************************************      INVOICE ROUTES       *********************************/


// @route   GET /invoicing/invoice/findAll
// @desc    Search all invoices
// @access  Public
router.get("/invoice/findAll", async(req, res) => {

    const invoices = await Invoice.find().populate("client").sort("invoiceNumber");

    //check if invoice(s) exist(s) or not.
    if(!invoices){
        return res.json({
            success : false,
            message : "invoices not found"
        })
    }

    return res.render("../views/invoices", {
        invoices
    })
});



// @route   GET /invoicing/invoice/:invoiceId
// @desc    Search invoice using invoiceId
// @access  Public
router.get("/invoice/:invoiceId", async(req, res) => {

    //Finding invoice details via invoice ID
    try {    
        await Invoice.findById(req.params.invoiceId)
        .then ( invoice => {
            //check if invoice exists or not.
            if(!invoice) {
                return res.json({
                    success : false,
                    message : "invoice not found. ! Recheck ID"
                })
            }

            return res.json({
                success: true,
                invoice
            });
        })   
    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }
});


// @route   GET /invoicing/invoice/create/new 
// @desc    Render page to register a new invoice
// @access  Public
router.get("/invoice/create/new", async(req, res) => {
    const clients = await Client.find();

    return res.render("../views/newInvoice", {
        clients
    });
})


// @route   GET /invoicing/invoice/:invoiceId/update
// @desc    Render page to update an invoice using MONGOOSE clientId
// @access  Public
router.get("/invoice/:invoiceId/update", async(req, res) => {
    const invoice = await Invoice.findById(req.params.invoiceId);
   
    //check if invoice exists or not.
    if(!invoice) 
    {
        return res.json({
            success : false,
            message : "Invoice doesn't exist."
            });
    }

    return res.render("../views/editInvoice", {
        invoice
    })
})

// @route   POST /invoicing/invoice
// @desc    Create a new invoice
// @access  Public
router.post("/invoice", async(req, res) => {
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
                let invoice = new Invoice(req.body);

                // Adding invoice to clien't invoice array
                const client = await Client.findById(req.body.client);
                client.invoices.unshift(invoice);
                await client.save();

                // save invoice to the DB
                await invoice.save();

                return res.redirect("/invoicing/invoice/findAll");

            } catch (err) {
                return res.json({
                    success : false,
                    message : "ERROR : "+ err
                })
              }
        }
    })
})



// @route   POST /invoicing/invoice/update/:invoiceId
// @desc    Update an invoice
// @access  Public
router.post("/invoice/update/:invoiceId", async(req, res) => {
    
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.invoiceId, req.body, {new : true});
        if(!invoice)
        {
            return res.json({
                success: false,
                message: "Invoice not found"
            })
        }

        return res.redirect("/invoicing/invoice/findAll");

    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }
});


// @route   POST /invoicing/invoice/delete/:invoiceId
// @desc    Delete existing invoice
// @access  Public
router.get("/invoice/delete/:invoiceId", async(req, res) => {

    // Deleting invoice from clientId
    const invoice = await Invoice.findById(req.params.invoiceId).select("client");
    if(!invoice)
    {
        return res.json({
            success: false,
            message: "Invoice not found"
        })
    }

    // cascade delete the invoice from client schema as well
    const client = await Client.findById(invoice.client);

    if(client) 
    {
        let i = 0;
        for(i = 0; i < client.invoices.length; i++)
        {
            if(JSON.stringify(client.invoices[i]) === JSON.stringify(req.params.invoiceId))
            {
                client.invoices.splice(i, 1)
            }
        }
        await client.save();
    }
    
    // Delete invoice
    await Invoice.findByIdAndDelete(req.params.invoiceId, (err) => {
        if(err) {
            return res.json({
                success : false,
                message : err
            });
        }
        return res.redirect("/invoicing/invoice/findAll");
    });
    
}) 



//exporting
module.exports = router;