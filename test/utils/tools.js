const electron = require("electron");
Application = require("spectron").Application;
delay = require("delay");
chalk = require("chalk");
exec = require("child_process").exec;
pwd = process.cwd();
usr = process.argv[2] || 0;
platform = process.argv[3] || "local";
OSENV = process.env.OSENV || "osx";
pj = require("../../package.json");
appCacheName = pj.productName;
appBuildName = pj.config.forge.electronPackagerConfig.name;
appVersion = pj.version;
user = require("os").userInfo().username;

const buildPath =
    pwd +
    "/out/" +
    appBuildName +
    "-darwin-x64/" +
    appBuildName +
    ".app/Contents/MacOS/" +
    appBuildName;
const app = new Application({
    path: buildPath
});

function init() {
    return new Promise((r, rj) => {
        exec("bash " + pwd + "/test/utils/quick.sh " + user, err => {
            if (err) rj(err);
            r("done");
        });
    });
}

function appStart() {
    return new Promise((r, rj) => {
        init().then(() => r(app.start()));
    });
}

function appStop() {
    if (this.app && this.app.isRunning()) {
        return this.app.stop();
    }
    return undefined;
}

function specStart(text) {
    return console.log(text);
}

function specStop(text) {
    return console.log(text);
    // return screenshotCheck(app, fileName)
}

function regStep(app, selector) {
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

function clipboardCheck(check) {
    return new Promise((r, j) => {
        app.electron.clipboard
            .readText()
            .then(cbt => assert.equal(cbt, check))
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

function screenshotCheck(app, fileName) {
    return new Promise((r, rj) => {
        delay(1000)
            .then(() =>
                app.browserWindow
                    .capturePage()
                    .then(img =>
                        writer(pwd + "/test/local/caps/screen/" + fileName, img)
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

function consoleNotes() {
    const note =
        "Working Dir: " +
        pwd +
        "\n" +
        "Build Dir: " +
        buildPath +
        "\n" +
        "Test Data: " +
        usr +
        "\n" +
        "Platform: " +
        process.platform +
        "\n" +
        "OS Environment: " +
        OSENV +
        "\n" +
        "OS Username: " +
        user +
        "\n" +
        "Product Name: " +
        appCacheName +
        "\n" +
        "Build Name: " +
        appBuildName +
        "\n" +
        "Build Version: " +
        pj.version +
        "\n" +
        "NodeJS Version: " +
        process.version +
        "\n" +
        "NPM Version: " +
        process.version;

    console.log(chalk.green("SelfKey ID Wallet Test Config"));
    console.log(chalk.blue("*****************************"));
    console.log(
        chalk.blue(`
    _______   _______   __       _______  ___ ___ _________ ____   ___
   /       | |   ____| |  |     |   ____||  |/  / |   ____ \\   \\  /  / 
   |   (---- |  |__    |  |     |  |__   |     /  |  |__    \\   \\/  /  
   \\   \\     |   __|   |  |     |   __|  |   <    |   __|    \\_   _/   
.----)   |   |  |____  |  -----||  |     |     \\  |  |____    |  |     
|_______/    |_______| |_______||__|     |__|\\__\\ |_______|   |__|     
                                                                      `)
    );
    console.log(chalk.blue(note));
}

module.exports = {
    app,
    init,
    appStart,
    appStop,
    specStart,
    specStop,
    regStep,
    clipboardCheck,
    screenshotCheck,
    consoleNotes
};
