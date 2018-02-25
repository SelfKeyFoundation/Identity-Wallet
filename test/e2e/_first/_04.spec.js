const tools = require("../../utils/tools.js");
delay = require("delay");
data = require("../../data/data.json");
assert = require("assert");

describe("Restores A Wallet With Private Key", () => {
    before(tools.appStart);
    after(tools.appStop);

    it("Accepts The TOC", () => {
        return tools.regStep(tools.app, "#agree");
    });

    it("Confirms Setup Wallet", () => {
        return tools.regStep(tools.app, "#setupWallet");
    });

    it("Selects Restore Wallet", () => {
        return tools.regStep(tools.app, "#restoreWallet");
    });

    // it('Selects Private Key Unlock And Inputs Private Key', () => {
    // 	return delay(2000)
    // 		.then(() => tools.app.client.waitForExist('#pkey', 10000))
    // 		.then(() => tools.app.client.click('#pkey'))
    // 		.then(() => tools.app.client.click('#keyarea'))
    // 		.then(() => tools.app.client.setValue('#keyarea', data[usr].privKey))
    // 		.then(() => tools.app.client.click('#pkyunlock'))
    // })

    // it('Uploads KYC Document', () => {
    // 	return tools.regStep(tools.app,'#uploadKyc')
    // })

    // it('Goes To Dashboard', () => {
    // 	return tools.regStep(tools.app,'#goToDashboard')
    // })

    // it('Checks The Copy ETH Address On The Clipboard', () => {
    // 	return tools.regStep(tools.app,'#eth-copy')
    // 		// .then(() => {
    // 		// 	console.log(privvy)
    // 		// 	tools.clipboardCheck(privvy)
    // 		// })
    // })

    // it('Checks The Copy KEY Address On The Clipboard', () => {
    // 	return tools.regStep(tools.app,'#key-copy')
    // 		// .then(() => tools.clipboardCheck(privvy))
    // })

    // it('TC25: Navigating to Help', () => {
    // 	return tools.regStep(tools.app,'#navLink')
    // 		.then(() => tools.regStep(tools.app,'#helpLink'))
    // })

    // it('TC26: Navigating to About', () => {
    // 	return tools.regStep(tools.app,'#aboutLink')
    // })

    // it('TC29: Navigating to Version', () => {
    // 	return tools.app.client.getText('#version')
    // 			// .then(v => assert(v,  'V' + appVersion))
    // 			// .then(() => console.log(chalk.green('Version Assert Correct: ' + v + ' == ' + appVersion)))
    // })
});
