// File: src/components/common/FluidCursor.tsx

import { useEffect } from 'react'
import initFluidCursor from '../../hooks/use-FluidCursor.js'

function FluidCursor() {
    useEffect(() => {
        initFluidCursor()
    }, [])

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: 'none'
        }}>
            <canvas
                id="fluid"
                style={{
                    width: '100vw',
                    height: '100vh'
                }}
            />
        </div>
    )
}

export default FluidCursor