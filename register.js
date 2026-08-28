/* ==========================
   REGISTER PAGE
   Wires up the shared face-scan flow (see face-scan.js) and
   the registration form's validation/submit.
========================== */

const form = document.getElementById('registerForm');
const proceedBtn = document.getElementById('proceedBtn');
const formHint = document.getElementById('formHint');

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordError = document.getElementById('passwordError');

let faceCaptured = false;

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
            faceCaptured = true;

            // Saved locally (this browser only) so the login page can compare
            // against it later — see face-scan.js's compareFaceImages().
            localStorage.setItem('hemolink_registered_face', dataUrl);
            localStorage.setItem('hemolink_registered_name', fullNameInput.value || '');

            updateProceedState();
        },
        onRetake: function () {
            faceCaptured = false;
            updateProceedState();
        }
    }
);

/* ---- Form validation + submit ---- */

function passwordsMatch() {
    return passwordInput.value === confirmPasswordInput.value;
}

function updatePasswordError() {
    if (confirmPasswordInput.value && !passwordsMatch()) {
        passwordError.textContent = 'Passwords do not match.';
    } else {
        passwordError.textContent = '';
    }
}

function updateProceedState() {
    const ready = form.checkValidity() && faceCaptured && passwordsMatch();
    proceedBtn.disabled = !ready;

    if (!faceCaptured) {
        formHint.textContent = 'Fill in the form and complete the face scan to continue.';
    } else if (!form.checkValidity()) {
        formHint.textContent = 'A few required fields are still missing.';
    } else if (!passwordsMatch()) {
        formHint.textContent = 'Your passwords do not match yet.';
    } else {
        formHint.textContent = 'Looks good — you\'re ready to proceed.';
    }
}

form.addEventListener('input', function () {
    updatePasswordError();
    updateProceedState();
});
form.addEventListener('change', updateProceedState);

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity() || !faceCaptured || !passwordsMatch()) {
        updateProceedState();
        return;
    }

    faceScan.stop();

    // Generate a demo one-time code and hand off to the OTP page.
    // There's no real email/SMS service here, so otp.html shows the code
    // on-screen in a clearly-labelled "demo mode" banner.
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem('hemolink_pending_otp', otp);
    localStorage.setItem('hemolink_pending_email', emailInput.value);

    window.location.href = 'otp.html';
});

updateProceedState();
