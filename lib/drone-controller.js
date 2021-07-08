const { Drone } = require("dronelib");
class DroneControl extends Drone {
    /**
     * Be sure you are already connected to the AP before instanciation of this class
     * @constructor
     * @class
     * @classdesc
     * @returns {DroneControl}
     */
    constructor(autoenable = true) {
        super();
        this.motorLocked = false;
        this.inAir = false;
        if (autoenable) this.enable();
        let { takeOff, land } = this;
        this._overwritten = {
            takeOff, land
        };
    }
    /**
     * @function DroneControl~takeOff
     * @augments DroneControl
     */
    takeOff() {
        if (!this.inAir) this._overwritten.takeOff();
        this.inAir = true;
    }
    /**
     * @function DroneControl~land
     * @augments DroneControl
     */
    land() {
        if (this.inAir) this._overwritten.land();
        this.inAir = false;
    }
    /**
     * @function DroneControl~rotate
     * @param {Boolean} goLeft - left or right?
     * @augments DroneControl
     */
    rotate(goLeft) {
        if (this.turn == 128) this.turn = ((!goLeft) ? 64 : 192);
    }
    /**
     * @function DroneControl~stopRotating
     * @augments DroneControl
     */
    stopRotating() {
        this.turn = 128;
    }
}
module.exports = DroneControl;