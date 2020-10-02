---
title: 'Conway's Game Of Life and the Rust NVG Library'
author: 'Brad Barrows'
date: '2020-10-01'
hero_image: ../static/gol.gif
---
## Why?

So I have been crazy impressed with how fast Alacritty is. And I want to know more.

I know I read somewhere that one of the libraries that Alacritty uses (or maybe it was just a random Rust OpenGL based library) actually does some cool React style tricks to improve performance. Something about diffing changes so that it know what changed and only re renders what it needs to.

This combined with the speed of the OpenGL Graphics pipeline must be what gives Alacritty so much awesomeness. Other than the quality Rust code that the author wrote of course.

So I wanted to play around with some of these Rust graphics libraries and see if I could find a fast, easy to use way to:
    * Render 2D text
    * Render 2D images

This is actually much harder then it sounds. Due to the fact that all fast graphics rendering is going to have to be done in a 3D environment. Meaning someething like OpenGL. This means that you cannot do something as simple as drawing an image to the screen or drawing a rectangle. To draw an image for example you end up having to draw multiple triangles, loading a texture, mapping the texture to the triangles and rendering that. Not too mention all the insane amount of work it takes to just setup up the 3D environment you just want to 2D render into..

So to get going on this I choose to implement a Conway's Game Of Life app.

In searching through libraries I stumbled upon the Rust nvg library.

This library is pretty awesome. It has an insanely easy to use API and very powerful.

The big downside for me though is that it is very slow. Try out my Game of Life implementaiton and you'll see you end up with 20 FPS on a good laptop in 2020.

## What's next?

On to the next library.

I have a square rendering using [rendy](https://github.com/amethyst/rendy) which is using [gfx-hal](https://github.com/gfx-rs/gfx) underneath and is very fast. I am stuck on fixing the projection so that my aspect ratio isn't out of whack for full screen which I want.

Other choices look to be:
    * [Conrod](https://github.com/PistonDevelopers/conrod)
    * Lower level [Piston](https://github.com/PistonDevelopers/piston-examples)
    * Lower Level [GFX](https://github.com/gfx-rs/gfx)
    * [Rendy](ttps://github.com/amethyst/rendy)



## How does it look?

![image of game of life run](static/gol.gif)


# Amendment

It turns out that these 2 repos/crates do everything I am looking for:
    * [General Piston Guide](https://github.com/PistonDevelopers/Piston-Tutorials/blob/master/getting-started/readme.md)
    * [Piston OpenGL graphics](https://github.com/PistonDevelopers/opengl_graphics)

    