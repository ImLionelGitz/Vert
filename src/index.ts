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
let errored = false

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

        const watcher = fs.watch(path, (ev) => {0
            if (ev == 'change' && !write) {
                write = true

                let ProcessedCode = ''

                const readStream = fs.createReadStream(path, {encoding: 'utf8', highWaterMark: 15 * 1024})

                readStream.on('data', (chunks) => {
                    if (typeof chunks == 'string') {
                        const PreProcessed = chunks.split('\n').filter(chunk => !chunk.match(regex)).join('\n')
                        
                        try {
                            const ast = parser.parse(PreProcessed, {
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
    
                            const generatedCode = generate(ast).code
                            ProcessedCode = ProcessedCode + generatedCode
                        }
                        catch(err: any) {
                            console.log(chalk.red(`Error: ${err.message}`))
                            errored = true
                        }
                    }
                })

                readStream.on('error', (err) => {
                    console.log(chalk.red(err.message))
                    watcher.close()
                })

                readStream.on('end', () => {
                    if (!errored && ProcessedCode) {
                        fs.writeFile(path, ProcessedCode, 'utf8', (err) => {
                            if (err) {
                                console.log(chalk.red(err.message))
                                return
                            }

                            const currentTime = new Date();
                            const hours = currentTime.getHours().toString().padStart(2, '0');
                            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                            const seconds = currentTime.getSeconds().toString().padStart(2, '0');
                            const formattedTime = hours + ":" + minutes + ":" + seconds;

                            ProcessedCode = ''
                            console.log(successColor(`Successfully de-modulated ${filename}! Time: ${formattedTime}`))
                            write = false
                        })
                    }
                    else {
                        ProcessedCode = ''
                        errored = false
                        write = false
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