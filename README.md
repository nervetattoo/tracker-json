# tracker-json

> Easily generate a tracker.json file for your Home Assistant custom cards on new releases

[![npm version](https://badge.fury.io/js/tracker-json.svg)](https://badge.fury.io/js/tracker-json)

## Installation

Either install tracker-json globally `npm i -g tracker-json` or locally in your cards project (`npm i --save-dev tracker-json`).
The command `tracker-json` then either gets installed in your system or in your project

## Configuration

You configure `tracker-json` in your custom cards source repo, in its `package.json` file.
If my custom card project is called *awesome-card* I could configure it like so:

```json
{
  "tracker-json": {
    "awesome-card": {
      "repo": "nervetattoo/awesome-card"
    }
  }
}
```

Now, when you run `tracker-json` it will generate github repo specific URLs, get the version off of the one in `package.json` and set the cards update date to today.
You can specify multiple keys in the configuration to create different variations of your custom card.

### Supported configuration parameters

| Option | Default                   | Description                              |
| ---    | ---                       | ---                                      |
| repo   | package.json repo field   | A repo slug like github-user/repo-name   |
| file   | package.json file field   | The filename to link to inside the repo  |

## Basic usage

In the folder you want to store your `tracker.json` you can run the command `tracker-json <semantic-version>`. For example:

```bash
$ tracker-json.js 1.0.0
✓ tracker.json generated
my-card 1.0.0
```

## Using with release-it

I highly recommend using `tracker-json` with [release-it](https://github.com/webpro/release-it) for release handling.
release-it is a one-stop-shop to release a package following semantic versioning and also generate changelogs and publish the release to GitHub and optionally publishing to npm.
Using release-it you would handle cutting a new release with commands like `release-it major|minor|patch` and it handles everything else for you.
`tracker-json` currently only supports linking to releases with changelogs on GitHub, so you need to configure `release-it` with one of its hooks to trigger `tracker-json` as well as making sure it generates releases on GitHub:

```json
{
  "release-it": {
    "github": {
      "release": true
    },
    "scripts": {
      "afterBump": "npx tracker-json"
    }
  }
}
```
