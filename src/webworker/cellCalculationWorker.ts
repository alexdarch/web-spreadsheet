export default (): void => {
    self.addEventListener('message', (event) => {  // eslint-disable-line no-restricted-globals
        console.log('Received message from main thread:', event.data)
        const result = event.data * 2
        postMessage(result)
    })
}
