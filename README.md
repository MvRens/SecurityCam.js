# SecurityCam.js
#### URL's
| Path | Description |
| --- | --- |
| / | Outputs a bit of status information in JSON format. |
| /capture | Starts capturing all cameras as defined in config.js. |
| /capture/group/id | Starts capturing all cameras in the specified group as defined in config.js. |
| /capture/id | Starts capturing the camera with the specified id as defined in config.js. |
<br /><br />

#### Configuration

Refer to config.sample.js for the syntax.

##### Basic
| Name | Description |
| --- | --- |
| port | The port on which the HTTP server will run. Default is 5705. |
| cams | An object where each property defines a camera. The property name is the camId, the property value an object with the options for that camera. |

##### Camera
| Name | Description |
| --- | --- |
| processor | The processor plugin to use. This corresponds to a 'processor-*.js' file. For example, 'ffmpeg', 'http-mjpegsplit' or 'http-raw'. |
| options | Options depending on the processor plugin used. Refer to the specific processor configuration below. |
| before | An array of commands to run before starting the capture. Refer to the Commands section below. |
| during | An array of commands to run when capture has started. Waits for the first response from the camera before running. |
| after | An array of commands to run after the capture. Will wait for 'during' commands to finish. |
<br /><br />


##### Processor - Variables
When specifying a filename you can use date / time specifiers and variables. The filename will be processed by the [format() function of the moment library](http://momentjs.com/docs/#/displaying/). This means that text like 'YYYY' will be replaced by the current year. Any literal text you do not want to have replaced should be enclosed in square brackets.

All outputs support the &lt;camId&gt; variable which will be replaced with the camera's property name as specified in the config. Any extra supported variables are listed under the output's section below.

An example: '[/srv/www/publiccam/]YYYY-MM-DD HH.mm.ss[/&lt;camId&gt;.avi]'


If multiple cameras are captured at the same time, the date and time used in the filename will be the same for each, regardless of when the camera actually starts streaming. This ensures you can group these files together.
<br /><br />


##### Processor - 'http-raw'
The simplest of outputs; reads from an HTTP stream and writes all data it receives from the URL to a file without further processing.

| Option | Description |
| --- | --- |
| url | The URL to the video stream. At the moment it is assumed to be an endless stream, snapshots are not polled and will result in capturing only a single frame. |
| filename | The filename where the raw output will be written to. If the file exists it will be overwritten. |
| time | How long this camera will be captured, in milliseconds. |
<br /><br />


##### Processor - 'http-mjpegsplit'
Processes an MJPEG HTTP stream and outputs individual JPEG files.

| Option | Description |
| --- | --- |
| url | The URL to the video stream. At the moment it is assumed to be an endless stream, snapshots are not polled and will result in capturing only a single frame. |
| filename | The filename for each JPEG. Be sure to include the &lt;frame&gt; variable to get unique filenames! |
| time | How long this camera will be captured, in milliseconds. |

| Variable | Description |
| --- | --- |
| frame | The frame number in the current capture. Starts at 1. |
<br /><br />


##### Processor - 'http-ffmpeg'
Uses [ffmpeg](https://ffmpeg.org/) to transcode the input HTTP stream into another output format. Requires ffmpeg to be installed as described in [node-fluent-ffmpeg's readme under Prerequisites](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#prerequisites).

| Option | Description |
| --- | --- |
| url | The URL to the video stream. At the moment it is assumed to be an endless stream, snapshots are not polled and will result in capturing only a single frame. |
| filename | The filename where the encoded output will be written to. If the file exists it will be overwritten. |
| time | How long this camera will be captured, in milliseconds. Note: since FFmpeg uses seconds for the timeout, this value will be rounded up towards the nearest whole second. |
| inputFormat | The input format, for example 'mjpeg'. For the full list, run 'ffmpeg -formats' and look for formats with the 'D' column. |
| outputFormat | The output format, for example 'avi'. For the full list, run 'ffmpeg -formats' and look for formats with the 'E' column. |
| videoCodec | The output video codec, for example 'libx264'. For the full list, run 'ffmpeg -codecs' and look for formats with the 'V' column. For some codecs (like x264) you need to specify the encoder instead of the codec identifier, which are listed after the description as '(encoders: ...)'. |
<br /><br />


##### Processor - 'ffmpeg'
Uses [ffmpeg](https://ffmpeg.org/) to transcode the input stream into another output format. Requires ffmpeg to be installed as described in [node-fluent-ffmpeg's readme under Prerequisites](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#prerequisites).

Similar to 'http-ffmpeg', with subtle differences:
- Upside: the input option is passed directly to FFmpeg, which means it supports non-HTTP sources (RTSP for example)
- Downside: 'during' commands are executed immediately instead of waiting for the stream to start up

| Option | Description |
| --- | --- |
| input | The source of the video stream, passed directly to FFmpeg. |
| filename | The filename where the encoded output will be written to. If the file exists it will be overwritten. |
| time | How long this camera will be captured, in milliseconds. Note: since FFmpeg uses seconds for the timeout, this value will be rounded up towards the nearest whole second. |
| inputFormat | The input format, for example 'mjpeg'. For the full list, run 'ffmpeg -formats' and look for formats with the 'D' column. |
| outputFormat | The output format, for example 'avi'. For the full list, run 'ffmpeg -formats' and look for formats with the 'E' column. |
| videoCodec | The output video codec, for example 'libx264'. For the full list, run 'ffmpeg -codecs' and look for formats with the 'V' column. For some codecs (like x264) you need to specify the encoder instead of the codec identifier, which are listed after the description as '(encoders: ...)'. |
<br /><br />


##### Commands
Each command will be executed in order and consists of an 'url' and a 'wait' time after. Both are optional.

Example usage: rotate the camera to a preset location when starting, go to further presets while it is capturing and return back to the first location afterwards.

```javascript
before:
[
	{
		url: foscam.gotoPreset('10.138.1.10', 2, 'viewer', 'verysecure'),
	}
],

after:
[
	{
		url: foscam.gotoPreset('10.138.1.10', 1, 'viewer', 'verysecure'),
	}
],

during:
[
	{
		wait: 5000
	},
	{
		url: foscam.gotoPreset('10.138.1.10', 3, 'viewer', 'verysecure'),
		wait: 5000
	},
	{
		url: foscam.gotoPreset('10.138.1.10', 4, 'viewer', 'verysecure')
	}
]
```