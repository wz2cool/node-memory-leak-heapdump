"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fs = require("fs");
var os = require("os");
var path = require("path");
var rimraf = require("rimraf");
var util = require("util");
var index_1 = require("./../src/index");
describe(".watcher", function () {
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
    describe("#generateDumpFilepath", function () {
        it("should get name", function () {
            var watcher = new index_1.Watcher(null);
            var generateFilepath = watcher.generateDumpFilepath("testAppName", "testDir");
            console.log("generateFilepath: ", generateFilepath);
            var patten = new RegExp(/^testDir(\\|\/)testAppName-\d+\.heapsnapshot$/);
            var testResult = patten.test(generateFilepath);
            chai_1.expect(true).to.be.equal(testResult);
        });
    });
    describe("#canDumpFile", function () {
        it("should can dump file if last dump time is null", function () {
            var watcher = new index_1.Watcher(null);
            var canDump = watcher.canDumpFile(null, 1000);
            chai_1.expect(true).to.be.equals(canDump);
        });
        it("should can dump file if diff interval less than min interval", function () {
            var watcher = new index_1.Watcher(null);
            var canDump = watcher.canDumpFile(new Date(), 1000);
            chai_1.expect(true).to.be.equals(canDump);
        });
        it("should not dump file if diff interval geater than min interval", function () {
            var watcher = new index_1.Watcher(null);
            var canDump = watcher.canDumpFile(new Date(2000, 9, 1), 1000);
            chai_1.expect(false).to.be.equals(canDump);
        });
    });
    describe("#dumpFile", function () {
        var config = new index_1.WatcherConfig();
        config.appName = "testApp";
        config.dumpDir = path.join(os.tmpdir(), "test");
        config.dumpMinInterval = 10000;
        it("should have dump file", function (done) {
            rimraf(config.dumpDir, function (error) {
                if (util.isNullOrUndefined(error)) {
                    var watcher = new index_1.Watcher(config);
                    var cb = function (err, dumpFilepath) {
                        console.log("dump file: ", dumpFilepath);
                        if (err) {
                            done(err);
                        }
                        else {
                            if (fs.existsSync(dumpFilepath)) {
                                done();
                            }
                            else {
                                done("shuold have dump file");
                            }
                        }
                    };
                    watcher.dumpFile(cb);
                }
                else {
                    done(error);
                }
            });
        });
    });
});
