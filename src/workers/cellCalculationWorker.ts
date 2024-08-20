// Self-Contained worker function. 
// No functions from other files or other global data may be used in here. 
export default (): void => {

    // We use a worker to:
    // 1. Not block the main UI thread when calculating formulas
    // 2. Creates a sandbox environment to prevent rogue js
    // 3. Prevent cyclic references (Hard - fix this later)
    //       Done via getter and setter functions in the global scope?

    function calculateFormulas(sheet: Map<string, string>): { errors: Map<string, string>, values: Map<string, string> }
    {
        let errors: Map<string, string> = new Map([]);
        let values: Map<string, string> = new Map([]);

        for (const coord in sheet)
        {
            // Do somethign with the worker
            console.log(coord)
        }

        return { errors: errors, values: values }
    }

    self.addEventListener('message', (event) => {  // eslint-disable-line no-restricted-globals
        console.log(`Received message from main thread: ${event.data}`)
        const result = calculateFormulas(event.data)
        postMessage(result)
    })
}


