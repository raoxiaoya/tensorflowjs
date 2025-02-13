var ctx = null;

function drawResult(canvas, image, pose) {
    ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    if (pose.keypoints != null) {
        drawKeypoints(pose.keypoints);
        drawSkeleton(pose.keypoints, pose.id);
    }
}

function drawKeypoint(keypoint) {
    // 如果分数不为空，则显示关键点。
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = 0;

    if (score >= scoreThreshold) {
        const circle = new Path2D();
        circle.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
        ctx.fill(circle);
        ctx.stroke(circle);
    }
}

function drawKeypoints(keypoints) {
    const keypointInd = poseDetection.util.getKeypointIndexBySide(
        poseDetection.SupportedModels.MoveNet,
    );
    ctx.fillStyle = "Red";
    ctx.strokeStyle = "White";
    ctx.lineWidth = 2;

    for (const i of keypointInd.middle) {
        drawKeypoint(keypoints[i]);
    }

    ctx.fillStyle = "Green";
    for (const i of keypointInd.left) {
        drawKeypoint(keypoints[i]);
    }

    ctx.fillStyle = "Orange";
    for (const i of keypointInd.right) {
        drawKeypoint(keypoints[i]);
    }
}

function drawSkeleton(keypoints, poseId) {
    // Each poseId is mapped to a color in the color palette.
    const color = 'aqua';
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    poseDetection.util
        .getAdjacentPairs(poseDetection.SupportedModels.MoveNet)
        .forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            // If score is null, just show the keypoint.
            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;
            const scoreThreshold = 0;

            if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.stroke();
            }
        });
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