---
title: 'Alacritty - builtin tab support - no tmux needed - possible performance improvement'
author: 'Brad Barrows'
date: '2021-01-17'
hero_image: /static/alacritty-tabs.png
---

## Re write of the Alacritty Event Loop

While getting started on this I found an awesome project named [session-manager](https://github.com/nw0/session-manager).

This provided a great way for me to see how the lower level TTY code and ansi processing was implemented.

I played around with this for a while, adding support for colors and then upon realizing that most of this session-manager code came from Alacritty, decided that I should give adding tabs to Alacritty a shot.

When digging into the Alacritty source I realized I would need some struct to manage the tabs and Term/PTY struct state throughout the app. Unfortunately this meant passing around an Arc<Mutex<T>> and lots of locking and unlocking.

Luckily this mutex use along with the removal of the use of channels actually lead to performance improvements. I believe this may mostly be due to the simplified process of reading input from the TTY file descriptor. I now just spin off a thread for each tty and in that thread there is a simple loop which reads and then writes directly to the ansi processor, skipping the previous process of sending bytes over a channel and then into an event loop.

Currently the key bindings default to Command + T for a new tab. Command + Shift + Left Bracket for previous tab and Command + Shift + Right Bracket for the next tab.

The build of Alacritty, based off of the official v0.7.0-dev tag can be found at [alacritty DMG download](https://github.com/bebrws/alacritty-tabs/releases/download/v0.7.1-tabs/Alacritty.zip).

The code is up at [alacritty](https://github.com/bebrws/alacritty-tabs/). Note that this has only been tested on OSX.

## Performance

The only way I spent time trying to measure performance was by timing the find file print out of my local llvm-project directory.

I am seeing slightly faster times when running:

```
time find ~/repos/llvm-project
```

with my build of Alacritty than with the official build.


## New functionality

I also hardcoded the new feature (no keybinding) for Command Click to write the word under the cursor into the terminal. I thought this would be a huge time saver instead of double clicking, copy, and then pasting.

## Screen Capture with Tabs

![Alacritty With Tabs in action](/static/alacrittytabs.gif)

## Example alacritty.yml file:

```

background_opacity: 1
window:
  dimensions:
    columns: 150
    lines: 50
  padding:
    x: 10
    y: 10
  dynamic_padding: true
  decorations: buttonless
scrolling:
  history: 10000
  multiplier: 40
key_bindings:
  - key: W
    mods: Command
    action: ToggleFullscreen
  - key: N
    mods: Command|Shift
    action: SpawnNewInstance
  - key: F
    mods: Command|Shift
    action: ToggleFullscreen
  - key: Equals
    mods: Command|Shift
    action: IncreaseFontSize
  - key: Minus
    mods: Command|Shift
    action: DecreaseFontSize
font:
  size: 12
  normal:
    family: Menlo
    style: Regular
  bold:
    family: Menlo
    style: Bold
  italic:
    family: Menlo
    style: Italic
custom_cursor_colors: true
colors:
  # Default colors
  primary:
    # hard contrast: background = '#f9f5d7'
    background: '#1A2025'
    foreground: '#e3dfc5'

    dim_foreground: '#dbdbdb'
    bright_foreground: '#d9d9d9'
    dim_background: '#202020'    # not sure
    bright_background: '#3a3a3a' # not sure

  # Cursor colors
  cursor:
    text: '#2c2c2c'
    cursor: '#d9d9d9'

  # Normal colors
  vi_mode_cursor:
    text: '#2e3440'
    cursor: '#d8dee9'
  selection:
    text: CellForeground
    background: '#4c566a'
  search:
    matches:
      foreground: CellBackground
      background: '#abd3de'
    bar:
      background: '#434c5e'
      foreground: '#d8dee9'
  normal:
  # Bright colors
    black: '#1c1c1c'
    red: '#bc5653'
    green: '#b4c28a'
    yellow: '#ebc17a'
    blue: '#7eaac7'
    magenta: '#aa6292'
    cyan: '#d3dde8'
    white: '#cacaca'

  # Bright colors
  bright:
    black: '#636363'
    red: '#bc5653'
    green: '#b4c28a'
    yellow: '#ebc17a'
    blue: '#7eaac7'
    magenta: '#aa6292'
    cyan: '#d3dde8'
    white: '#f7f7f7'

  # Dim colors
  dim:
    black: '#232323'
    red: '#74423f'
    green: '#9ea880'
    yellow: '#8b7653'
    blue: '#556b79'
    magenta: '#6e4962'
    cyan: '#5c8482'
    white: '#828282'
  indexed_colors:
    - {index: 16, color: '#232323'}
    - {index: 17, color: '#d65d0e'}
    - {index: 18, color: '#000000'}
    - {index: 19, color: '#d5c4a1'}
    - {index: 20, color: '#665c54'}
    - {index: 21, color: '#3c3836'}
hide_cursor_when_typing: true
shell:
  program: /bin/zsh
  args:
    - -l


```

This can be copy and pasted into a file which should be placed at:

```
~/.config/alacritty/alacritty.yml
```