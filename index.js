const { Drone: Controller } = require("dronelib");
const Camera = require("./lib/capture-camera");
const wifiConnect = require("./lib/connect-wifi");
class Drone {
    /**
     * @constructor 
     * @class
     * @classdesc
     * @param {Object} opts - Options
     * @param {Object} opts.wifi - Wi-Fi options
     * @param {String} opts.wifi.ssid - SSID of drone's open Wi-Fi network.
     * @param {String} [opts.wifi.password] - Password [if Wi-Fi is password-protected]
     * @param {Boolean} opts.lowdef - Whether or not to use low definition camera stream
     * @returns {Drone}
     */
    constructor(opts) {
        this._inited = false;
        this.opts = opts;
    }
    /**
     * @async
     * @function Drone~init
     * @augments Drone
     * @returns {Promise}
     */
    async init() {
        if (this._inited) return;
        this._inited = true;
        if (this.opts.wifi != false) await wifiConnect(this.opts.wifi.ssid, this.opts.wifi.password);
        this.control = new Controller();
        if (this.opts?.autoenable) this.control.enable();
        /**
         * @type {ReadableStream} Camera H.264 stream
         */
        this.camera = (new Camera(this.opts.lowdef)).getStream();
    }
}
module.exports = Drone;