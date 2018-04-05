#!bin/bash
quicky() {
	rm -rf /Users/${1}/Library/Application\ Support/Electron/documents
	rm -rf /Users/${1}/Library/Application\ Support/Electron/wallets
	rm -rf /Users/${1}/Library/Application\ Support/${2}/documents
	rm -rf /Users/${1}/Library/Application\ Support/${2}/wallets
	rm /Users/${1}/Library/Application\ Support/Electron/main-store.json
	rm /Users/${1}/Library/Application\ Support/${2}/main-store.json
	exit 0
}
quicky $1 $2
