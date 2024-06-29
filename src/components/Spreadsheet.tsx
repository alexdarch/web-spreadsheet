import React from 'react'
import HeaderCell from './HeaderCell'
import Cell from './Cell'
import '../styles/Components.css'

export default function Spreadsheet() {
    const numColumns = 30
    const numRows = 15

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
        <button
            className="reset-button"
            onClick={() => alert("clicked")}
        >↻</button>
    )

    const rows = Array.from(Array(numRows).keys()).map((x) => {
        const contentCells = Array.from(Array(numColumns - 1).keys()).map(
            (x) => <Cell contents="" keydown={(a, b, c) => alert("keydown")} calc={() => alert("calc")} />
        )
        return (
            <tr>
                <HeaderCell contents={(x + 1).toString()} />
                {contentCells}
            </tr>
        )
    })

    return (
        <table className="table">
            <tbody>
                <tr>{headerRow}</tr>
                {rows}
            </tbody>
        </table>
    )
}
