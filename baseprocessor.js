var events = require('events');
var util = require('util');

function BaseProcessor(camId, cam, now)
{
	this.camId = camId;
	this.cam = cam;
	this.now = now;
}

/*
	Descendants are required to call the following functions:

		doStart
			Call when the processing starts. This may be delayed slightly, for example,
			right after the stream is connected or when the first chunk of data arrives.

		doEnd
			Call when the processor is done.

*/
util.inherits(BaseProcessor, events.EventEmitter);


BaseProcessor.prototype.run = function()
{
}


BaseProcessor.prototype.doStart = function()
{
	this.emit('start');
}


BaseProcessor.prototype.doEnd = function()
{
	this.emit('end');
}


module.exports = BaseProcessor;