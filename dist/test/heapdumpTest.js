"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var mkdirp = require("mkdirp");
var os = require("os");
var path = require("path");
var rimraf = require("rimraf");
var util = require("util");
var heapdump_1 = require("./../src/heapdump");
describe("#createDirIfNotExists", function () {
    var dumpDir = path.join(os.tmpdir(), "heapdumpTest");
    var filepath = path.join(dumpDir, "test.heapsnapshot");
    console.log("dumpDir:", dumpDir);
    console.log("filepath", filepath);
    it("should create new directory to save file", function (done) {
        rimraf(dumpDir, function (err) {
            if (util.isNullOrUndefined(err)) {
                var result = heapdump_1.Heapdump.createDirIfNotExists(dumpDir);
                result.then(function (createNew) {
                    if (createNew) {
                        done();
                    }
                    else {
                        done("should create new dir");
                    }
                }).catch(function (error) {
                    done(error);
                });
            }
            else {
                done(err);
            }
        });
    });
    it("should not create new directory since directory exists", function (done) {
        mkdirp(dumpDir, function (err) {
            if (util.isNullOrUndefined(err)) {
                var result = heapdump_1.Heapdump.createDirIfNotExists(dumpDir);
                result.then(function (createNew) {
                    if (createNew) {
                        done("should not create new dir");
                    }
                    else {
                        done();
                    }
                }).catch(function (error) {
                    done(error);
                });
            }
            else {
                done(err);
            }
        });
    });
    it("should throw error if path is invalid", function (done) {
        var invalidDir = "/%aa--asdfasdfinvalidpath/adf-/d.*1";
        var result = heapdump_1.Heapdump.createDirIfNotExists(invalidDir);
        result.then(function (createNew) {
            done("should have error because path is invalid!");
        }).catch(function (err) {
            console.log(err);
            done();
        });
    });
});
describe("#dumpFileInternal", function () {
    var dumpDir = path.join(os.tmpdir(), "heapdumpTest");
    var filepath = path.join(dumpDir, "test.heapsnapshot");
    it("should throw expcetion if directory not found", function (done) {
        rimraf(dumpDir, function (err) {
            if (fs.existsSync(dumpDir)) {
                done("test dir should not exists");
            }
            if (util.isNullOrUndefined(err)) {
                var result = heapdump_1.Heapdump.dumpFileInternal(filepath);
                result.then(function (dumpFilepath) {
                    if (fs.existsSync(dumpFilepath)) {
                        done("should not have file");
                    }
                    else {
                        done();
                    }
                }).catch(function (error) {
                    console.log(error);
                    done();
                });
            }
            else {
                done(err);
            }
        });
    });
});
describe("#dumpFile", function () {
    var dumpDir = path.join(os.tmpdir(), "heapdumpTest");
    var filepath = path.join(dumpDir, "test.heapsnapshot");
    it("should have dump file and create directory if not exists", function (done) {
        rimraf(dumpDir, function (err) {
            if (fs.existsSync(dumpDir)) {
                done("test dir should not exists");
            }
            if (util.isNullOrUndefined(err)) {
                heapdump_1.Heapdump.dumpFile(filepath)
                    .then(function (dumpFilepath) {
                    if (fs.existsSync(dumpFilepath)) {
                        done();
                    }
                    else {
                        done("file not found");
                    }
                }).catch(function (error) {
                    done(error);
                });
            }
            else {
                done(err);
            }
        });
    });
});
