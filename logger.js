var moment = require('moment');
var logger = {};


function log(level, message)
{
	console.log('[' + moment().format() + '] ' + level + ': ' + message);
}


logger.verbose = function(message)
{
	log('Verbose', message);
}

logger.info = function(message)
{
	log('Info', message);
}

logger.warning = function(message)
{
	log('Warning', message);
}

logger.error = function(message)
{
	log('Error', message);
}


module.exports = logger;