/**
 * Delay a Promise chain for a number of ms
 * @param {Number} ms - The number of milliseconds to wait for
 * @returns {Promise} A Promise that resolves after ms milliseconds
 */
export const wait = (ms) => (data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    return resolve(data)
  }, ms)
})

/**
 * Delay a Promise chain until an event is emitted on a Vue component
 * @param {any} component - The Vue component that will emit the event
 * @param {String} event - The name of the event to listen for
 * @param {Number} [timeout=3000] - An optional timeout in milliseconds. Defaults to 3000ms
 */
export const waitForEvent = (component, event, timeout = 3000) =>
  (data) => new Promise((resolve, reject) => {
    component.$on(event, () => {
      resolve(arguments)
    })
    if (timeout > 0) {
      setTimeout(() => {
        reject(new Error(`Component failed to emit '${event}' event within ${timeout}ms`))
      }, timeout)
    }
  })
