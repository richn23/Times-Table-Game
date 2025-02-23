// Create variable to hold the state of the game
let mistakes = 0;
let currentQuestion = 0;
let timeLeft = 60; // Timer starts at 60 seconds
let timerInterval; // Variable to store the timer
let score = 0; // Tracks correct answers
const MAX_LIVES = 5; // Maximum lives allowed
let lives = MAX_LIVES; // Initialize lives

// Generate all answers from the 15x15 times table, including repeated values
let answers = [];
for (let i = 1; i <= 15; i++) {
    for (let j = 1; j <= 15; j++) {
        answers.push(i * j);
    }
}
answers = answers.sort(() => Math.random() - 0.5); // Randomize the answers

// Update UI elements
function updateElement(id, value) {
    let element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    } else {
        console.error(`❌ ERROR: #${id} not found in the HTML!`);
    }
}

function showQuestion() {
    updateElement("num", answers[currentQuestion]); // Update question box
    startTimer(); // Restart timer
}

function checkAnswer(i) {
    let I = i - 1;
    let row = (I % 15) + 1;
    let col = Math.floor(I / 15) + 1;
    let question = answers[currentQuestion];
    let button = document.getElementById(i);
    let correctValue = row * col;

    if (correctValue === question) {
        if (button) {
            button.classList.add("flipped", "correct");
            button.textContent = question;
            button.disabled = true;
        }
        score++;
        updateElement("score", score);
        currentQuestion++;
        showQuestion();
    } else {
        if (lives > 0) {
            lives--;
            updateElement("lives", lives);
        }

        if (button) {
            button.classList.add("flipped", "incorrect");
            button.textContent = correctValue;
            setTimeout(() => {
                button.classList.remove("flipped", "incorrect");
                button.textContent = "?";
            }, 1000);
        }

        if (lives === 0) {
            gameOver("lives");
        }
    }
}

function startTimer() {
    updateElement("time-left", timeLeft);
    clearInterval(timerInterval);
    timeLeft = 60;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateElement("time-left", timeLeft);
        } else {
            clearInterval(timerInterval);
            gameOver("time");
        }
    }, 1000);
}

function gameOver(type) {
    console.log("💀 Game Over!");
    disableGrid();
    clearInterval(timerInterval);
    let message = document.createElement("div");
    message.classList.add("game-over-message");

    if (type === "time") {
        message.textContent = `Time's Up! Game Over! Your final score is ${score}`;
        message.classList.add("pink");
    } else if (type === "lives") {
        message.textContent = `You are out of lives! Game Over! Your final score is ${score}`;
        message.classList.add("purple");
    }
    document.body.appendChild(message);
}

function disableGrid() {
    document.querySelectorAll(".main button").forEach(button => button.disabled = true);
}

function restartGame() {
    console.log("🔄 Restarting game...");
//remove game over message    
  let gameOverMessage = document.querySelector(".game-over-message");
    if (gameOverMessage) gameOverMessage.remove();
//reset game data
    clearInterval(timerInterval);
    lives = MAX_LIVES;
    score = 0;
    currentQuestion = 0;
    timeLeft = 60;
    answers = answers.sort(() => Math.random() - 0.5);
//update status boxes
   const gameStats = { lives, score, "time-left": timeLeft };
Object.keys(gameStats).forEach(id => updateElement(id, gameStats[id]));
    updateElement("num", answers[currentQuestion]);
//reset grid
    let grid = document.querySelector(".main");
    grid.innerHTML = "";//clear old buttons
    for (let i = 1; i <= 225; i++) {
        let button = document.createElement("button");
        button.id = i;
        button.className = "square";
        button.textContent = "?";
        grid.appendChild(button);
    }
    addEventListeners();//add listeners to new buttons
    showQuestion();//generate new question
}

function addEventListeners() {
    document.querySelectorAll(".main button").forEach(button => {
        button.addEventListener("click", () => checkAnswer(parseInt(button.id)));
    });

    let restartButton = document.getElementById("restart");
    if (restartButton) {
        restartButton.addEventListener("click", restartGame);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    addEventListeners();
    showQuestion();
});

console.log("Restarting game...");