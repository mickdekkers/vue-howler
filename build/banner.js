const pack = require('../package.json')

module.exports = `/*!
 * ${pack.name} v${pack.version}
 * (c) ${new Date().getFullYear()} ${pack.author.name}
 * Released under the ${pack.license} License.
 */`
