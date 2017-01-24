import { expect } from 'chai'
import assign from 'lodash/assign'
import Vue from 'vue'
import VueHowler from '../../dist/vue-howler'

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
 * The component to test the mixin in
 */
const TestComponent = {
  render (createElement) {
    return createElement(
      'div',
      [
        createElement('button', {
          on: {
            click: this.togglePlayback
          }
        },
        [
          this.playing ? 'Pause' : 'Play'
        ]),
        createElement('button', {
          on: {
            click: this.stop
          }
        },
        [
          'Stop'
        ]),
        createElement('button', {
          on: {
            click: this.toggleMute
          }
        },
        [
          this.muted ? 'Unmute' : 'Mute'
        ]),
        createElement('button', {
          on: {
            click () {
              this.setSeek(this.seek - 5)
            }
          }
        },
        [
          'Seek -5'
        ]),
        createElement('button', {
          on: {
            click () {
              this.setSeek(this.seek + 5)
            }
          }
        },
        [
          'Seek +5'
        ]),
        createElement('button', {
          on: {
            click () {
              this.setRate(this.rate - 0.25)
            }
          }
        },
        [
          'Rate -25%'
        ]),
        createElement('button', {
          on: {
            click () {
              this.setRate(this.rate + 0.25)
            }
          }
        },
        [
          'Rate +25%'
        ]),
        createElement('button', {
          on: {
            click () {
              this.setVolume(this.volume - 0.10)
            }
          },
        },
        [
          'Volume -10%'
        ]),
        createElement('button', {
          on: {
            click () {
              this.setVolume(this.volume + 0.10)
            }
          }
        },
        [
          'Volume +10%'
        ]),
        createElement('br'),
        `Duration: ${this.duration} Seek: ${this.seek}`
      ]
    )
  },
  mixins: [VueHowler]
}

/**
 * Make a new Vue instance for testing
 * @param {Object} data - The data object that will be passed to the Vue instance.
 * This is merged into the defaults with lodash.assign
 * @returns {Vue} The new Vue instance
 */
const makeTestInstance = (data) => {
  data = assign({}, {
    sources: [
      require('file-loader!../fixtures/RetroFuture Clean.mp3')
    ]
  }, data)

  const container = document.createElement('div')
  const className = `container-${Date.now()}`
  container.classList = className

  document.body.appendChild(container)

  return new Vue({
    render (createElement) {
      return createElement(
        'div',
        [
          createElement(TestComponent, {
            props: {
              sources: this.sources
            },
            ref: 'player'
          })
        ]
      )
    },
    components: {
      TestComponent
    },
    data,
    el: `.${className}`
  })
}

describe('vue-howler mixin', function () {
  this.timeout(60000)
  it ('should play mp3s', () => {
    const vm = makeTestInstance()
    const p = vm.$refs.player

    return Vue.nextTick()
      .then(() => {
        expect(p).to.exist
        expect(p.$data._howl).to.exist
        expect(p.duration).to.equal(0)
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
        expect(p.duration).to.equal(206.208) // Duration of the 'RetroFuture Clean' mp3
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
