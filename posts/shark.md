---
title: 'Animating SVGs using CSS ( using Affinity Designer to create SVGs )'
author: 'Brad Barrows'
date: '2020-11-01'
pre_shark: true
---
# What is this?

Example for creating an SVG in Affinity Designer and then exporting as an SVG and animating using CSS.

I wanted to see how I could animate some of the SVGs I had been drawing using Affinity Designer.

To animate I am using CSS only.

[My code is here](https://github.com/bebrws/shark-animation)

# How?

You can name a group or single layer in AD (Affinity Designer). 
This will set a CSS ID to the group name you have in AD.

You can then use CSS to transform or animate whatever you have the ID for.

In shark-animcation/index.html you can see how I animate using CSS.

If you open up the AD file here you can see I took my shark I had drawn as a solid object and broke up the path around the mouth. Then named everything I needed to move with a name ending in Head.

Then I copied over the SVG into my html and was able to use the css IDs to animate. 

# CSS Code

The css code I used is pretty simple. Just an animation to move the mouth and another to move the shark. The way animations work in CSS I am able to set the inital state of an object. In this case the object is either the whole shark or different parts of the shark drawing. Then I can set the final state, or where I want to animate "to". And then set the time it takes to animate betweeen these two states and the acceleration in change used (I used linear here).

The CSS Code is :

```


  #wholeShark {
      /* width: 500px; */
      transform: translate(-400px, 0px);
      animation: moveShark 2s linear forwards;
  }
  @keyframes moveShark {
      to {
          transform: translate(100px, 0px);
      }
  }

  #SharkEyeHead, #SharkNoseStuffHead, #SharkStylHead, #SharkBackgroundHead {
      transform: rotate(-6deg) translate(-105px, 190px);
      animation: moveMouth .3s linear forwards;
      animation-direction: alternate;
      animation-iteration-count: infinite;
  }

  @keyframes moveMouth {
      to {
          transform: rotate(0deg) translate(0px, 0px);
      }
  }

```

## How does it look?

[Click here to see it hosted on its own](https://bebrws.github.io/shark-animation/index.html)