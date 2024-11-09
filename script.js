// Add click sound effect
const clickSound = new Audio('sounds/click.mp3'); // Ensure the sound file is in the correct location

// Function to play the click sound
function playClickSound() {
    clickSound.currentTime = 0;  // Reset sound to start
    clickSound.play();
}

// Timer related buttons
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const resetButton = document.getElementById("reset-button");
const timerLabel = document.getElementById("base-timer-label");
const baseTimerPath = document.getElementById("base-timer-path-remaining");
const timerTitle = document.getElementById("timer-title");

// Set the initial timer limit (default 25 minutes for work)
let workDuration = 25 * 60; // Default 25 minutes work
let breakDuration = 5 * 60; // Default 5 minutes break
let timePassed = 0;
let timerInterval = null;
let isPaused = false;
let isWorkPhase = true; // To track if it's work or break phase

// Function to start the timer
function startTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval); // Ensure no multiple intervals are running at once
    }

    timerInterval = setInterval(() => {
        if (!isPaused) {
            timePassed++;
            const timeLeft = (isWorkPhase ? workDuration : breakDuration) - timePassed;
            timerLabel.innerHTML = formatTime(timeLeft);
            setCircleDasharray(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (isWorkPhase) {
                    // Work phase finished, start break phase
                    timerTitle.innerHTML = `Work done! Time for a break!`;
                    isWorkPhase = false; // Switch to break phase
                    timePassed = 0; // Reset time for the break timer
                    startTimer();
                } else {
                    // Break phase finished, restart work phase
                    timerTitle.innerHTML = `Break is over! Time to focus again!`;
                    isWorkPhase = true; // Switch back to work phase
                    timePassed = 0; // Reset time for the work timer
                    startTimer();
                }
            }
        }
    }, 1000);
    timerTitle.innerHTML = isWorkPhase ? "TIME TO FOCUS 🔥" : "TIME FOR A BREAK 🛑";
}

// Function to format time as MM:SS
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to set the circle's dash array for the progress bar
function setCircleDasharray(timeLeft) {
    const circleDasharray = (timeLeft / (isWorkPhase ? workDuration : breakDuration)) * 283;
    baseTimerPath.setAttribute("stroke-dasharray", circleDasharray);
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    timePassed = 0;
    isPaused = false;
    isWorkPhase = true; // Default to work phase
    timerLabel.innerHTML = formatTime(workDuration);
    setCircleDasharray(workDuration);
    timerTitle.innerHTML = "FOCUS TIMER";
    startButton.style.display = "block";
    pauseButton.style.display = "none";
    resumeButton.style.display = "none";
    // Prevent the timer from starting automatically after reset
    clearInterval(timerInterval); 
}

// Start button event listener
startButton.addEventListener("click", () => {
    playClickSound();
    startTimer();
    startButton.style.display = "none";
    pauseButton.style.display = "block";
});

// Pause button event listener
pauseButton.addEventListener("click", () => {
    playClickSound();
    isPaused = true;
    pauseButton.style.display = "none";
    resumeButton.style.display = "block";
    timerTitle.innerHTML = "DON'T GET DISTRACTED 🎯"; // Update title on pause
});

// Resume button event listener
resumeButton.addEventListener("click", () => {
    playClickSound();
    isPaused = false;
    resumeButton.style.display = "none";
    pauseButton.style.display = "block";
    startTimer();
});

// Reset button event listener
resetButton.addEventListener("click", () => {
    playClickSound();
    resetTimer();
});

// Profile dropdown functionality (optional, keep existing functionality)
const profileButton = document.getElementById("profile-button");
const profileOptions = document.getElementById("profile-options");
profileButton.addEventListener("click", (e) => {
    e.stopPropagation();
    profileOptions.classList.toggle("show-options");
});

// Hide profile options when clicking anywhere else
document.addEventListener("click", () => {
    profileOptions.classList.remove("show-options");
});

profileOptions.addEventListener("click", (e) => {
    e.stopPropagation();
});

// Gear icon and menu for settings
const gearIcon = document.getElementById("gear-icon");
const settingsMenu = document.getElementById("settings-menu");

gearIcon.addEventListener("click", () => {
    settingsMenu.style.display = settingsMenu.style.display === "none" || settingsMenu.style.display === "" ? "block" : "none";
    gearIcon.classList.toggle("rotated"); // Rotate the gear icon
});

// Timer mode buttons (Pomodoro, Focus, Custom)
const pomodoroButton = document.getElementById("pomodoro-button");
const focusButton = document.getElementById("focus-button");
const customButton = document.getElementById("custom-button");

pomodoroButton.addEventListener("click", () => {
    playClickSound();
    workDuration = 25 * 60; // 25 minutes work
    breakDuration = 5 * 60; // 5 minutes break
    resetTimer();
    timerTitle.innerHTML = "Pomodoro Timer: Time to Focus!";
});

focusButton.addEventListener("click", () => {
    playClickSound();
    workDuration = 50 * 60; // 50 minutes work
    breakDuration = 10 * 60; // 10 minutes break
    resetTimer();
    timerTitle.innerHTML = "Focus Timer: Time to Focus!";
});

customButton.addEventListener("click", () => {
    playClickSound();
    const customWork = prompt("Enter custom work time (in minutes):", 25);
    const customBreak = prompt("Enter custom break time (in minutes):", 5);

    // Set custom time based on user input
    workDuration = parseInt(customWork) * 60; // Convert to seconds
    breakDuration = parseInt(customBreak) * 60; // Convert to seconds

    resetTimer();
    timerTitle.innerHTML = `Custom Timer: Time to Focus!`;
});
