const fs = require('fs')
const readPkg = require('read-pkg-up')
const pkgConf = require('pkg-conf')

const pad = value => value.toString().padStart(2, '0')
const getDate = (d = new Date()) => ([
  d.getFullYear(),
  pad(d.getMonth()+1),
  pad(d.getDate()),
].join('-'))

const key = 'tracker-json'

const resolvers = {
  'gh:repo': (name, { repo, file, version }) => {
    return {
      remote_location: `https://raw.githubusercontent.com/${repo}/master/${file}`,
      changelog: `https://github.com/${repo}/commits/${version}`,
    }
  },
  'gh:release': (name, { repo, file, version }) => {
    return {
      remote_location: `https://github.com/${repo}/releases/download/${version}/${file}`,
      changelog: `https://github.com/${repo}/releases/${version}`,
    }
  }
}

module.exports = async function generateTrackerJson (version = null, flags) {
  const { pkg } = await readPkg()

  if (!pkg.hasOwnProperty(key)) {
    throw new Error('Missing tracker-json config in package.json')
  }

  if (version === null) {
    version = pkg.version
  }

  const updatedAt = getDate()
  const entries = Object.entries(pkg[key])
  const packages = entries.reduce((memo, [ name, values ]) => {
    const { repo, resolve } = values
    const file = (values.file || pkg.main).trim()
    const resolveFn = resolvers.hasOwnProperty(resolve) ? resolvers[resolve] : resolvers['gh:repo']
    return {
      ...memo,
      [name]: {
        version,
        updated_at: updatedAt,
        visit_repo: `https://github.com/${repo}`,
        ...resolveFn(name, { repo, file, version }),
      },
    }
  }, {})

  const outFile = flags.out || './tracker.json'

  fs.writeFileSync(outFile, JSON.stringify(packages, null, 2))

  return entries.map(([name]) => ({ name, version }))
}
