# vue-howler
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
    <span>Progress: {{ (seek / duration * 100) }}%</span>
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
    components: [AudioPlayer],
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

#### `autoplay`

Type: `Boolean` - Default: `false`

Whether to start the playback
when the component is mounted

#### `loop`

Type: `Boolean` - Default: `false`

Whether to start the playback again
automatically after it is done playing

#### `preload`

Type: `Boolean` - Default: `true`

Whether to start downloading the audio
file when the component is mounted

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

### Methods

#### `play`

Start the playback

#### `pause`

Pause the playback

#### `togglePlayback`

Toggle playing or pausing the playback

#### `stop`

Stop the playback (also resets the `seek` to `0`)

#### `mute`

Mute the playback

#### `unmute`

Unmute the playback

#### `toggleMute`

Toggle muting and unmuting the playback

#### `setVolume(newValue)`

Set the volume of the playback (value is clamped between `0` and `1`)

#### `setRate(newValue)`

Set the rate (speed) of the playback (value is clamped between `0.5` and `4`)

#### `setSeek(newValue)`

Set the position of the playback (value is clamped between `0` and `duration`)

## License

MIT © [Blocklevel][blocklevel-gh]

[howler]: https://howlerjs.com/
[mixins]: https://vuejs.org/v2/guide/mixins.html
[blocklevel-gh]: https://github.com/blocklevel
