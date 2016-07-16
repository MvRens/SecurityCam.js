var path = require('path');
var mkdirp = require('mkdirp');


function parseVariables(value, now, variables)
{
	for (var variable in variables)
	{
		if (variables.hasOwnProperty(variable))
		{
			value = value.replace('<' + variable + '>', variables[variable].toString());
		}
	}

	value = now.format(value);
	return value;
}


function createVariableFilename(value, now, variables)
{
	var filename = parseVariables(value, now, variables);
	var dirname = path.dirname(filename);
	mkdirp.sync(dirname);

	return filename;
}


module.exports =
{
	parseVariables: parseVariables,
	createVariableFilename: createVariableFilename
};