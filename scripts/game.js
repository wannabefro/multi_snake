$(function(){
  setupCanvas();
});

var setupCanvas = function(){
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  w = window.innerWidth,
  h = window.innerHeight;
  canvas.height = h;
  canvas.width = w;
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,w,h);
}
