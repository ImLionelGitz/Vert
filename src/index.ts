#!/usr/bin/env node
import * as fs from "fs"
import * as ts from "typescript"
import * as path from "path"
import * as babel from "@babel/core"

const args = process.argv.filter(arg => !arg.startsWith('--'))
const cmds = process.argv.filter(cmd => cmd.startsWith('--'))
const nonFileCmds = ['--help']

const startupMessage = "To use this, enter the file name at first\nand then optionally the destination path.\nFor more info enter --help"
const helpMessage = "Usage: <file.extension> (optional)<path/to/export>\nCommands:\n--minify: Use this tag to minify the exported JS\n--help: Use this for 'how to use' info. (Don't use this with the file specified!)";

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
    
        TranspileTS(fileToTranspile, outputDir)
        return
    }
})()

function GenerateJS(cmd: string, js: string) {
    switch (cmd) {
        case '--minify':
            return babel.transformSync(js, {
                presets: ["@babel/preset-env"],
                minified: true
            })?.code
        default:
            return js
    }
}

function OnExternalCMD(cmd: string) {
    switch (cmd) {
        case "--help":
            console.log(helpMessage)
    }
}

function WriteJSFile(dir: string, code: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    
    fs.writeFileSync(dir + args[2].replace('.ts', '.js'), code, {encoding: "utf8"})
}

function TranspileTS(filePath: string, outDir: string) {
    const tsCompilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2016,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.Node10,
        removeComments: true
    }

    fs.readFile(filePath, {encoding: "utf8"}, (err, untranspiledjs) => {
        if (err) throw new Error(err.message)
        
        const transpiledJs = ts.transpile(untranspiledjs, tsCompilerOptions)
        let unmodulatedJs: any = transpiledJs.split('\n').filter(lines => !lines.includes('require')).join('\n')
        
        cmds.forEach(cmd => {
            unmodulatedJs = GenerateJS(cmd, unmodulatedJs)
        })

        WriteJSFile(outDir, unmodulatedJs)
    })
}