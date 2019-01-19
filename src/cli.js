const meow = require('meow')
const chalk = require('chalk')

const generate = require('./index')

const cmd = 'tracker-json'

async function run() {

  const cli = meow(`
    Usage
      $ ${cmd} <version>

    Examples
      $ ${cmd} my-card
  `,
  {
    flags: {
      out: {
        type: 'string',
        alias: 'o',
      },
      help: {
        type: 'boolean',
        alias: 'h',
      },
    },
  })

  if (!cli.flags.h) {
    const entries = await generate(cli.input[0], cli.flags)
    console.log(chalk`{green ✓ tracker.json generated}`)
    entries.forEach(({ name, version }) => {
      console.log(chalk`${name} {green ${version}}`)
    })
  }
}

module.exports = run
