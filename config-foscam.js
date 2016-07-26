var url = require('url');
var foscam = {};

// Based on: www.foscam.es/descarga/ipcam_cgi_sdk.pdf
// Tested on FI8910W

function baseUrl(host, cgi, username, password)
{
	var urlObject = {
		protocol: 'http:',
		host: host,
		pathname: cgi,
		query: {}
	};

	if (typeof(username) !== 'undefined')
		urlObject.query.user = username;

	if (typeof(password) !== 'undefined')
		urlObject.query.pwd = password;

	return urlObject;
}


/*
	rate：
		image data translate speed, value range 0-23

		0: full speed
		1： 20 fps
		3: 15 fps
		6： 10 fps
		11： 5 fps
		12： 4 fps
		13： 3 fps
		14： 2 fps
		15： 1 fps
		17： 1 fp/2s
		19： 1 fp/3s
		21： 1 fp/4s
		23： 1 fp/5s

	resolution：
		image resolution （8： 320*240， 32： 640*480）
*/
foscam.mjpegStream = function(host, username, password, rate, resolution)
{
	var urlObject = baseUrl(host, 'videostream.cgi', username, password);

	if (typeof(resolution) !== 'undefined')
		urlObject.query.resolution = resolution;

	if (typeof(rate) !== 'undefined')
		urlObject.query.rate = rate;

	return url.format(urlObject);
}

foscam.rtspStream = function(host, username, password)
{
	var urlObject = {
		protocol: 'rtsp:',
		host: host
	};

	if (typeof(username) !== 'undefined' || typeof(password) !== 'undefined')
		urlObject.auth = (username || '') + ':' + (password || '');

	return url.format(urlObject);
}

foscam.gotoPreset = function(host, presetNumber, username, password)
{
	if (presetNumber < 1) presetNumber = 1;
	if (presetNumber > 32) presetNumber = 32;

	var urlObject = baseUrl(host, 'decoder_control.cgi', username, password);
	urlObject.query.command = 29 + (presetNumber * 2);

	return url.format(urlObject);
}

module.exports = foscam;