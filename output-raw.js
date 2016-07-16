var fs = require('fs');

var helpers = require('./helpers');


function OutputRaw(camId, options, now)
{
	this.output = fs.createWriteStream(helpers.createVariableFilename(options.filename, now,
	{
		camId: camId
	}));
}


OutputRaw.prototype.getStream = function()
{
	return this.output;
};


OutputRaw.prototype.cleanup = function()
{
	if (this.output !== null)
	{
		this.output.end();
		this.output = null;
	}
}

module.exports = OutputRaw;