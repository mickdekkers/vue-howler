/**
 * Get a Promise that resolves after a number of ms
 * @param {Number} ms - The number of milliseconds to resolve after
 * @returns {Promise} A Promise that resolves after ms milliseconds
 */
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get a Promise that resolves when an event is emitted on a Vue component
 * @param {Vue.Component} component - The Vue component that will emit the event
 * @param {String} event - The name of the event to listen for
 * @returns {Promise}
 */
export const eventPromise = (component, event) =>
  new Promise(resolve => component.$on(event, resolve))
