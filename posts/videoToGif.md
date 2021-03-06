---
title: 'Convert any video format to a gif'
author: 'Brad Barrows'
date: '2020-9-07'
# hero_image: /static/niceday.png
---
## Converting any video format supported by ffmped to a gif

I have 2 helpful bash/zsh functions I use often.

The first one uses gifsicle to compress the gif further and remove some frames. The second shouldn't have as much loss.

```
function convertMov2Gif() {
  ffmpeg -i $1 -pix_fmt rgb8 -r 10 $1.gif && gifsicle -O3 $1.gif -o $1.gif 
}
alias mov2gif=convertMov2Gif

function video2gifNoLoss() {
  ffmpeg -i $1 -pix_fmt rgb8 $1.gif 
}
```

To use to convert a mp4 to a gif:
```
video2gifNoLoss someVideo.mp4
```

Or convert a mov to a gif:
```
video2gifNoLoss someVideo.mov
```

Requires:

```
brew install gifsicle ffmpeg
```