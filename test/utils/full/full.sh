#!/bin/bash
rm -rf /Users/${1}/Library/Application\ Support/Electron
rm -rf /Users/${1}/Library/Application\ Support/${2}
rm -rf ${3}/Identity-Wallet/out
cd ${3}