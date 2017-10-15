module.exports = (gulp, runSequence, watch, path) => {
    const packager = require('electron-packager');

    const installerDMG = require('electron-installer-dmg');
    const installerEXE = require('electron-winstaller');
    const installerDEB = require('electron-installer-debian');

    const APP_NAME = "KYC Wallet";
    const SRC_DIR = path.resolve(__dirname, '../');

    const BUILD_DIST_DIR = path.resolve(__dirname, "../release/builds");
    const INSTALLER_DIST_DIR = path.resolve(__dirname, "../release/installers");

    const OSX_ICON = path.resolve(__dirname, "../assets/icons/mac/selfkey.icns");
    const OSX_INSTALLER_BG = path.resolve(__dirname, "../assets/backgrounds/mac/installer.jpg");
    const WIN_ICON = path.resolve(__dirname, "../assets/icons/win/selfkey.ico");

    gulp.task('build:desktop-app:osx64', function (done) {
        runSequence('build:webapp', function() {
            packager({
                name: APP_NAME,
                dir: SRC_DIR,
                arch: "x64",
                platform: "darwin",
                overwrite: true,
                out: BUILD_DIST_DIR,
                icon: OSX_ICON,
                ignore: [
                    "gulp-tasks",
                    "release",
                    "wallet-desktop-app",
                    "config.json",
                    "config.template",
                    "Dockerfile-builder",
                    "gulpfile.js",
                    "package-lock.json",
                    "README.md",
                    "wallet-web-app/Dockerfile",
                    "wallet-web-app/node_modules",
                    "wallet-web-app/src",
                ]
            }, function (err, appPaths) {
                // create DMG file
                var installerDMGConfigs = {
                    icon: OSX_ICON,
                    name: APP_NAME, 
                    appPath: appPaths[0], 
                    background: OSX_INSTALLER_BG,
                    contents: [
                        { "x": 100, "y": 130, "type": "file", "path": BUILD_DIST_DIR + '/' + APP_NAME + '-darwin-x64/' + APP_NAME + ".app" },
                        { "x": 383, "y": 130, "type": "link", "path": "/Applications" }
                    ],
                    overwrite: true, 
                    out: INSTALLER_DIST_DIR
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
        runSequence('build:webapp', function() {
            packager({
                name: APP_NAME,
                productName: APP_NAME,
                win32metadata: {
                    CompanyName: "KYC Chain",
                    FileDescription: APP_NAME,
                    OriginalFilename: APP_NAME,
                    ProductName: APP_NAME,
                    InternalName: APP_NAME
                },
                appVersion: "0.0.2",
                dir: SRC_DIR,
                prune: true,
                arch: "ia32",
                platform: "win32",
                overwrite: true,
                out: BUILD_DIST_DIR,
                icon: WIN_ICON,
                asar: true,
                ignore: [
                    "gulp-tasks",
                    "release",
                    "wallet-desktop-app",
                    "config.json",
                    "config.template",
                    "Dockerfile-builder",
                    "gulpfile.js",
                    "package-lock.json",
                    "README.md",
                    "wallet-web-app/Dockerfile",
                    "wallet-web-app/node_modules",
                    "wallet-web-app/src",
                ]
            }, function (err, appPaths) {
                console.log(appPaths)

                installerEXE.createWindowsInstaller({
                    title: APP_NAME,
                    name: "SelfkeyWallet", //"org.selfkey.wallet",
                    
                    appDirectory: appPaths[0],
                    exe: APP_NAME + '.exe',

                    authors: APP_NAME,
                    description: APP_NAME,
                    version: "0.0.1",

                    outputDirectory: INSTALLER_DIST_DIR,
                    
                    //certificateFile: 'test-cert.p12',
                    //certificatePassword: 'xxxxxxxx',
                    
                    setupExe: APP_NAME + '.exe',
                    //setupMsi: APP_NAME + '.msi',
                    //noMsi: false,

                    iconUrl: 'http://www.iconsdb.com/icons/download/orange/lock-multi-size.ico', // TEMP
                    setupIcon: WIN_ICON,
                    skipUpdateIcon: true,
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
        runSequence('build:webapp', function() {
            packager({
                name: APP_NAME,
                dir: SRC_DIR,
                prune: true,
                arch: "x64",
                platform: "linux",
                overwrite: true,
                out: BUILD_DIST_DIR,
                icon: OSX_ICON,
                ignore: [
                    "gulp-tasks",
                    "release",
                    "wallet-desktop-app",
                    "config.json",
                    "config.template",
                    "Dockerfile-builder",
                    "gulpfile.js",
                    "package-lock.json",
                    "README.md",
                    "wallet-web-app/Dockerfile",
                    "wallet-web-app/node_modules",
                    "wallet-web-app/src",
                ]
            }, function (err, appPaths) {
                installerDEB({
                    src: appPaths[0],
                    dest: INSTALLER_DIST_DIR,
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
};