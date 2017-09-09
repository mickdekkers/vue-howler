const yargs = require('yargs')
const fs = require('mz/fs')
const path = require('path')
const semver = require('semver')
const Listr = require('listr')
const execa = require('execa')

const allowedBranch = 'master'
const pkgFile = path.join(__dirname, '../package.json')

const log = console.log

const bail = message => {
  if (message) {
    log(message)
  }
  log('Publishing failed')
  process.exit(1)
}

const publishIncPkgVersion = incType => async () => {
  try {
    var pkgVersion = await getPkgVersion()
  } catch (error) {
    bail(error.message)
  }

  const version = semver.inc(pkgVersion, incType)

  await publish(version)
}

// eslint-disable-next-line no-unused-expressions
yargs
  .usage('$0 command')
  .command({
    command: 'version <version>',
    desc: 'publish a specific version',
    async handler({ version }) {
      const validVersion = semver.valid(version)
      if (!validVersion) {
        bail(`"${version}" is not a valid semver version.`)
      }

      try {
        var pkgVersion = await getPkgVersion()
      } catch (error) {
        bail(error.message)
      }

      if (semver.lte(validVersion, pkgVersion)) {
        bail(
          `New version must be greater than the current version (${pkgVersion}).`
        )
      }

      await publish(validVersion)
    }
  })
  .command({
    command: 'major',
    desc: 'publish a new major version',
    handler: publishIncPkgVersion('major')
  })
  .command({
    command: 'minor',
    desc: 'publish a new minor version',
    handler: publishIncPkgVersion('minor')
  })
  .command({
    command: 'patch',
    desc: 'publish a new patch version',
    handler: publishIncPkgVersion('patch')
  })
  .demandCommand(1, 'You must provide a valid command.')
  .help().argv

const execaOpts = {
  cwd: path.join(__dirname, '..')
}

const tasks = new Listr([
  {
    title: 'Increment version',
    task: ctx => setPkgVersion(ctx.version)
  },
  {
    title: 'Run build',
    task: () => execa('npm', ['run', '--silent', 'build'], execaOpts)
  },
  {
    title: 'Commit build',
    task: () =>
      new Listr([
        {
          title: 'Add files',
          task: () =>
            execa(
              'git',
              ['add', '"dist/*"', 'package.json', 'yarn.lock'],
              execaOpts
            )
        },
        {
          title: 'Create commit',
          task: ctx =>
            execa('git', ['commit', '-m', `v${ctx.version}`], execaOpts)
        },
        {
          title: 'Create tag',
          task: ctx => execa('git', ['tag', `v${ctx.version}`], execaOpts)
        },
        {
          title: 'Push commit',
          task: () => execa('git', ['push', 'origin', 'master'], execaOpts)
        },
        {
          title: 'Push tag',
          task: ctx =>
            execa('git', ['push', 'origin', `v${ctx.version}`], execaOpts)
        }
      ])
  },
  {
    title: 'Publish build',
    task: () => execa('npm', ['publish'], execaOpts)
  }
])

async function publish(version) {
  const branch = await execa.stdout(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    execaOpts
  )

  if (branch !== allowedBranch) {
    bail(`You can only publish from the ${allowedBranch} branch`)
  }

  log(`Publishing v${version}\n`)

  tasks.run({ version }).then(
    ctx => {
      log(`\nv${version} published!`)
    },
    error => {
      bail(error.message)
    }
  )
}

async function getPkgVersion() {
  const version = await fs
    .readFile(pkgFile)
    .then(JSON.parse)
    .then(x => x.version)

  const validVersion = semver.valid(version)
  if (!validVersion) {
    throw new Error(`Invalid version in package.json: "${version}"`)
  }

  return validVersion
}

async function setPkgVersion(version) {
  const pkg = await fs.readFile(pkgFile).then(JSON.parse)
  Object.assign(pkg, { version })

  const pkgStr = JSON.stringify(pkg, null, 2)
  await fs.writeFile(pkgFile, pkgStr + '\n')
}
