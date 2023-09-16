const {execSync} = require('child_process')

let releaseChangelog = execSync('node_modules/.bin/conventional-changelog --preset angular --release-count 1')
releaseChangelog = String(releaseChangelog).trim().replace(/\n\n+/g, '\n\n')

const releaseBody = `Progressive web app mirrors:
- https://plebones.eth.limo
- https://plebones.eth.link
- https://cloudflare-ipfs.com/ipns/plebones.eth (insecure, no subdomain isolation)

CLI client:
- https://github.com/plebbit/plebbit-cli/releases/latest

${releaseChangelog}`

console.log(releaseBody)