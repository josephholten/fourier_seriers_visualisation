let canvas = document.getElementById("background");
let ctx = canvas.getContext("2d");
let sys = new System(canvas, -5, -10, 5, 10);
sys.drawAxis();
sys.drawMarks(7, true);
sys.drawLabels("y=e^x");

function quadrat(x){
    return x**2;
}
function lin(x){
    return x;
}
var v = 1;
function square_wave(x) {
    return Math.sign(Math.sin(2*Math.PI*v*x));
}

//sys.plot(square_wave, 0.01);
//sys.plot(quadrat, 0.01);
//sys.plot(Math.sin, 0.01);

const t0 = performance.now();
var s = fourier_synthesis(square_wave, v, 10, 0, 1);
const t1 = performance.now();
console.log("fourier time: " + (t1-t0) + " (ms)");

const t2 = performance.now();
sys.plot(square_wave, 0.005);
sys.plot(s, 0.005, "red");
const t3 = performance.now();
console.log("plotting time: " + (t3-t2) + " (ms)");