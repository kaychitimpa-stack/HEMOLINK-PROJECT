/* ==========================
   OTP VERIFICATION PAGE
   Checks the 6 digit boxes against the demo code that register.js
   generated and stored in localStorage before redirecting here.
========================== */

const otpForm = document.getElementById('otpForm');
const otpBoxes = Array.prototype.slice.call(document.querySelectorAll('.otp-box'));
const otpError = document.getElementById('otpError');
const otpSuccess = document.getElementById('otpSuccess');
const otpIntro = document.getElementById('otpIntro');
const demoOtpCode = document.getElementById('demoOtpCode');
const resendOtp = document.getElementById('resendOtp');

function currentEmail() {
    return localStorage.getItem('hemolink_pending_email') || '';
}

function currentOtp() {
    return localStorage.getItem('hemolink_pending_otp') || '';
}

function refreshDemoCode() {
    demoOtpCode.textContent = currentOtp() || '------';
    if (currentEmail()) {
        otpIntro.textContent = 'Enter the 6-digit code we sent to ' + currentEmail() + ' to finish creating your account.';
    }
}

refreshDemoCode();

/* ---- digit box behaviour: type to auto-advance, backspace to go back, paste to fill all ---- */

otpBoxes.forEach(function (box, index) {
    box.addEventListener('input', function () {
        box.value = box.value.replace(/[^0-9]/g, '');
        if (box.value && index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus();
        }
    });

    box.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && !box.value && index > 0) {
            otpBoxes[index - 1].focus();
        }
    });

    box.addEventListener('paste', function (event) {
        const pasted = (event.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        if (!pasted) return;

        event.preventDefault();
        otpBoxes.forEach(function (b, i) {
            b.value = pasted[i] || '';
        });
        const next = otpBoxes[Math.min(pasted.length, otpBoxes.length) - 1];
        if (next) next.focus();
    });
});

/* ---- verify + resend ---- */

otpForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const entered = otpBoxes.map(function (b) { return b.value; }).join('');

    if (entered.length < 6) {
        otpError.textContent = 'Enter all 6 digits.';
        return;
    }

    if (entered !== currentOtp()) {
        otpError.textContent = 'That code doesn\'t match. Please try again.';
        return;
    }

    otpError.textContent = '';
    localStorage.removeItem('hemolink_pending_otp');
    localStorage.setItem('hemolink_verified', 'true');

    otpForm.style.display = 'none';
    document.getElementById('demoOtpBanner').style.display = 'none';
    otpSuccess.classList.add('show');
});

resendOtp.addEventListener('click', function (event) {
    event.preventDefault();

    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    localStorage.setItem('hemolink_pending_otp', newOtp);
    refreshDemoCode();

    otpBoxes.forEach(function (b) { b.value = ''; });
    otpBoxes[0].focus();
    otpError.textContent = 'A new code has been generated.';
});
