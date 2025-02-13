const color = 'aqua';
const boundingBoxColor = 'red';
const lineWidth = 2;
var ctx = null;

function drawResult(canvas, image, pose, minPartConfidence, minPoseConfidence) {
    ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    if (pose.score >= minPoseConfidence) {
        drawKeypoints(pose.keypoints, minPartConfidence);
        drawSkeleton(pose.keypoints, minPartConfidence);
        drawBoundingBox(pose.keypoints);
    }
}

function drawKeypoints(keypoints, minConfidence, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const { y, x } = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, color);
    }
}

function drawSkeleton(keypoints, minConfidence, scale = 1) {
    const adjacentKeyPoints =
        posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(
            toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
            scale);
    });
}

function drawBoundingBox(keypoints) {
    const boundingBox = posenet.getBoundingBox(keypoints);

    ctx.rect(
        boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY);

    ctx.strokeStyle = boundingBoxColor;
    ctx.stroke();
}

function drawSegment([ay, ax], [by, bx], color, scale) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function toTuple({ y, x }) {
    return [y, x];
}

function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function saveJsonToFile(jsonData, filename) {
    // 将JSON数据转换为字符串
    const jsonString = JSON.stringify(jsonData, null, 2);

    // 创建一个Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建一个下载链接
    const url = URL.createObjectURL(blob);

    // 创建一个<a>元素并设置其属性
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'data.json';

    // 触发点击事件以下载文件
    a.click();

    // 释放URL对象
    URL.revokeObjectURL(url);
}