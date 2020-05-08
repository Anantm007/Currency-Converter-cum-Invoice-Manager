const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
    invoiceNumber : {
        type : string
    }, 
    invoiceId : {
        type : string
    }, 
    client : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Client'
        // (mongoose object, refer above schema)
    },
    amount : {
        type : Number,              // (Number, USD), 
    }, 
    inrReceived : {
        type : Number,
        default : 0     	        // should be 0 when status is pending)
    },
    status : {
        type : [String]
        // enum : { pending, paid, cancelled }
    }
    },
    { timestamps: true } 
)

module.exports = Invoice = mongoose.model("Invoice", invoiceSchema);