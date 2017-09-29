import * as dateFormat from "dateformat";
import * as memwatch from "memwatch-next";
import * as os from "os";
import * as path from "path";
import * as util from "util";
import { Heapdump } from "./heapdump";
import { WatcherConfig } from "./watcherConfig";

export class Watcher {
    private readonly config: WatcherConfig;
    private isWatched: boolean;
    private lastSnapshotTime: Date;
    constructor(config: WatcherConfig) {
        this.config = this.initConfig(config);
        this.isWatched = false;
    }

    public snapshotIfLeak(cb: (err: Error, snapshotFilepath: string) => void): void {
        // avoid multi call.
        if (this.isWatched) {
            return;
        }
        this.isWatched = true;
        console.info("watch leak start...");
        memwatch.on("leak", (info) => {
            if (this.canSnapshot(this.lastSnapshotTime, this.config.snapshotMinInterval)) {
                this.snapshot(cb);
            }
        });
    }

    private snapshot(cb: (err: Error, snapshotFilepath: string) => void): void {
        const filepath = this.generateSnapshotFilepath(this.config.appName, this.config.snapshotDir);
        const result = Heapdump.snapshot(filepath);
        result.then((snapshotFile) => {
            cb(null, snapshotFile);
        }).catch((err) => {
            cb(err, null);
        });
    }

    private initConfig(config: WatcherConfig): WatcherConfig {
        let useConfig = config;
        if (util.isNullOrUndefined(useConfig)) {
            useConfig = new WatcherConfig();
        }
        if (util.isNullOrUndefined(useConfig.snapshotDir)) {
            useConfig.snapshotDir = os.tmpdir();
        }
        if (util.isNullOrUndefined(useConfig.snapshotMinInterval)) {
            useConfig.snapshotMinInterval = 1000 * 60 * 5;
        }
        if (util.isNullOrUndefined(useConfig.appName)) {
            useConfig.appName = process.pid.toString();
        }
        return useConfig;
    }

    private canSnapshot(lastSnapshotTime: Date, snapshotMinInterval: number): boolean {
        if (util.isNullOrUndefined(lastSnapshotTime)) {
            return true;
        }

        const diff = Math.abs(new Date().getTime() - lastSnapshotTime.getTime());
        return diff < snapshotMinInterval;
    }

    private generateSnapshotFilepath(appName: string, snapshotDir: string): string {
        const filename = appName + "-" + dateFormat((new Date()), "yyyymmddHHMMss") + ".heapsnapshot";
        const filepath = path.join(snapshotDir, filename);
        return filepath;
    }
}
