import { SheetTypes } from '../types/types'
import { MapsEqual } from './mapHelpers'
import cellCalculationWorker from '../workers/cellCalculationWorker'

/**
 * Triggers a web worker to do the sheet calculations in a seperate process.
 * This stops the main thread from blocking, provides a sandbox environment, and enables cycle-prevention logic
 * calc stores the state of the sheet before running and handles the returned calculations.
 * @param worker Web-Worker to perform the calculations in
 * @param sheet A 2d mapping of user-editable content
 * @param setSheet
 * @param errors A 2d mapping of read-only errors
 * @param setErrors
 * @param errors A 2d mapping of read-only calculation values
 * @param setErrors
 */
export function calc(
    worker: Worker,
    setWorker: (worker: Worker) => void,
    sheet: Map<string, SheetTypes>,
    setSheet: (newSheet: Map<string, SheetTypes>) => void,
    errors: Map<string, SheetTypes>,
    setErrors: (newErrors: Map<string, SheetTypes>) => void,
    values: Map<string, SheetTypes>,
    setValues: (newValues: Map<string, SheetTypes>) => void
) {
    console.log('calc worker', worker, 'sheet', sheet)
    var json = JSON.stringify(Object.fromEntries(new Map(sheet)))

    var promise = setTimeout(() => {
        console.log('timeout')
        // If the worker has not returned in 499 milliseconds, terminate it
        worker.terminate()
        // Back up to the previous state and make a new worker
        init(setWorker, sheet, setSheet, values, setValues, errors, setErrors)
        // Redo the calculation using the last-known state
        calc(
            worker,
            setWorker,
            sheet,
            setSheet,
            errors,
            setErrors,
            values,
            setValues
        )
    }, 1099)

    // When the worker returns, apply its effect on the scope
    worker.onmessage = function (event) {
        clearTimeout(promise)

        // If we successfully receive a message then save the current sheet as a backup
        const currSheet = Object.entries(sheet)
        localStorage.setItem('', JSON.stringify(currSheet))

        const result = JSON.parse(event.data)

        const newValues = new Map(Object.entries<string>(result.values))
        const newErrors = new Map(Object.entries<string>(result.errors))

        console.log('Received result from worker: ', newValues, newErrors)

        if (!MapsEqual(values, newValues)) {
            setValues(newValues)
        }

        if (!MapsEqual(errors, newErrors)) {
            setErrors(newErrors)
        }
    }

    worker.postMessage(json)
}

export function init(
    setWorker: (worker: Worker) => void,
    sheet: Map<string, SheetTypes>,
    setSheet: (newSheet: Map<string, SheetTypes>) => void,
    values: Map<string, SheetTypes>,
    setValues: (newValues: Map<string, SheetTypes>) => void,
    errors: Map<string, SheetTypes>,
    setErrors: (newErrors: Map<string, SheetTypes>) => void
) {
    const lastSheet = localStorage.getItem('')!
    let result = JSON.parse(lastSheet)

    if (!result) {
        // If no previous local storage then reset the sheet and run the calcs for it
        reset(setSheet)
    }

    console.log('creating worker')
    const workerProcess = createWorker(cellCalculationWorker)
    setWorker(workerProcess)

    calc(
        workerProcess,
        setWorker,
        sheet,
        setSheet,
        errors,
        setErrors,
        values,
        setValues
    )
}

function createWorker(worker: () => any) {
    // Change the worker we defined in "app.worker.js" to an object URL.
    // so we dont have to use filenames directly

    console.log('worker:', worker)
    const code = worker.toString()
    console.log('code:', worker.toString())
    const blob = new Blob(['(' + code + ')()'])
    return new Worker(URL.createObjectURL(blob))
}

export function reset(setSheet: (newSheet: Map<string, SheetTypes>) => void) {
    console.log('Resetting...')
    const initSheet = new Map<string, SheetTypes>([
        ['B1', 1874],
        ['A2', '+'],
        ['B2', 2046],
        ['A3', '⇒'],
        ['B3', '=B1+B2'],
    ])

    var json = JSON.stringify(initSheet)
    localStorage.setItem('', json)
    setSheet(initSheet)
}
