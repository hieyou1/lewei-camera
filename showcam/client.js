window.onload = async () => {
    let canvas = document.getElementById("camera");
    let ctx = canvas.getContext("2d");
    let loop = () => {
        let img = new Image();
        img.src = "/image.jpg?rand=".concat(Date.now());
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
};