const spawnCommand = require("spawn-command");
const P2J = require("pipe2jpeg");
const stream = require("stream");
const { EventEmitter } = require("events");
class Camera extends EventEmitter {
    /**
     * @function stopCam
     * @description Stops camera stream
     */
    stopCam() {
        if (!this.pybridge.killed) this.pybridge.kill("SIGINT");
        this.pybridge = null;
        this.stream = null;
        this.p2j = null;
    }
    /**
     * @function startStream
     * @description Start and get camera stream
     * @returns {stream.Readable} The H.264 stream
     */
    startStream() {
        if (this.running) this.stopCam();
        this.pybridge = spawnCommand(`pylwdrone -q stream start${((this.lowdef) ? " --low-def " : " ")}--out-file -`);
        this.running = true;
        this.pybridge.stderr.on("data", (a) => { console.log(a.toString()) });
        this.pybridge.on("disconnect", console.log);
        this.pybridge.on("error", console.error);
        this.pybridge.on("exit", console.log);
        this.pybridge.on("close", console.log);
        this.stream = this.pybridge.stdout;
        this.p2j = new P2J();
        this.stream.pipe(this.p2j);
        this.pybridge.on("exit", () => {
            this.stopCam();
            this.emit("disconnected");
        });
        this.p2j.on("jpeg", (jpeg) => {
            this.jpeg = jpeg;
            this.emit("jpeg", jpeg);
        });
    }
    /**
     * @constructor
     * @class
     * @classdesc
     * @param {Boolean} lowdef - Whether or not to have a low definition camera (low fps and bps).
     * @returns {Camera}
     */
    constructor(lowdef) {
        super({
            "captureRejections": true
        });
        this.lowdef = lowdef ?? false;
        this.running = false;
        this.startStream();
    }
}
module.exports = { Camera };
