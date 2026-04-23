// File: src/components/cursor/FluidCursor.tsx

import { useEffect, useRef } from 'react'
import initFluidCursor from '../../hooks/use-FluidCursor.js'

function FluidCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        // Canvas is guaranteed to exist here because
        // useEffect only runs after the component is mounted and painted
        if (!canvasRef.current) return
        initFluidCursor()
    }, [])

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 10,
            pointerEvents: 'none'
        }}>
            <canvas
                ref={canvasRef}
                id="fluid"
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'block'
                }}
            />
        </div>
    )
}

export default FluidCursor