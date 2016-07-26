var fs = require('fs');
var util = require('util');

var MjpegConsumer = require('mjpeg-consumer');
var FileOnWrite = require('file-on-write');

var helpers = require('./helpers');
var BaseHTTPStreamProcessor = require('./basehttpstreamprocessor');

function HTTPMJPEGSplitProcessor()
{
    BaseHTTPStreamProcessor.apply(this, arguments);
}

util.inherits(HTTPMJPEGSplitProcessor, BaseHTTPStreamProcessor);



HTTPMJPEGSplitProcessor.prototype.run = function()
{
	var self = this;
	var frameCounter = 0;

	this.output = new FileOnWrite({
		filename: function(data)
		{
			frameCounter++;

			return helpers.createVariableFilename(self.cam.options.filename, self.now,
			{
				camId: self.camId,
				frame: frameCounter
			});
		}
	});

	this.consumer = new MjpegConsumer();
	this.consumer.pipe(this.output);


	HTTPMJPEGSplitProcessor.super_.prototype.run.call(this);
}


HTTPMJPEGSplitProcessor.prototype.getStream = function()
{
	return this.consumer;
}

module.exports = HTTPMJPEGSplitProcessor;




HTTPMJPEGSplitProcessor.prototype.cleanup = function()
{
	if (this.consumer !== null)
	{
		this.consumer.end();
		this.consumer = null;
	}
}

module.exports = HTTPMJPEGSplitProcessor;