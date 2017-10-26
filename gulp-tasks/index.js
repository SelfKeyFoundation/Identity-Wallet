module.exports = (gulp, runSequence, watch, path, projConfig, environment) => {
    const packager = require('electron-packager');

    const installerDMG = require('electron-installer-dmg');
    const installerEXE = require('electron-winstaller');
    
    const env = environment || 'default';
    const config = projConfig[env];

    const SRC_DIR = path.resolve(__dirname, '../');

    const BUILD_DIST_DIR = path.resolve(__dirname, "../release/builds");
    const INSTALLER_DIST_DIR = path.resolve(__dirname, "../release/installers");

    const OSX_ICON = path.resolve(__dirname, "../assets/icons/mac/selfkey.icns");
    const OSX_INSTALLER_BG = path.resolve(__dirname, "../assets/backgrounds/mac/installer.jpg");
    const WIN_ICON = path.resolve(__dirname, "../assets/icons/win/selfkey.ico");
    const UNIX_ICON = path.resolve(__dirname, "../assets/icons/png/256x256.png");

    let packagerCommonConfigs = {
        name: config.app.name,
        productName: config.app.productName,
        appVersion: config.app.version,
        dir: SRC_DIR,
        out: BUILD_DIST_DIR,
        overwrite: true,
        ignore: config.package.ignoreFiles
    }

    gulp.task('build:desktop-app:osx64', (done) => {
        runSequence('build:webapp', () => {
            packagerCommonConfigs.platform = "darwin";
            packagerCommonConfigs.arch = "x64";
            packagerCommonConfigs.icon = OSX_ICON;
            packager(packagerCommonConfigs, (err, appPaths) => {
                // create DMG file
                let installerDMGConfigs = {
                    name: config.app.name, 
                    appPath: appPaths[0], 
                    icon: OSX_ICON,
                    background: OSX_INSTALLER_BG,
                    contents: [
                        { "x": 100, "y": 130, "type": "file", "path": appPaths[0] + "/" + config.app.name + ".app" },
                        { "x": 383, "y": 130, "type": "link", "path": "/Applications" }
                    ],
                    overwrite: true, 
                    out: INSTALLER_DIST_DIR
                }
                installerDMG(installerDMGConfigs, (installerDMGError) => { 
                    if(installerDMGError){
                        console.log(installerDMGError);
                    } else {
                        done();    
                    }
                });
            });	
        });
    });

    gulp.task('build:desktop-app:win32', (done) => {
        runSequence('build:webapp', () => {
            packagerCommonConfigs.win32metadata = {
                CompanyName: config.app.companyName,
                FileDescription: config.app.description,
                OriginalFilename: config.app.name,
                ProductName: config.app.productName,
                InternalName: config.app.name
            };
            packagerCommonConfigs.platform = "win32";
            packagerCommonConfigs.arch = "ia32";
            packagerCommonConfigs.icon = WIN_ICON;
            packagerCommonConfigs.asar = false;

            packager(packagerCommonConfigs, (err, appPaths) => {
                console.log(appPaths)

                installerEXE.createWindowsInstaller({
                    title: config.app.title,
                    name: config.app.name,
                    exe: config.app.name + ".exe",
                    description: config.installer.description,
                    version: config.app.version,
                    authors: config.app.authors,

                    setupExe: config.installer.win.name,
                    appDirectory: appPaths[0],
                    outputDirectory: INSTALLER_DIST_DIR,
                    
                    //certificateFile: 'test-cert.p12',
                    //certificatePassword: 'xxxxxxxx',
                    
                    iconUrl: config.installer.win.iconUrl, // 'http://www.iconsdb.com/icons/download/orange/lock-multi-size.ico', // TEMP
                    setupIcon: WIN_ICON,
                    skipUpdateIcon: config.installer.win.skipUpdateIcon // true,
                }).then((error) => {
                    if(error){
                        console.log(error)
                    }else{
                        done();
                    }
                });
            });
        });
    });

    gulp.task('build:desktop-app:ubuntu', (done) => {
        runSequence('build:webapp', () => {
            packagerCommonConfigs.platform = "linux";
            packagerCommonConfigs.arch = "x64";
            packagerCommonConfigs.asar = true;
            packager(packagerCommonConfigs, (err, appPaths) => {
                const installerDEB = require('electron-installer-debian');
                installerDEB({
                    src: appPaths[0],
                    dest: INSTALLER_DIST_DIR,
                    arch: 'amd64',
                    description: config.app.description,
                    productDescription: config.app.description
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

    gulp.task('build:desktop-app:redhat', (done) => {
        runSequence('build:webapp', () => {
            packagerCommonConfigs.platform = "linux";
            packagerCommonConfigs.arch = "x64";
            packagerCommonConfigs.description = "x64";
            packager(packagerCommonConfigs, (err, appPaths) => {
                const installerRPM = require('electron-installer-redhat');
                installerRPM({
                    src: appPaths[0],
                    dest: INSTALLER_DIST_DIR,
                    arch: "x86_64",
                    description: "test desc",
                    license: "test",
                    group: "test",
                    icon: UNIX_ICON,
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