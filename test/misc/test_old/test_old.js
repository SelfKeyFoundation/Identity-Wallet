const Application = require("spectron").Application;
const expect = require("chai").expect;
const electron = require("electron");
// const fs = require('fs')
// const assert = require('assert')
const chalk = require("chalk");
const delay = require("delay");
const exec = require("child_process").exec;
const pwd = process.cwd();
const data = require("./data/data.json");
const usr = process.argv[2] || 0;
const platform = process.argv[3] || "local";
const OSENV = process.env.OSENV;
const APP_TITLE = require("../package.json").config.forge.electronPackagerConfig
    .name;
const password = "Y@88@D00!";
const user = require("os").userInfo().username;

// JSON Config - Platforms & Environments
// - Travis (OSX)
// - Appveyor (Windows)
// - Circle (Docker/Linux)
// - Local (Docker)
// - Local (OSX)
// - Local (Linux)
// - Local (Windows)

// const exec = require('child_process').exec
// const user = require('os').userInfo().username
// const appName = require('../package.json').config.forge.electronPackagerConfig.name

// var conf = []
// conf = [
//   {
//     "os": "osx",
//     "platform": "travis",
//     "remove": [
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/wallets",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/wallets",
//       "rm /Users/"+user+"/Library/Application\ Support/Electron/main-store.json",
//       "rm /Users/"+user+"/Library/Application\ Support/"+appName+"/main-store.json",
//     ]
//   },
//   {
//     "os": "osx",
//     "platform": "local",
//     "remove": [
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/wallets",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/wallets",
//       "rm /Users/"+user+"/Library/Application\ Support/Electron/main-store.json",
//       "rm /Users/"+user+"/Library/Application\ Support/"+appName+"/main-store.json",
//     ]
//   }
// ]

// function newPreInit(config) {
//   return new Promise((rs,rj) => {
//     // console.log(config)
//     for (var i = config.length - 1; i >= 0; i--) {
//       var remove = config[i].remove
//       // console.log(remove)
//       for (var j = remove.length - 1; j >= 0; j--) {
//         // console.log(remove.length)
//         console.log(remove[j])
//         var rstr = '"'+remove[j]+'"'
//         exec(remove[j], err => {
//           if (err) console.log(err)
//             console.log('yosh')
//         })
//       }
//     }
//   })
// }

// newPreInit(conf)

// New Pre Init
// exec for loop of config rm commands WIP
// remove all shell files WIP

// Pre-Init TDL
// ************
// Check Platform
// Check ENV
// Clear Cache
// Set App Path

// Other TDL
// *********
// Integrate Chai
// New Builder / Choose?
// Source Cap Save Location
// Screen Cap Save Location
// Review All Delay / Timeout Settings
// Cleanup / Improve Test Data
// Send Artifacts / Logs

var appPath, cacheCmd;
if (OSENV === "osx") {
    appPath =
        pwd +
        "/out/" +
        APP_TITLE +
        "-darwin-x64/" +
        APP_TITLE +
        ".app/Contents/MacOS/" +
        APP_TITLE;
    cacheCmd =
        "bash " +
        pwd +
        "/test/utils/" +
        OSENV +
        "/" +
        platform +
        ".sh " +
        user +
        " " +
        APP_TITLE;
} else if (OSENV === "win") {
    appPath = pwd + "\\out\\id-wallet-win32-ia32\\" + APP_TITLE + ".exe";
    cacheCmd =
        "bash " +
        pwd +
        "\\test\\utils\\" +
        OSENV +
        "\\" +
        platform +
        ".sh " +
        user +
        " " +
        APP_TITLE;
} else if (OSENV === "lin") {
    appPath = pwd + "/out/" + APP_TITLE + "-linux-x64/" + APP_TITLE;
    cacheCmd =
        "bash " +
        pwd +
        "/test/utils/" +
        OSENV +
        "/" +
        platform +
        ".sh " +
        user +
        " " +
        APP_TITLE;
}

// const app = new Application({
//   path: appPath
// })

function preInit() {
    return new Promise((resolve, reject) => {
        if (platform && OSENV) {
            exec(cacheCmd, err => {
                if (err) {
                    reject(
                        console.log(
                            chalk.red("Pre-Init Failed With Error: "),
                            err
                        )
                    );
                } else {
                    resolve(console.log(chalk.green("Pre-Init Success")));
                }
            });
        } else {
            resolve(
                console.log(
                    chalk.blue(
                        "Skip Pre-Init - Missing Platform and/or Environment Configuration"
                    )
                )
            );
        }
    });
}

function init(testName) {
    return new Promise((resolve, reject) => {
        app.start().then(() => {
            app.client
                .waitUntilWindowLoaded()
                .then(() =>
                    app.webContents.savePage(
                        "test/caps/source/index.html",
                        "HTMLComplete"
                    )
                )
                .then(() =>
                    resolve(console.log(chalk.green("Start: " + testName)))
                )
                .catch(err => {
                    reject(err);
                });
        });
    });
}

// function regStep(app, selector, delayTime) {
//   console.log(app)
//   return new Promise((resolve, reject) => {
//     console.log(app)
//     delay(1000)
//       .then(() => {
//         console.log(app)
//         app.client.waitForVisible(selector, 15000)
//       })
//       .then(() => app.client.click(selector))
//       .then(() => resolve(console.log(chalk.green(selector + ' Step Done'))))
//       .catch(err => {
//         reject(err)
//       })
//   })
// }

function clipboardCheck(check) {
    return new Promise((resolve, reject) => {
        app.electron.clipboard
            .readText()
            // .then(cbt => assert.equal(cbt, check))
            .then(() =>
                resolve(console.log(chalk.green("Clipboard Check : " + check)))
            )
            .catch(err => {
                reject(err);
            });
    });
}

// function writer(savePath, img) {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(savePath, img, err => {
//       if (err) reject(err)
//       resolve(savePath + 'Saved')
//     })
//   })
// }

// function screenshotCheck(fileName) {
//   return new Promise((resolve, reject) => {
//     delay(1000)
//       .then(() =>
//         app.browserWindow
//           .capturePage()
//           .then(img => writer(pwd + '/test/caps/screen/' + fileName, img))
//           .then(() =>
//             resolve(console.log(chalk.green('Screencap Done ' + fileName)))
//           )
//       )
//       .catch(err => {
//         reject(err)
//       })
//   })
// }

function dashboardTest() {
    return new Promise((resolve, reject) => {
        regStep("#goToDashboard")
            // Check ETH Address Value
            .then(() => regStep("#eth-copy", 500))
            .then(() => clipboardCheck(data[usr].pubKey))
            // Check KEY Addres Value
            .then(() => regStep("#key-copy", 500))
            .then(() => clipboardCheck(data[usr].pubKey))
            // Check Navbar works
            .then(() => regStep("#navLink"))
            // Check Navbar Links Work
            .then(() => regStep("#aboutLink"))
            .then(() => regStep("#helpLink"))
            // Check Transaction History for a correct value
            // Send ETH
            // Send KEY
            // Airdrop Test
            .then(() =>
                resolve(console.log(chalk.green("Dashboard Test Done")))
            )
            .catch(err => {
                reject(err);
            });
    });
}

function passwordTest(password) {
    return new Promise((resolve, reject) => {
        const c = app.client;
        delay(1000)
            // 2x Password
            .then(() => c.waitForVisible("#pw1", 10000))
            .then(() => c.setValue("#pw1", password))
            .then(() => c.setValue("#pw2", password))
            .then(() => c.click("#next"))
            // Confirm Password
            .then(() =>
                delay(1000).then(() =>
                    c.waitForVisible("#generateWallet", 10000)
                )
            )
            .then(() => c.setValue("#pw3", password))
            .then(() => c.click("#generateWallet"))
            .then(() => resolve(console.log(chalk.green("Add Password Done"))))
            .catch(err => {
                reject(err);
            });
    });
}

function checkPubKey() {
    return new Promise((resolve, reject) => {
        const c = app.client;
        delay(1000)
            .then(() => c.waitForVisible("#dl", 10000))
            // get text
            // assert vs ?
            // click download
            // .then(() => c.click('#dl'))
            // click next
            .then(() => delay(1000).then(() => c.click("#next")))
            .then(() =>
                resolve(console.log(chalk.green("Check Publick Key Done")))
            )
            .catch(err => {
                reject(err);
            });
    });
}

function printWalletTest() {
    return new Promise((resolve, reject) => {
        const c = app.client;
        delay(1000)
            // .then(() => screenshotCheck('print.png'))
            .then(() => c.waitForVisible("#next2", 10000))
            // get text
            // assert vs ?
            // click next
            .then(() => c.click("#next2"))
            .then(() => console.log(chalk.green("Next All Good")))
            .then(() => resolve("done"))
            .catch(err => {
                reject(err);
            });
    });
}

function uploadKycTest() {
    return new Promise((resolve, reject) => {
        const c = app.client;
        c
            .waitForExist("#uploadKyc", 15000)
            // .then(() => screenshotCheck('upload.png'))
            // .then(() => c.element('#uploadKyc').keys(pwd + '/test/data/' + usr + '.zip'))
            // .then(() => c.chooseFile('#uploadKyc', pwd + '/test/data/' + usr + '.zip'))
            .then(() => c.click("#uploadKyc", 10000))
            // post anything to localhost:3333/ get 200 go to dashboard
            // local storage checks file
            // make new zip file from public key and other test data
            // name: store.wallets[key].name,
            // keystoreFilePath: store.wallets[key].keystoreFilePath,
            // publicKey: key
            .then(() =>
                resolve(console.log(chalk.green("Upload KYC All Good")))
            )
            .catch(err => {
                reject(err);
            });
    });
}

function importWalletTest(fileName) {
    return new Promise((resolve, reject) => {
        delay(1500)
            // .then(() => screenshotCheck('import.png'))
            .then(() => regStep("#restoreWallet"))
            .then(() => resolve(chalk.green("Import Button Test Done")))
            .catch(err => {
                reject(err);
            });
    });
}

function selectPrivateKey() {
    return new Promise((resolve, reject) => {
        // Choose Import -> Private Key (Ignore other options for now, lack test data)
        // Select Private Key Radio Button
        // Select Private Key Text Area
        // Add Value For Private Key Text Area
        // Submit Private Key
        const c = app.client;
        delay(1000)
            // .then(() => screenshotCheck('private.png'))
            .then(() => c.waitForExist("#pkey", 10000))
            .then(() => c.click("#pkey"))
            .then(() => c.click("#keyarea"))
            .then(() => c.setValue("#keyarea", data[usr].privKey))
            .then(() => c.click("#pkyunlock"))
            .then(() =>
                resolve(
                    console.log(
                        chalk.green("Select And Add Private Key Test Done")
                    )
                )
            )
            .catch(err => {
                reject(err);
            });
    });
}

// UPDATE: BASIC ID FLOW
function mbeforeEach() {
    var appPath;
    if (OSENV === "osx") {
        appPath =
            pwd +
            "/out/" +
            APP_TITLE +
            "-darwin-x64/" +
            APP_TITLE +
            ".app/Contents/MacOS/" +
            APP_TITLE;
    } else if (OSENV === "win") {
        appPath = pwd + "\\out\\id-wallet-win32-ia32\\" + APP_TITLE + ".exe";
    } else if (OSENV === "lin") {
        appPath = pwd + "/out/" + APP_TITLE + "-linux-x64/" + APP_TITLE;
    }
    if (OSENV) {
        exec(
            "bash " +
                pwd +
                "/test/utils/" +
                OSENV +
                "/local.sh " +
                user +
                " " +
                APP_TITLE,
            err => {
                if (err) {
                    return console.log(
                        chalk.red("Pre-Init Failed With Error: "),
                        err
                    );
                } else {
                    console.log(chalk.green("Pre-Init Success"));
                    this.timeout(10000);
                    this.app = new Application({
                        path: appPath,
                        args: ["."],
                        startTimeout: 10000,
                        waitTimeout: 10000
                    });
                    return this.app.start();
                }
            }
        );
    } else {
        console.log(
            chalk.blue(
                "Skip Pre-Init - Missing Platform and/or Environment Configuration"
            )
        );
        this.timeout(10000);
        this.app = new Application({
            path: appPath,
            args: ["."],
            startTimeout: 10000,
            waitTimeout: 10000
        });
        return this.app.start();
    }
}

function beforeEEch() {
    this.timeout(10000);
    this.app = new Application({
        path:
            pwd +
            "/out/" +
            APP_TITLE +
            "-darwin-x64/" +
            APP_TITLE +
            ".app/Contents/MacOS/" +
            APP_TITLE,
        args: ["."],
        startTimeout: 10000,
        waitTimeout: 10000
    });
    return this.app.start();
}

function mafterEach() {
    this.timeout(10000);
    if (this.app && this.app.isRunning()) {
        return this.app.stop();
    }
    return undefined;
}

describe("application launch", () => {
    // function regStep(app, selector, delayTime) {
    //   console.log(app)
    //   return new Promise((resolve, reject) => {
    //     console.log(app)
    //     delay(1000)
    //       .then(() => {
    //         this.app.client.waitForVisible(selector, 15000)
    //       })
    //       .then(() => this.app.client.click(selector))
    //       .then(() => resolve(console.log(chalk.green(selector + ' Step Done'))))
    //       .catch(err => {
    //         reject(err)
    //       })
    //   })
    // }
    describe("its the first tst", () => {
        // beforeEach(beforeEEch)
        afterEach(mafterEach);
        it("Runs Create New Wallet With Basic ID Details", () => {
            const app = new Application({
                path:
                    pwd +
                    "/out/" +
                    APP_TITLE +
                    "-darwin-x64/" +
                    APP_TITLE +
                    ".app/Contents/MacOS/" +
                    APP_TITLE
            });
            // init('Create New Wallet With Password')
            //   // TOC Confirm
            //   .then(() =>
            //console.log(app)
            app.client.waitForVisible("#agree").then(() => {
                app.client.click("#agree");
            });
            // return this.app.client.waitForVisible('#agree', 15000)
            // .then(() => this.app.client.click("#agree"))
            // .then(() => console.log(chalk.green('#agree' + ' Step Done')))
            // .catch(err => {
            //   return err
            // })
            // regStep(app,'#agree', 3000)
            // // Setup Wallet
            // .then(() => regStep(app, '#setupWallet'))
            // // Click Create New Wallet
            // .then(() => regStep(app, '#createWallet'))
            // // Set Password
            // .then(() => passwordTest(password))
            // // Check PubKey
            // .then(() => checkPubKey())
            // // Check PrivKey
            // .then(() => printWalletTest())
            // // Upload KYC Docs
            // .then(() => uploadKycTest())
            // // Dashboard
            // .then(() => dashboardTest())
            // .then(() =>
            //   resolve(console.log(chalk.green('Create New Wallet Tests Done')))
            // )
            // .catch(err => {
            //   reject(err)
            // })
        });
    });
});

// Create New Wallet
// *****************
// function createNewWalletTest() {
//   return new Promise((resolve, reject) => {
//     init('Create New Wallet With Password')
//       // TOC Confirm
//       .then(() => regStep('#agree', 3000))
//       // Setup Wallet
//       .then(() => regStep('#setupWallet'))
//       // Click Create New Wallet
//       .then(() => regStep('#createWallet'))
//       // Set Password
//       .then(() => passwordTest(password))
//       // Check PubKey
//       .then(() => checkPubKey())
//       // Check PrivKey
//       .then(() => printWalletTest())
//       // Upload KYC Docs
//       .then(() => uploadKycTest())
//       // Dashboard
//       .then(() => dashboardTest())
//       .then(() =>
//         resolve(console.log(chalk.green('Create New Wallet Tests Done')))
//       )
//       .catch(err => {
//         reject(err)
//       })
//   })
// }

// Keystore Import
// ***************
// function keystoreImportTest() {
//   init()
//     .then(() => console.log(chalk.green('Done')))
//     .then(() => app.stop())
//     .catch(err => {
//       console.log(chalk.red('Test Failed With Error: '), err)
//       app.stop()
//     })
// }

// UPDATE: RESTORE WALLET FLOW

// Private Key Import
// ******************
// function privateKeyImportTest() {
//   return new Promise((resolve, reject) => {
//     init('Import Wallet From Private Key')
//       // TOC Agre
//       .then(() => regStep('#agree'))
//       // Setup Wallet
//       .then(() => regStep('#setupWallet'))
//       // Import Wallet
//       .then(() => importWalletTest())
//       // Select Private Key And Submit
//       .then(() => selectPrivateKey())
//       // Upload KYC Docs
//       .then(() => uploadKycTest())
//       // Dashboard
//       .then(() => dashboardTest())
//       // Complete
//       .then(() =>
//         resolve(console.log(chalk.green('Private Key Import Tests Done')))
//       )
//       .catch(err => {
//         reject(err)
//       })
//   })
// }

// TOC Agree -> Import Key
// TOC Disagree -> Quit / Go Back & Agree
// Help -> External Window
// Quit -> Exit

// Agree TOC
// .then(() => c.waitForExist('#agree', 10000))
// .then(() => console.log(chalk.blue('TOC Agree Loaded')))
// //.then(() => c.execute('window.scrollTo(0, document.body.scrollHeight)'))
// // .then(() => c.execute('arguments[0].scrollIntoView()', 'document.getElementById('#bottom')'))
// // .then(() => c.execute('document.getElementById('#agree').removeAttribute('disabled')'))
// // ** temp removed this from button #agree ** (ng-disabled='!scrolledBottom || storeSavePromise.$$state.status')
// .then(() => c.click('#agree'))
// .then(() => console.log(chalk.green('TOC Agree Test Done')))

// If KYC confirm private key -> Goto Dashboard

// Confirm Private Key
// .then(() => c.waitForExist('#pkycontinue', 10000))
// .then(() => b.capturePage()
//  .then(img => fs.writeFile(pwd + '/test/caps/screen/3.png', img))
// ).then(() => c.click('#pkycontinue'))
// .then(() => console.log(chalk.green('Confirm Private Key Test Done')))

// Add like a reset / pre-init function before each test to delete cached files like in the shell script currently

// function runTests() {
//   return new Promise((resolve, reject) => {
//     console.log(process.env.LOCAL)
//     console.log(process.env.NODE_ENV)
//     preInit()
//       .then(() => privateKeyImportTest())
//       .then(() => app.stop())
//       .then(() => preInit())
//       .then(() => delay(2000))
//       .then(() => createNewWalletTest())
//       .then(() => app.stop())
//       // .then(() => keystoreImportTest())
//       .then(() => resolve(console.log(chalk.green('Tests Passed'))))
//       .catch(err => {
//         reject(console.log(chalk.red('Test Failed With Error: '), err))
//         app.stop()
//       })
//   })
// }

// runTests()
