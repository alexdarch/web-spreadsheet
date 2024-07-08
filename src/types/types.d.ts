type CellProps = {
    col: number
    row: number
    values: string[][]
    setValues: (values: string[][]) => void
    expressions: string[][]
    setExpressions: (values: string[][]) => void
    errors: string[][]
    setErrors: (values: string[][]) => void
}
