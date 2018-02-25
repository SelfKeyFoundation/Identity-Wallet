// TC01: Navigating to Selfkey Basic ID screen
// *******************************************

// Open ID Wallet Application
// Click CREATE NEW WALLET button
// Click Create Selfkey Basic ID
// User should be able to see the Selfkey Basic ID screen with the following fields:
// - First Name
// - Last Name
// - Middle Name
// - Country of Residency

const tools = require("../../utils/tools.js");

describe("Rejects the TOS and Exits", function() {
    before(tools.appStart);
    after(tools.appStop);

    // beforeEach(tools.specStart(fileName))
    // afterEach(tools.app.stop())
    // afterEach(tools.specStop(tools.app, fileName))

    it("Rejects the TOS", function() {
        return tools.regStep(tools.app, "#doNotAgree");
    });
});
