import React, { useState, useEffect, useRef } from 'react'
import { fromCellId } from '../helpers/helpers'

export default function useCellsRef(
    initialCell: string | undefined,
    numColumns: number,
    numRows: number
): [
    // React.MutableRefObject<(HTMLInputElement | null)[][]>,
    (el: HTMLInputElement | null, col: number, row: number) => void,
    string | undefined,
    (cell: string | undefined) => void,
    //React.Dispatch<React.SetStateAction<string | undefined>>,
] {
    // https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
    // https://stackoverflow.com/questions/66664209/how-can-i-use-forwardref-in-react
    const cellRefs = useRef<(HTMLInputElement | null)[][]>(
        Array(numColumns)
            .fill(null)
            .map(() => Array(numRows).fill(null))
    )
    useEffect(() => {
        cellRefs.current = cellRefs.current
            .slice(0, numColumns)
            .map(
                (row) => row?.slice(0, numRows) ?? Array(numColumns).fill(null)
            )
    }, [numColumns, numRows])

    function setCellRef(
        el: HTMLInputElement | null,
        col: number,
        row: number
    ): void {
        cellRefs.current[col][row] = el
    }

    const [focusedCell, setFocusedCell] = useState<string | undefined>(
        initialCell
    )

    function setFocusedCellWrapper(cell: string | undefined): void {
        if (cell === undefined) {
            setFocusedCell(cell)
            return
        }

        let { col, row } = fromCellId(cell)
        if (cellRefs?.current[col] && cellRefs.current[col][row]) {
            cellRefs.current[col][row]?.focus()
        }
        setFocusedCell(cell)
    }

    // Is this better?
    // useEffect(() => {
    //     if (focusedCell === undefined) {
    //         setFocusedCell(focusedCell)
    //         return
    //     }
    //     let { col, row } = fromCellId(focusedCell)
    //     if (cellRefs?.current[col] && cellRefs.current[col][row]) {
    //         cellRefs.current[col][row]?.focus()
    //     }
    // }, [numColumns, numRows, focusedCell])

    return [setCellRef, focusedCell, setFocusedCellWrapper]
}
