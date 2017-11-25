# vue-howler [![Version](https://img.shields.io/npm/v/vue-howler.svg)][npm]
A [Howler.js][howler] [mixin][mixins] for Vue 2 that makes it easy to create custom audio player components

## Installation

```bash
$ npm install vue-howler
```

## Usage

First create a component that uses the mixin

`audio-player.vue`

```vue
<script>
  import VueHowler from 'vue-howler'

  export default {
    mixins: [VueHowler]
  }
</script>

<template>
  <div>
    <span>Total duration: {{ duration }} seconds</span>
    <span>Progress: {{ (progress * 100) }}%</span>
    <button @click="togglePlayback">{{ playing ? 'Pause' : 'Play' }}</button>
    <button @click="stop">Stop</button>
  </div>
</template>
```

Then you can use that component in your templates

`home.vue`

```vue
<script>
  import AudioPlayer from './audio-player.vue'

  export default {
    components: {
      AudioPlayer
    },

    data () {
      return {
        audioSources: [
          "assets/audio/music.webm",
          "assets/audio/fallback.mp3",
          "assets/audio/fallback2.wav"
        ]
      }
    }
  }
</script>

<template>
  <div>
    <audio-player :sources="audioSources" :loop="true"></audio-player>
  </div>
</template>
```

## API

### Props

#### `sources`

Type: `String[]` - Required

An array of audio file urls

#### `html5`

Type: `Boolean` - Default: `false`

Whether to force HTML5 Audio

#### `loop`

Type: `Boolean` - Default: `false`

Whether to start the playback again
automatically after it is done playing

#### `preload`

Type: `Boolean` - Default: `true`

Whether to start downloading the audio
file when the component is mounted

#### `autoplay`

Type: `Boolean` - Default: `false`

Whether to start the playback
when the component is mounted

#### `formats`

Type: `String[]` - Default: `[]`

Howler.js automatically detects your file format from the extension,
but you may also specify a format in situations where extraction won't work
(such as with a SoundCloud stream)

#### `xhrWithCredentials`

Type: `Boolean` - Default: `false`

Whether to enable the `withCredentials` flag on XHR requests
used to fetch audio files when using Web Audio API ([see reference](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials))

### Data

#### `playing`

Type: `Boolean`

Whether audio is currently playing

#### `muted`

Type: `Boolean`

Whether the audio playback is muted

#### `volume`

Type: `Number`

The volume of the playback on a scale of `0` to `1`

#### `rate`

Type: `Number`

The rate (speed) of the playback on a scale of `0.5` to `4`

#### `seek`

Type: `Number`

The position of the playback in seconds

#### `duration`

Type: `Number`

The duration of the audio in seconds

#### `progress`

Type: `Number`

The progress of the playback on a scale of `0` to `1`

### Methods

#### `play()`

Start the playback

#### `pause()`

Pause the playback

#### `togglePlayback()`

Toggle playing or pausing the playback

#### `stop()`

Stop the playback (also resets the `seek` to `0`)

#### `mute()`

Mute the playback

#### `unmute()`

Unmute the playback

#### `toggleMute()`

Toggle muting and unmuting the playback

#### `setVolume(volume)`

Set the volume of the playback (value is clamped between `0` and `1`)

#### `setRate(rate)`

Set the rate (speed) of the playback (value is clamped between `0.5` and `4`)

#### `setSeek(seek)`

Set the position of the playback (value is clamped between `0` and `duration`)

#### `setProgress(progress)`

Set the progress of the playback (value is clamped between `0` and `1`)

## License

MIT © [Mick Dekkers][mickdekkers-gh]

[howler]: https://howlerjs.com/
[mixins]: https://vuejs.org/v2/guide/mixins.html
[mickdekkers-gh]: https://github.com/mickdekkers
[npm]: https://www.npmjs.com/package/vue-howler
