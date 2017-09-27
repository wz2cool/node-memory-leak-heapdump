export class WatcherConfig {
    public appName: string;
    // minimum interval to dump file. (to avoid CPU utility issue)
    public dumpMinInterval: number;
    // the directory of saving dump file.
    public dumpDir: string;
}
