export function toCellId(col: number, row: number): string {
    return '#' + col + '-' + row
}

export function fromCellId(id: string): { col: number; row: number } {
    let s = id.substring(1)
    let [col, row] = s.split('-')
    return { row: parseInt(row), col: parseInt(col) }
}

export function onKeyDown(
    event: KeyboardEvent, //React.KeyboardEvent<HTMLInputElement
    numColumns: number,
    numRows: number,
    focusedCell: string | undefined,
    setFocusedCell: (cell: string | undefined) => void
): void {
    if (focusedCell === undefined) return

    var { col, row } = fromCellId(focusedCell)
    let cell = ''

    switch (event.key) {
        case 'Enter':
            alert('Enter')
            break
        case 'ArrowLeft':
            cell = toCellId(Math.max(col - 1, 0), row)
            setFocusedCell(cell)
            break
        case 'ArrowRight':
            cell = toCellId(Math.min(col + 1, numColumns), row)
            setFocusedCell(cell)
            break
        case 'ArrowUp':
            cell = toCellId(col, Math.max(row - 1, 0))
            setFocusedCell(cell)
            break
        case 'ArrowDown':
            cell = toCellId(col, Math.min(row + 1, numRows))
            setFocusedCell(cell)
            break
        default:
            alert('bad key')
            break
    }
}
