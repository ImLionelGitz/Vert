const startupMessage = "To use this, enter the file name at first\nand then optionally the destination path.\nFor more info enter --help"
const helpMessage = `
Usage: <file.ts> ?<path/to/export>
Commands:
--minify: Minify the exported JS.
--help: Show 'how to use' info.
--watch: Watch changes in source file and compile it.`

export {startupMessage, helpMessage}
