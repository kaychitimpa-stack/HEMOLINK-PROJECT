/* ==========================
   FACE SCAN (shared by register.html and login.html)
   Wraps the getUserMedia camera + canvas capture logic so both
   pages can reuse the same "Start Camera / Scan Face / Retake" flow.
========================== */

// elements: { video, capturedImg, frame, statusEl, startBtn, scanBtn, retakeBtn }
// callbacks: { onCaptured(dataUrl), onRetake() } — both optional
function initFaceScan(elements, callbacks) {
    const video = elements.video;
    const capturedImg = elements.capturedImg;
    const frame = elements.frame;
    const statusEl = elements.statusEl;
    const startBtn = elements.startBtn;
    const scanBtn = elements.scanBtn;
    const retakeBtn = elements.retakeBtn;

    const onCaptured = (callbacks && callbacks.onCaptured) || function () {};
    const onRetake = (callbacks && callbacks.onRetake) || function () {};

    let cameraStream = null;

    scanBtn.style.display = 'none';
    retakeBtn.style.display = 'none';
    capturedImg.style.display = 'none';

    async function start() {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            video.srcObject = cameraStream;

            video.style.display = 'block';
            capturedImg.style.display = 'none';
            frame.classList.remove('captured');

            startBtn.style.display = 'none';
            scanBtn.style.display = 'inline-flex';
            scanBtn.disabled = false;
            retakeBtn.style.display = 'none';

            statusEl.textContent = 'Camera ready. Center your face in the frame and click "Scan Face".';
        } catch (error) {
            statusEl.textContent = 'Camera access was denied or unavailable. Please allow camera access to continue.';
        }
    }

    function stop() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(function (track) {
                track.stop();
            });
            cameraStream = null;
        }
    }

    function scan() {
        scanBtn.disabled = true;
        frame.classList.add('scanning');
        statusEl.textContent = 'Scanning...';

        // Brief delay so the scan-line animation is visible before the frame is captured
        setTimeout(function () {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 320;

            const ctx = canvas.getContext('2d');
            // Un-mirror the capture: the live preview is flipped like a mirror (see CSS),
            // but the saved photo should read the right way round.
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/png');
            capturedImg.src = dataUrl;
            capturedImg.style.display = 'block';
            video.style.display = 'none';

            stop();

            frame.classList.remove('scanning');
            frame.classList.add('captured');
            statusEl.textContent = 'Face captured successfully.';

            scanBtn.style.display = 'none';
            retakeBtn.style.display = 'inline-flex';

            onCaptured(dataUrl);
        }, 1600);
    }

    function retake() {
        frame.classList.remove('captured');

        capturedImg.style.display = 'none';
        retakeBtn.style.display = 'none';
        startBtn.style.display = 'inline-flex';
        scanBtn.style.display = 'none';

        statusEl.textContent = 'Camera is off. Click "Start Camera" to begin.';
        onRetake();
    }

    startBtn.addEventListener('click', start);
    scanBtn.addEventListener('click', scan);
    retakeBtn.addEventListener('click', retake);

    return { stop: stop };
}


/* ---- Very basic client-side image similarity ----
   NOT real biometric face recognition — there's no backend or ML model here.
   This just downsamples both photos to a tiny grayscale grid and measures how
   close the pixels are, as a lightweight "does this look roughly the same"
   check for the demo login flow. */
function compareFaceImages(dataUrlA, dataUrlB) {
    return Promise.all([loadImage(dataUrlA), loadImage(dataUrlB)]).then(function (images) {
        const size = 32;
        const gridA = toGrayscaleGrid(images[0], size);
        const gridB = toGrayscaleGrid(images[1], size);

        let diffSum = 0;
        for (let i = 0; i < gridA.length; i++) {
            diffSum += Math.abs(gridA[i] - gridB[i]);
        }

        const avgDiff = diffSum / gridA.length; // 0 (identical) .. 255 (opposite)
        return 1 - (avgDiff / 255); // similarity, 0..1
    });
}

function loadImage(src) {
    return new Promise(function (resolve) {
        const img = new Image();
        img.onload = function () { resolve(img); };
        img.src = src;
    });
}

function toGrayscaleGrid(img, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);

    const pixels = ctx.getImageData(0, 0, size, size).data;
    const grid = new Array(size * size);

    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {
        grid[p] = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    }

    return grid;
}
