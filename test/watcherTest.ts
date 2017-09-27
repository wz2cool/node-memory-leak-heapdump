import { assert, expect } from "chai";
import * as os from "os";
import * as util from "util";
import { Watcher, WatcherConfig } from "./../src/index";

describe("#initConfig", () => {
    it("should have default config if config is null", () => {
        const watcher = new Watcher(null);
        const config = (watcher as any).initConfig(null) as WatcherConfig;
        if (util.isNullOrUndefined(config)) {
            assert.fail("default config file can not be empty!");
        } else {
            expect(os.tmpdir()).to.be.equal(config.dumpDir);
            expect(1000 * 60 * 5).to.be.equal(config.dumpMinInterval);
            console.log("pid: ", process.pid.toString());
            expect(process.pid.toString()).to.be.equal(config.appName);
        }
    });
});
