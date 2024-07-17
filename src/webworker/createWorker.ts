export default function createWorker(worker: () => void) {
    // Change the worker we defined in "app.worker.js" to an object URL.
    // so we dont have to use filenames directly

    const code = worker.toString()
    const blob = new Blob(['(' + code + ')()'])
    return new Worker(URL.createObjectURL(blob))
}

// export default class WorkerWrapper {
//     constructor(worker: () => void) {
//     // Change the worker we defined in "app.worker.js" to an object URL.
//     // so we dont have to use filenames directly

//       const code = worker.toString();
//       const blob = new Blob(['(' + code + ')()']);
//       return new Worker(URL.createObjectURL(blob));
//     }
//   }
