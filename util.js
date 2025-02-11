const color = 'aqua';
const boundingBoxColor = 'red';
const lineWidth = 2;

function drawMultiplePosesResults() {
    const canvas = multiPersonCanvas();
    drawResults(
        canvas, predictedPoses, guiState.multiPoseDetection.minPartConfidence,
        guiState.multiPoseDetection.minPoseConfidence);

    // drawResults(canvas, predictedPoses, 0.01, 0.01);
}

function multiPersonCanvas() {
    return document.querySelector('#canvas');
}

function drawResults(canvas, image, poses, minPartConfidence, minPoseConfidence) {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    poses.forEach((pose) => {
        if (pose.score >= minPoseConfidence) {
            drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            drawSkeleton(pose.keypoints, minPartConfidence, ctx);
            drawBoundingBox(pose.keypoints, ctx);
        }
    });
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const { y, x } = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, color);
    }
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints =
        posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(
            toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
            scale, ctx);
    });
}

function drawBoundingBox(keypoints, ctx) {
    const boundingBox = posenet.getBoundingBox(keypoints);

    ctx.rect(
        boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY);

    ctx.strokeStyle = boundingBoxColor;
    ctx.stroke();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
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