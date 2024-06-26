#!/bin/bash
TIMESTAMP=$(date +%Y.%m.%d.%H)
COMMIT_MESSAGE=$1
# openssl aes-256-cbc -K $encrypted_40ef2f4394e3_key -iv $encrypted_40ef2f4394e3_iv -in client-secret.json.enc -out client-secret.json -d
gcloud auth activate-service-account --key-file gcp_key.json

if [ "$OSENV" == "linux" ]
then
    VERSION=$(cat /tmp/linux/package.json | jq .version)
    gsutil cp /tmp/linux/dist/*.{AppImage,tar.gz} gs://sk-builds/$CIRCLE_BRANCH/$TIMESTAMP/
    # curl -i -X POST -H "Content-Type: application/json" -d "{\"text\": \"Linux build has been deployed for \n$COMMIT_MESSAGE \n[(see artifacts)](https://console.cloud.google.com/storage/browser/sk-builds/$CIRCLE_BRANCH/$VERSION/$TIMESTAMP/?project=selfkey2)\", \"channel\": \"poi-builds\" }" $MATTERMOST_URL
else
    VERSION=$(cat /tmp/mac/package.json | jq .version)
    gsutil cp /tmp/mac/dist/*.{zip,dmg,pkg} gs://sk-builds/$CIRCLE_BRANCH/$TIMESTAMP/
    # curl -i -X POST -H "Content-Type: application/json" -d "{\"text\": \"Mac build has been deployed for \n$COMMIT_MESSAGE \n[(see artifacts)](https://console.cloud.google.com/storage/browser/sk-builds/$CIRCLE_BRANCH/$VERSION/$TIMESTAMP/?project=selfkey2)\", \"channel\": \"poi-builds\" }" $MATTERMOST_URL
fi

