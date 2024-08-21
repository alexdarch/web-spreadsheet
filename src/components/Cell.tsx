import React from 'react'
import { useState, forwardRef } from 'react'
import '../styles/Components.css'
import '../types/types.d.ts'
import { toCellName } from '../helpers/helpers'

type CellProps = {
    col: number
    row: number
    setCellRef: (el: HTMLInputElement | null, col: number, row: number) => void
    sheet: Map<string, string | number>
    setSheet: (values: Map<string, string | number>) => void
    // expressions: string[][]
    // setExpressions: (values: string[][]) => void
    // errors: string[][]
    // setErrors: (values: string[][]) => void
}

export default forwardRef(function Cell(
    { col, row, setCellRef, sheet, setSheet }: CellProps,
    ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
    // Use a local useState here otherwise there is a weird lag
    const [value, setValue] = useState(sheet.get(toCellName(col, row)))

    const cellName = toCellName(col, row)

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
    return (
        <td className="cell" key={`${toCellName(col, row)}-celldata`}>
            <input
                key={`${cellName}-input`}
                id={cellName}
                className="input"
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                ref={(el) => setCellRef(el, col, row)}
            />
            <div className="text" key={`${toCellName(col, row)}-text`}>
                {value}
            </div>
        </td>
    )
})
