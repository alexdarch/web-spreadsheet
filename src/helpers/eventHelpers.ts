import { fromCellId, toCellId } from './helpers'

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

export function onMouseDown(
    event: MouseEvent,
    setFocusedCell: (cellId: string) => void
): void {
    try {
        const target = event.target as HTMLInputElement
        if (!target) {
            console.log('Event target is null or undefined.')
            return
        }
        const cellId = target.getAttribute('id')
        if (!cellId || cellId.substring(0, 1) != '#') {
            console.log('Cell ID attribute is missing.')
            return
        }
        setFocusedCell(cellId)
    } catch (error: any) {
        // Handle the error
        console.error('Error in handleMouseDown:', (error as Error).message)
        // You can choose to log, notify the user, or handle the error in another appropriate way
    }
}
