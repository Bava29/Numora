// =========================================
// NUMORA DASHBOARD - INTERACTIONS
// =========================================

const getById = id => document.getElementById(id);

// SIDEBAR
const dashboardSidebar = getById("dashboardSidebar");
const dashboardMenuToggle = getById("dashboardMenuToggle");
const dashboardSidebarClose = getById("dashboardSidebarClose");
const dashboardSidebarOverlay = getById("dashboardSidebarOverlay");
getById("dashboardRtlToggle")?.addEventListener("click", closeDashboardSidebar);

function openDashboardSidebar() {
    if (!dashboardSidebar || !dashboardSidebarOverlay || !dashboardMenuToggle) return;

    dashboardSidebar.classList.add("sidebar-open");
    dashboardSidebarOverlay.classList.add("show");
    dashboardMenuToggle.setAttribute("aria-expanded", "true");
    dashboardMenuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
}

function closeDashboardSidebar() {
    dashboardSidebar?.classList.remove("sidebar-open");
    dashboardSidebarOverlay?.classList.remove("show");
    dashboardMenuToggle?.setAttribute("aria-expanded", "false");

    if (dashboardMenuToggle) {
        dashboardMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
}

dashboardMenuToggle?.addEventListener("click", () => {
    if (dashboardSidebar?.classList.contains("sidebar-open")) {
        closeDashboardSidebar();
    } else {
        openDashboardSidebar();
    }
});

dashboardSidebarClose?.addEventListener("click", closeDashboardSidebar);

dashboardSidebarOverlay?.addEventListener("click", closeDashboardSidebar);

document.querySelectorAll(".dashboard-menu-link").forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 1024) closeDashboardSidebar();
    });
});


// NOTIFICATION AND MEMBER DROPDOWNS
const dashboardNotificationButton = getById("dashboardNotificationButton");
const dashboardNotificationDropdown = getById("dashboardNotificationDropdown");
const dashboardMemberButton = getById("dashboardMemberButton");
const dashboardMemberDropdown = getById("dashboardMemberDropdown");

function closeDashboardMemberDropdown() {
    dashboardMemberDropdown?.classList.remove("show");
    dashboardMemberButton?.setAttribute("aria-expanded", "false");
}

dashboardNotificationButton?.addEventListener("click", event => {
    event.stopPropagation();
    dashboardNotificationDropdown?.classList.toggle("show");
    closeDashboardMemberDropdown();
});

dashboardMemberButton?.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = dashboardMemberDropdown?.classList.contains("show") ?? false;
    dashboardMemberDropdown?.classList.toggle("show", !isOpen);
    dashboardMemberButton.setAttribute("aria-expanded", String(!isOpen));
    dashboardNotificationDropdown?.classList.remove("show");
});

document.addEventListener("click", event => {
    if (!event.target.closest(".dashboard-notification-wrapper")) {
        dashboardNotificationDropdown?.classList.remove("show");
    }
    if (!event.target.closest(".dashboard-member-wrapper")) {
        closeDashboardMemberDropdown();
    }
});


// LOGOUT CONFIRMATION MODAL
const dashboardLogoutModal = getById("dashboardLogoutModal");
const dashboardLogoutButton = getById("dashboardLogoutButton");
const dashboardProfileLogout = getById("dashboardProfileLogout");
const dashboardLogoutCancel = getById("dashboardLogoutCancel");
const dashboardLogoutConfirm = getById("dashboardLogoutConfirm");
let previousBodyOverflow = "";

function openDashboardLogoutModal() {
    if (!dashboardLogoutModal || dashboardLogoutModal.classList.contains("show")) return;

    previousBodyOverflow = document.body.style.overflow;
    dashboardLogoutModal.classList.add("show");
    dashboardLogoutModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeDashboardLogoutModal() {
    if (!dashboardLogoutModal) return;

    dashboardLogoutModal.classList.remove("show");
    dashboardLogoutModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;
}

dashboardLogoutButton?.addEventListener("click", openDashboardLogoutModal);

dashboardProfileLogout?.addEventListener("click", () => {
    closeDashboardMemberDropdown();
    openDashboardLogoutModal();
});

dashboardLogoutCancel?.addEventListener("click", closeDashboardLogoutModal);

dashboardLogoutModal?.addEventListener("click", event => {
    if (event.target === dashboardLogoutModal) closeDashboardLogoutModal();
});

dashboardLogoutConfirm?.addEventListener("click", () => {
    localStorage.removeItem("numora-member-session");
    window.location.href = "login.html";
});


// ESCAPE KEY AND RESPONSIVE SIDEBAR RESET
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    closeDashboardSidebar();
    closeDashboardLogoutModal();
    dashboardNotificationDropdown?.classList.remove("show");
    closeDashboardMemberDropdown();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeDashboardSidebar();
});


// =========================================
// CLASS SCHEDULE - DAY FILTER
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    const dayTabs = document.querySelectorAll(".schedule-day-tab");
    const dayPanels = document.querySelectorAll(".schedule-day-panel");

    dayTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const selectedDay = tab.dataset.day;

            dayTabs.forEach(function (item) {
                item.classList.remove("active");
                item.setAttribute("aria-selected", "false");
            });

            dayPanels.forEach(function (panel) {
                panel.classList.remove("active");
            });

            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");

            const selectedPanel = document.querySelector(
                '.schedule-day-panel[data-panel="' + selectedDay + '"]'
            );

            if (selectedPanel) {
                selectedPanel.classList.add("active");
            }

        });

    });


    // =========================================
    // CLASS PREPARATION CHECKLIST
    // =========================================

    const checklistItems = document.querySelectorAll(
        ".schedule-check-input"
    );

    const completedCount = document.getElementById(
        "scheduleCompletedCount"
    );

    const progressFill = document.getElementById(
        "scheduleChecklistFill"
    );

    const checklistMessage = document.getElementById(
        "scheduleChecklistMessage"
    );

    function updateChecklist() {

        if (!completedCount || !progressFill || !checklistMessage) {
            return;
        }

        const totalItems = checklistItems.length;

        const completedItems = document.querySelectorAll(
            ".schedule-check-input:checked"
        ).length;

        const percentage = totalItems
            ? (completedItems / totalItems) * 100
            : 0;

        completedCount.textContent = completedItems + "/" + totalItems;

        progressFill.style.width = percentage + "%";

        if (completedItems === totalItems && totalItems > 0) {

            checklistMessage.innerHTML =
                '<i class="fa-solid fa-circle-check"></i>' +
                'Great job! You are ready for your class.';

        } else {

            checklistMessage.innerHTML =
                '<i class="fa-regular fa-circle-check"></i>' +
                completedItems + " of " + totalItems +
                " preparation steps completed.";

        }

    }

    checklistItems.forEach(function (item) {
        item.addEventListener("change", updateChecklist);
    });

    updateChecklist();

});


/* =========================================
   LEARNING PROGRESS PAGE INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* -------------------------------------
       SECTION 1 - PERIOD FILTER & CHART
    ------------------------------------- */

    const periodButtons = document.querySelectorAll(".lp-period-btn");
    const overallValue = document.getElementById("lpOverallValue");
    const sessionsValue = document.getElementById("lpSessionsValue");
    const accuracyValue = document.getElementById("lpAccuracyValue");
    const chartPeriod = document.getElementById("lpChartPeriod");
    const progressChart = document.getElementById("lpProgressChart");

    const progressData = {
        week: {
            overall: "68%",
            sessions: "12",
            accuracy: "85%",
            label: "Your progress this week",
            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: [35, 55, 45, 75, 60, 90, 25]
        },
        month: {
            overall: "74%",
            sessions: "38",
            accuracy: "88%",
            label: "Your progress this month",
            days: ["Week 1", "Week 2", "Week 3", "Week 4"],
            values: [35, 58, 72, 90]
        },
        overall: {
            overall: "68%",
            sessions: "96",
            accuracy: "85%",
            label: "Your overall learning journey",
            days: ["Stage 1", "Stage 2", "Stage 3", "Stage 4"],
            values: [30, 48, 68, 85]
        }
    };

    function updateProgressChart(period) {

        const data = progressData[period];

        if (!data || !progressChart) return;

        overallValue.textContent = data.overall;
        sessionsValue.textContent = data.sessions;
        accuracyValue.textContent = data.accuracy;
        chartPeriod.textContent = data.label;

        progressChart.innerHTML = "";

        data.days.forEach(function (day, index) {

            const column = document.createElement("div");
            column.className = "lp-chart-column";

            const bar = document.createElement("div");
            bar.className = "lp-chart-bar";
            bar.style.setProperty("--bar-height", data.values[index] + "%");

            const label = document.createElement("span");
            label.textContent = day;

            column.appendChild(bar);
            column.appendChild(label);

            progressChart.appendChild(column);

        });
    }

    periodButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            periodButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            updateProgressChart(button.dataset.period);

        });

    });


    /* -------------------------------------
       SECTION 2 - SKILL TABS
    ------------------------------------- */

    const skillTabs = document.querySelectorAll(".lp-skill-tab");
    const skillIcon = document.getElementById("lpSkillIcon");
    const skillTitle = document.getElementById("lpSkillTitle");
    const skillDescription = document.getElementById("lpSkillDescription");
    const skillPercent = document.getElementById("lpSkillPercent");
    const skillFill = document.getElementById("lpSkillFill");
    const skillTip = document.getElementById("lpSkillTip");

    const skillData = {

        calculation: {
            icon: "fa-solid fa-calculator",
            title: "Calculation Skills",
            description: "Build accuracy by practising addition and subtraction using your Abacus.",
            percent: 80,
            tip: "Practise mixed addition and subtraction problems to improve accuracy."
        },

        concentration: {
            icon: "fa-solid fa-bullseye",
            title: "Concentration Skills",
            description: "Improve your ability to stay focused while solving number problems.",
            percent: 65,
            tip: "Try short, distraction-free practice sessions and focus on one task at a time."
        },

        speed: {
            icon: "fa-solid fa-stopwatch",
            title: "Calculation Speed",
            description: "Develop faster calculation skills while maintaining correct answers.",
            percent: 55,
            tip: "Start with simple timed exercises and gradually increase the difficulty."
        },

        mental: {
            icon: "fa-solid fa-brain",
            title: "Mental Maths Skills",
            description: "Develop number visualisation and learn to calculate mentally.",
            percent: 45,
            tip: "Visualise Abacus movements in your mind and practise simple mental calculations."
        }

    };

    skillTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const selectedSkill = skillData[tab.dataset.skill];

            if (!selectedSkill) return;

            skillTabs.forEach(function (item) {
                item.classList.remove("active");
                item.setAttribute("aria-selected", "false");
            });

            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");

            skillIcon.className = selectedSkill.icon;
            skillTitle.textContent = selectedSkill.title;
            skillDescription.textContent = selectedSkill.description;
            skillPercent.textContent = selectedSkill.percent + "%";
            skillFill.style.width = selectedSkill.percent + "%";
            skillTip.textContent = selectedSkill.tip;

        });

    });


    /* -------------------------------------
       SECTION 3 - MILESTONE ACCORDION
    ------------------------------------- */

    const milestoneItems = document.querySelectorAll(".lp-milestone-item");

    milestoneItems.forEach(function (item) {

        const toggle = item.querySelector(".lp-milestone-toggle");

        toggle.addEventListener("click", function () {

            const isOpen = item.classList.contains("open");

            milestoneItems.forEach(function (otherItem) {
                otherItem.classList.remove("open");

                const otherToggle = otherItem.querySelector(".lp-milestone-toggle");
                otherToggle.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.classList.add("open");
                toggle.setAttribute("aria-expanded", "true");
            }

        });

    });

});


/* =========================================
   PRACTICE ACTIVITIES - INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* -------------------------------------
       SECTION 1 - DAILY PRACTICE CHALLENGE
    ------------------------------------- */

    const dailyQuestions = [
        { question: "What is 25 + 17?", answer: 42 },
        { question: "What is 64 - 28?", answer: 36 },
        { question: "What is 12 × 4?", answer: 48 },
        { question: "What is 81 ÷ 9?", answer: 9 },
        { question: "What is 35 + 26?", answer: 61 }
    ];

    let dailyIndex = 0;

    const questionNumber = document.getElementById("paQuestionNumber");
    const questionText = document.getElementById("paQuestionText");
    const answerInput = document.getElementById("paAnswerInput");
    const checkAnswerBtn = document.getElementById("paCheckAnswer");
    const nextQuestionBtn = document.getElementById("paNextQuestion");
    const answerFeedback = document.getElementById("paAnswerFeedback");

    function loadDailyQuestion() {

        const current = dailyQuestions[dailyIndex];

        questionNumber.textContent = "Question " + (dailyIndex + 1);
        questionText.textContent = current.question;

        answerInput.value = "";
        answerInput.disabled = false;
        checkAnswerBtn.disabled = false;
        nextQuestionBtn.disabled = true;

        answerFeedback.textContent = "";
        answerFeedback.className = "pa-answer-feedback";

        answerInput.focus();
    }

    if (checkAnswerBtn && answerInput) {

        checkAnswerBtn.addEventListener("click", function () {

            const enteredAnswer = answerInput.value.trim();

            if (enteredAnswer === "") {
                answerFeedback.textContent = "Please enter your answer first.";
                answerFeedback.className = "pa-answer-feedback incorrect";
                answerInput.focus();
                return;
            }

            const correctAnswer = dailyQuestions[dailyIndex].answer;

            if (Number(enteredAnswer) === correctAnswer) {
                answerFeedback.textContent = "Correct! Excellent work. Keep it up!";
                answerFeedback.className = "pa-answer-feedback correct";
            } else {
                answerFeedback.textContent = "Not quite! The correct answer is " + correctAnswer + ".";
                answerFeedback.className = "pa-answer-feedback incorrect";
            }

            answerInput.disabled = true;
            checkAnswerBtn.disabled = true;
            nextQuestionBtn.disabled = false;

            if (dailyIndex === dailyQuestions.length - 1) {
                nextQuestionBtn.innerHTML = 'Restart Challenge <i class="fa-solid fa-rotate-right"></i>';
            }

        });

        answerInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter" && !checkAnswerBtn.disabled) {
                checkAnswerBtn.click();
            }
        });

    }

    if (nextQuestionBtn) {

        nextQuestionBtn.addEventListener("click", function () {

            if (dailyIndex === dailyQuestions.length - 1) {
                dailyIndex = 0;
                nextQuestionBtn.innerHTML = 'Next Question <i class="fa-solid fa-arrow-right"></i>';
            } else {
                dailyIndex++;
            }

            loadDailyQuestion();

        });

    }


    /* -------------------------------------
       SECTION 2 - MENTAL MATHS QUIZ
    ------------------------------------- */

    const quizQuestions = [
        {
            question: "What is 12 × 3?",
            options: [24, 36, 42, 32],
            answer: 36
        },
        {
            question: "What is 75 - 28?",
            options: [43, 47, 53, 57],
            answer: 47
        },
        {
            question: "What is 15 + 26?",
            options: [39, 40, 41, 42],
            answer: 41
        },
        {
            question: "What is 96 ÷ 8?",
            options: [10, 11, 12, 14],
            answer: 12
        },
        {
            question: "What is 14 × 5?",
            options: [60, 65, 70, 75],
            answer: 70
        }
    ];

    let quizIndex = 0;
    let quizScore = 0;
    let quizAnswered = false;

    const quizQuestion = document.getElementById("paQuizQuestion");
    const quizOptions = document.getElementById("paQuizOptions");
    const quizScoreDisplay = document.getElementById("paQuizScore");
    const quizQuestionCount = document.getElementById("paQuizQuestionCount");
    const quizProgressText = document.getElementById("paQuizProgressText");
    const quizProgressFill = document.getElementById("paQuizProgressFill");
    const quizFeedback = document.getElementById("paQuizFeedback");
    const quizNextBtn = document.getElementById("paQuizNext");
    const quizQuestionArea = document.querySelector(".pa-quiz-question-area");
    const quizResult = document.getElementById("paQuizResult");
    const quizResultTitle = document.getElementById("paQuizResultTitle");
    const quizResultText = document.getElementById("paQuizResultText");
    const quizRestartBtn = document.getElementById("paQuizRestart");

    function loadQuizQuestion() {

        const current = quizQuestions[quizIndex];

        quizAnswered = false;

        quizQuestion.textContent = current.question;
        quizQuestionCount.textContent = "Question " + (quizIndex + 1) + " of " + quizQuestions.length;

        const progress = (quizIndex / quizQuestions.length) * 100;

        quizProgressFill.style.width = progress + "%";
        quizProgressText.textContent = Math.round(progress) + "% completed";

        quizScoreDisplay.textContent = quizScore + " / " + quizQuestions.length;

        quizFeedback.textContent = "";
        quizFeedback.className = "pa-quiz-feedback";

        quizNextBtn.disabled = true;
        quizNextBtn.innerHTML = 'Next Question <i class="fa-solid fa-arrow-right"></i>';

        quizOptions.innerHTML = "";

        current.options.forEach(function (option) {

            const optionButton = document.createElement("button");

            optionButton.type = "button";
            optionButton.className = "pa-quiz-option";
            optionButton.textContent = option;

            optionButton.addEventListener("click", function () {

                if (quizAnswered) return;

                quizAnswered = true;

                const selectedAnswer = Number(option);

                const allOptions = quizOptions.querySelectorAll(".pa-quiz-option");

                allOptions.forEach(function (item) {

                    item.disabled = true;

                    if (Number(item.textContent) === current.answer) {
                        item.classList.add("correct");
                    }

                });

                if (selectedAnswer === current.answer) {

                    quizScore++;

                    quizFeedback.textContent = "Correct answer! Well done!";
                    quizFeedback.className = "pa-quiz-feedback correct";

                } else {

                    optionButton.classList.add("incorrect");

                    quizFeedback.textContent = "Good try! The correct answer is " + current.answer + ".";
                    quizFeedback.className = "pa-quiz-feedback incorrect";

                }

                quizScoreDisplay.textContent = quizScore + " / " + quizQuestions.length;
                quizNextBtn.disabled = false;

            });

            quizOptions.appendChild(optionButton);

        });

    }

    function showQuizResult() {

        quizQuestionArea.hidden = true;
        quizResult.hidden = false;

        quizProgressFill.style.width = "100%";
        quizProgressText.textContent = "100% completed";
        quizQuestionCount.textContent = "All questions completed";

        quizResultTitle.textContent = quizScore >= 4 ? "Excellent Work!" : "Great Effort!";

        quizResultText.textContent =
            "You scored " + quizScore + " out of " + quizQuestions.length +
            ". Keep practising to improve your mental maths skills.";

    }

    if (quizNextBtn) {

        quizNextBtn.addEventListener("click", function () {

            if (!quizAnswered) return;

            if (quizIndex < quizQuestions.length - 1) {
                quizIndex++;
                loadQuizQuestion();
            } else {
                showQuizResult();
            }

        });

    }

    if (quizRestartBtn) {

        quizRestartBtn.addEventListener("click", function () {

            quizIndex = 0;
            quizScore = 0;
            quizAnswered = false;

            quizResult.hidden = true;
            quizQuestionArea.hidden = false;

            loadQuizQuestion();

        });

    }


    /* -------------------------------------
       SECTION 3 - PRACTICE PLANNER
    ------------------------------------- */

    const plannerCheckboxes = document.querySelectorAll(".pa-task-checkbox");
    const plannerCount = document.getElementById("paPlannerCount");
    const plannerProgress = document.getElementById("paPlannerProgress");
    const plannerProgressText = document.getElementById("paPlannerProgressText");
    const plannerComplete = document.getElementById("paPlannerComplete");

    function updatePracticePlanner() {

        const totalTasks = plannerCheckboxes.length;

        const completedTasks = document.querySelectorAll(
            ".pa-task-checkbox:checked"
        ).length;

        const percentage = totalTasks
            ? (completedTasks / totalTasks) * 100
            : 0;

        plannerCount.textContent = completedTasks + " / " + totalTasks;
        plannerProgress.style.width = percentage + "%";

        if (completedTasks === totalTasks) {

            plannerProgressText.textContent = "All practice goals completed!";
            plannerComplete.hidden = false;

        } else if (completedTasks > 0) {

            plannerProgressText.textContent =
                "Great progress! " + (totalTasks - completedTasks) +
                " more task(s) to complete.";

            plannerComplete.hidden = true;

        } else {

            plannerProgressText.textContent =
                "Let's get started! Complete your first practice task.";

            plannerComplete.hidden = true;

        }

    }

    plannerCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", updatePracticePlanner);
    });

});

// =========================================
// CERTIFICATES PAGE INTERACTIONS
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. CERTIFICATE MILESTONE PROGRESS
    const goalCheckboxes = document.querySelectorAll(".certificate-goal-checkbox");
    const progressFill = document.getElementById("certificateProgressFill");
    const progressPercent = document.getElementById("certificateProgressPercent");

    function updateCertificateProgress() {
        if (!progressFill || !progressPercent) return;

        const totalMilestones = 4;
        const completedFixedMilestones = 2;

        const completedGoals = document.querySelectorAll(
            ".certificate-goal-checkbox:checked"
        ).length;

        const completedTotal = completedFixedMilestones + completedGoals;
        const percentage = Math.round((completedTotal / totalMilestones) * 100);

        progressFill.style.width = percentage + "%";
        progressPercent.textContent = percentage + "%";

        goalCheckboxes.forEach(function (checkbox) {
            const milestone = checkbox.closest(".certificates-milestone");
            const state = milestone.querySelector(".certificates-milestone-state");

            if (checkbox.checked) {
                milestone.classList.add("completed");
                state.textContent = "Completed";
            } else {
                milestone.classList.remove("completed");
                state.textContent = "Pending";
            }
        });
    }

    goalCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", updateCertificateProgress);
    });

    updateCertificateProgress();


    // 2. CERTIFICATE COLLECTION FILTER
    const filterButtons = document.querySelectorAll(".certificates-filter-btn");
    const certificateCards = document.querySelectorAll(
        ".certificates-collection-card"
    );
    const collectionCount = document.getElementById(
        "certificateCollectionCount"
    );
    const emptyState = document.getElementById("certificatesEmptyState");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedFilter = this.dataset.filter;
            let visibleCount = 0;

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            certificateCards.forEach(function (card) {
                const cardStatus = card.dataset.status;
                const shouldShow =
                    selectedFilter === "all" || selectedFilter === cardStatus;

                card.style.display = shouldShow ? "" : "none";

                if (shouldShow) visibleCount++;
            });

            if (collectionCount) {
                collectionCount.textContent =
                    visibleCount + (visibleCount === 1 ? " certificate" : " certificates");
            }

            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        });
    });


    // 3. CERTIFICATE DETAILS MODAL
    const certificateModal = document.getElementById(
        "certificateDetailsModal"
    );
    const modalTitle = document.getElementById("certificateModalTitle");
    const modalDescription = document.getElementById(
        "certificateModalDescription"
    );
    const modalStatus = document.getElementById("certificateModalStatus");
    const modalClose = document.getElementById("certificateModalClose");
    const modalDone = document.getElementById("certificateModalDone");

    const certificateInformation = {
        foundation: {
            title: "Abacus Foundation Certificate",
            description:
                "This certificate represents the completion of the Foundation Level learning milestones. Replace this sample information with the student's actual certificate details.",
            status: "Sample earned certificate"
        },
        participation: {
            title: "Learning Participation Certificate",
            description:
                "This sample entry represents a participation achievement. Add the actual event or activity details when available.",
            status: "Sample earned certificate"
        },
        intermediate: {
            title: "Abacus Intermediate Certificate",
            description:
                "Complete the remaining practice activities and level assessment requirements to progress towards this certificate.",
            status: "Currently in progress"
        }
    };

    function openCertificateModal(certificateKey) {
        const certificate = certificateInformation[certificateKey];

        if (!certificate || !certificateModal) return;

        modalTitle.textContent = certificate.title;
        modalDescription.textContent = certificate.description;
        modalStatus.textContent = certificate.status;

        certificateModal.classList.add("show");
        certificateModal.setAttribute("aria-hidden", "false");
    }

    function closeCertificateModal() {
        if (!certificateModal) return;

        certificateModal.classList.remove("show");
        certificateModal.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll("[data-certificate-details]").forEach(function (button) {
        button.addEventListener("click", function () {
            openCertificateModal(this.dataset.certificateDetails);
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeCertificateModal);
    }

    if (modalDone) {
        modalDone.addEventListener("click", closeCertificateModal);
    }

    if (certificateModal) {
        certificateModal.addEventListener("click", function (event) {
            if (event.target === certificateModal) {
                closeCertificateModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeCertificateModal();
        }
    });

});

// =========================================
// PAYMENTS PAGE INTERACTIONS
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. PAYMENT HISTORY FILTER
    const paymentFilterButtons = document.querySelectorAll(
        ".payments-filter-btn"
    );

    const paymentRows = document.querySelectorAll(
        "#paymentsHistoryBody tr"
    );

    const paymentRecordCount = document.getElementById(
        "paymentsRecordCount"
    );

    const paymentEmptyState = document.getElementById(
        "paymentsEmptyState"
    );

    paymentFilterButtons.forEach(function (button) {
        button.addEventListener("click", function () {

            const selectedFilter = this.dataset.paymentFilter;
            let visibleCount = 0;

            paymentFilterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            paymentRows.forEach(function (row) {
                const status = row.dataset.paymentStatus;

                const shouldShow =
                    selectedFilter === "all" ||
                    selectedFilter === status;

                row.style.display = shouldShow ? "" : "none";

                if (shouldShow) {
                    visibleCount++;
                }
            });

            if (paymentRecordCount) {
                paymentRecordCount.textContent =
                    visibleCount + (visibleCount === 1 ? " record" : " records");
            }

            if (paymentEmptyState) {
                paymentEmptyState.hidden = visibleCount !== 0;
            }
        });
    });


    // 2. TRANSACTION DETAILS MODAL
    const paymentModal = document.getElementById(
        "paymentDetailsModal"
    );

    const paymentModalClose = document.getElementById(
        "paymentModalClose"
    );

    const paymentModalDone = document.getElementById(
        "paymentModalDone"
    );

    const paymentModalTitle = document.getElementById(
        "paymentModalTitle"
    );

    const paymentModalId = document.getElementById(
        "paymentModalId"
    );

    const paymentModalProgram = document.getElementById(
        "paymentModalProgram"
    );

    const paymentModalDate = document.getElementById(
        "paymentModalDate"
    );

    const paymentModalMethod = document.getElementById(
        "paymentModalMethod"
    );

    const paymentModalAmount = document.getElementById(
        "paymentModalAmount"
    );

    const paymentModalStatus = document.getElementById(
        "paymentModalStatus"
    );

    const paymentTransactions = {
        txn1: {
            id: "TXN-10021",
            program: "Abacus Level 2",
            date: "10 November 2026",
            method: "UPI",
            amount: "₹4,000",
            status: "Successful"
        },

        txn2: {
            id: "TXN-10015",
            program: "Abacus Level 2",
            date: "10 October 2026",
            method: "Card",
            amount: "₹2,000",
            status: "Successful"
        },

        txn3: {
            id: "TXN-10008",
            program: "Abacus Level 2",
            date: "01 December 2026",
            method: "Not paid",
            amount: "₹4,000",
            status: "Pending"
        }
    };

    function openPaymentModal(transactionKey) {

        const transaction = paymentTransactions[transactionKey];

        if (!transaction || !paymentModal) return;

        paymentModalTitle.textContent = "Payment Details";
        paymentModalId.textContent = transaction.id;
        paymentModalProgram.textContent = transaction.program;
        paymentModalDate.textContent = transaction.date;
        paymentModalMethod.textContent = transaction.method;
        paymentModalAmount.textContent = transaction.amount;
        paymentModalStatus.textContent = transaction.status;

        paymentModal.classList.add("show");
        paymentModal.setAttribute("aria-hidden", "false");
    }

    function closePaymentModal() {

        if (!paymentModal) return;

        paymentModal.classList.remove("show");
        paymentModal.setAttribute("aria-hidden", "true");
    }

    document.querySelectorAll("[data-payment-details]").forEach(function (button) {

        button.addEventListener("click", function () {
            openPaymentModal(this.dataset.paymentDetails);
        });

    });

    if (paymentModalClose) {
        paymentModalClose.addEventListener("click", closePaymentModal);
    }

    if (paymentModalDone) {
        paymentModalDone.addEventListener("click", closePaymentModal);
    }

    if (paymentModal) {
        paymentModal.addEventListener("click", function (event) {

            if (event.target === paymentModal) {
                closePaymentModal();
            }

        });
    }

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closePaymentModal();
        }

    });

});
