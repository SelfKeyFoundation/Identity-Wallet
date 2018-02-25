#!/bin/bash
rm -rf node_modules
npm i
node ./test/utils/full.js
npm run make
npm run test