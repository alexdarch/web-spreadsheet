import React from 'react'
import '../styles/Components.css'

type HeaderCellProps = {
    contents: string
}

export default function HeaderCell({ contents }: HeaderCellProps): JSX.Element {
    return (
        <th key={`${contents}-th`} className="header-cell">
            {contents}
        </th>
    )
}
