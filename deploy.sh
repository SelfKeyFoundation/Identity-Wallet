#!/bin/bash
VERSION=$(date +%Y.%m.%d)-$1
COMMIT_MESSAGE=$2
echo "staging $VERSION"
openssl aes-256-cbc -K $encrypted_40ef2f4394e3_key -iv $encrypted_40ef2f4394e3_iv -in client-secret.json.enc -out client-secret.json -d
gcloud auth activate-service-account --key-file client-secret.json

if [ "$OSENV" == "circle" ]
then
    gsutil cp dist/*.AppImage gs://selfkey-builds/$VERSION/
else
    gsutil cp dist/*.zip gs://selfkey-builds/$VERSION/
#    if [ "$TRAVIS_PULL_REQUEST" == "false" && "$TRAVIS_BRANCH" == "dev"  ]
#    then
    curl -i -X POST -H "Content-Type: application/json" -d "{\"text\": \"Mac build has been deployed for \n$TRAVIS_COMMIT_MESSAGE \n[(see artifacts)](https://console.cloud.google.com/storage/browser/selfkey-builds/$VERSION/?project=kycchain-master)\", \"channel\": \"id-wallet-builds\" }" $MM_URL
#    fi
fi