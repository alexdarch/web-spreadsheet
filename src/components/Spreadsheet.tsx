import React, { useState, useRef, useEffect, ReactElement } from 'react'
import HeaderCell from './HeaderCell'
import { toCellName, toColName } from '../helpers/cellHelpers'
import { onKeyDown, onMouseDown } from '../helpers/eventHelpers'
import { calc, reset, init } from '../helpers/calcHelpers'
import Cell from './Cell'
import '../styles/Components.css'
import useCellsRef from '../hooks/useCellsRef'
import { SheetTypes } from '../types/types'

export default function Spreadsheet() {
    const numColumns = 30
    const numRows = 15

    const [setCellRef, focusedCell, setFocusedCell] = useCellsRef(
        undefined,
        numColumns,
        numRows
    )

    // const [sheet, setSheet, errors, setErrors, worker] = useWorker<SheetTypes>(() => cellCalculationWorker)
    const [worker, setWorker] = useState<Worker | null>(null)
    const [sheet, setSheet] = useState(new Map<string, SheetTypes>([]))
    const [errors, setErrors] = useState(new Map<string, SheetTypes>([]))
    const [values, setValues] = useState(new Map<string, SheetTypes>([]))

    useEffect(() => {
        init(setSheet, setValues, setErrors, setWorker)
    }, [])

    useEffect(() => {
        if (!worker || !sheet) {
            return
        }
        console.log('focussed cell change. Sheet: ', sheet)
        calc(
            worker,
            setWorker,
            sheet,
            setSheet,
            errors,
            setErrors,
            values,
            setValues
        )

        // TODO: call the calc when we run F9 or press enter on a particular cell.
        // Start with a particular cell, proxied by focusedCell for now
    }, [focusedCell, sheet])

    // useEffect(() => {
    //     console.log('Received result!: ', sheet)
    // }, [sheet])

    const headerRow = Array.from(Array(numColumns).keys()).map((index) => {
        const column = toColName(index)
        return <HeaderCell key={column} contents={column} />
    })
    headerRow[0] = (
        <td key={'reset'}>
            <button
                key={'reset-button'}
                className="reset-button"
                onClick={() => reset(setSheet, setErrors)}
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

    // Then call the worker on the sheet and update the errors and sheet
    // At first just return this fixed list of errors
    // TODO: ignore workers and just allow typing of strings and numbers
    // Then if number is negative then show error message?
    // TODO:
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
                    error={errors?.get(toCellName(col, row)) ?? ''}
                    value={values?.get(toCellName(col, row)) ?? ''}
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
