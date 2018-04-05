#!/bin/bash
rm -rf /Users/${1}/Library/Application\ Support/Electron
rm -rf /Users/${1}/Library/Application\ Support/ID\ Wallet
rm -rf /Users/${1}/Library/Application\ Support/id-wallet
rm -rf ${2}/Identity-Wallet/out
cd ${2}
exit 0