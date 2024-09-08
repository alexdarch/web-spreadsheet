// Self-Contained worker function. 
// No functions from other files or other global data may be used in here. 
export default (): void => {

    // We use a worker to:
    // 1. Not block the main UI thread when calculating formulas
    // 2. Creates a sandbox environment to prevent rogue js
    // 3. Prevent cyclic references (Hard - fix this later)
    //       Done via getter and setter functions in the global scope?

    type StringDict = { [key: string]: string }

    function calculateFormulas(sheet: StringDict): { errors: StringDict , values: StringDict }
    {
        console.log("Calculate Formulas")
        let errors: StringDict = { "A1": "error" };
        let values: StringDict = {"A2": "value"};

        for (const coord in sheet)
        {
            // Do somethign with the worker
            console.log(coord)
        }

        return { errors: errors, values: values }
    }

    self.addEventListener('message', (event) => {  // eslint-disable-line no-restricted-globals
        console.log(`Received message from main thread: ${event.data}`)
        
        const parsedMessage = JSON.parse(event.data)
        const result = calculateFormulas(parsedMessage)
        postMessage(JSON.stringify(result))
    })
}


