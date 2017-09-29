export class WatcherConfig {
    public appName: string;
    // minimum interval to snapshot (to avoid CPU utility issue)
    public snapshotMinInterval: number;
    // the directory of saving snapshot.
    public snapshotDir: string;
}
