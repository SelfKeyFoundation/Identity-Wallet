#!bin/bash
rm -rf /Users/altninja/Library/Application\ Support/Electron/documents
rm -rf /Users/altninja/Library/Application\ Support/Electron/wallets
rm -rf /Users/altninja/Library/Application\ Support/ID\ Wallet/documents
rm -rf /Users/altninja/Library/Application\ Support/ID\ Wallet/wallets
rm /Users/altninja/Library/Application\ Support/ID\ Wallet/main-store.json
rm /Users/altninja/Library/Application\ Support/Electron/main-store.json
rm -rf /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/source
rm -rf /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/screens
mkdir /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/screens
mkdir /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/caps/source
node /Users/altninja/code/selfkey/wallets/Identity-Wallet/test/test.js 2
