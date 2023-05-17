
# Vert

`Vert` is a custom TS compiler that removes any occurrence `require()` from the output.


## Table of Contents

- [About](#about)
- [Issues](#issues)
- [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
## About

**⚠ This compiler is at its infancy so there might be various bugs or glitches!**

This compiler is designed for creating websites using plain HTML/CSS/JS. Certain browsers or versions may not support modular JS files. The default TS compiler lacks the option to remove `import`/`export` statements, There was some hassle for me to use an external library or pack those modules into one file, so I created this custom TypeScript compiler to meet my needs.
## Known Issues

This compiler is designed for my **personal use**, so it utilizes these options: `target: ES6`, `module: CommonJS`and `moduleResolution: node` of the TypeScript compiler by default, so you need to edit the source files to meet your needs.
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
  vert <file.ts> optional <path/to/export>
```

### Flags

| Flag | Description                |
| :--------| :------------------------- |
| `--help` | Shows infos on how to use it |

| Flag| Description                |
| :--------| :------------------------- |
| `--minify` | **File Required.** Minifies the output JS |

| Flag| Description                |
| :--------| :------------------------- |
| `--watch` | **File Required.** Watches changes and compiles them |


## Roadmap

- Add a configurtion sytem like `tsconfig.json`
- Fix bugs, glitches and performance issues
- Make it more user friendly
- Add more commands if necessary


