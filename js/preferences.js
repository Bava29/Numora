// Apply saved preferences before stylesheets render, then bind every page's controls.
(function () {
    const root = document.documentElement;
    const THEME_KEY = "numora-theme";
    const DIRECTION_KEY = "numora-direction";

    function readPreference(key, legacyKey, allowedValues, fallback) {
        let value = localStorage.getItem(key);

        if (legacyKey) {
            if (!allowedValues.includes(value)) {
                const legacyValue = localStorage.getItem(legacyKey);
                if (allowedValues.includes(legacyValue)) {
                    value = legacyValue;
                    localStorage.setItem(key, value);
                }
            }
            localStorage.removeItem(legacyKey);
        }

        return allowedValues.includes(value) ? value : fallback;
    }

    const initialTheme = readPreference(THEME_KEY, "prepvera-theme", ["light", "dark"], "light");
    const initialDirection = readPreference(
        DIRECTION_KEY,
        "prepvera-direction",
        ["ltr", "rtl"],
        "ltr"
    );

    function updateThemeControls(isDark) {
        document.querySelectorAll(".theme-toggle, #auth-theme-toggle, #dashboardThemeToggle")
            .forEach(function (button) {
                const icon = button.querySelector("i");
                if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";

                const label = isDark ? "Switch to light mode" : "Switch to dark mode";
                button.setAttribute("aria-label", label);
                button.setAttribute("aria-pressed", String(isDark));
                if (button.hasAttribute("title")) button.setAttribute("title", label);
            });

        document.querySelectorAll(".theme-status").forEach(function (status) {
            status.textContent = isDark ? "On" : "Off";
        });
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        root.classList.toggle("dark-mode", isDark);
        updateThemeControls(isDark);
    }

    function updateDirectionControls(isRtl) {
        document.querySelectorAll(".rtl-toggle, #auth-rtl-toggle, #dashboardRtlToggle")
            .forEach(function (button) {
                const label = isRtl ? "Switch to left-to-right mode" : "Switch to right-to-left mode";
                button.setAttribute("aria-label", label);
                button.setAttribute("aria-pressed", String(isRtl));
                if (button.hasAttribute("title")) button.setAttribute("title", label);
            });

        document.querySelectorAll(".rtl-status").forEach(function (status) {
            status.textContent = isRtl ? "On" : "Off";
        });
    }

    function applyDirection(direction) {
        const isRtl = direction === "rtl";
        root.setAttribute("dir", isRtl ? "rtl" : "ltr");
        updateDirectionControls(isRtl);
    }

    // Run synchronously in the head before CSS paints.
    applyTheme(initialTheme);
    applyDirection(initialDirection);

    function bindPreferenceControls() {
        updateThemeControls(root.classList.contains("dark-mode"));
        updateDirectionControls(root.getAttribute("dir") === "rtl");

        document.querySelectorAll(".theme-toggle, #auth-theme-toggle, #dashboardThemeToggle")
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    const nextTheme = root.classList.contains("dark-mode") ? "light" : "dark";
                    localStorage.setItem(THEME_KEY, nextTheme);
                    applyTheme(nextTheme);
                });
            });

        document.querySelectorAll(".rtl-toggle, #auth-rtl-toggle, #dashboardRtlToggle")
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    const nextDirection = root.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
                    localStorage.setItem(DIRECTION_KEY, nextDirection);
                    applyDirection(nextDirection);
                });
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindPreferenceControls, { once: true });
    } else {
        bindPreferenceControls();
    }

    // Keep other open tabs in sync when a preference changes elsewhere.
    window.addEventListener("storage", function (event) {
        if (event.key === THEME_KEY || event.key === null) {
            applyTheme(event.newValue === "dark" ? "dark" : "light");
        }
        if (event.key === DIRECTION_KEY || event.key === null) {
            applyDirection(event.newValue === "rtl" ? "rtl" : "ltr");
        }
    });
})();
