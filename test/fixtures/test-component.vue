<script>
  import VueHowler from '../../dist/vue-howler.esm.js'

  export default {
    mixins: [VueHowler]
  }
</script>

<template>
  <div>
    <button @click="togglePlayback">{{ playing ? 'Pause' : 'Play' }}</button>
    <button @click="stop">Stop</button>
    <button @click="toggleMute">{{ muted ? 'Unmute' : 'Mute' }}</button>
    <button @click="setSeek(seek - 5)">Seek -5</button>
    <button @click="setSeek(seek + 5)">Seek +5</button>
    <button @click="setRate(rate - 0.25)">Rate -25%</button>
    <button @click="setRate(rate + 0.25)">Rate +25%</button>
    <button @click="setVolume(volume - 0.1)">Volume -10%</button>
    <button @click="setVolume(volume + 0.1)">Volume +10%</button>
    <br>
    Duration: {{ duration }}
    Seek: {{ seek }}
  </div>
</template>
