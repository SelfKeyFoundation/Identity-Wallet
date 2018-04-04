#!/bin/bash
NODE_ENV="test"
rm -rf node_modules
npm i
node ./test/utils/full/full.js
npm run make
npm run test