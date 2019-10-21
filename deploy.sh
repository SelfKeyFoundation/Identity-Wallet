#!/bin/bash
TIMESTAMP=$(date +%Y.%m.%d.%H)
COMMIT_MESSAGE=$1
openssl aes-256-cbc -K $encrypted_40ef2f4394e3_key -iv $encrypted_40ef2f4394e3_iv -in client-secret.json.enc -out client-secret.json -d
gcloud auth activate-service-account --key-file client-secret.json

if [ "$OSENV" == "linux" ]
then
    VERSION=$(cat /tmp/linux/package.json | jq .version)
    gsutil cp /tmp/linux/dist/*.AppImage gs://selfkey-builds/$CIRCLE_BRANCH/$TIMESTAMP/
else
    VERSION=$(cat /tmp/mac/package.json | jq .version)
    gsutil cp /tmp/mac/dist/*.{zip,dmg} gs://selfkey-builds/$CIRCLE_BRANCH/$TIMESTAMP/
    curl -i -X POST -H "Content-Type: application/json" -d "{\"text\": \"Mac build has been deployed for \n$COMMIT_MESSAGE \n[(see artifacts)](https://console.cloud.google.com/storage/browser/selfkey-builds/$CIRCLE_BRANCH/$VERSION/$TIMESTAMP/?project=kycchain-master)\", \"channel\": \"id-wallet-builds\" }" $MM_URL
fi

