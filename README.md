# Currency Converter cum Invoice Manager

This project consists of 2 parts:

1. Currency converter - To inter-convert between EUR, USD and INR built using ExchangeRate-API (https://www.exchangerate-api.com)

2. Invoice/Client Manager - Perform CRUD operations to keep track of clients and generate invoices.

## Project Setup

```javascript
1. Clone the repo
2. cd Currency Converter cum Invoice Manager
3. npm install
4. make a .env file with the following keys: MongoURI
5. npm run dev
6. Open the project on 127.0.0.1:3003
```

## Features

1. Smoothly inter-convert a specific amount of Indian Rupee or Euro or US Dollar
2. CRUD operation on clients
3. CRUD operations on generate invoices
4. A summary page to keep a a track of how many clients are added or how many invoices are raise along with toal earnings till date (in INR).
5. A "notes" section/textarea to keep some handy information.

## Technology Stack

- MongoDB
- Express.js
- Node.js
- EJS Templating Engine

### Check out the deployed application at:

- http://ammanager.herokuapp.com/

### Miscellaneous

Being a freelancer, I built this web app for myself to effectively manage my clients and keep a track of my earnings and raised invoices.
The code is very scalable and anyone who wishes to modify the app as per their requirements is most welcome!

### Resources:

1. https://exchangeratesapi.io/

#### Contributiong

Feel free to fork this repo and raise an issue or submit a PR in case of any bugs.
