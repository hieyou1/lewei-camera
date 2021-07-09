const { Camera } = require('..');

(async () => {
    let camera = new Camera();

    const Express = require('express');
    const app = Express();
    app.use(Express.static("./"));
    app.get("/image.jpg", (req, res) => {
        res.status(200).type("image/jpg").send(camera.jpeg);
    })
    app.listen(3005);
})();
