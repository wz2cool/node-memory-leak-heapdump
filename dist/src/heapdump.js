"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var heapdump = require("heapdump");
var mkdirp = require("mkdirp");
var path = require("path");
var q = require("q");
var util = require("util");
var Heapdump = /** @class */ (function () {
    function Heapdump() {
    }
    Heapdump.dumpFile = function (filepath) {
        var dir = path.dirname(filepath);
        var deferred = q.defer();
        this.createDirIfNotExists(dir)
            .then(function (createNew) {
            heapdump.writeSnapshot(filepath, function (err) {
                if (util.isNullOrUndefined(err)) {
                    deferred.resolve(filepath);
                }
                else {
                    deferred.reject(err);
                }
            });
        }).catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    Heapdump.createDirIfNotExists = function (dirpath) {
        var deferred = q.defer();
        var wait = setTimeout(function () {
            clearTimeout(wait);
            deferred.reject(new Error("createDirIfNotExists timeout"));
        }, 1000);
        if (fs.existsSync(dirpath)) {
            deferred.resolve(false);
        }
        else {
            mkdirp(dirpath, function (err) {
                if (util.isNullOrUndefined(err)) {
                    // create dir success.
                    deferred.resolve(true);
                }
                else {
                    console.log("should rejedct");
                    deferred.reject(err);
                }
            });
        }
        return deferred.promise;
    };
    return Heapdump;
}());
exports.Heapdump = Heapdump;
