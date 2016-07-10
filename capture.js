var http = require('http');
var fs = require('fs');
var util = require('util');
var Readable = require('stream').Readable;
var FfmpegCommand = require('fluent-ffmpeg');


var PushStream = function(options) { Readable.call(this, options); };
util.inherits(PushStream, Readable);
PushStream.prototype._read = function(n) { };


module.exports =
{
	start: function(camId, cam, now)
	{
		var timer = null;
		var req = null;

		console.log('Starting FFmpeg');

		var output = new PushStream();
		var command = new FfmpegCommand();
		command
			.input(output)
			.inputFormat('mjpeg')
			.inputOption('-use_wallclock_as_timestamps 1')
			.output('D:/Temp/' + camId + '.avi')
			.videoCodec('libx264')
			.outputFormat('avi')
			.run();


		var cleanup = function()
		{
			if (timer !== null)
			{
				clearTimeout(timer);
				timer = null;
			}

			if (command !== null)
			{
				output.push(null);
				command = null;
			}
		};


		req = http.request(cam.url, function(res)
		{
			timer = setTimeout(function()
			{
				console.log('Timeout!');
				req.abort();

				cleanup();
			}, cam.timeout);

			res.on('data', function(chunk)
			{
				output.push(chunk);
			});

			res.on('end', function()
			{
				console.log('End!');
				cleanup();
			});
		});

		req.on('error', function(e)
		{
			console.log(e);
			cleanup();
		});

		req.end();
	}
};