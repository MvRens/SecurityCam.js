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
				require('./processor-' + cams[camId].processor);
			}
		}
	},


	start: function(camId, cam, now)
	{
		var processor = new (require('./processor-' + cam.processor))(camId, cam, now);
		var duringCommandsDone = false;
		var queueAfterCommand = false;


		runCommands(cam.before, 'before', function()
		{
			processor.on('start', function()
			{
				runCommands(cam.during, 'during', function()
				{
					// Check if the processor has already finished and the
					// 'after' commands should be run immediately.
					if (queueAfterCommand)
						runCommands(cam.after, 'after', function() { });
					else
						duringCommandsDone = true;
				});
			});

			processor.on('end', function()
			{
				// If the stream is cut short, or the time is configured
				// to be less than the duration of the 'during' commands,
				// queue it up.
				if (duringCommandsDone)
					runCommands(cam.after, 'after', function() { });
				else
					queueAfterCommand = true;
			});

			processor.run();
		});
	}
};