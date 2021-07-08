const wifi = require("node-wifi");
module.exports = async (ssid, password = false) => {
    wifi.init();
    let conns = await wifi.getCurrentConnections();
    for (let i of conns) {
        if (i.ssid == ssid) {
            return;
        }
    }
    await wifi.disconnect();
    let obj = {ssid};
    if (password) obj.password = password;
    await wifi.connect(obj);
    return;
};