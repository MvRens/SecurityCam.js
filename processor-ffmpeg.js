var fs = require('fs');
var util = require('util');
var stream = require('stream');

var FfmpegCommand = require('fluent-ffmpeg');

var helpers = require('./helpers');
var BaseProcessor = require('./baseprocessor');


function FFMPEGProcessor()
{
    BaseProcessor.apply(this, arguments);
}

util.inherits(FFMPEGProcessor, BaseProcessor);



FFMPEGProcessor.prototype.run = function()
{
	var self = this;
	var command = new FfmpegCommand();
	command
		.input(this.cam.options.input)
		.inputOptions(['-t ' + this.cam.options.time]);

	if (typeof(this.cam.options.inputFormat) !== 'undefined')
	{
		command.inputFormat(this.cam.options.inputFormat);
		if (this.cam.options.inputFormat === 'mjpeg')
			command.inputOption('-use_wallclock_as_timestamps 1');
	}

	command
		.output(helpers.createVariableFilename(this.cam.options.filename, this.now,
		{
			camId: this.camId
		}))
		.videoCodec(this.cam.options.videoCodec)
		.outputFormat(this.cam.options.outputFormat);

	command.on('end', function()
	{
		self.doEnd();
	});

	self.doStart();
	command.run();

	FFMPEGProcessor.super_.prototype.run.call(this);
}


module.exports = FFMPEGProcessor;