var canv = document.createElement('canvas');
canv.id = 'canvas';
document.body.appendChild(canv);

var canvas = document.getElementById("canvas");

const updateCanvasSize = () => {
    // canvas.style.width = document.body.clientWidth + "px";
    // canvas.style.height = document.body.clientHeight + "px";
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight+ "px";
};

const updateCanvasSizeAndStart = () => {
    updateCanvasSize();

    canvas.style.position = "fixed";
    canvas.style.top = "0px";
    canvas.style.backgroundColor = "green";

    var gl = document.querySelector("#canvas").getContext("webgl");
    gl.clearColor(0.1, 0.5, 0.5, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

document.addEventListener('DOMContentLoaded', updateCanvasSizeAndStart);
window.addEventListener('resize', updateCanvasSize);

