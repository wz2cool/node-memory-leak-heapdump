import * as memwatch from "memwatch-next";
import * as os from "os";
import * as path from "path";
import * as util from "util";
import { Heapdump } from "./heapdump";
import { WatcherConfig } from "./watcherConfig";

export class Watcher {
    private readonly config: WatcherConfig;
    private isWatched: boolean;
    private lastDumpTime: Date;
    constructor(config: WatcherConfig) {
        this.config = this.initConfig(config);
        this.isWatched = false;
    }

    public dumpFileIfLeak(cb: (err: Error, dumpFilepath: string) => void): void {
        // avoid multi call.
        if (this.isWatched) {
            return;
        }
        this.isWatched = true;
        console.info("watch leak start...");
        memwatch.on("leak", (info) => {
            if (this.canDumpFile(this.lastDumpTime, this.config.dumpMinInterval)) {
                this.dumpFile(cb);
            }
        });
    }

    private dumpFile(cb: (err: Error, dumpFilepath: string) => void): void {
        const filepath = this.generateDumpFilepath(this.config.appName, this.config.dumpDir);
        const result = Heapdump.dumpFile(filepath);
        result.then((dumpFile) => {
            cb(null, dumpFile);
        }).catch((err) => {
            cb(err, null);
        });
    }

    private initConfig(config: WatcherConfig): WatcherConfig {
        let useConfig = config;
        if (util.isNullOrUndefined(useConfig)) {
            useConfig = new WatcherConfig();
        }
        if (util.isNullOrUndefined(useConfig.dumpDir)) {
            useConfig.dumpDir = os.tmpdir();
        }
        if (util.isNullOrUndefined(useConfig.dumpMinInterval)) {
            useConfig.dumpMinInterval = 1000 * 60 * 5;
        }
        if (util.isNullOrUndefined(useConfig.appName)) {
            useConfig.appName = process.pid.toString();
        }
        return useConfig;
    }

    private canDumpFile(lastDumpTime: Date, dumpMinInterval: number): boolean {
        if (util.isNullOrUndefined(lastDumpTime)) {
            return true;
        }

        const diff = Math.abs(new Date().getTime() - lastDumpTime.getTime());
        return diff < dumpMinInterval;
    }

    private generateDumpFilepath(appName: string, dumpDir: string): string {
        if (util.isNullOrUndefined(dumpDir)) {
            throw new Error("dumpDir cannot be empty!");
        }

        const filename = appName + "-" + new Date() + ".heapsnapshot";
        const filepath = path.join(dumpDir, filename);
        return filepath;
    }
}
