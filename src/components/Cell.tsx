import React from 'react'
import '../styles/Components.css'

type CellProps = {
    contents: string,
    keydown: (event: React.KeyboardEvent<HTMLInputElement>, col: number, row: number) => void,
    calc: () => void
}

export default function Cell({ contents, keydown, calc }: CellProps): JSX.Element {
    const col = 10;
    const row = 5;
    
    return (
    <td className="cell">
        <input id="a" 
            onChange={_ => calc()}
            onKeyDown={event => keydown(event, col, row)}/>
        {contents}
    </td>
    )
}
