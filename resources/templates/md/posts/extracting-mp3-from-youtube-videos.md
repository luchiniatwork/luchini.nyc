{:title  "Extracting MP3 from Youtube videos"
 :layout :post
 :date   "2008-08-31"
 :tags   ["technology"]}
 
 Here goes a simple tip on how to extract the audio of youtube videos if you use a linux box.

You will need ffmpeg to be able to proceed with these steps. If you don't have it and are on a Debian descendant box, simply type:

```bash
sudo apt-get install ffmpeg
```

1) Find the video on Youtube

2) Save the video file. There are a couple of options to do it but I am pretty old-school so I do it the hard way:

2a) Clean your browser's cache (if using firefox, simple press `Ctrl+Shift+Del` and choose "Clear Private Data"

2b) Refresh the youtube page where your video is. This will ensure that your browser re-download your video. Wait until the video has been fully downloaded.

2c) Find the biggest file on your cache (the cache folder is normally on `/home/user/.mozilla/firefox/{some code}/Cache`) and copy it to something simpler to deal with. An example:

```bash
cp 11D49E9Cd01 movie.flv
```

3) Use ffmpeg to extract the audio as an MP3 from the video file:

```bash
ffmpeg -i movie.flv -ab 128k -acodec libmp3lame movie.mp3
```

The file `movie.mp3` will be generated and ready to be played.
