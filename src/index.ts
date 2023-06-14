#!/usr/bin/env node

import { Command } from "commander";
import { join } from "path";
import * as parser from '@babel/parser'
import * as chalk from "chalk";
import * as fs from 'fs'
import traverse from '@babel/traverse'
import generate from '@babel/generator'

const program = new Command()
const successColor = chalk.hex('#42c264')
const fileColor = chalk.hex('#bec242')
const regex = /(import\s*{\s*[\w.-]+\s*}\s*from\s*(['"])([\w.-]+)\2|require\((['"])([\w.-]+)\4\))/gmi
let write = false

program
.name('Vert')
.description(`A tool that removes ${fileColor('module import statements')} automatically.`)
.version('1.0.1')

program
.command('watch')
.description('Watch for changes in a specific file')
.argument('<file-name>', 'Name of the file that is about to be observed (Required)')
.argument('[file-path]', 'Add a file path to the JS to observe (Optional)', '/')
.action((filename, filepath) => {
    const path = join(process.cwd(), filepath, filename)
    
    if (fs.existsSync(path)) {
        console.clear()
        
        console.log('Watching for changes in ' + fileColor(filename) + '...')

        const watcher = fs.watch(path, (ev) => {
            if (ev == 'change' && !write) {
                write = true

                fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
                    if (err) {
                        console.log(chalk.red(err.message))
                        watcher.close()
                        return
                    }
            
                    const filteredText = data.split('\n').filter(lines => !lines.match(regex)).join('\n')

                    const ast = parser.parse(filteredText, {
                        sourceType: 'module'
                    })

                    traverse(ast, {
                        ImportDeclaration(path) {
                            path.remove()
                        },
                        
                        CallExpression(path) {
                            const callee = path.node.callee

                            if (
                                callee.type == 'Identifier' &&
                                callee.name == 'require' &&
                                path.node.arguments.length == 1 &&
                                path.node.arguments[0].type == 'StringLiteral'
                            ) path.remove()
                        }
                    })

                    const transformed = generate(ast).code
                    fs.writeFile(path, transformed, 'utf8', (err) => {
                        if (err) {
                            console.log(chalk.red(err.message))
                        }
                        else {
                            console.log(successColor('Removed module import statements!'))
                        }
                        write = false
                    })
                    
                })
            }
        })
    }

    else {
        console.log(chalk.red("The specified file dosen't exist!"))
    }
})

program.parse()