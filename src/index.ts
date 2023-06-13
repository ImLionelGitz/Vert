import { Command } from "commander";
import { join } from "path";
import chalk from "chalk";
import  clear from 'clear'
import * as fs from 'fs'

const program = new Command()
const successColor = chalk.hex('#42c264')
const fileColor = chalk.hex('#bec242')
let write = false

program
.name('Vert')
.description('lololol')
.version('1.0.0')

program
.command('watch')
.argument('<file-name>', 'Name of the file that is about to be observed. (Required)')
.argument('[file-path]', 'Add a file path to the JS to observe. (Optional)', '/')
.action((filename, filepath) => {
    const path = join(process.cwd(), filepath, filename)
    
    if (fs.existsSync(path)) {
        clear()
        console.log('Watching for changes in ' + fileColor(filename) + '...')

        fs.watch(path, (ev, file) => {
            if (!write) {
                write = true
                return
            }

            if (ev == 'change') {
                write = false
                fs.readFile(file, {encoding: 'utf8'}, (err, data) => {
                    if (err) throw new Error(err.message)
            
                    if (data.includes('require')) {
                        const filteredText = data.split('\n').filter(lines => !lines.includes('require')).join('\n')
                        fs.writeFileSync(path, filteredText, {encoding: 'utf8'})
                        console.log(successColor('Removed the Require() function!'))
                    }
                })
            }
        })
    }
})

program.parse()