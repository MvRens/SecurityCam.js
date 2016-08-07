var util = require('util');
var http = require('http');
var logger = require('./logger');

var BaseProcessor = require('./baseprocessor');


function BaseHTTPStreamProcessor(camId, cam, now)
{
    BaseProcessor.apply(this, arguments);
}

util.inherits(BaseHTTPStreamProcessor, BaseProcessor);


BaseHTTPStreamProcessor.prototype.run = function()
{
	var self = this;
	var timer = null;
	var req = null;

	var doCleanup = function()
	{
		if (timer !== null)
		{
			clearTimeout(timer);
			timer = null;
		}

		self.cleanup();
		self.doEnd();
	};

	req = http.request(self.cam.options.url, function(res)
	{
		self.doStart();

		timer = setTimeout(function()
		{
			req.abort();
			doCleanup();
		}, self.cam.options.time || 10000);


		res.on('end', function()
		{
			doCleanup();
		});

		res.pipe(self.getStream());
	});

	req.on('error', function(e)
	{
		logger.error(e);
		doCleanup();
	});

	req.end();
};


BaseHTTPStreamProcessor.prototype.getStream = function()
{
}


BaseHTTPStreamProcessor.prototype.cleanup = function()
{
}

module.exports = BaseHTTPStreamProcessor;