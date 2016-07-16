var MjpegConsumer = require('mjpeg-consumer');
var FileOnWrite = require('file-on-write');

var helpers = require('./helpers');


function OutputMJPEGSplit(camId, options, now)
{
	var frameCounter = 0;

	this.output = new FileOnWrite({
		filename: function(data)
		{
			frameCounter++;

			return helpers.createVariableFilename(options.filename, now,
			{
				camId: camId,
				frame: frameCounter
			});
		}
	});

	this.consumer = new MjpegConsumer();
	this.consumer.pipe(this.output);
}


OutputMJPEGSplit.prototype.getStream = function()
{
	return this.consumer;
};


OutputMJPEGSplit.prototype.cleanup = function()
{
	if (this.consumer !== null)
	{
		this.consumer.end();
		this.consumer = null;
	}
}

module.exports = OutputMJPEGSplit;