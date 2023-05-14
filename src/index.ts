#!/usr/bin/env node
import * as fs from "fs"
import * as path from "path"
import { ESLint } from "eslint"

import { TranspileTS, OnExternalCMD } from "./helpers"
import { startupMessage } from "./messages"

const args = process.argv.filter(arg => !arg.startsWith('--'))
const cmds = process.argv.filter(cmd => cmd.startsWith('--'))
const nonFileCmds = ['--help']

let Write = false

const eslint = new ESLint();

(function(){
    if (args.length == 2) {
        if (cmds.length == 0) {
            console.log(startupMessage)
            return
        }

        cmds.forEach(cmd => {
            if (nonFileCmds.includes(cmd)) {
                OnExternalCMD(cmd)
            }
            return
        })
    }
    
    if (args.length > 2) {
        const fileToTranspile = path.join(__dirname, args[2])
        const outputDir = path.join(__dirname, args[3] || './')
    
        if (!fs.existsSync(fileToTranspile)) {
            throw new Error("File not found!: " + args[2])
        }
    
        if (cmds.includes('--watch')) {
            fs.watch(fileToTranspile, (ev, fileName) => {
                if (!Write) {
                    Write = true
                    return
                }

                if (ev == "change") {
                    Write = false
                    TranspileTS(fileToTranspile, outputDir, args, cmds, eslint)
                }
            })
        }
        else {
            TranspileTS(fileToTranspile, outputDir, args, cmds, eslint)
        }
        
        return
    }
})()

