'use strict'
const { app, dialog } = require('electron')
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');

function appUpdater() {

    autoUpdater.logger = log
     
    // Ask the user if update is available
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.'
        if (releaseNotes) {
            const splitNotes = releaseNotes.split(/[^\r]\n/)
            message += '\n\nRelease notes:\n'
            splitNotes.forEach(notes => {
                message += notes + '\n\n'
            })
        }
        // Ask user to update the app
        dialog.showMessageBox({
            type: 'question',
            buttons: ['Install and Relaunch', 'Later'],
            defaultId: 0,
            message: 'A new version of ' + app.getName() + ' has been downloaded',
            detail: message
        }, response => {
            if (response === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 1)
            }
        })
    })
    // init for updates
    autoUpdater.checkForUpdatesAndNotify()
}

module.exports = {
    appUpdater
}
