import React, { useState, useRef, useEffect, ReactElement } from 'react'
import HeaderCell from './HeaderCell'
import { toCellName, toColName } from '../helpers/helpers'
import { onKeyDown, onMouseDown } from '../helpers/eventHelpers'
import Cell from './Cell'
import '../styles/Components.css'
import useCellsRef from '../hooks/useCellsRef'
import useWorker from '../hooks/useWorker'
import cellCalculationWorker from '../workers/cellCalculationWorker'

export default function Spreadsheet() {
    const numColumns = 30
    const numRows = 15

    const [setCellRef, focusedCell, setFocusedCell] = useCellsRef(
        undefined,
        numColumns,
        numRows
    )

    const [result, setResult, worker] = useWorker(() => cellCalculationWorker)
    const [sheet, setSheet] = useState(new Map<string, string | number>([]))

    useEffect(() => {
        if (!worker) {
            return
        }

        const randNum = Math.random()
        console.log('Generated random number: ', randNum)
        worker.postMessage(randNum)
    }, [focusedCell, worker])

    useEffect(() => {
        if (!worker) {
            return
        }

        const sheetString = localStorage.getItem('sheet')
        if (sheet !== null) {
            const sheet = JSON.parse(sheetString!)
        } else {
            reset()
        }
    }, [worker])

    useEffect(() => {
        console.log('Received result!: ', result)
    }, [result])

    function reset() {
        const initSheet = new Map<string, string | number>([
            ['B1', 1874],
            ['A2', '+'],
            ['B2', 2046],
            ['A3', '⇒'],
            ['B3', '=B1+B2'],
        ])
        setSheet(initSheet)
    }

    // const [expressions, setExpressions] = useState(
    //     Array<string>(numColumns).map((_) => Array<string>(numRows))
    // )
    // const [errors, setErrors] = useState(
    //     Array<string>(numColumns).map((_) => Array<string>(numRows))
    // )

    const headerRow = Array.from(Array(numColumns).keys()).map((index) => {
        const column = toColName(index)
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

    // TODO: Move errors into their own use-state like sheet
    // Then call the worker on the sheet and update the errors and sheet
    // At first just return this fixed list of errors
    // TODO: ignore workers and just allow typing of strings and numbers
    // Then if number is negative then show error message?
    // TODO:
    const errors = new Map<string, string | number>([
        ['B1', 1874],
        ['A2', '+'],
        ['B2', 2046],
        ['A3', '⇒'],
        ['B3', '=B1+B2'],
    ])
    function createRow(row: number): JSX.Element[] {
        return Array.from(Array(numColumns - 1).keys()).map((col) => {
            return (
                <Cell
                    key={`${toCellName(col, row)}-cell`}
                    row={row + 1}
                    col={col + 1}
                    setCellRef={setCellRef}
                    sheet={sheet}
                    setSheet={setSheet}
                    error={errors.get(toCellName(col, row))}
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
                            key={toCellName(0, rowNum)}
                            contents={(rowNum + 1).toString()}
                        />
                        {createRow(rowNum)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
