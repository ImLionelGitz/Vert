
# Vert

`Vert` is a custom tool that removes any occurrence `require()` from a JS script.


## Table of Contents

- [About](#about)
- [Issues](#issues)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
## About

**⚠ This compiler is at its infancy so there might be various bugs or glitches!**

This tool was designed for developing websites using plain HTML/CSS/JS. Certain browsers or versions of it may not support modular JS files. There was some hassle for me to use an external library to pack those modules into one file, so I created this tool to meet my needs.
## Known Issues

This compiler is designed for my **personal use**, so you need to edit the source files to meet your needs.
## Installation

To install this compiler, download the file and build it yourself using this command:

```bash
  npm run build
```

Next go to the `dist/` folder and type:

```bash
   npm install -g
```

The compiler is now installed in your system.
## Usage

```bash
  vert watch <file.ts> optional <path/to/export>
```

### Commands

| Command | Description                |
| :--------| :------------------------- |
| `help` | Shows infos on how to use it |

| Command| Description                |
| :--------| :------------------------- |
| `watch` | **File Required.** Watches changes of the specified file |


## Roadmap

- Add a configurtion sytem like `tsconfig.json`
- Fix bugs, glitches and performance issues
- Make it more user friendly
- Add more commands if necessary


