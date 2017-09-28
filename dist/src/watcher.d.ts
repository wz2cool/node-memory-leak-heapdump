import { WatcherConfig } from "./watcherConfig";
export declare class Watcher {
    private readonly config;
    private isWatched;
    private lastDumpTime;
    constructor(config: WatcherConfig);
    dumpFileIfLeak(cb: (err: Error, dumpFilepath: string) => void): void;
    private dumpFile(cb);
    private initConfig(config);
    private canDumpFile(lastDumpTime, dumpMinInterval);
    private generateDumpFilepath(appName, dumpDir);
}
