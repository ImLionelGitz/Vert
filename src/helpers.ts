import * as babel from "@babel/core"
import * as ts from "typescript"
import * as fs from 'fs'
import { ESLint } from "eslint"

import { ESLintResults } from './types'
import { helpMessage } from './messages'

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

function WriteJSFile(dir: string, code: string, args: string[]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    
    fs.writeFileSync(dir + args[2].replace('.ts', '.js'), code, {encoding: "utf8"})
}

function TranspileTS(filePath: string, outDir: string, args: string[], cmds: string[], eslint: ESLint) {
    const tsCompilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2016,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.Node10,
        removeComments: true
    }

    fs.readFile(filePath, {encoding: "utf8"}, (err, untranspiledjs) => {
        if (err) throw new Error(err.message)

        eslint.lintText(untranspiledjs).then((response) => {
            const result = response[0] as unknown as ESLintResults

            if (result.errorCount > 0) {
                const message = result.messages[0]
                const errorMessage = `Error at line: ${message.line} on column: ${message.column}! ${message.message}`
                console.log(errorMessage)
                return
            }

            else {
                const transpiledJs = ts.transpile(untranspiledjs, tsCompilerOptions)

                let unmodulatedJs: any = transpiledJs.split('\n').filter(lines => !lines.includes('require')).join('\n')

                cmds.forEach(cmd => {
                    unmodulatedJs = GenerateJS(cmd, unmodulatedJs)
                })

                WriteJSFile(outDir, unmodulatedJs, args)
            }
        })
    })
}

export {TranspileTS, OnExternalCMD}