var config = require('./config');
var capture = require('./capture');

var moment = require('moment');
var express = require('express');
var app = express();


// Some sanity checking to avoid issues later on
if (!config.cams)
	config.cams = [];


app.get('/', function(req, res)
{
	res.send(JSON.stringify(
	{
		status: 'running',
		cams: Object.keys(config.cams)
	}));
});


app.get('/capture', function(req, res)
{
	var now = moment();
	var cams = [];

	for (var camId in config.cams)
	{
		cams.push(camId);
		capture.start(camId, config.cams[camId], now);
	}

	res.send(JSON.stringify(cams));
});


app.get('/capture/:camId', function(req, res)
{
	var camId = req.params.camId;

	if (config.cams.hasOwnProperty(camId))
	{
		capture.start(config.cams[camId], moment());
		res.send(JSON.stringify([camId]));
	}
	else
	{
		res.sendStatus(404);
	}
});


app.listen(config.port, function()
{
  console.log('SecurityCam.js running on port ' + config.port);
});