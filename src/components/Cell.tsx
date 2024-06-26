import React from 'react'
import '../styles/Components.css'

export default function Cell({ contents }: { contents: string }): JSX.Element {
    return <td className="cell">{contents}</td>
}
