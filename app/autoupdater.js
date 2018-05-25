'use strict';

const os = require('os');
const { app, autoUpdater, dialog } = require('electron');
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64
const config = require('./config');
const updaterServerUrl = config.updateEndpoint;

const updaterFeedURL = `${updaterServerUrl}${platform}/${version}`;
const DOMAIN = 'https://selfkey-releases.storage.googleapis.com';
const suffix = process.platform === 'darwin' ? `/RELEASES.json?method=JSON&version=${app.getVersion()}` : '';

function appUpdater() {
    autoUpdater.setFeedURL({
      url: `${DOMAIN}/SelfKey-Desktop-Identity-Wallet/ea788838ccc9eb63676dd2da87772850/${process.platform}/${process.arch}${suffix}`,
      serverType: 'json',
    });	
    /* Log whats happening
	TODO send autoUpdater events to renderer so that we could console log it in developer tools
	You could alsoe use nslog or other logging to see what's happening */
    autoUpdater.on('error', err => console.log(err));
    autoUpdater.on('checking-for-update', () => console.log('checking-for-update'));
    autoUpdater.on('update-available', () => console.log('update-available'));
    autoUpdater.on('update-not-available', () => console.log('update-not-available'));

    // Ask the user if update is available
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.';
        if (releaseNotes) {
            const splitNotes = releaseNotes.split(/[^\r]\n/);
            message += '\n\nRelease notes:\n';
            splitNotes.forEach(notes => {
                message += notes + '\n\n';
            });
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
                setTimeout(() => autoUpdater.quitAndInstall(), 1);
            }
        });
    });
    // init for updates
    autoUpdater.checkForUpdates();
}

module.exports = {
    appUpdater
};

