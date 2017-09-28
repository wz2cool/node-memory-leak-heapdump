"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var os = require("os");
var util = require("util");
var index_1 = require("./../src/index");
describe("#initConfig", function () {
    it("should have default config if config is null", function () {
        var watcher = new index_1.Watcher(null);
        var config = watcher.initConfig(null);
        if (util.isNullOrUndefined(config)) {
            chai_1.assert.fail("default config file can not be empty!");
        }
        else {
            chai_1.expect(os.tmpdir()).to.be.equal(config.dumpDir);
            chai_1.expect(1000 * 60 * 5).to.be.equal(config.dumpMinInterval);
            console.log("pid: ", process.pid.toString());
            chai_1.expect(process.pid.toString()).to.be.equal(config.appName);
        }
    });
});
