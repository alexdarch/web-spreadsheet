/* eslint-disable no-restricted-globals */
// Self-Contained worker function. 
// No functions from other files or other global data may be used in here. 
export default (): void => {

    // We use a worker to:
    // 1. Not block the main UI thread when calculating formulas
    // 2. Creates a sandbox environment to prevent rogue js
    // 3. Prevent cyclic references (Hard - fix this later)
    //       Done via getter and setter functions in the global scope?

    type SheetType = { [key: string]: string | number }
    type ErrorsType = { [key: string]: string | number }
    type ValuesType = { [key: string]: string | number | Function | object }


    function calculateFormulas(sheet: SheetType): { errors: ErrorsType , values: ValuesType }
    {
        console.log("Calculate Formulas")
        let errors: ErrorsType = { "A1": "error" };
        let values: ValuesType = { "A2": "value" };

        console.log(`Worker Thread sheet: ${JSON.stringify(sheet)}`)

        for (const coord in sheet)
        {
            console.log(`Worker Thread coords: ${coord}`)

            // Assuming all coords come in as upper case
            for (const name of [coord.toLowerCase(), coord, '$'+coord.toLowerCase(), '$' + coord])
            {
                console.log(`Worker Thread name: ${JSON.stringify(name)}`)

                // Worker is reused across computations, so only define each variable once
                const discriptor = Object.getOwnPropertyDescriptor( self, name ) || {}
                console.log(`Worker Thread discriptor: ${JSON.stringify(discriptor)}`)
                if (discriptor.get) {
                    continue; 
                }

                // TODO: slowly go through the below code and uncomment things
                // the name is different to the examples so be careful of that
                // Looks like console.log does actually work for web workers
                // Finally uncomment the promise and see if we can trigger a timeout.

                // // Otherwise define a getter for this property (Which effectively becomes global for this worker)
                // Object.defineProperty(self, name, { get: function() {
                //     if (coord in values) {
                //         return values[coord]
                //     }

                //     values[coord] = NaN;

                //     // Convert numeric strings to numbers so =A1+C1 works when both are numbers
                //     let possibleNumber = +sheet[coord];
                //     if (!isNaN(possibleNumber))
                //     {
                //         values[coord] = possibleNumber;
                //     }

                //     let str = sheet[coord].toString()

                //     // evaluate formula cells beginning with =
                //     try {
                //         values[coord] = (('=' === str[0]) ? eval.call(null, str.slice(1)) : str);
                //     }
                //     catch (e) {
                //         let ex = (e as any).toString()
                //         var match = /\$?[A-Za-z]+[1-9][0-9]*\b/.exec(ex);

                //         // throw new Error({ex: ex }.toString())

                //         // The formula refers to a uninitialized cell; set it to 0 and retry
                //         // if (match && !(match![0] in self)) {
                //         //     self[match![0]] = 0
                //         //     delete values[coord]
                //         //     return self [coord]
                //         // }

                //         // // Otherwise, stringify the caught exception in the errs object
                //         // errors[coord] = e.toString();
                //     }

                //     // Turn vals[coord] into a string if it's not a number or boolean
                //     switch (typeof values[coord]) { 
                //         case 'function': 
                //         case 'object': 
                //             values[coord].toString(); 
                //     }
                //     return values[coord];

                // }})
            }
        }

        return { errors: errors, values: values }
    }

    self.addEventListener('message', (event) => {
        console.log(`Received message from main thread: ${event.data}`)
        // throw new Error({data: event.data}.toString())
        const parsedSheet = JSON.parse(event.data)
        const result = calculateFormulas(parsedSheet)
        postMessage(JSON.stringify(result))
    })
}


