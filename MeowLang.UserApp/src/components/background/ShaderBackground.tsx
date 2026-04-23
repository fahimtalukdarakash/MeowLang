// File: src/components/background/ShaderBackground.tsx
// This component lives on the main thread but renders nothing heavy
// It just creates a canvas and transfers control to the worker

import { useEffect, useRef } from 'react'

function ShaderBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const workerRef = useRef<Worker | null>(null)
    // const transferredRef = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        // if (transferredRef.current) return
        // transferredRef.current = true
        // Create the worker
        workerRef.current = new Worker(
            new URL('../../workers/shader.worker.ts', import.meta.url),
            { type: 'module' }
        )

        // Transfer canvas control to worker — main thread loses control of this canvas
        // This is the key — the canvas now belongs entirely to the worker thread
        const offscreen = canvas.transferControlToOffscreen()

        workerRef.current.postMessage(
            {
                type: 'init',
                canvas: offscreen,
                width: window.innerWidth,
                height: window.innerHeight
            },
            // Transfer the offscreen canvas — not just copy it
            [offscreen]
        )

        // Handle resize — send message to worker
        const handleResize = () => {
            workerRef.current?.postMessage({
                type: 'resize',
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            workerRef.current?.postMessage({ type: 'destroy' })
            workerRef.current?.terminate()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                display: 'block',
                background: '#050510'
            }}
        />
    )
}

export default ShaderBackground