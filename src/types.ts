interface ESLintResults {
    messages: [
        {
            message: string,
            line: number,
            column: number
        }
    ],
    errorCount: number,
    warningCount: number
}

export {ESLintResults}