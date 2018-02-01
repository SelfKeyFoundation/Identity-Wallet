#!bin/bash
rm -rf /Users/altninja/Library/Application\ Support/Electron/documents
rm -rf /Users/altninja/Library/Application\ Support/Electron/wallets
rm /Users/altninja/Library/Application\ Support/Electron/main-store.json

rm -rf /Users/altninja/Library/Application\ Support/id-wallet/documents
rm -rf /Users/altninja/Library/Application\ Support/id-wallet/wallets
rm /Users/altninja/Library/Application\ Support/id-wallet/main-store.json

rm -rf /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/source
rm -rf /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/screens

mkdir /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/screens
mkdir /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/source

node /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/test.js 2
