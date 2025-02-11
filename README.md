[https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js](https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js)

<body onload="processor.doLoad()">
    <div>
        <video id="video" src="" controls="true" />
    </div>
    <div>
        <canvas id="c1" width="160" height="96" />
    </div>
</body>

var processor={};

processor.doLoad = function doLoad() {
this.video = document.getElementById('video');
this.c1 = document.getElementById('c1');
this.ctx1 = this.c1.getContext('2d');
let self = this;
this.video.addEventListener('play', function() {
self.width = self.video.videoWidth / 2;
self.height = self.video.videoHeight / 2;
self.timerCallback();
}, false);


}

processor.timerCallback = function timerCallback() {
if (this.video.paused || this.video.ended) {
return;
}
this.computeFrame();
let self = this;
setTimeout(function() {
self.timerCallback();
}, 0);
},


processor.computeFrame = function computeFrame() {
this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
<!-- let l = frame.data.length / 4;

  for (let i = 0; i < l; i++) {
    let r = frame.data[i * 4 + 0];
    let g = frame.data[i * 4 + 1];
    let b = frame.data[i * 4 + 2];
    if (g > 100 && r > 100 && b < 43) frame.data[i * 4 + 3] = 0;
  }
  this.ctx2.putImageData(frame, 0, 0); -->
return;
};

render()
function render() {
window.requestAnimationFrame(render)
ctx.clearRect(0, 0,canvas.width,canvas.height)
ctx.drawImage(video, 0, 0,width,height) //绘制视频
}