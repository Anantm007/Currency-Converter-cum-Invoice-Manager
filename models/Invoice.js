const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    invoiceNumber : {
        type : String,
        trim: true,
        required: true
    }, 

    client : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Client'
    },

    amount : {
        type : Number,
        required: true
    },

    inrReceived : {
        type : Number,
        default : 0     	       
    },

    url : {
        type : String,
        default: ''
    },

    status : {
        type : String,
        default: 'pending'
    }

},  { timestamps: true } 

);

module.exports = Invoice = mongoose.model("Invoice", invoiceSchema);