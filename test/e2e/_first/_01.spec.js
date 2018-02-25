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

    it("Reconsiders and Returns to TOS", function() {
        return tools.regStep(tools.app, "#backToTOS");
    });

    it("Confirms Decision to Reject the TOS", function() {
        return tools.regStep(tools.app, "#doNotAgree");
    });

    it("Exits the App", function() {
        return tools.regStep(tools.app, "#exit");
    });
});
