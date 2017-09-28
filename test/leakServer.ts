// follow: https://www.nearform.com/blog/self-detect-memory-leak-node/
import * as http from "http";
import * as os from "os";
import * as path from "path";
import { Watcher, WatcherConfig } from "../src/index";

const config = new WatcherConfig();
config.appName = "leakServer";
config.dumpDir = path.join(os.homedir(), "leakServer");
config.dumpMinInterval = 10000; // 10s;

const watcher = new Watcher(config);
watcher.dumpFileIfLeak((err, dumpFile) => {
    if (err) {
        console.error(err);
    } else {
        console.log("dumpFile: ", dumpFile);
    }
});

function leakfun(): void {
}

const server = http.createServer((req, res) => {
    for (let i = 0; i < 1000; i++) {
        server.on("request", leakfun);
    }
    res.end("Hello World\n");
}).listen(1337, "127.0.0.1");

server.setMaxListeners(0);

console.log("Server running at http://127.0.0.1:1337/. Process PID: ", process.pid);
