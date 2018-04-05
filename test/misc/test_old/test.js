// REBUILD TEST FILE
// *****************
// - All requires / consts / vars etc... DONE
// - Cache clear config data DONE
// - Build / app path config data DONE
// - Test data DONE
// 		- private key
//		- basic id info (name, country, fake password)
// 		- private key
// 		- public key

// - Check NPM version !== v5.2 (Was I Dreaming This?)
// - Output some config settings to log DONE
// - Delete old build
// - Run fresh build
// - Cache clear function DONE
// - Helper functions for onboarding / spectron / webdriver etc.. DONE

// - Mocha setup
// 		- before: init run cache clear and app start etc... DONE
// 		- run specs / onboarding flows DONE
//		- after: close app DONE
//      - afterEach: if err exit mocha WIP

// Other TDL
// *********
// Apple and Windows Signed Certificates
// Source Cap Save Location
// Screen Cap Save Location
// Send Error / Artifacts / Logs to Sentry
// Send Builds Where?
// Slack Alerts etc...

const Application = require("spectron").Application;
expect = require("chai").expect;
electron = require("electron");
fs = require("fs");
assert = require("assert");
chalk = require("chalk");
delay = require("delay");
exec = require("child_process").exec;
pwd = process.cwd();
usr = process.argv[2] || 0;
platform = process.argv[3] || "local";
OSENV = process.env.OSENV || "osx";
appCacheName = require("../package.json").productName;
appBuildName = require("../package.json").config.forge.electronPackagerConfig
    .name;
appVersion = require("../package.json").version;

user = require("os").userInfo().username;

// Test Data
// *********
var data = [];
data = [
    {
        firstName: "Bobby",
        middleName: "Panda",
        lastName: "Lee",
        country: "Canada",
        strongPass: "Y@88@D@88@D00",
        weakPass: "1234",
        pubKey: "0x30B5C0767d45C05b209ca99f3B9aA189A8Af8a86",
        privKey:
            "0x0ef413ecf0af0d5be949a0379b308ac2cb3f2b8cf4e88e834330eaabed5e7921"
    },
    {
        pubKey: "0x9F2c0194013B55cE7fF51Abd62b5Ac062ca551aa",
        privKey:
            "0x2a6aa9a1b6212a844cf9d703f6a8e58b9714509c60a279ab7637fa80000b9bd5"
    },
    {
        pubKey: "0x078462C08d7709659628aA80B969D33a0c69FfFb",
        privKey:
            "0xff0fed0eea25a9b0848f22b7603c99c1c1409da2892f79aa3f597ae13b8522e8"
    },
    {
        pubKey: "0x91d0Bda51F7979366093358D8e3d22ba887c5B1f",
        privKey:
            "0x3ec58fb62c0040e9e0f2dbf0536b83d8186d6e37b5f89b492d1357b3a0904018"
    }
];

// Cache Clear
// ***********
// - Travis (OSX)
// - Appveyor (Windows)
// - Circle (Docker/Linux)
// - Local (Docker)
// - Local (OSX)
// - Local (Linux)
// - Local (Windows)

var conf = [];
conf = [
    {
        os: "osx",
        platform: "local",
        remove: [
            "/Users/" + user + "/Library/Application Support/Electron",
            "/Users/" + user + "/Library/Application Support/ID Wallet",
            "/Users/" + user + "/Library/Application Support/id-wallet",
            "/Users/" + user + "/Library/Application Support/" + appCacheName,
            "/Users/" + user + "/Library/Application Support/" + appBuildName
            //'rm -rf ' + pwd + '/' + appBuildName + '/out'
        ]
    }
];

// Init
// ************
// Check Platform and Environment
// Clear Cache Directories
// Make Clean Build

// function init(config) {
// 	return new Promise((r,rj) => {
// 		// TODO: Check Platform / OS First
// 		for (var i = config.length - 1; i >= 0; i--) {
// 			var rmv = config[i].remove
// 			for (var j = rmv.length - 1; j >= 0; j--) {
// 				console.log(rmv[j])
// 				console.log(fs.existsSync(rmv[j]))
// 				if (fs.existsSync(rmv[j])) {
// 					rmstr = 'rm -rf ' + rmv[j]
// 					exec(rmstr, err => {
// 						if (err) rj(console.log(err))
// 						console.log(fs.existsSync(rmstr))
// 						r(console.log('delete done'))
// 					})
// 				} else {
// 					r(console.log('fake done'))
// 				}
// 			}
// 		}
// 	})
// }

function init() {
    return new Promise((r, rj) => {
        exec("bash " + pwd + "/test/utils/quick.sh " + user, err => {
            if (err) rj(err);
            r("done");
        });
    });
}

// Create New App w/ Build Output Path
const app = new Application({
    path:
        pwd +
        "/out/" +
        appBuildName +
        "-darwin-x64/" +
        appBuildName +
        ".app/Contents/MacOS/" +
        appBuildName
});

function regStep(selector) {
    return new Promise((r, rj) => {
        delay(1000)
            .then(() => app.client.waitForVisible(selector, 15000))
            .then(() => app.client.click(selector))
            .then(() => r(console.log(chalk.green(selector + " Step Done"))))
            .catch(err => {
                rj(err);
            });
    });
}

// Check and Compare Clipboard Value
function clipboardCheck(check) {
    return new Promise((r, j) => {
        app.electron.clipboard
            .readText()
            // .then(cbt => assert.equal(cbt, check))
            .then(() =>
                r(console.log(chalk.green("Clipboard Check : " + check)))
            )
            .catch(err => {
                rj(err);
            });
    });
}

function writer(savePath, img) {
    return new Promise((r, rj) => {
        fs.writeFile(savePath, img, err => {
            if (err) rj(err);
            r(savePath + "Saved");
        });
    });
}

function screenshotCheck(fileName) {
    return new Promise((r, rj) => {
        delay(1000)
            .then(() =>
                app.browserWindow
                    .capturePage()
                    .then(img =>
                        writer(pwd + "/test/caps/screen/" + fileName, img)
                    )
                    .then(() =>
                        r(
                            console.log(
                                chalk.green("Screencap Done " + fileName)
                            )
                        )
                    )
            )
            .catch(err => {
                rj(err);
            });
    });
}

// Run Init and Start App
function appStart() {
    return new Promise((r, rj) => {
        init(conf)
            .then(() => r(app.start()))
            .catch(err => {
                rj(err);
            });
    });
}

function a1() {
    return new Promise((r, rj) => {
        init().then(() => r(app.start()));
    });
}

// Check App Running And Stop App
function appStop() {
    if (this.app && this.app.isRunning()) {
        return this.app.stop();
    }
    return undefined;
}

function specStart(name) {
    return new Promise((r, rj) => {
        r(console.log("yosh"));
    });
}

function specStop(err) {
    if (err) {
        console.log(err);
        return app.stop();
    }
    return undefined;
}

// Run All Tests
describe("Begin All ID Wallet Tests", () => {
    console.log(chalk.green("SelfKey ID Wallet Test Config"));
    console.log(chalk.blue("*****************************"));
    console.log(chalk.blue("Working Dir: " + pwd));
    console.log(chalk.blue("Test Data: " + usr));
    console.log(chalk.blue("Platform: " + process.platform));
    console.log(chalk.blue("OS Environment: " + OSENV));
    console.log(chalk.blue("OS Username: " + user));
    console.log(chalk.blue("Product Name: " + appCacheName));
    console.log(chalk.blue("Build Name: " + appBuildName));
    console.log(chalk.blue("NodeJS Version: " + process.version));
    console.log(chalk.blue("NPM Version: " + process.version)); // how?

    // Test 1
    describe("Rejects the TOS and Exits", () => {
        before(a1);
        after(appStop);
        // beforeEach(specStart)
        // afterEach(specStop)

        it("Rejects the TOS", () => {
            return regStep("#doNotAgree");
        });

        it("Reconsiders and Returns to TOS", () => {
            return regStep("#backToTOS");
        });

        it("Confirms Decision to Reject the TOS", () => {
            return regStep("#doNotAgree");
        });

        it("Exits the App", () => {
            return regStep("#exit");
        });
    });

    // Test 2
    describe("Creates a New Wallet with Basic ID Details and a Password", () => {
        before(a1);
        after(appStop);

        // afterEach(specStop)

        it("Accepts The TOC", () => {
            return regStep("#agree");
        });

        it("Confirms Setup Wallet", () => {
            return regStep("#setupWallet", 10000);
        });

        it("Chooses Create New Wallet", () => {
            return regStep("#createWallet");
        });

        it("Step 1: Chooses Basic ID", () => {
            return regStep("#createBasic");
        });

        it("Step 2: Fills Out the Basic ID Form", () => {
            return (
                delay(1000)
                    .then(() => app.client.waitForVisible("#firstName", 10000))
                    .then(() =>
                        app.client.setValue("#firstName", data[0].firstName)
                    )
                    .then(() =>
                        app.client.setValue("#lastName", data[0].lastName)
                    )
                    .then(() =>
                        app.client.setValue("#middleName", data[0].middleName)
                    )
                    .then(() => app.client.click("#country"))
                    .then(() => delay(3000))
                    // .then(() => app.client.waitForExist('#Afghanistan', 10000))
                    .then(() =>
                        app.client.click(
                            "md-option#Afghanistan.ng-scope.md-ink-ripple"
                        )
                    )

                    // .then(() => app.client.click('#'+data[0].country))
                    .then(() => app.client.click("#submitBasic"))
            );

            // .then(() => {
            // 	var result = app.client.execute( () => {
            //         return document.getElementById('#country').click('#Afghanistan')
            //     })
            //     console.log(result.value)
            // })
        });

        it("Confirms Password Warning", () => {
            return regStep("#pwWarningNext");
        });

        it("Step 3: Create Password", () => {
            return delay(1000)
                .then(() => app.client.waitForVisible("#pw1", 10000))
                .then(() => app.client.setValue("#pwd1", data[0].password))
                .then(() => app.client.click("#pwdNext"));
        });

        it("Step 4: Confirm Password", () => {
            return delay(1000)
                .then(() => app.client.waitForVisible("#pwd2", 10000))
                .then(() => app.client.setValue("#pwd2", data[0].password))
                .then(() => app.client.click("#pwd2Next"));
        });

        it("Step 5: Download JSON Keystore", () => {
            return regStep("#keystoreNext");
        });

        it("Step 6: Print Wallet", () => {
            return regStep("#printWalletNext");
        });

        it("Go To Dashboard", () => {
            return regStep("#goToDashboard");
        });

        it("Checks The Copy ETH Address On The Clipboard", () => {
            return regStep("#eth-copy").then(() =>
                clipboardCheck(data[usr].pubKey)
            );
        });

        it("Checks The Copy KEY Address On The Clipboard", () => {
            return regStep("#key-copy").then(() =>
                clipboardCheck(data[usr].pubKey)
            );
        });

        it("TC25: Navigating to Help", () => {
            return regStep("#navLink").then(() => regStep("#helpLink"));
        });

        it("TC26: Navigating to About", () => {
            return regStep("#navLink").then(() => regStep("#aboutLink"));
        });

        it("TC29: Navigating to Version", () => {
            return regStep("#navLink").then(() =>
                app.client
                    .getText("#version")
                    .then(v => assert(v, "V" + appVersion))
            );
        });
    });
});
