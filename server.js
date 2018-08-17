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

app.get("/id/:awsId/secret/:awsSecret/tag/:awsTag/type/:type/id/:id", function (req, res) {
	//console.log(req.params);

	var client = amazon.createClient({
	  awsId: req.params["awsId"],
	  awsSecret: req.params["awsSecret"],
	  awsTag: req.params["awsTag"]
	});
	var type = req.params["type"].toLowerCase();
	var upccode = req.params["id"];
	if (type == 'upc') {
		if (upccode.length < 12){
			upccode = "0" + upccode;
		} else if (upccode.length > 12) {
			upccode = upccode.slice(upccode.length - 12);
		}
	}
	
	lookUp(upccode, type);
	
	var count = 0;
	function lookUp(upccode, type) {
		
		if (type == 'upc') {
			client.itemLookup({
				idType: 'UPC',
				itemId: upccode,
				responseGroup: 'OfferFull'
			}).then(function(results) {
				
				var merchant = results[0].Offers[0].Offer[0].Merchant[0].Name[0];
				res.send({merchant: merchant})
			}).catch(function(err) {
					if (typeof err['$'] != "undefined" && count != 100) {
						lookUp(upccode, type);
						count++;
					} else {
						//console.log(err, i);
						res.send({merchant: null, error: err})
					}
			});
		} else if (type == 'asin') {
			client.itemLookup({
				itemId: upccode,
				responseGroup: 'OfferFull'
			}).then(function(results) {
				
				var merchant = results[0].Offers[0].Offer[0].Merchant[0].Name[0];
				res.send({merchant: merchant})
			}).catch(function(err) {
					if (typeof err['$'] != "undefined" && count != 100) {
						lookUp(upccode, type);
						count++;
					} else {
						//console.log(err, i);
						res.send({merchant: null, error: err})
					}
			});
		} else {
			res.send({merchant: null, error: 'Incorrect type: ' + type});
		}
		
		
	}
	
});


var listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
})