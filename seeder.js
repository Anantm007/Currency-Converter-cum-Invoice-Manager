const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

// Load models
const Client = require("./models/Client");
const Invoice = require("./models/Invoice");

// Connect to DB
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// Read JSON files
const clients = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/clients.json`, "utf-8")
);
const invoices = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/invoices.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Client.create(clients);
    await Invoice.create(invoices);

    console.log("Data Imported...");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Client.deleteMany();
    await Invoice.deleteMany();

    console.log("Data Destroyed...");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Checking which function to call (argv will be from calling function)
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
