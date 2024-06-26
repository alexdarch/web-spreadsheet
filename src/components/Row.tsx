import React from 'react'
import Cell from './Cell'
import HeaderCell from './HeaderCell'
import '../styles/Components.css'

export default function Row() {
    return (
            <tr>
                <Cell contents={'Alfreds Futterkiste2'} />
                <Cell contents={'Maria Anders'} />
                <Cell contents={'Germany'} />
            </tr>
    )
}
