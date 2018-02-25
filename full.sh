#!/bin/bash
rm -rf node_modules
npm i
node ./test/utils/full/full.js
NODE_ENV=test npm run make
NODE_ENV=test npm run test