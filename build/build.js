const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const pascalCase = require('pascal-case')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const packageName = require('../package.json').name

const getDataSize = code => {
  return `${(code.length / 1024).toFixed(2)}kb`
}

const getRelativePath = p => path.relative(path.join(__dirname, '..'), p)

const writeFile = (dest, data) =>
  new Promise((resolve, reject) => {
    const finalDest = path.resolve(__dirname, dest)
    fs.writeFile(finalDest, data, err => {
      if (err) return reject(err)
      console.log(
        `${chalk.blue(getRelativePath(finalDest))} ${getDataSize(data)}`
      )
      resolve()
    })
  })

const writeCodeMap = async (dest, code, map) => {
  await Promise.all([
    writeFile(dest, code),
    writeFile(`${dest}.map`, JSON.stringify(map))
  ])
}

const build = async () => {
  const bundle = await rollup.rollup({
    input: path.resolve(__dirname, '../src/index.js'),
    plugins: [
      babel({
        exclude: 'node_modules/**',
        // Uncomment this to cause error
        // externalHelpersWhitelist: ['_typeof']
      })
    ]
  })

  /**
   * CommonJS build
   */
  {
    const { code, map } = await bundle.generate({
      format: 'cjs',
      sourcemap: true,
      sourcemapFile: `${packageName}.common.js`
    })

    writeCodeMap(`../dist/${packageName}.common.js`, code, map)
  }

  /**
   * ES Module build
   */
  {
    const { code, map } = await bundle.generate({
      format: 'es',
      sourcemap: true,
      sourcemapFile: `${packageName}.esm.js`
    })

    writeCodeMap(`../dist/${packageName}.esm.js`, code, map)
  }

  /**
   * UMD build
   */
  {
    const { code, map } = await bundle.generate({
      format: 'umd',
      sourcemap: true,
      sourcemapFile: `${packageName}.umd.js`,
      name: pascalCase(packageName)
    })

    writeCodeMap(`../dist/${packageName}.umd.js`, code, map)
  }
}

build()
