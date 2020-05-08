const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name :{
        type : String,
        required: true,
        trim: true
    },

    companyName: {
        type : String,
        trim: true,
        default: 'N/A'
    },

    clientId : {
        type : String,
        required: true
    },

    invoices : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    }],

},  { timestamps: true }

);

module.exports = Client = mongoose.model("Client", clientSchema);