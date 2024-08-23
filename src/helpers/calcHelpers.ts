import { SheetTypes } from '../types/types'
import cellCalculationWorker from '../workers/cellCalculationWorker'

export function calc(
    worker: Worker,
    sheet: Map<string, SheetTypes>,
    setSheet: (newSheet: Map<string, SheetTypes>) => void,
    errors: Map<string, SheetTypes>,
    setErrors: (newErrors: Map<string, SheetTypes>) => void
) {
    var json = JSON.stringify(sheet)

    var promise = setTimeout(() => {
        // If the worker has not returned in 499 milliseconds, terminate it
        worker.terminate()
        // Back up to the previous state and make a new worker
        init()
        // Redo the calculation using the last-known state
        calc(worker, sheet, setSheet, errors, setErrors)
    }, 99)

    // When the worker returns, apply its effect on the scope
    worker.onmessage = function (message) {
        clearTimeout(promise)
        localStorage.setItem('', json)
        setTimeout(() => {
            $scope.errs = message.data[0]
            $scope.vals = message.data[1]
        })
    }

    // Post the current sheet content for the worker to process
    worker.postMessage(sheet)
}

function init(
    setSheet: (sheet: Map<string, SheetTypes>) => void,
    setErrors: (errors: Map<string, SheetTypes>) => void,
    setWorker: (worker: Worker) => void
) {
    let sheet = JSON.parse(localStorage.getItem(''))
    if (!sheet) {
        reset(setSheet, setErrors)
    }
    initWorker(setSheet, setErrors, setWorker)
}

function createWorker(worker: () => void) {
    // Change the worker we defined in "app.worker.js" to an object URL.
    // so we dont have to use filenames directly

    const code = worker.toString()
    const blob = new Blob(['(' + code + ')()'])
    return new Worker(URL.createObjectURL(blob))
}

function initWorker(
    setSheet: (sheet: Map<string, SheetTypes>) => void,
    setErrors: (errors: Map<string, SheetTypes>) => void,
    setWorker: (worker: Worker) => void
) {
    const workerProcess = createWorker(() => cellCalculationWorker)
    workerProcess.onmessage = function (event) {
        console.log('Received result from worker: ', event.data)
        setSheet(event.data[0])
        setErrors(event.data[1])
    }

    setWorker(workerProcess)
}

export function reset(
    setSheet: (newSheet: Map<string, SheetTypes>) => void,
    setErrors: (newErrors: Map<string, SheetTypes>) => void
) {
    const initSheet = new Map<string, SheetTypes>([
        ['B1', 1874],
        ['A2', '+'],
        ['B2', 2046],
        ['A3', '⇒'],
        ['B3', '=B1+B2'],
    ])
    setSheet(initSheet)
    setErrors(new Map<string, SheetTypes>([]))
}
