/**
 * Created by Matteo on 18/07/2017.
 */

let canvas = document.createElement('canvas');
canvas.width  = 1080;
canvas.height = 720;
let ctx = canvas.getContext('2d');
let gradient = ctx.createRadialGradient(150.000, 150.000, 0.000, 150.000, 150.000, 150.000);
grd.addColorStop(0.000, 'rgba(51, 51, 51, 1.000)');
grd.addColorStop(1.000, 'rgba(0, 0, 0, 0.000)');
ctx.fillStyle = gradient;
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 300.000, 300.000);

