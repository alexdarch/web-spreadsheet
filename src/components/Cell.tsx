import React from 'react'
import { useState, forwardRef } from 'react'
import '../styles/Components.css'
import '../types/types.d.ts'
import { toCellId } from '../helpers/helpers'

export default forwardRef(function Cell(
    {
        col,
        row,
        values,
        setValues,
        expressions,
        setExpressions,
        errors,
        setErrors,
    }: CellProps,
    ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
    function calc(): void {}

    return (
        <td className="cell" key={toCellId(col, row)}>
            <input
                className="input"
                onChange={(_) => calc()}
                ref={ref}
                // onKeyDown={(event) => keydown(event, col, row)}
            />
            <div className="input">{'contents'}</div>
        </td>
    )
})
