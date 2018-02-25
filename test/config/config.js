const pj = require("../../package.json");
appCacheName = pj.productName;
appBuildName = pj.config.forge.electronPackagerConfig.name;
user = require("os").userInfo().username;

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

module.exports = conf;
