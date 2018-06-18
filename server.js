//server.js

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));
var amazon = require('amazon-product-api');

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get("/id/*/secret/*/tag/*/upc/*", function (req, res) {

	var client = amazon.createClient({
	  awsId: req.params[0],
	  awsSecret: req.params[1],
	  awsTag: req.params[2]
	});
	
	lookUp(req.params[3]);
	var count = 0;
	function lookUp(upccode) {
		client.itemLookup({
			idType: 'UPC',
			itemId: upccode,
			responseGroup: 'OfferFull'
		}).then(function(results) {
			console.log(results);
			var merchant = results[0].Offers[0].Offer[0].Merchant[0].Name[0];
		}).catch(function(err) {
				if (typeof err['$'] != "undefined" && count != 10) {
					lookUp(upccode);
					count++;
				} else {
					//console.log(err, i);
					res.send({error: err})
				}
		});
	}
	
});

var listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
})