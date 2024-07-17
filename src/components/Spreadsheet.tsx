import React, { useState, useRef, useEffect, ReactElement } from 'react'
import HeaderCell from './HeaderCell'
import { toCellId } from '../helpers/helpers'
import { onKeyDown, onMouseDown } from '../helpers/eventHelpers'
import Cell from './Cell'
import '../styles/Components.css'
import useCellsRef from '../hooks/useCellsRef'
import cellCalculationWorker from '../webworker/cellCalculationWorker'
import createWorker from '../webworker/createWorker'

export default function Spreadsheet() {
    const numColumns = 30
    const numRows = 15

    const [setCellRef, focusedCell, setFocusedCell] = useCellsRef(
        undefined,
        numColumns,
        numRows
    )

    const [result, setResult] = useState<any>(0)
    const [worker, setWorker] = useState<any>(null)

    useEffect(() => {
        const workerProcess = createWorker(cellCalculationWorker)

        workerProcess.onmessage = function (event) {
            console.log('Received result from worker: ', event.data)
            setResult(event.data)
        }

        setWorker(workerProcess)

        return () => {
            workerProcess.terminate()
        }
    }, [])

    useEffect(() => {
        const randNum = Math.random()
        console.log('Generated random number: ', randNum)
        worker.postMessage(randNum)
    }, [focusedCell])

    useEffect(() => {
        console.log('Received result!: ', result)
    }, [result])

    // const [values, setValues] = useState(
    //     Array<string>(numColumns).map((_) => Array<string>(numRows))
    // )
    // const [expressions, setExpressions] = useState(
    //     Array<string>(numColumns).map((_) => Array<string>(numRows))
    // )
    // const [errors, setErrors] = useState(
    //     Array<string>(numColumns).map((_) => Array<string>(numRows))
    // )

    const headerRow = Array.from(Array(numColumns).keys()).map((index) => {
        let column = ''
        while (index > 0) {
            let remainder = (index - 1) % 26
            column = String.fromCharCode(65 + remainder) + column
            index = Math.floor((index - 1) / 26)
        }
        return <HeaderCell key={column} contents={column} />
    })
    headerRow[0] = (
        <td key={'reset'}>
            <button
                key={'reset-button'}
                className="reset-button"
                onClick={() => alert('clicked')}
            >
                ↻
            </button>
        </td>
    )

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) =>
            onKeyDown(event, numColumns, numRows, focusedCell, setFocusedCell)
        const handleMouseDown = (event: MouseEvent) =>
            onMouseDown(event, setFocusedCell)
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('mousedown', handleMouseDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('mousedown', handleMouseDown)
        }
    }, [numColumns, numRows, focusedCell])

    function createRow(row: number): JSX.Element[] {
        return Array.from(Array(numColumns - 1).keys()).map((col) => {
            return (
                <Cell
                    key={`${toCellId(col, row)}-cell`}
                    row={row}
                    col={col}
                    setCellRef={setCellRef}
                />
            )
        })
    }

    return (
        <table className="table">
            <tbody key={'body'}>
                <tr key={'header-row'}>{headerRow}</tr>
                {Array.from(Array(numRows - 1).keys()).map((rowNum) => (
                    <tr key={rowNum}>
                        <HeaderCell
                            key={toCellId(0, rowNum)}
                            contents={(rowNum + 1).toString()}
                        />
                        {createRow(rowNum)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
