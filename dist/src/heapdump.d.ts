export declare class Heapdump {
    static dumpFile(filepath: string): Promise<string>;
    private static createDirIfNotExists(dirpath);
}
