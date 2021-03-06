---
title: 'Debugging and working on Rust in XCode - Debug with LLDB using the XCode interface'
author: 'Brad Barrows'
date: '2020-12-30'
# hero_image: /static/zshstringreplace.gif
---


## Setup

To get Rust in XCode working you just need to go and clone this repo:

https://github.com/bebrws/rust-xcode-plugin

I have an install script I created for myself as well:

```
git clone https://github.com/bebrws/rust-xcode-plugin.git
cd rust-xcode-plugin
./install.sh
```

Afterwords close and open XCode.

If later you notice that you cannot set breakpoints then you will need to add your XCode UUID to the plist file.

Follow the directions in the README. You just have to run the command they provide and add it to the plist.

# Creating XCode Projects For Yur Rust Projects

Be sure to check out the amazing project:

https://crates.io/crates/cargo-xcode/1.1.1

To use run:

```
https://crates.io/crates/cargo-xcode/1.1.1
```

and from your Rust project root run:

```
cargo-xcode
```

You now have an xcodeproj file with your XCode project!

Open this and if you have the Rust plugin installed correctly from above you will be ready to build and debug your rust project, using the LLDB front end provided by XCode. Which IMO can be kind of nice. Especially if your running into issues with Rust VSCode debugging.

Although I did write a post about setting this up as well and it has been working great for me too.

You will most likely need to make sure your projevt has similar settings for the "Scheme". I took screen shots and list them below.


### For Mac OSX Only Right Now

### For iOS 

Checkout the rust-bitcode repo


Configuaration that worked for me in XCode 12.3

Goto 

Product -> Scheme -> Edit Scheme

Then under Run:

![XCode Scheme Settings Info](/static/xcode-scheme-info.png)

![XCode Scheme Settings Info](/static/xcode-scheme-options.png)

![XCode Scheme Settings Info](/static/xcode-scheme-arguments.png)

If you are running into an error regarding the deployment target you just need to bump the deployment target here up to a recent version

![XCode Scheme Settings Info](/static/xcode-deployment-target.png)