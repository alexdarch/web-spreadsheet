import React, { useState, useRef, useEffect, ReactElement } from 'react'
import HeaderCell from './HeaderCell'
import { fromCellId, toCellId, onKeyDown } from '../helpers/helpers'
import Cell from './Cell'
import '../styles/Components.css'

// function useCellRefs(numColumns: number, numRows: number): any {
//     const cellRefs = useRef<any>(null);

//     // Initialize cellRefs array with refs for each cell
//     useEffect(() => {
//         cellRefs.current = Array(numRows).map((_) => {
//             return Array(numColumns).map((_) => useRef(null))
//         })
//     }, [numColumns, numRows]);

//     return cellRefs.current;
//   };

export default function Spreadsheet() {
    const numColumns = 30
    const numRows = 15

    const [focusedCell, setFocusedCell] = useState<string | undefined>(
        undefined
    )

    // https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
    // https://stackoverflow.com/questions/66664209/how-can-i-use-forwardref-in-react
    const cellRefs = useRef(
        Array(numColumns).map((_) =>
            Array<HTMLInputElement | null>(numRows).fill(null)
        )
    )

    const [values, setValues] = useState(
        Array<string>(numColumns).map((_) => Array<string>(numRows))
    )
    const [expressions, setExpressions] = useState(
        Array<string>(numColumns).map((_) => Array<string>(numRows))
    )
    const [errors, setErrors] = useState(
        Array<string>(numColumns).map((_) => Array<string>(numRows))
    )

    const headerRow = Array.from(Array(numColumns).keys()).map((index) => {
        let column = ''
        while (index > 0) {
            let remainder = (index - 1) % 26
            column = String.fromCharCode(65 + remainder) + column
            index = Math.floor((index - 1) / 26)
        }
        return <HeaderCell contents={column} />
    })
    headerRow[0] = (
        <button className="reset-button" onClick={() => alert('clicked')}>
            ↻
        </button>
    )

    // function updateFocusedCell(cell: { col: number; row: number } | undefined): void {
    //     // get HTML element
    //     window.
    //     let element = getDomElement();

    //     element.focus();
    //     setFocusedElement()
    // }

    // only run on mount
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) =>
            onKeyDown(event, numColumns, numRows, focusedCell, setFocusedCell)
        document.addEventListener('keydown', handleKeyDown)
        // unmount event listener when component is unmounted
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    // Run whenever the focused cell changes
    useEffect(() => {
        if (focusedCell === undefined) return

        let { col, row } = fromCellId(focusedCell)
        if (cellRefs?.current[col] && cellRefs.current[col][row]) {
            cellRefs.current[col][row]?.focus()
        }
    }, [focusedCell])

    function createRow(row: number): JSX.Element[] {
        return Array.from(Array(numColumns - 1).keys()).map((col) => {
            return (
                // <Cell
                //     col={colNum}
                //     row={rowNum}
                //     ref={cellRefs.current[colNum][rowNum]}
                //     values={values}
                //     setValues={setValues}
                //     expressions={expressions}
                //     setExpressions={setExpressions}
                //     errors={errors}
                //     setErrors={setErrors}
                //     // keydown={(a, b, c) => alert('keydown')}
                //     // calc={() => alert('calc')}
                // />
                <td className="cell" key={toCellId(col, row)}>
                    <input
                        className="input"
                        onChange={(_) => {}}
                        ref={(el) => (cellRefs.current[col][row] = el)}
                        // onKeyDown={(event) => keydown(event, col, row)}
                    />
                    <div className="text">{'contents'}</div>
                </td>
            )
        })
    }

    return (
        <table className="table">
            <tbody>
                <tr>{headerRow}</tr>
                {Array.from(Array(numRows - 1).keys()).map((rowNum) => (
                    <tr>
                        <HeaderCell contents={(rowNum + 1).toString()} />
                        {createRow(rowNum)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
