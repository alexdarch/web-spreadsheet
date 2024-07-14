import React from 'react'
import { useState, forwardRef } from 'react'
import '../styles/Components.css'
import '../types/types.d.ts'
import { toCellId } from '../helpers/helpers'

type CellProps = {
    col: number
    row: number
    setCellRef: (el: HTMLInputElement | null, col: number, row: number) => void
    // values: string[][]
    // setValues: (values: string[][]) => void
    // expressions: string[][]
    // setExpressions: (values: string[][]) => void
    // errors: string[][]
    // setErrors: (values: string[][]) => void
}

export default forwardRef(function Cell(
    { col, row, setCellRef }: CellProps,
    ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
    function calc(): void {}

    return (
        <td className="cell" key={`${toCellId(col, row)}-celldata`}>
            <input
                key={`${toCellId(col, row)}-input`}
                id={`${toCellId(col, row)}`}
                className="input"
                onChange={(_) => {}}
                ref={(el) => setCellRef(el, col, row)}
                // onClick={event => setFocusedCell(toCellId(col, row))}
            />
            <div className="text" key={`${toCellId(col, row)}-text`}>
                {'contents'}
            </div>
        </td>
    )
})
