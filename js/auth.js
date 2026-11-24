
document.addEventListener("DOMContentLoaded", function () {
    /* ==========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    const passwordInput = document.getElementById("login-password");
    const passwordToggle = document.getElementById("login-password-toggle");

    if (passwordInput && passwordToggle) passwordToggle.addEventListener("click", function () {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        passwordToggle.innerHTML = isPassword
            ? '<i class="far fa-eye-slash"></i>'
            : '<i class="far fa-eye"></i>';

        passwordToggle.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    });


    /* ==========================================
       LOGIN FORM
    ========================================== */

    const loginForm = document.getElementById("numora-login-form");

    if (loginForm) loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!loginForm.checkValidity()) {
            loginForm.reportValidity();
            return;
        }

        // Connect your authentication backend here.
        alert("Login form is ready. Connect your authentication backend to continue.");

    });

});


document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    function setupPasswordToggle(inputId, buttonId) {

        const passwordInput = document.getElementById(inputId);
        const toggleButton = document.getElementById(buttonId);

        if (!passwordInput || !toggleButton) return;

        toggleButton.addEventListener("click", function () {

            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            toggleButton.innerHTML = isPassword
                ? '<i class="far fa-eye-slash"></i>'
                : '<i class="far fa-eye"></i>';

            toggleButton.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

        });
    }

    setupPasswordToggle(
        "register-password",
        "register-password-toggle"
    );

    setupPasswordToggle(
        "register-confirm-password",
        "register-confirm-toggle"
    );


    /* ==========================================
       CONFIRM PASSWORD VALIDATION
    ========================================== */

    const password = document.getElementById("register-password");
    const confirmPassword = document.getElementById("register-confirm-password");

    function validatePasswordMatch() {

        if (!password || !confirmPassword) return;

        if (confirmPassword.value === "") {
            confirmPassword.setCustomValidity("");
            return;
        }

        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match.");
        } else {
            confirmPassword.setCustomValidity("");
        }
    }

    if (password && confirmPassword) {
        password.addEventListener("input", validatePasswordMatch);
        confirmPassword.addEventListener("input", validatePasswordMatch);
    }


    /* ==========================================
       REGISTER FORM VALIDATION
    ========================================== */

    const registerForm = document.getElementById("numora-register-form");

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            validatePasswordMatch();

            if (!registerForm.checkValidity()) {
                registerForm.reportValidity();
                return;
            }

            alert(
                "Registration form is ready. Connect your authentication backend to create an account."
            );

        });

    }

});

