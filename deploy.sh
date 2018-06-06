#!/bin/bash
openssl aes-256-cbc -K $encrypted_40ef2f4394e3_key -iv $encrypted_40ef2f4394e3_iv -in client-secret.json.enc -out client-secret.json -d
curl https://sdk.cloud.google.com | bash
source $HOME/google-cloud-sdk/path.bash.inc
gcloud auth activate-service-account --key-file client-secret.json
gsutil cp dist/*.zip gs://selfkey-builds/mac/$TRAVIS_BUILD_NUMBER-$TRAVIS_PULL_REQUEST_BRANCH/