import React from 'react'
import '../styles/Components.css'

export default function HeaderCell({
    contents,
}: {
    contents: string
}): JSX.Element {
    return <th className="header-cell">{contents}</th>
}