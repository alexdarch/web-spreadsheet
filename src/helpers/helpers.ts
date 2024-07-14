export function toCellId(col: number, row: number): string {
    return '#' + col + '-' + row
}

export function fromCellId(id: string): { col: number; row: number } {
    let s = id.substring(1)
    let [col, row] = s.split('-')
    return { row: parseInt(row), col: parseInt(col) }
}
