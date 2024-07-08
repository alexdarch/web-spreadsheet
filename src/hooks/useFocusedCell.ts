import React, { useState, useEffect } from 'react'

export default function useFocusedCell() {
    const [active, setActive] = useState(document.activeElement)
    const [focusedCell, setFocusedCell] = useState<string | undefined>(
        active?.id
    )

    const handleFocusIn = (e: Event) => {
        if (document.activeElement?.id === undefined) {
            return
        }
        const cellId = document.activeElement.id
        console.log(`cell = ${cellId}, sub = ${cellId.substring(0, 5)}`)
        if (cellId.substring(0, 5) !== '#cell') {
            return
        }
        
        setFocusedCell(cellId)
        setActive(document.activeElement)
    }

    useEffect(() => {
      // TODO: listen to keystrokes and move the key too
        document.addEventListener('focusin', handleFocusIn)
        return () => {
            document.removeEventListener('focusin', handleFocusIn)
        }
    }, [])

    return [focusedCell, setFocusedCell]
}
