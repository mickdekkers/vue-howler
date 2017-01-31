import { expect } from 'chai'
import assign from 'lodash/assign'
import Vue from 'vue-standalone'
import VueHowler from '../../dist/vue-howler'
import TestComponent from '../fixtures/test-component.vue'

/**
 * Delay a Promise chain for a number of ms
 * @param {Number} ms - The number of milliseconds to wait for
 * @returns {Promise} A Promise that resolves after ms milliseconds
 */
const wait = (ms) => (data) => new Promise((resolve, reject) => {
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
const waitForEvent = (component, event, timeout = 3000) =>
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

/**
 * Make a new instance of the test component
 * @param {Object} data - The data object that will be passed to the Vue instance.
 * This is merged into the defaults with lodash.assign
 * @param {Boolean} visible - Whether to visibly mount the component on the page
 * @returns {Vue} The new Vue instance
 */
const makeTestInstance = (data, visible = true) => {
  const vm = new Vue({
    components: {
      TestComponent
    },
    data: assign({}, {
      sources: [
        require('file-loader!../fixtures/RetroFuture Clean.mp3')
      ]
    }, data),
    template: `
      <test-component ref="player" :sources="sources"></test-component>
    `
  }).$mount()

  if (visible) {
    document.body.appendChild(vm.$el)
  }

  return vm
}

describe('vue-howler mixin', function () {
  this.timeout(60000)

  it ('should play mp3s', () => {
    const p = makeTestInstance().$refs.player

    return Vue.nextTick()
      .then(() => {
        expect(p).to.exist
        expect(p.$data._howl).to.exist
        expect(p.seek).to.equal(0)
        expect(p.playing).to.be.false
      })
      .then(waitForEvent(p, 'load'))
      .then(() => {
        p.play()
      })
      .then(waitForEvent(p, 'play'))
      .then(wait(500))
      .then(() => {
        expect(Math.round(p.duration)).to.equal(206) // Duration of the 'RetroFuture Clean' mp3
        expect(p.seek).to.be.above(0)
        expect(p.playing).to.be.true
        p.stop()
      })
      .then(waitForEvent(p, 'stop'))
      .then(() => {
        console.log('done!')
      })
  })
})
