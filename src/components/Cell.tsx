import React from 'react'

export default function Cell({ contents }: { contents: string }) {
    return <th>{contents}</th>
}