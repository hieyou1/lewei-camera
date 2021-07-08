const spawnCommand = require("spawn-command");
const stream = require("stream");
class Camera {
    /**
     * @constructor
     * @class
     * @classdesc
     * @param {Boolean} lowdef - Whether or not to have a low definition camera (low fps and bps).
     * @returns {Camera}
     */
    constructor(lowdef) {
        this.lowdef = lowdef;
        this.running = false;
        this.width = 1280;
        this.height = 720;
    }
    /**
     * @async
     * @function Camera~getStream
     * @description Start and get camera stream
     * @returns {stream.Readable} The H.264 stream
     */
    getStream() {
        if (this.running) this.stopCam();
        this.pybridge = spawnCommand(`pylwdrone -q stream start${((this.lowdef) ? " --low-def " : " ")}--out-file -`);
        this.running = true;
        this.pybridge.stderr.on("data", (a) => { console.log(a.toString()) });
        this.pybridge.on("disconnect", console.log);
        this.pybridge.on("error", console.error);
        this.pybridge.on("exit", console.log);
        this.pybridge.on("close", console.log);
        return this.pybridge.stdout;
    }
    /**
     * @function Camera~stopCam
     * @description Stops camera stream
     */
    stopCam() {
        this.pybridge.kill("SIGINT");
    }
}
module.exports = Camera;