import { Howl } from 'howler'
import clamp from 'lodash.clamp'

export default {
  props: {
    /**
     * An array of audio file urls
     */
    sources: {
      type: Array,
      required: true,
      validator (value) {
        return value.every(source => typeof source === 'string' && source.length > 0)
      }
    },
    /**
     * Whether to start the playback
     * when the component is mounted
     */
    autoplay: {
      type: Boolean,
      default: false
    },
    /**
     * Whether to start the playback again
     * automatically after it is done playing
     */
    loop: {
      type: Boolean,
      default: false
    },
    /**
     * Whether to start downloading the audio
     * file when the component is mounted
     */
    preload: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      /**
       * The Howl instance used for playback
       */
      _howl: null,
      /**
       * Whether audio is currently playing
       */
      playing: false,
      /**
       * Whether the audio playback is muted
       */
      muted: false,
      /**
       * The volume of the playback
       */
      volume: 1.0,
      /**
       * The rate (speed) of the playback
       */
      rate: 1.0,
      /**
       * The position of playback
       */
      seek: 0,
      /**
       * The duration of the audio
       */
      duration: 0,
      /**
       * Functions that poll the Howl instance
       * to update various data
       */
      _polls: {
        seek: {
          id: null,
          interval: 1000 / 4, // 4 times per second (4Hz)
          hook: () => {
            this.seek = this.$data._howl.seek()
          }
        }
      },
      /**
       * A list of howl events to listen to as well as
       * functions to call when they are triggered
       */
      _howlEvents: [
        {
          name: 'load',
          hook: () => { this.duration = this.$data._howl.duration() }
        },
        'loaderror',
        {
          name: 'play',
          hook: () => { this.playing = true }
        },
        {
          name: 'end',
          hook: () => { this.playing = false }
        },
        {
          name: 'pause',
          hook: () => { this.playing = false }
        },
        {
          name: 'stop',
          hook: () => {
            this.playing = false
            this.seek = this.$data._howl.seek()
          }
        },
        'mute',
        {
          name: 'volume',
          hook: () => { this.volume = this.$data._howl.volume() }
        },
        {
          name: 'rate',
          hook: () => { this.rate = this.$data._howl.rate() }
        },
        {
          name: 'seek',
          hook: () => { this.seek = this.$data._howl.seek() }
        },
        'fade'
      ]
    }
  },

  created () {
    this.$data._howl = new Howl({
      src: this.sources,
      volume: this.volume,
      autoplay: this.autoplay,
      loop: this.loop,
      preload: this.preload
    })

    // Bind to all Howl events
    this.$data._howlEvents = this.$data._howlEvents.map(event => {
      if (typeof event === 'string') {
        event = { name: event }
      }

      const handler = (id, details) => {
        if (typeof event.hook === 'function') event.hook(id, details)
        this.$emit(event.name, id, details)
      }

      this.$data._howl.on(event.name, handler)

      // Return the name and handler to unbind later
      return { name: event.name, handler }
    })
  },

  beforeDestroy () {
    // Stop all playback
    this.stop()
    // Stop all polls
    Object.values(this.$data._polls).forEach(poll => {
      if (poll.id != null) clearInterval(poll.id)
    })
    // Clear all event listeners
    this.$data._howlEvents.forEach(({ name, handler }) => this.$data._howl.off(name, handler))
    // Destroy the Howl instance
    this.$data._howl = null
  },

  watch: {
    playing () {
      this.seek = this.$data._howl.seek()

      if (this.playing) {
        this.$data._polls.seek.id = setInterval(
          this.$data._polls.seek.hook,
          this.$data._polls.seek.interval
        )
      } else {
        clearInterval(this.$data._polls.seek.id)
      }
    }
  },

  methods: {
    /**
     * Start the playback
     */
    play () {
      if (!this.playing) this.$data._howl.play()
    },
    /**
     * Pause the playback
     */
    pause () {
      if (this.playing) this.$data._howl.pause()
    },
    /**
     * Toggle playing or pausing the playback
     */
    togglePlayback () {
      if (!this.playing) {
        this.$data._howl.play()
      } else {
        this.$data._howl.pause()
      }
    },
    /**
     * Stop the playback
     */
    stop () {
      this.$data._howl.stop()
    },
    /**
     * Mute the playback
     */
    mute () {
      this.$data._howl.mute(true)
      this.muted = true
    },
    /**
     * Unmute the playback
     */
    unmute () {
      this.$data._howl.mute(false)
      this.muted = false
    },
    /**
     * Toggle muting the playback
     */
    toggleMute () {
      this.$data._howl.mute(!this.muted)
      this.muted = !this.muted
    },
    /**
     * Set the volume of the playback
     * @param {Number} newValue - The new volume
     */
    setVolume (newValue) {
      if (typeof newValue !== 'number') {
        throw new Error(`volume must be a number, got a ${typeof newValue} instead`)
      }

      this.$data._howl.volume(clamp(newValue, 0, 1))
    },
    /**
     * Set the rate (speed) of the playback
     * @param {Number} newValue - The new rate
     */
    setRate (newValue) {
      if (typeof newValue !== 'number') {
        throw new Error(`rate must be a number, got a ${typeof newValue} instead`)
      }

      this.$data._howl.rate(clamp(newValue, 0.5, 4))
    },
    /**
     * Set the position of the playback
     * @param {Number} newValue - The new position in seconds
     */
    setSeek (newValue) {
      if (typeof newValue !== 'number') {
        throw new Error(`seek must be a number, got a ${typeof newValue} instead`)
      }

      this.$data._howl.seek(clamp(newValue, 0, this.duration))
    }
  }
}
