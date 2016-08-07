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
	this.filename = helpers.createVariableFilename(this.cam.options.filename, this.now,
	{
		camId: this.camId
	});

	this.tempFilename = this.filename + '.recording';
	this.output = fs.createWriteStream(this.tempFilename);

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

	fs.rename(this.tempFilename, this.filename, function(err)
	{
		console.log('Error: could not move ' + this.tempFilename + ' to ' + this.filename + ': ' + err.message);
	});
}

module.exports = HTTPRawProcessor;