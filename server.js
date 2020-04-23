// Express app
const express = require('express');
const app = express();

// Utility packages
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config();


// Getting data in json format
app.use(bodyParser.urlencoded({extended:true}));

// Setting express engine
app.set('view engine', 'ejs');
app.use(express.static("public"));



/*******************************                ROUTES                ***************************************/

app.get('/', async(req, res) => {
    return res.render("../views/home")
})

app.post('/convert', async(req, res) => {
    console.log(req.body);
    var fromCurrency = req.body.fromCurrency;
    var amount = req.body.amount;
    var apiKey = process.env.apiKey;
    
    var toCurrency;
    let eur, inr, usd;
    var query;

    if(fromCurrency === 'USD')
    {
        toCurrency = 'EUR';
        query = fromCurrency + '_' + toCurrency;

        await convertCurrency(apiKey, amount, query, function(err, total) {   
            eur = total;
    
            toCurrency = 'INR';
            query = fromCurrency + '_' + toCurrency;

            convertCurrency(apiKey, amount, query, function(err, total) {
                inr = total;        
                return res.json({
                    usd: amount,
                    inr,
                    eur
                })
        
            });

        });
    }

    else if(fromCurrency === 'EUR')
    {

        toCurrency = 'USD';
        query = fromCurrency + '_' + toCurrency;

        await convertCurrency(apiKey, amount, query, function(err, total) {   
            usd = total;
    
            toCurrency = 'INR';
            query = fromCurrency + '_' + toCurrency;

            convertCurrency(apiKey, amount, query, function(err, total) {
                inr = total;        
                return res.json({
                    usd,
                    inr,
                    eur: amount
                })
        
            });

        });
    }

    else if(fromCurrency === 'INR')
    {
        toCurrency = 'USD';
        query = fromCurrency + '_' + toCurrency;

        await convertCurrency(apiKey, amount, query, function(err, total) {   
            usd = total;
    
            toCurrency = 'EUR';
            query = fromCurrency + '_' + toCurrency;

            convertCurrency(apiKey, amount, query, function(err, total) {
                eur = total;        
                return res.json({
                    usd,
                    inr: amount,
                    eur
                })
        
            });

        });
    }

})

convertCurrency = (apiKey, amount, query, cb) => {
    
    var url = 'https://free.currconv.com/api/v7/convert?q=' + query + '&compact=ultra&apiKey=' + apiKey;
    
    https.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        try {
          var jsonObj = JSON.parse(body);

          var val = jsonObj[query];
          if (val) {
            total = val * amount;
            console.log(total);
            cb(null,total);
          } else {
            var err = new Error("Value not found for " + query);
            console.log(err);
            cb(err, 0)
          }
        } catch(e) {
          console.log("Parse error: ", e);
          cb(e, 0);
        }
    });


    }).on('error', function(e){
        console.log("Got an error: ", e);
        cb(e);
    });
}


app.listen(3000, async(req, res) => {
    console.log('Server running on PORT 3000')
})