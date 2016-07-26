var foscam = require('./config-foscam');
var config = {};

config.port = 5705;

config.cams =
{
	frontdoor:
	{
		processor: 'ffmpeg',
		options:
		{
			// You can specify any URL string here, the Foscam helper just makes it easier
			// for compatible models. If you add your own config helper, please publish!
			url: foscam.mjpegStream('10.138.1.10', 'viewer', 'verysecure'),
			time: 5000,

			inputFormat: 'mjpeg',
			outputFormat: 'avi',
			videoCodec: 'libx264',

			filename: '[/srv/www/publiccam/]YYYY-MM-DD HH.mm.ss[/<camId>.avi]'
		}

		// TODO examples for before/after/during commands
	},

	backdoor:
	{
		processor: 'mjpeg-split',
		options:
		{
			// You can use username:password@ in the URL to log in with basic
			// authentication. Note that some cams, like Foscam, use Digest
			// authentication which is not supported. For Foscam you can provide
			// the login in the parameters instead.
			url: 'http://viewer:verysecure@10.138.1.11/video.cgi',
			time: 5000,

			filename: '[/srv/www/publiccam/]YYYY-MM-DD HH.mm.ss[/<camId> <frame>.avi]'
		}
	}
};


module.exports = config;