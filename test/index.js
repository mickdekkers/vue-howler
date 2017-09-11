import Vue from 'vue'

// Disable Vue console tips
Vue.config.productionTip = false
Vue.config.devtools = false

// Load and run tests
const testsContext = require.context('./src', true, /\.spec$/)

testsContext.keys().forEach(testsContext)
