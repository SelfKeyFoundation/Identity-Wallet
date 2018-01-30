#!bin/bash
rm -rf /Users/altninja/Library/Application\ Support/Electron
rm -rf /Users/altninja/Library/Application\ Support/ID\ Wallet
rm -rf /Users/altninja/code/selfkey/wallets/Identity-Wallet/out
cd /Users/altninja/code/selfkey/wallets/Identity-Wallet
npm run make
node /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/test.js 0
# node /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/test.js 2
# node /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/test.js 3n