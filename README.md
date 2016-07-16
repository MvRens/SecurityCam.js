# SecurityCam.js
#### URL's
| Path | Description |
| --- | --- |
| / | Outputs a bit of status information in JSON format. |
| /capture | Starts capturing all cameras as defined in config.js. |
| /capture/id | Starts capturing the camera with the specified id as defined in config.js. |

#### Configuration

Refer to config.sample.js for the syntax.

##### Basic
| Name | Description |
| --- | --- |
| port | The port on which the HTTP server will run. Default is 5705. |
| defaultTime | The default time for which a capture runs, in milliseconds. |
| cams | An object where each property defines a camera. The property name is the camId, the property value an object with the options for that camera. |

##### Camera
| Name | Description |
| --- | --- |
| url | The URL to the video stream. At the moment it is assumed to be an endless stream (video or server-pushed mjpeg), snapshots are not polled and will result in capturing only a single frame. |
| time | How long this camera will be captured, in milliseconds. If not specified, defaultTime is used. |
| output | The output format used. This is pluggable and corresponds to the output-*.js files. For example, 'ffmpeg', 'mjpeg-split' or 'raw'. |
| outputOptions | Options depending on the output format used. Refer to the specific output configuration below. |


##### Output - Variables
When specifying a filename you can use date / time specifiers and variables. The filename will be processed by the [format() function of the moment library](http://momentjs.com/docs/#/displaying/). This means that text like 'YYYY' will be replaced by the current year. Any literal text you do not want to have replaced should be enclosed in square brackets.

All outputs support the &lt;camId&gt; variable which will be replaced with the camera's property name as specified in the config. Any extra supported variables are listed under the output's section below.

An example: '[/srv/www/publiccam/]YYYY-MM-DD HH.mm.ss[/&lt;camId&gt;.avi]'


If multiple cameras are captured at the same time, the date and time used in the filename will be the same for each, regardless of when the camera actually starts streaming. This ensures you can group these files together.

##### Output - 'raw'
The simplest of outputs; writes all data it receives from the URL to a file without further processing.

| Option | Description |
| --- | --- |
| filename | The filename where the raw output will be written to. If the file exists it will be overwritten. |



##### Output - 'mjpeg-split'
Processes an MJPEG stream and outputs individual JPEG files.

| Option | Description |
| --- | --- |
| filename | The filename for each JPEG. Be sure to include the &lt;frame&gt; variable to get unique filenames! |

| Variable | Description |
| --- | --- |
| frame | The frame number in the current capture. Starts at 1. |



##### Output - 'ffmpeg'
Uses [ffmpeg](https://ffmpeg.org/) to transcode the input stream into another output format. Requires ffmpeg to be installed as described in [node-fluent-ffmpeg's readme under Prerequisites](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#prerequisites).

| Option | Description |
| --- | --- |
| filename | The filename where the encoded output will be written to. If the file exists it will be overwritten. |
| inputFormat | The input format, for example 'mjpeg'. For the full list, run 'ffmpeg -formats' and look for formats with the 'D' column. |
| outputFormat | The output format, for example 'avi'. For the full list, run 'ffmpeg -formats' and look for formats with the 'E' column. |
| videoCodec | The output video codec, for example 'libx264'. For the full list, run 'ffmpeg -codecs' and look for formats with the 'V' column. For some codecs (like x264) you need to specify the encoder instead of the codec identifier, which are listed after the description as '(encoders: ...)'. |