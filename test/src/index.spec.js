import { expect } from 'chai'
import Vue from 'vue'
import VueHowler from '../../dist/vue-howler.esm.js'
import TestComponent from '../fixtures/test-component.vue'
import { eventPromise, wait } from './helpers'
import { mount } from 'vue-test-utils'
import { Howl } from 'howler'

/**
 * The duration of the RetroFuture Clean mp3 in seconds
 */
const MP3_DURATION = 206

const getWrapper = options => {
  return mount(
    TestComponent,
    Object.assign(
      {
        propsData: {
          sources: [require('../fixtures/RetroFuture Clean.mp3')]
        },
        attachToDocument: true
      },
      options
    )
  )
}

describe('Basic Initialization', function() {
  const wrapper = getWrapper()
  const component = wrapper.vm

  // Start listening for load event right away so we don't miss it
  const loadPromise = eventPromise(component, 'load')

  it('Component is a Vue instance', () => {
    expect(wrapper.isVueInstance()).to.equal(true)
  })

  it('Component uses the vue-howler mixin', () => {
    const mixins = component.$options.mixins
    expect(mixins).to.be.an('array')
    expect(mixins).to.deep.contain(VueHowler)
  })

  it('Component has the vue-howler methods', () => {
    expect(component['_reinitialize']).to.be.a('function')
    expect(component['_initialize']).to.be.a('function')
    expect(component['_cleanup']).to.be.a('function')
    expect(component['play']).to.be.a('function')
    expect(component['pause']).to.be.a('function')
    expect(component['togglePlayback']).to.be.a('function')
    expect(component['stop']).to.be.a('function')
    expect(component['mute']).to.be.a('function')
    expect(component['unmute']).to.be.a('function')
    expect(component['toggleMute']).to.be.a('function')
    expect(component['setVolume']).to.be.a('function')
    expect(component['setRate']).to.be.a('function')
    expect(component['setSeek']).to.be.a('function')
    expect(component['setProgress']).to.be.a('function')
  })

  it('Component has the vue-howler props', () => {
    const props = component.$options.props
    expect(props['sources']).to.exist
    expect(props['autoplay']).to.exist
    expect(props['loop']).to.exist
    expect(props['preload']).to.exist
    expect(props['html5']).to.exist
  })

  it('Component has a Howl instance', () => {
    expect(component.$data._howl).to.be.an.instanceof(Howl)
  })

  it('Component.seek === 0', () => {
    expect(component.seek).to.equal(0)
  })

  it('Component.playing === false', () => {
    expect(component.playing).to.equal(false)
  })

  it('Component emits "load" event', () => loadPromise)

  it('Component.duration is set correctly', () => {
    const measuredDuration = Math.round(component.duration)
    const actualDuration = Math.round(MP3_DURATION)
    expect(measuredDuration).to.equal(actualDuration)
  })
})

describe('Basic Functionality', () => {
  const wrapper = getWrapper()
  const component = wrapper.vm

  // Start listening for load event right away so we don't miss it
  const loadPromise = eventPromise(component, 'load')

  it('Component.play() starts playback', async () => {
    await loadPromise

    const playPromise = eventPromise(component, 'play')
    component.play()
    await playPromise

    expect(component.playing).to.equal(true)
  })

  it('Playback increments seek', async () => {
    await wait(1000)
    expect(component.seek).to.be.greaterThan(0)
  })

  it('Component.stop() stops playback and resets seek', async () => {
    const stopPromise = eventPromise(component, 'stop')
    component.stop()
    await stopPromise

    expect(component.playing).to.equal(false)
    expect(component.seek).to.equal(0)
  })
})
