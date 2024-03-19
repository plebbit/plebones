#!/usr/bin/env bash

# deploy html to a server and then add html to ipfs

# go to current folder
cd "$(dirname "$0")"

# add env vars
if [ -f ../.deploy-env ]; then
  export $(echo $(cat ../.deploy-env | sed 's/#.*//g'| xargs) | envsubst)
fi

# check creds
if [ -z "${DEPLOY_HOST+xxx}" ]; then echo "DEPLOY_HOST not set" && exit; fi
if [ -z "${DEPLOY_USER+xxx}" ]; then echo "DEPLOY_USER not set" && exit; fi
if [ -z "${DEPLOY_PASSWORD+xxx}" ]; then echo "DEPLOY_PASSWORD not set" && exit; fi

# save version
PLEBONES_VERSION=$(node -e "console.log(require('../package.json').version)")
PLEBONES_HTML_NAME="plebones-html-$PLEBONES_VERSION"
PLEBONES_PREVIOUS_VERSIONS=$(git tag | sed 's/v//g' | tr '\n' ' ')

SCRIPT="
# download html
cd ~
rm $PLEBONES_HTML_NAME.zip
rm -fr $PLEBONES_HTML_NAME
wget https://github.com/plebbit/plebones/releases/download/v$PLEBONES_VERSION/$PLEBONES_HTML_NAME.zip || exit

# extract html
unzip $PLEBONES_HTML_NAME.zip || exit
rm $PLEBONES_HTML_NAME.zip || exit

# add previous versions as folders e.g. /0.1.1
cd $PLEBONES_HTML_NAME
for PLEBONES_PREVIOUS_VERSION in $PLEBONES_PREVIOUS_VERSIONS
do
  # download previous version
  PLEBONES_PREVIOUS_VERSION_HTML_NAME="plebones-html-\$PLEBONES_PREVIOUS_VERSION"
  echo downloading \$PLEBONES_PREVIOUS_VERSION_HTML_NAME...
  wget --quiet https://github.com/plebbit/plebones/releases/download/v\$PLEBONES_PREVIOUS_VERSION/\$PLEBONES_PREVIOUS_VERSION_HTML_NAME.zip
  # extract previous version html
  unzip -qq \$PLEBONES_PREVIOUS_VERSION_HTML_NAME.zip
  rm \$PLEBONES_PREVIOUS_VERSION_HTML_NAME.zip
  mv \$PLEBONES_PREVIOUS_VERSION_HTML_NAME \$PLEBONES_PREVIOUS_VERSION
done
cd ..

# add to ipfs
CID=\`ipfs add --recursive --pin --quieter $PLEBONES_HTML_NAME | tail -n 1\`
ipfs pin add --recursive \"\$CID\"

# start ipfs daemon if not started
ipfs init
nohup ipfs daemon &

# the CID of plebones html, add this CID to ENS
sleep 3
echo \"\"
CID=\`ipfs cid base32 \$CID\`
echo $PLEBONES_HTML_NAME \"CID: \$CID\"
echo \"\"
"

# execute script over ssh
echo "$SCRIPT" | sshpass -p "$DEPLOY_PASSWORD" ssh "$DEPLOY_USER"@"$DEPLOY_HOST"
