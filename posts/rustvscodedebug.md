---
title: 'Debugging a Rust process in VSCode by attaching to process - useful for say.. a terminal emulator'
author: 'Brad Barrows'
date: '2020-12-20'
# hero_image: /static/tmuxcd.gif
---
# Visual Studio Code launch.json

You will want to use something similar to:

```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "lldb",
            "request": "launch",
            "stopOnEntry": true,
            "name": "Debug with LLDB",
            "program": "${workspaceRoot}/target/debug/your_project_name",
            "args": [],
            "cwd": "${workspaceRoot}/",
            "sourceLanguages": [
                "rust"
            ],
        },
        {
            "type": "lldb",
            "request": "attach",
            "pid": "${command:pickMyProcess}",
            "name": "Attach LLDB",
            "program": "${workspaceRoot}/target/debug/your_project_name",
            "sourceLanguages": [
                "rust"
            ],
        }
    ]
}
```

NOTE: You will wan to change the program property to point to your binary (from your_project_name to whatever your project is)!

That should be it though! 