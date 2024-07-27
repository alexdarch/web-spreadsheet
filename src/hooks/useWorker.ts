import React, { useState, useEffect } from 'react'

function createWorker(worker: () => void) {
    // Change the worker we defined in "app.worker.js" to an object URL.
    // so we dont have to use filenames directly

    const code = worker.toString()
    const blob = new Blob(['(' + code + ')()'])
    return new Worker(URL.createObjectURL(blob))
}

export default function useWorker<T>(
    workerFactory: () => () => void
): [T, (result: T) => void, Worker | null] {
    const [result, setResult] = useState<any>(0)
    const [worker, setWorker] = useState<Worker | null>(null)

    useEffect(() => {
        const workerProcess = createWorker(workerFactory())
        workerProcess.onmessage = function (event) {
            console.log('Received result from worker: ', event.data)
            setResult(event.data)
        }

        setWorker(workerProcess)

        return () => {
            workerProcess.terminate()
        }
    }, [])

    return [result, setResult, worker]
}
