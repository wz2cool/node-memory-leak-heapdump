import { expect } from "chai";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as os from "os";
import * as path from "path";
import * as q from "q";
import * as rimraf from "rimraf";
import * as util from "util";
import { Heapdump } from "./../src/heapdump";

describe(".Heapdump", () => {
    describe("#createDirIfNotExists", () => {
        const dumpDir = path.join(os.tmpdir(), "heapdumpTest");
        const filepath = path.join(dumpDir, "test.heapsnapshot");
        console.log("dumpDir:", dumpDir);
        console.log("filepath", filepath);

        it("should create new directory to save file", (done) => {
            rimraf(dumpDir, (err) => {
                if (util.isNullOrUndefined(err)) {
                    const result = (Heapdump as any).createDirIfNotExists(dumpDir) as q.Promise<boolean>;
                    result.then((createNew) => {
                        if (createNew) {
                            done();
                        } else {
                            done("should create new dir");
                        }
                    }).catch((error) => {
                        done(error);
                    });
                } else {
                    done(err);
                }
            });
        });

        it("should not create new directory since directory exists", (done) => {
            mkdirp(dumpDir, (err) => {
                if (util.isNullOrUndefined(err)) {
                    const result = (Heapdump as any).createDirIfNotExists(dumpDir) as q.Promise<boolean>;
                    result.then((createNew) => {
                        if (createNew) {
                            done("should not create new dir");
                        } else {
                            done();
                        }
                    }).catch((error) => {
                        done(error);
                    });
                } else {
                    done(err);
                }
            });
        });

        it("should throw error if path is invalid", (done) => {
            const invalidDir = `/\%aa--asdfasdfinvalidpath\/adf-/d.\*1`;
            const result = (Heapdump as any).createDirIfNotExists(invalidDir) as q.Promise<boolean>;
            result.then((createNew) => {
                done("should have error because path is invalid!");
            }).catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#snapshotFileInternal", () => {
        const dumpDir = path.join(os.tmpdir(), "heapdumpTest");
        const filepath = path.join(dumpDir, "test.heapsnapshot");

        it("should throw expcetion if directory not found", (done) => {
            rimraf(dumpDir, (err) => {
                if (fs.existsSync(dumpDir)) {
                    done("test dir should not exists");
                }

                if (util.isNullOrUndefined(err)) {
                    const result = (Heapdump as any).snapshotInternal(filepath) as Promise<string>;
                    result.then((dumpFilepath) => {
                        if (fs.existsSync(dumpFilepath)) {
                            done("should not have file");
                        } else {
                            done();
                        }
                    }).catch((error) => {
                        console.log(error);
                        done();
                    });
                } else {
                    done(err);
                }
            });
        });
    });

    describe("#snapshotFile", () => {
        const dumpDir = path.join(os.tmpdir(), "heapdumpTest");
        const filepath = path.join(dumpDir, "test.heapsnapshot");

        it("should have dump file and create directory if not exists", (done) => {
            rimraf(dumpDir, (err) => {
                if (fs.existsSync(dumpDir)) {
                    done("test dir should not exists");
                }

                if (util.isNullOrUndefined(err)) {
                    Heapdump.snapshot(filepath)
                        .then((dumpFilepath) => {
                            if (fs.existsSync(dumpFilepath)) {
                                done();
                            } else {
                                done("file not found");
                            }
                        }).catch((error) => {
                            done(error);
                        });
                } else {
                    done(err);
                }
            });
        });
    });
});
