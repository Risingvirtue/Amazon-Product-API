//server.js

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get("/test", function (req, res) {
  res.json({greeting: 'hello API'});
});

var listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
})