import * as fs from "fs";
import * as heapdump from "heapdump";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as q from "q";
import * as util from "util";

export class Heapdump {
    public static dumpFile(filepath: string): Promise<string> {
        const dir = path.dirname(filepath);
        const deferred = q.defer<string>();
        this.createDirIfNotExists(dir)
            .then((dirpath) => {
                heapdump.writeSnapshot(filepath, (err) => {
                    if (util.isNullOrUndefined(err)) {
                        deferred.resolve(filepath);
                    } else {
                        deferred.reject(err);
                    }
                });
            }).catch((err) => {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    private static createDirIfNotExists(dirpath: string): Promise<string> {
        const deferred = q.defer<string>();
        if (fs.existsSync(dirpath)) {
            deferred.resolve(dirpath);
        } else {
            mkdirp(dirpath, (err) => {
                if (util.isNullOrUndefined(err)) {
                    // create dir success.
                    deferred.resolve(dirpath);
                } else {
                    deferred.reject(err);
                }
            });
        }
        return deferred.promise;
    }
}
