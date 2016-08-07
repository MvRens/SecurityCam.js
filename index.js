var moment = require('moment');
var fs = require('fs');
var chokidar = require('chokidar');
var express = require('express');
var capture = require('./capture');
var logger = require('./logger');

var app = express();

var server = null;
var serverPort = 0;
var config = null;
var configError = null;

var loadConfig = function()
{
	try
	{
		// Unload existing config
		if (config !== null)
		{
			var name = require.resolve('./config');
			delete require.cache[name];
		}

		config = require('./config');

		// Some sanity checking to avoid issues later on
		if (!config.cams)
			config.cams = [];

		capture.init(config.cams);
		configError = null;

		if (server === null || config.port !== serverPort)
		{
			if (server !== null)
			{
				server.close();
				server = null;
			}

			serverPort = config.port;
			server = app.listen(config.port, function()
			{
			  logger.info('SecurityCam.js running on port ' + config.port);
			});
		}
	}
	catch (e)
	{
		config = null;
		configError = e.message;

		// Don't close the server if it was running before. The port is
		// unlikely to change, and this will allow the status page to
		// report the error.

		logger.error('Error loading configuration:');

		// Tried to use e.stack to get more information about where the syntax
		// error is, but it seems SyntaxError doesn't provide it yet:
		// http://stackoverflow.com/questions/20570477/line-number-of-syntaxerror-in-node-js
		logger.error(e);
	}
}



app.get('/', function(req, res)
{
	if (config !== null)
	{
		res.send(JSON.stringify(
		{
			status: 'running',
			cams: Object.keys(config.cams)
		}));
	}
	else if (configError !== null)
	{
		res.send(JSON.stringify(
		{
			status: 'error',
			error: configError
		}));
	}
	else
	{
		res.send(JSON.stringify(
		{
			status: 'error',
			error: 'An unhandled error has occured. See the console for more information, hopefully.'
		}));
	}
});


app.get('/capture', function(req, res)
{
	if (config !== null)
	{
		var now = moment();
		var cams = [];

		for (var camId in config.cams)
		{
			if (config.cams.hasOwnProperty(camId))
			{
				cams.push(camId);
				capture.start(camId, config.cams[camId], now);
			}
		}

		logger.info('Started capture for: ' + cams.join(', '));

		res.send(JSON.stringify(cams));
	}
	else
	{
		res.status(500).send({ error: 'See / for more information' });
	}
});


app.get('/capture/:camId', function(req, res)
{
	if (config !== null)
	{
		var camId = req.params.camId;

		if (config.cams.hasOwnProperty(camId))
		{
			capture.start(camId, config.cams[camId], moment());

			logger.info('Started capture for: ' + camId);
			res.send(JSON.stringify([camId]));
		}
		else
		{
			logger.warning('Cam not found: ' + camId);
			res.sendStatus(404);
		}
	}
	else
	{
		res.status(500).send({ error: 'See / for more information' });
	}
});

var watcher = chokidar.watch('./config.js');
var firstLoad = true;

watcher.on('all', function()
{
	if (!firstLoad)
		logger.verbose('Configuration change detected, reloading...');

	loadConfig();
	firstLoad = false;
});


// It looks like the add event from chokidar will always be fired immediately,
// at least on Windows, but I couldn't find anything in the documentation so
// let's not make that assumption and double-check.
setTimeout(function()
{
	if (firstLoad)
	{
		loadConfig();
		firstLoad = false;
	}
}, 1000);