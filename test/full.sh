#!bin/bash
rm -rf /Users/altninja/Library/Application\ Support/Electron
rm -rf /Users/altninja/Library/Application\ Support/ID\ Wallet
rm -rf /Users/altninja/code/selfkey/idw2/out
cd /Users/altninja/code/selfkey/idw2
npm run make
node /Users/altninja/code/selfkey/idw2/test/test.js 1
node /Users/altninja/code/selfkey/idw2/test/test.js 2
node /Users/altninja/code/selfkey/idw2/test/test.js 3