---
title: 'Chrome Debugger Window always on top script'
author: 'Brad Barrows'
date: '2020-9-06'
# hero_image: ../static/niceday.png
---
## Keep your Chrome Dev Tools Debugger on top of all windows on OSX Catalina

![An animated gif of the usage of these scripts](/static/ChromeDevToolsOnTop.gif)

I was getting tired of having to search for my Chrome Dev Tools Debugger window and thought I would see how hard it would be to write a dylib I could
add as a dylib load instruction eventually to my Google Chrome binary.

I eventually will make a script and dylib that does all this but for now I wrote a quick frida-cycript script to take care of this.

### Issues I encountered

So for some reason.. sometimes.. I can't use 
```[NSApplication shared]```
to get a reference to the main application. I am not sure why this is for some programs.

One way I thought of around this is to just use the heap!

Here we will search for all NSApplication instances in the heap and grab the last one we find (there should only be one).

```var a;
ObjC.choose(ObjC.classes.NSApplication, {
    onMatch: function (aarg) {
        a = aarg;
    },      
    onComplete: function () {    
        console.log('Done searching for NSApplication.');    
    }      
});  

```

I did a similar trick with this script since I couldn't do a NSApplication.windows or mainWindow or keyWindow on Google Chrome without it crashing:

```
var ws=[];
ObjC.choose(ObjC.classes.NSWindow, {
    onMatch: function (aarg) {
        ws.push(aarg);
    },      
    onComplete: function () {    
        console.log('done');    
    }      
});  
```

Just creates a list of all the Windows.

I then checked out the class names and titles one by one.

I noticed that Chrome will crash when I even check the title of some of these windows so I had to write my filter functions in a specific order.

Then I set the window level to always be on top finally.

The code is below:

```
var ws=[];
ObjC.choose(ObjC.classes.NSWindow, {
    onMatch: function (aarg) {
        ws.push(aarg);
    },      
    onComplete: function () {    
        console.log('done');    
    }      
});  

var possibleWindows = ws.filter((w) => w.className().toString() === "NativeWidgetMacNSWindow")
var devToolWindows = possibleWindows.filter((w) => w.title().toString().includes("DevTools"))
devToolWindows.forEach((w) => {
    w.setLevel_(9);
});

```

### To use:


Run:

```
function toppid() { ps -ef | grep $1 | grep -v grep | awk '{ if (NR == 1) print $2 }'  }
sudo cycript -p `toppid "Google Chrome.app"` keepDevToolsOnTop.cy
```


NOTE:

* Requires SIP be disabled
* [frida-cycript](https://github.com/nowsecure/frida-cycript/releases) installed 

