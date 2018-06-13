#!/bin/bash
VERSION=$1
echo "staging $VERSION"
openssl aes-256-cbc -K $encrypted_40ef2f4394e3_key -iv $encrypted_40ef2f4394e3_iv -in client-secret.json.enc -out client-secret.json -d
gcloud auth activate-service-account --key-file client-secret.json

if [ "$OSENV" == "circle" ]
then
    gsutil cp dist/*.AppImage gs://selfkey-builds/$(date +%Y.%m.%d)-$VERSION/
else
    gsutil cp dist/*.zip gs://selfkey-builds/$(date +%Y.%m.%d)-$VERSION/
fi


