var fs = require('fs');
var util = require('util');
var stream = require('stream');

var FfmpegCommand = require('fluent-ffmpeg');

var helpers = require('./helpers');
var BaseHTTPStreamProcessor = require('./basehttpstreamprocessor');


function HTTPFFMPEGProcessor()
{
    BaseHTTPStreamProcessor.apply(this, arguments);
}

util.inherits(HTTPFFMPEGProcessor, BaseHTTPStreamProcessor);



HTTPFFMPEGProcessor.prototype.run = function()
{
	this.output = new stream.PassThrough();
	var command = new FfmpegCommand();
	command
		.input(this.output)
		.inputFormat(this.cam.options.inputFormat);

	if (this.cam.options.inputFormat === 'mjpeg')
		command.inputOption('-use_wallclock_as_timestamps 1');

	command
		.output(helpers.createVariableFilename(this.cam.options.filename, this.now,
		{
			camId: this.camId
		}))
		.videoCodec(this.cam.options.videoCodec)
		.outputFormat(this.cam.options.outputFormat)
		.run();

	HTTPFFMPEGProcessor.super_.prototype.run.call(this);
}


HTTPFFMPEGProcessor.prototype.getStream = function()
{
	return this.output;
}


HTTPFFMPEGProcessor.prototype.cleanup = function()
{
	if (this.output !== null)
	{
		this.output.end();
		this.output = null;
	}
}

module.exports = HTTPFFMPEGProcessor;