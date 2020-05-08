const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    name :{
        type : String
    },

    clientId : {
        type : String
    },

    invoices : {
        type : [String]
    },
},
    
    { timestamps: true }
)

module.exports = Client = mongoose.model("Client", clientSchema);


// module.export = clientSchema
