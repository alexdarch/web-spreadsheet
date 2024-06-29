import React from 'react'
import HeaderCell from './HeaderCell'
import Cell from './Cell'
import '../styles/Components.css'

export default function Spreadsheet() {
    const numColumns = 30
    const numRows = 15

    const colHeaders = Array.from(Array(numColumns).keys()).map((index) => {
        let column = ''
        while (index > 0) {
            let remainder = (index - 1) % 26
            column = String.fromCharCode(65 + remainder) + column
            index = Math.floor((index - 1) / 26)
        }
        return <HeaderCell contents={column} />
    })
    colHeaders[0] = (
        <button
            content="reset"
            title="reset"
            style={{ width: '50px', height: '10px' }}
        />
    )

    const rows = Array.from(Array(numRows).keys()).map((x) => {
        const contentCells = Array.from(Array(numColumns - 1).keys()).map(
            (x) => <Cell contents="" />
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
                <tr>{colHeaders}</tr>
                {rows}
            </tbody>
        </table>
    )
}
