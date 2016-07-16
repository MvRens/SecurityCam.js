var config = {};

config.port = 5705;
config.defaultTime = 5000;

config.cams =
{
	frontdoor:
	{
		url: 'http://10.138.1.10/videostream.cgi?user=viewer&pwd=verysecure',
		time: 5000,

		output: 'ffmpeg',
		outputOptions:
		{
			inputFormat: 'mjpeg',
			outputFormat: 'avi',
			videoCodec: 'libx264',
			filename: '[/srv/www/publiccam/]YYYY-MM-DD HH.mm.ss[/<camId>.avi]'
		}
	},

	backdoor:
	{
		url: 'http://10.138.1.11/videostream.cgi?user=viewer&pwd=verysecure',
		time: 5000,

		output: 'mjpeg-split',
		outputOptions:
		{
			filename: '[/srv/www/publiccam/]YYYY-MM-DD HH.mm.ss[/<camId> <frame>.avi]'
		}
	}
};


module.exports = config;