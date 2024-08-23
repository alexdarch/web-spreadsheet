export function toColName(index: number): string {
    if (index <= 0) {
        return '?'
    }

    let column = ''
    while (index > 0) {
        let remainder = (index - 1) % 26
        column = String.fromCharCode(65 + remainder) + column
        index = Math.floor((index - 1) / 26)
    }
    return column
}

export function toCellName(col: number, row: number): string {
    return toColName(col) + row.toString()
}

export function fromCellName(name: string): { col: number; row: number } {
    // Split the string into col and row components. E.g. "B2" => ["B", "5"]
    let splitIdx = 1
    for (const char of name) {
        if (char >= '0' && char <= '9') {
            splitIdx -= 1
            break
        }
        splitIdx += 1
    }

    let [col, row] = [name.substring(0, splitIdx), name.substring(splitIdx)]

    // Convert col to number
    let colNum = 0
    let factor = 1
    const colSplit = col.toLowerCase().split('')
    for (let i = colSplit.length - 1; i >= 0; i--) {
        console.log(colSplit[i], colSplit[i].charCodeAt(0) - 97 + 1, factor)
        colNum += (colSplit[i].charCodeAt(0) - 97 + 1) * factor
        factor *= 26
    }

    // Check: XFD = 16384
    return { row: parseInt(row), col: colNum }
}
