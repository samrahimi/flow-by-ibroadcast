Flow requires youtube-dl, ffmpeg, and ffprobe to function correctly, and expects that they are in the PATH.

The easy way to do it, from this folder:

cp * /usr/local/bin

Enjoy

Note: These are generic Linux builds, statically linked - if ffmpeg and ffprobe do not work on your system, please download binaries designed for it and follow the directions to put it in your path.

Don't even bother with doing this on Windows, just use WSL Ubuntu!