import { useEffect, useRef } from "react"
import FileSaver from "file-saver"
import Pica from "pica"


export function useCanvasImage() {

    const outputCanvasRef = useRef<HTMLCanvasElement>()

    useEffect(() => {
        outputCanvasRef.current = document.createElement('canvas')
    }, [])

    function getCanvasImage() {
        const canvas = document.querySelector<HTMLCanvasElement>("canvas")

        const dataURL = canvas!.toDataURL("image/png", 0.5)
        return dataURL
    }

    async function saveCanvasImage() {
        FileSaver.saveAs(getCanvasImage(), "canvas.png")
    }

    async function getResizedImage() {

        const resizedCanvas = outputCanvasRef.current!
        const aspectRatio = window.innerWidth / window.innerHeight
        resizedCanvas.width = 500
        resizedCanvas.height = 500 / aspectRatio

        const pica = new Pica()
        const canvas = document.querySelector<HTMLCanvasElement>("canvas")!
        const result = await pica.resize(canvas, resizedCanvas, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2,
        })

        const dataURL = result.toDataURL("image/png", 0.5)

        return dataURL
    }

    return {
        getCanvasImage,
        getResizedImage,
        saveCanvasImage,
    }
}