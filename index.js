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
        this.rawstream = null;
    }
    /**
     * @function startStream
     * @description Start and get camera stream
     * @returns {stream.Readable} The H.264 stream
     */
    startStream() {
        if (this.running) this.stopCam();
        /**
         * @private
         */
        this.pybridge = spawnCommand(`pylwdrone -q stream start${((this.lowdef) ? " --low-def " : " ")}--out-file -`);
        this.running = true;
        this.pybridge.stderr.on("data", (a) => { console.log(a.toString()) });
        this.pybridge.on("disconnect", console.log);
        this.pybridge.on("error", console.error);
        this.pybridge.on("exit", console.log);
        this.pybridge.on("close", console.log);

        /**
         * @type {stream.Readable}
         */
        this.rawstream = this.pybridge.stdout;

        /**
         * @type {P2J}
         */
        this.stream = new P2J();
        this.rawstream.pipe(this.stream);


        this.pybridge.on("exit", () => {
            this.stopCam();
            this.emit("disconnected");
        });
        this.stream.on("jpeg", (jpeg) => {
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
