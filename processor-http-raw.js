var fs = require('fs');
var util = require('util');

var helpers = require('./helpers');
var BaseHTTPStreamProcessor = require('./basehttpstreamprocessor');

function HTTPRawProcessor()
{
    BaseHTTPStreamProcessor.apply(this, arguments);
}

util.inherits(HTTPRawProcessor, BaseHTTPStreamProcessor);



HTTPRawProcessor.prototype.run = function()
{
	this.output = fs.createWriteStream(helpers.createVariableFilename(this.cam.options.filename, this.now,
	{
		camId: this.camId
	}));

	HTTPRawProcessor.super_.prototype.run.call(this);
}


HTTPRawProcessor.prototype.getStream = function()
{
	return this.output;
}

module.exports = HTTPRawProcessor;




HTTPRawProcessor.prototype.cleanup = function()
{
	if (this.output !== null)
	{
		this.output.end();
		this.output = null;
	}
}

module.exports = HTTPRawProcessor;