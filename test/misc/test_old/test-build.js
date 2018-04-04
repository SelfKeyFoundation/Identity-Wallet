const builder = require("electron-builder");
Platform = builder.Platform;
Mocha = require("mocha");
mocha = new Mocha();
fs = require("fs");
path = require("path");
testDir = "some/dir/test";

// Add each .js file to the mocha instance
fs
    .readdirSync(testDir)
    .filter(function(file) {
        // Only keep the .js files
        return file.substr(-3) === ".js";
    })
    .forEach(function(file) {
        mocha.addFile(path.join(testDir, file));
    });

// Run the tests.
mocha.run(function(failures) {
    process.on("exit", function() {
        process.exit(failures); // exit with non-zero status if there were failures
    });
});

// Promise is returned
builder
    .build({
        targets: Platform.MAC.createTarget(),
        config: {
            "//": "build options, see https://goo.gl/ZhRfla"
        }
    })
    .then(() => {
        // handle result
    })
    .catch(error => {
        // handle error
    });
