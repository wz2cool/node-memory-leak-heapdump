import { assert, expect } from "chai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as rimraf from "rimraf";
import * as util from "util";
import { Watcher, WatcherConfig } from "./../src/index";

describe(".watcher", () => {
    describe("#initConfig", () => {
        it("should have default config if config is null", () => {
            const watcher = new Watcher(null);
            const config = (watcher as any).initConfig(null) as WatcherConfig;
            if (util.isNullOrUndefined(config)) {
                assert.fail("default config file can not be empty!");
            } else {
                expect(os.tmpdir()).to.be.equal(config.snapshotDir);
                expect(1000 * 60 * 5).to.be.equal(config.snapshotMinInterval);
                console.log("pid: ", process.pid.toString());
                expect(process.pid.toString()).to.be.equal(config.appName);
            }
        });
    });

    describe("#generateSnapshotFilepath", () => {
        it("should get name", () => {
            const watcher = new Watcher(null) as any;
            const generateFilepath = watcher.generateSnapshotFilepath("testAppName", "testDir");
            console.log("generateFilepath: ", generateFilepath);
            const patten = new RegExp(/^testDir(\\|\/)testAppName-\d+\.heapsnapshot$/);
            const testResult = patten.test(generateFilepath);
            expect(true).to.be.equal(testResult);
        });
    });

    describe("#canSnapshot", () => {
        it("should can dump file if last dump time is null", () => {
            const watcher = new Watcher(null) as any;
            const canDump = watcher.canSnapshot(null, 1000);
            expect(true).to.be.equals(canDump);
        });

        it("should can dump file if diff interval less than min interval", () => {
            const watcher = new Watcher(null) as any;
            const canDump = watcher.canSnapshot(new Date(), 1000);
            expect(true).to.be.equals(canDump);
        });

        it("should not dump file if diff interval geater than min interval", () => {
            const watcher = new Watcher(null) as any;
            const canDump = watcher.canSnapshot(new Date(2000, 9, 1), 1000);
            expect(false).to.be.equals(canDump);
        });
    });

    describe("#snapshot", () => {
        const config = new WatcherConfig();
        config.appName = "testApp";
        config.snapshotDir = path.join(os.tmpdir(), "test");
        config.snapshotMinInterval = 10000;
        it("should have dump file", (done) => {
            rimraf(config.snapshotDir, (error) => {
                if (util.isNullOrUndefined(error)) {
                    const watcher = new Watcher(config) as any;
                    const cb = (err: Error, dumpFilepath: string): void => {
                        console.log("dump file: ", dumpFilepath);
                        if (err) {
                            done(err);
                        } else {
                            if (fs.existsSync(dumpFilepath)) {
                                done();
                            } else {
                                done("shuold have dump file");
                            }
                        }
                    };
                    watcher.snapshot(cb);
                } else {
                    done(error);
                }
            });
        });
    });
});
