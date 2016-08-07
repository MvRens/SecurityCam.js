var fs = require('fs');
var util = require('util');
var stream = require('stream');

var FfmpegCommand = require('fluent-ffmpeg');

var helpers = require('./helpers');
var logger = require('./logger');
var BaseHTTPStreamProcessor = require('./basehttpstreamprocessor');


function HTTPFFMPEGProcessor()
{
    BaseHTTPStreamProcessor.apply(this, arguments);
}

util.inherits(HTTPFFMPEGProcessor, BaseHTTPStreamProcessor);



HTTPFFMPEGProcessor.prototype.run = function()
{
	this.output = new stream.PassThrough();
	this.filename = helpers.createVariableFilename(this.cam.options.filename, this.now,
	{
		camId: this.camId
	});

	this.tempFilename = filename + '.recording';


	var command = new FfmpegCommand();
	command
		.input(this.output)
		.inputFormat(this.cam.options.inputFormat);

	if (this.cam.options.inputFormat === 'mjpeg')
		command.inputOption('-use_wallclock_as_timestamps 1');

	command
		.output(this.tempFilename)
		.videoCodec(this.cam.options.videoCodec)
		.outputFormat(this.cam.options.outputFormat);

	command.on('error', function(err, stdout, stderr)
	{
		logger.error('FFmpeg output:' + err.message);
	});

	command.run();

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

	fs.rename(this.tempFilename, this.filename, function(err)
	{
		logger.error('Could not move ' + this.tempFilename + ' to ' + this.filename + ': ' + err.message);
	});
}

module.exports = HTTPFFMPEGProcessor;