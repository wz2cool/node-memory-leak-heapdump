import * as fs from "fs";
import * as heapdump from "heapdump";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as q from "q";
import * as util from "util";

export class Heapdump {
    public static snapshot(filepath: string): Promise<string> {
        const dir = path.dirname(filepath);
        const deferred = q.defer<string>();
        this.createDirIfNotExists(dir)
            .then((createNew) => {
                return this.snapshotInternal(filepath);
            }).then((snapshotFilepath) => {
                deferred.resolve(snapshotFilepath);
            }).catch((err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    private static createDirIfNotExists(dirpath: string): Promise<boolean> {
        const deferred = q.defer<boolean>();
        const wait = setTimeout(() => {
            clearTimeout(wait);
            deferred.reject(new Error("createDirIfNotExists timeout"));
        }, 1000);

        if (fs.existsSync(dirpath)) {
            deferred.resolve(false);
        } else {
            mkdirp(dirpath, (err) => {
                if (util.isNullOrUndefined(err)) {
                    // create dir success.
                    deferred.resolve(true);
                } else {
                    console.log("should rejedct");
                    deferred.reject(err);
                }
            });
        }
        return deferred.promise;
    }

    private static snapshotInternal(filepath: string): Promise<string> {
        const deferred = q.defer<string>();
        heapdump.writeSnapshot(filepath, (err) => {
            if (util.isNullOrUndefined(err)) {
                deferred.resolve(filepath);
            } else {
                deferred.reject(err);
            }
        });
        return deferred.promise;
    }
}
