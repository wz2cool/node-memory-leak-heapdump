"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateFormat = require("dateformat");
var memwatch = require("memwatch-next");
var os = require("os");
var path = require("path");
var util = require("util");
var heapdump_1 = require("./heapdump");
var watcherConfig_1 = require("./watcherConfig");
var Watcher = /** @class */ (function () {
    function Watcher(config) {
        this.config = this.initConfig(config);
        this.isWatched = false;
    }
    Watcher.prototype.dumpFileIfLeak = function (cb) {
        var _this = this;
        // avoid multi call.
        if (this.isWatched) {
            return;
        }
        this.isWatched = true;
        console.info("watch leak start...");
        memwatch.on("leak", function (info) {
            if (_this.canDumpFile(_this.lastDumpTime, _this.config.dumpMinInterval)) {
                _this.dumpFile(cb);
            }
        });
    };
    Watcher.prototype.dumpFile = function (cb) {
        var filepath = this.generateDumpFilepath(this.config.appName, this.config.dumpDir);
        var result = heapdump_1.Heapdump.dumpFile(filepath);
        result.then(function (dumpFile) {
            cb(null, dumpFile);
        }).catch(function (err) {
            cb(err, null);
        });
    };
    Watcher.prototype.initConfig = function (config) {
        var useConfig = config;
        if (util.isNullOrUndefined(useConfig)) {
            useConfig = new watcherConfig_1.WatcherConfig();
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
    };
    Watcher.prototype.canDumpFile = function (lastDumpTime, dumpMinInterval) {
        if (util.isNullOrUndefined(lastDumpTime)) {
            return true;
        }
        var diff = Math.abs(new Date().getTime() - lastDumpTime.getTime());
        return diff < dumpMinInterval;
    };
    Watcher.prototype.generateDumpFilepath = function (appName, dumpDir) {
        var filename = appName + "-" + dateFormat((new Date()), "yyyymmddHHMMss") + ".heapsnapshot";
        var filepath = path.join(dumpDir, filename);
        return filepath;
    };
    return Watcher;
}());
exports.Watcher = Watcher;
