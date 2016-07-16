var util = require('util');
var stream = require('stream');
var FfmpegCommand = require('fluent-ffmpeg');

var helpers = require('./helpers');


function OutputFFMPEG(camId, options, now)
{
	this.output = new stream.PassThrough();
	var command = new FfmpegCommand();
	command
		.input(this.output)
		.inputFormat(options.inputFormat);

	if (options.inputFormat === 'mjpeg')
		command.inputOption('-use_wallclock_as_timestamps 1');

	command
		.output(helpers.createVariableFilename(options.filename, now,
		{
			camId: camId
		}))
		.videoCodec(options.videoCodec)
		.outputFormat(options.outputFormat)
		.run();
}


OutputFFMPEG.prototype.getStream = function()
{
	return this.output;
};


OutputFFMPEG.prototype.cleanup = function()
{
	if (this.output !== null)
	{
		this.output.end();
		this.output = null;
	}
}

module.exports = OutputFFMPEG;