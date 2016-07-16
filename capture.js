var http = require('http');
var stream = require('stream');

var config = require('./config');


function runCommand(command, displayName, callback)
{
	var wait = function()
	{
		if (command.wait)
		{
			setTimeout(callback, command.wait)
		}
		else
			callback();
	}

	if (command.url)
	{
		console.log('Running command: ' + (command.displayName ? command.displayName : displayName));

		req = http.request(command.url, function(res)
		{
			res.resume();
			wait();
		});

		req.on('error', function(e)
		{
			console.log(e);
			wait();
		});

		req.end();
	}
	else
		wait();
}


function runCommands(commandArray, displayName, callback)
{
	if (!commandArray || !commandArray.length)
	{
		callback();
		return;
	}


	var commandIndex = 0;

	(function runNextCommand()
	{
		if (commandIndex < commandArray.length)
		{
			runCommand(commandArray[commandIndex], displayName + ' #' + (commandIndex + 1), function()
			{
				runNextCommand();
			});

			commandIndex++;
		}
		else
			callback();
	})();
}


module.exports =
{
	init: function(cams)
	{
		// Preload all modules to get error messages early
		for (var camId in cams)
		{
			if (cams.hasOwnProperty(camId))
			{
				require('./output-' + cams[camId].output);
			}
		}
	},


	start: function(camId, cam, now)
	{
		var timer = null;
		var req = null;
		var output = new (require('./output-' + cam.output))(camId, cam.outputOptions, now);


		runCommands(cam.before, 'before', function()
		{
			var cleanup = function()
			{
				if (timer !== null)
				{
					clearTimeout(timer);
					timer = null;
				}

				if (output !== null)
				{
					output.cleanup();
					output = null;
				}

				runCommands(cam.after, 'after', function() { });
			};


			req = http.request(cam.url, function(res)
			{
				runCommands(cam.during, 'during', function() { })

				timer = setTimeout(function()
				{
					req.abort();
					cleanup();
				}, cam.time || config.defaultTime || 10000);

				res.on('end', function()
				{
					cleanup();
				});

				res.pipe(output.getStream());
			});

			req.on('error', function(e)
			{
				console.log(e);
				cleanup();
			});

			req.end();
		});
	}
};