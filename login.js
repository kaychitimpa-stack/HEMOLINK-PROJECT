/* ==========================
   LOGIN PAGE
   Simple client-side form validation + submit flow, plus an
   optional face scan compared against the photo saved at registration
   (see face-scan.js — this is a basic image-similarity check, not
   real biometric authentication).
========================== */

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!loginForm.checkValidity()) {
        loginError.textContent = 'Please enter a valid email and a password of at least 8 characters.';
        return;
    }

    loginError.textContent = '';
    faceScan.stop();
    loginForm.style.display = 'none';
    loginSuccess.classList.add('show');
});

/* ---- face verification ---- */

const faceMatchResult = document.getElementById('faceMatchResult');

const faceScan = initFaceScan(
    {
        video: document.getElementById('faceVideo'),
        capturedImg: document.getElementById('faceCaptured'),
        frame: document.getElementById('faceFrame'),
        statusEl: document.getElementById('faceStatus'),
        startBtn: document.getElementById('startCameraBtn'),
        scanBtn: document.getElementById('scanFaceBtn'),
        retakeBtn: document.getElementById('retakeBtn')
    },
    {
        onCaptured: function (dataUrl) {
            compareAgainstRegisteredFace(dataUrl);
        },
        onRetake: function () {
            faceMatchResult.className = 'face-match-result';
            faceMatchResult.innerHTML = '';
        }
    }
);

function compareAgainstRegisteredFace(loginDataUrl) {
    const registeredFace = localStorage.getItem('hemolink_registered_face');
    const registeredName = localStorage.getItem('hemolink_registered_name');

    if (!registeredFace) {
        faceMatchResult.className = 'face-match-result face-match-neutral';
        faceMatchResult.innerHTML = '<i class="fa-solid fa-circle-info"></i> No registered face found on this device — you can still log in with your password below.';
        return;
    }

    faceMatchResult.className = 'face-match-result face-match-neutral';
    faceMatchResult.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Comparing with your registered photo...';

    compareFaceImages(loginDataUrl, registeredFace).then(function (similarity) {
        const pct = Math.round(similarity * 100);
        const name = registeredName ? ', ' + registeredName : '';

        if (similarity >= 0.75) {
            faceMatchResult.className = 'face-match-result face-match-success';
            faceMatchResult.innerHTML = '<i class="fa-solid fa-circle-check"></i> Face matched' + name + ' (' + pct + '% similarity).';
        } else {
            faceMatchResult.className = 'face-match-result face-match-warning';
            faceMatchResult.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Could not confidently match your face (' + pct + '% similarity). You can still log in with your password below.';
        }
    });
}
