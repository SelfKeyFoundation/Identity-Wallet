module.exports = (gulp, runSequence, watch, path) => {
    const packager = require('electron-packager');

    const installerDMG = require('electron-installer-dmg');
    const installerEXE = require('electron-winstaller');
    const installerDEB = require('electron-installer-debian');

    const APP_NAME = "KYC Wallet";
    const SRC_DIR = path.resolve(__dirname, '../');
    const DIST_DIR = path.resolve(__dirname, "../release-builds");

    const OSX_ICON = path.resolve(__dirname, "../src/icons/mac/icon.icns");
    const OSX_INSTALLER_BG = path.resolve(__dirname, "../src/icons/mac/mac-osx-installer-bg_3.jpg");

    const WIN_ICON = path.resolve(__dirname, "../src/icons/selfkey.ico");

    gulp.task('build:desktop-app:osx64', function (done) {
        runSequence('build:webapp', 'move:webapp', function() {
            packager({
                name: APP_NAME,
                dir: SRC_DIR,
                prune: true,
                arch: "x64",
                platform: "darwin",
                overwrite: true,
                out: DIST_DIR,
                icon: OSX_ICON
            }, function (err, appPaths) {
                // create DMG file
                var installerDMGConfigs = {
                    icon: OSX_ICON,
                    name: APP_NAME, 
                    appPath: appPaths[0], 
                    background: OSX_INSTALLER_BG,
                    contents: [
                        { "x": 100, "y": 130, "type": "file", "path": DIST_DIR + '/' + APP_NAME + '-darwin-x64/' + APP_NAME + ".app" },
                        { "x": 383, "y": 130, "type": "link", "path": "/Applications" }
                    ],
                    overwrite: true, 
                    out: DIST_DIR
                }
                installerDMG(installerDMGConfigs, function (installerDMGError) { 
                    if(installerDMGError){
                        console.log(installerDMGError);
                    } else {
                        done();    
                    }
                });
            });	
        });
    });

    gulp.task('build:desktop-app:win32', function (done) {
        runSequence('build:webapp', 'move:webapp', function() {
            packager({
                name: APP_NAME,
                dir: SRC_DIR,
                prune: true,
                arch: "ia32",
                platform: "win32",
                overwrite: true,
                out: DIST_DIR,
                icon: OSX_ICON
            }, function (err, appPaths) {
                installerEXE.createWindowsInstaller({
                    title: "Selfkey Wallet",
                    name: "SelfkeyWallet", //"org.selfkey.wallet",
                    appDirectory: appPaths[0],
                    outputDirectory: DIST_DIR,
                    description: "Selfkey",
                    version: "0.0.1",
                    authors: "Selfkey",
                    exe: APP_NAME + '.exe',
                    setupExe: APP_NAME + '.exe',
                    setupMsi: APP_NAME + '.msi',
                    iconUrl: 'http://www.iconeasy.com/icon/ico/Object/Nova/Settings.ico', // WIN_ICON, //
                    setupIcon: WIN_ICON
                }).then(function(error){
                    if(error){
                        console.log(error)
                    }else{
                        done();
                    }
                });
            });
        });
    });

    gulp.task('build:desktop-app:deb', function (done) {
        runSequence('build:webapp', 'move:webapp', function() {
            packager({
                name: APP_NAME,
                dir: SRC_DIR,
                prune: true,
                arch: "x64",
                platform: "linux",
                overwrite: true,
                out: DIST_DIR,
                icon: OSX_ICON
            }, function (err, appPaths) {
                installerDEB({
                    src: appPaths[0],
                    dest: DIST_DIR,
                    arch: 'amd64',
                    description: "Test Description",
                    productDescription: "Test Product Description"
                }, function(error){
                    if(error){
                        console.log(error)
                    }else{
                        done();
                    }
                });
            });
        });
    });

    gulp.task('build:desktop-app:all', function (done) {
        runSequence('build:webapp', 'move:webapp', function() {
            packager({
                name: APP_NAME,
                dir: SRC_DIR,
                all: true,
                overwrite: true,
                out: DIST_DIR,
                icon: OSX_ICON
            }, function done_callback (err, appPaths) {
                done();
            });	
        });
    });
};