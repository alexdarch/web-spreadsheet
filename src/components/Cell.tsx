import React from 'react'
import { useState, useEffect, forwardRef } from 'react'
import '../styles/Components.css'
import '../types/types.d.ts'
import { toCellName } from '../helpers/helpers'

type CellProps = {
    col: number
    row: number
    setCellRef: (el: HTMLInputElement | null, col: number, row: number) => void
    sheet: Map<string, string | number>
    setSheet: (values: Map<string, string | number>) => void
    error: string | number | undefined
}

export default forwardRef(function Cell(
    { col, row, setCellRef, sheet, setSheet, error }: CellProps,
    ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
    // Use a local useState here otherwise there is a weird lag
    const cellName = toCellName(col, row)

    const [value, setValue] = useState(error || sheet.get(cellName) || '')

    function onChangeHandler(e: React.FormEvent<HTMLInputElement>) {
        const val = e.currentTarget.value
        setValue(val)
        sheet.set(cellName, val)
        setSheet(sheet)
    }

    function onBlurHandler(e: React.FormEvent<HTMLInputElement>) {
        const val = e.currentTarget.value
        sheet.set(cellName, val)
        setSheet(sheet)
    }

    // Note that the cell is focused by functions in the Spreadsheet component
    // As we need to be able to deal with arrow keys to move focus around
    // Note that the input value={value || ''} but div contents = {error || value || ''}
    // This is because when editing we dont want to edit the error, only what caused the error
    return (
        <td className="cell" key={`${toCellName(col, row)}-celldata`}>
            <input
                key={`${cellName}-input`}
                id={cellName}
                className="input"
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={(el) => setCellRef(el, col, row)}
                value={value || ''}
            />
            <div className="text" key={`${toCellName(col, row)}-text`}>
                {error || value || ''}
            </div>
        </td>
    )
})
