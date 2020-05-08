const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    invoiceNumber : {
        type : String
    }, 

    client : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Client'
    },

    amount : {
        type : Number 
    },

    inrReceived : {
        type : Number,
        default : 0     	       
    },

    status : {
        type : String,
        default: 'pending'
    }

},  { timestamps: true } 

);

module.exports = Invoice = mongoose.model("Invoice", invoiceSchema);