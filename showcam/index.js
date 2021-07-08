(async () => {
    const Drone = require("..");
    const drone = new Drone({
        "wifi": false,
        "lowdef": false,
        "autoenable": false
    });
    await drone.init();

    const P2J = require("pipe2jpeg");
    let p2j = new P2J();

    const Express = require('express');
    const app = Express();
    app.use(Express.static("./"));
    drone.camera.pipe(p2j);
    app.get("/image.jpg", (req, res) => {
        res.status(200).type("image/jpg").send(p2j.jpeg);
    })
    app.listen(3005);
})();
