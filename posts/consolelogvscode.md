---
title: 'Creating a keyboard shortcut to console log the selected javascript expression in VSCode'
author: 'Brad Barrows'
date: '2020-9-07'
# hero_image: /static/niceday.png
---
## Creating a keyboard shortcut to console log the selected javascript expression in VSCode

Command Shift P -> Configure User Snippets -> Create New

```
{
	// Console log the selected expressinn
	"consolelog": {
		"scope": "javascript, typescript",
		"prefix": "consolelog",
		"body": [
			"console.log(`$TM_SELECTED_TEXT - ${$TM_SELECTED_TEXT}`);",
			"$TM_SELECTED_TEXT$2"
		],
		"description": "Console log the selected expression"
	}
}
```

Command Shift P -> Open Keyboard Shortcuts (JSON)

```
[
    { 
        "key": "cmd+ctrl+c",        
        "command": "editor.action.insertSnippet",
        "when": "textInputFocus",
        "args": {
            "name": "consolelog"
        }
    },
]
```

