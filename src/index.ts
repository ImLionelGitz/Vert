#!/usr/bin/env node

import { Command } from "commander";
import { join } from "path";
import chalk from "chalk";
import  clear from 'clear'
import * as fs from 'fs'

const program = new Command()
const successColor = chalk.hex('#42c264')
const fileColor = chalk.hex('#bec242')
const regex = /(import\s*{\s*[\w.-]+\s*}\s*from\s*(['"])([\w.-]+)\2|require\((['"])([\w.-]+)\4\))/gmi
let write = false

program
.name('Vert')
.description(`A tool that removes the function ${fileColor('Require()')} automatically.`)
.version('1.0.1')

program
.command('watch')
.description('Watch for changes in a specific file')
.argument('<file-name>', 'Name of the file that is about to be observed (Required)')
.argument('[file-path]', 'Add a file path to the JS to observe (Optional)', '/')
.action((filename, filepath) => {
    const path = join(process.cwd(), filepath, filename)
    
    if (fs.existsSync(path)) {
        clear()
        console.log('Watching for changes in ' + fileColor(filename) + '...')

        const watcher = fs.watch(path, (ev) => {
            if (!write) {
                write = true
                return
            }

            if (ev == 'change') {
                write = false
                fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
                    if (err) {
                        console.log(chalk.red(err.message))
                        watcher.close()
                        return
                    }
            
                    if (data.match(regex)) {
                        const filteredText = data.split('\n').filter(lines => !lines.match(regex)).join('\n')
                        fs.writeFileSync(path, filteredText, {encoding: 'utf8'})
                        console.log(successColor('Removed the Require() function!'))
                    }
                })
            }
        })
    }

    else {
        console.log(chalk.red("The specified file dosen't exist!"))
    }
})

program.parse()