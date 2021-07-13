const spawnCommand = require("spawn-command");
const P2J = require("pipe2jpeg");
const stream = require("stream");
const { EventEmitter } = require("events");
const exitHook = require("exit-hook");
class Camera extends EventEmitter {
    /**
     * @function stopCam
     * @description Stops camera stream
     */
    stopCam() {
        if (this?.pybridge?.killed === false) this.pybridge.kill("SIGINT");
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

        /**
         * @type {stream.Readable}
         */
        this.rawstream = this.pybridge.stdout;

        /**
         * @type {P2J}
         */
        this.stream = new P2J();
        this.rawstream.pipe(this.stream);


        this.pybridge.on("exit", (code) => {
            this.stopCam();
            this.emit("disconnected");
            if (code == 0 && this.resilient) {
                this.startStream();
            }
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
     * @param {Boolean} [lowdef=false] Use low definition camera stream.
     * @param {Boolean} [resilient=false] Automatically restart pybridge if disconnected due to inactivity.
     * @returns {Camera}
     */
    constructor(lowdef = false, resilient = false) {
        super({
            "captureRejections": true
        });
        this.lowdef = lowdef;
        this.running = false;
        this.resilient = resilient;
        this.startStream();


        exitHook(() => {
            if (this.running) {
                this.stopCam();
            }
        });
    }
}
module.exports = { Camera };
