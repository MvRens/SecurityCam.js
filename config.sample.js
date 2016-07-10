var config = {};

config.port = 5705;
config.defaultOutputBase = '/srv/cam/';
config.defaultOutputFilename = 'YYYY-MM-DD HH.mm.ss <camId>.avi';
config.defaultTimeout = 5000;

config.cams =
{
	frontdoor:
	{
		url: 'http://10.138.1.10/videostream.cgi?user=viewer&pwd=verysecure',
		timeout: 5000,

		outputBase: '/srv/www/publiccam/YYYY-MM-DD HH.mm.ss/',
		outputFilename: '<camId>.avi'
	}
};


module.exports = config;