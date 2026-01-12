import {levels} from "./grid.js";

const nameRegex = /^[a-zA-Z0-9]{3,20}$/;
const form = document.querySelector('form');
const start = document.querySelector('.start');

let currentLevel = 0;
let initialGrid = levels[currentLevel].map(row => [...row]);
let position = findPlayerPosition()
console.log(position)
let name = "";
let score = 0;
let gameOver =false
let gridElements = [];
let bestScore = localStorage.getItem("gridRunnerBestScore") || 0;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputName = document.querySelector("input[type='text']");
    const errorMessage = document.querySelector(".error-message");
    name = inputName.value;

    if (nameRegex.test(name)) {
        start.style.display = 'none';

        const savedProgress  =localStorage.getItem(`gridRunnerProgress_${name}`);
        if (savedProgress) {
            showResumeModal(savedProgress);
        } else {
            showTutorialModal();
        }

    } else {
        errorMessage.textContent = "Le nom doit contenir entre 3 et 20 caractères (lettres et chiffres uniquement)";
        errorMessage.style.display = 'block';

        inputName.classList.add("shake");
        setTimeout(() => {
            inputName.classList.remove("shake");
        }, 500)
    }
});

function showTutorialModal(callback) {
    let modal = document.createElement("div");
    modal.classList.add("victory-modal");
    modal.innerHTML = `
        <div class="modal-content tutorial-modal">
            <h2>📖 Comment jouer ?</h2>
            
            <div class="tutorial-section">
                <h3>🎯 Objectif</h3>
                <p>Collecte les étoiles 🌟 et atteins la sortie 🏁 pour passer au niveau suivant !</p>
            </div>
            
            <div class="tutorial-section">
                <h3>🎮 Contrôles</h3>
                <p><strong>Sur ordinateur :</strong> Flèches du clavier ⬆️ ⬇️ ⬅️ ➡️</p>
                <p><strong>Sur mobile :</strong> Utilisez les boutons directionnels</p>
            </div>
            
            <div class="tutorial-section">
                <h3>⚠️ Attention</h3>
                <p>🧱 Les murs sont infranchissables</p>
                <p>☠️ Évitez les pièges ou c'est Game Over !</p>
                <p>🌟 Chaque étoile vaut +10 points</p>
            </div>
            
            <button onclick="closeTutorial()">J'ai compris !</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeTutorial() {
    document.querySelector(".victory-modal").remove();

    startNewGame();
}
window.closeTutorial = closeTutorial;

function startNewGame() {
    bestScore = localStorage.getItem("gridRunnerBestScore") || 0;
    currentLevel = 0;
    initialGrid = levels[currentLevel].map(row => [...row]);
    score = 0;

    createGameContainer();
    updateScoreDisplay();
    displayGrid();
    addTouchControls();
}

function resumeGame(savedData) {
    bestScore = parseInt(localStorage.getItem(`gridRunnerBestScore_${name}`)) || 0;
    currentLevel = savedData.level;
    initialGrid = levels[currentLevel].map(row => [...row]);
    score = savedData.score;

    createGameContainer();
    updateScoreDisplay();
    document.getElementById("level-display").textContent = `Niveau: ${currentLevel + 1}`;
    displayGrid();
    addTouchControls();
}

function showResumeModal(savedProgress) {
    const data = JSON.parse(savedProgress);

    let modal = document.createElement("div");
    modal.classList.add("victory-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h2>👋 Re-bienvenue ${name} !</h2>
            <p>Vous avez une partie en cours</p>
            <p>Niveau ${data.level + 1} | Score : ${data.score}</p>
            <button onclick="continueGame()">Reprendre</button>
            <button onclick="restartGame()">Recommencer</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function continueGame() {
    const savedProgress = localStorage.getItem(`gridRunnerProgress_${name}`);
    const data = JSON.parse(savedProgress);

    document.querySelector(".victory-modal").remove();
    const oldContainer = document.querySelector(".game-container");
    if (oldContainer) oldContainer.remove();
    resumeGame(data);
}

function restartGame() {
    localStorage.removeItem(`gridRunnerProgress_${name}`);
    document.querySelector(".victory-modal").remove();

    const oldContainer = document.querySelector('.game-container');
    if (oldContainer) oldContainer.remove();
    startNewGame();
}

window.continueGame = continueGame;
window.restartGame = restartGame;

function createGameContainer() {
    const main = document.querySelector('main');

    start.innerHTML = "";

    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');
    gameContainer.innerHTML = `
        <h3>Bienvenue ${name} !</h3>
        <h4 id="level-display">Niveau: ${currentLevel +1}</h4>
        <div id="game-board"></div>
        <div id="score">Score : 0 | Meilleur : ${bestScore}</div>
        <div class="mobile-controls">
            <button class="control-btn up" id="btn-up">⬆️</button>
            <div class="horizontal-controls">
                <button class="control-btn left" id="btn-left">⬅️</button>
                <button class="control-btn down" id="btn-down">⬇️</button>
                <button class="control-btn right" id="btn-right">➡️</button>
            </div>
        </div>
    `;

    main.appendChild(gameContainer);
}

/*function createMobileControls() {
    const controls = document.createElement('div');
    controls.classList.add('mobile-controls');
    controls.innerHTML = `
        <button class="control-btn up" id="btn-up">⬆️</button>
        <div class="horizontal-controls">
            <button class="control-btn left" id="btn-left">⬅️</button>
            <button class="control-btn down" id="btn-down">⬇️</button>
            <button class="control-btn right" id="btn-right">➡️</button>
        </div>
    `;
    document.body.appendChild(controls);
}*/

function displayGrid() {
    let gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    for (let row = 0; row < initialGrid.length; row++) {
        gridElements[row] = []
        for (let col = 0; col < initialGrid[row].length; col++) {
            let newElement = document.createElement("div")
            newElement.classList.add("cell");
            let symbol = initialGrid[row][col]
            gameBoard.appendChild(newElement);

            switch (symbol) {
                case "P":
                    newElement.classList.add("player");
                    newElement.textContent = "👤";
                break;
                case ".":
                    newElement.classList.add("empty");
                break;
                case "#":
                    newElement.classList.add("wall");
                break;
                case "⭐":
                    newElement.classList.add("star");
                    let starIcon = document.createElement("span");
                    starIcon.textContent = "🌟";
                    starIcon.classList.add("star-icon");
                    newElement.appendChild(starIcon);
                break;
                case "☠️":
                    newElement.classList.add("trap");
                    newElement.textContent = "☠️";
                break;
                case "🏁":
                    newElement.classList.add("exit")
                    newElement.textContent = "🏁";
                break;
            }
            gridElements[row][col] = newElement;
        }
    }
}

function loadLevel(levelIndex) {
    console.log("chargement du niveau", levelIndex + 1);
    currentLevel = levelIndex;
    initialGrid = levels[currentLevel].map(row => [...row]);
    gameOver = false;
    gridElements = [];
    let gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    updateScoreDisplay();
    document.getElementById("level-display").textContent = `Niveau: ${currentLevel + 1}`;
    displayGrid();
}

function updateGrid(oldRow, oldCol, newRow, newCol) {
    let oldCell = gridElements[oldRow][oldCol];
    oldCell.classList.remove("player");
    oldCell.innerHTML = "";
    oldCell.classList.add("empty");

    let newCell = gridElements[newRow][newCol];
    newCell.classList.remove("empty", "star", "trap", "exit");
    newCell.innerHTML = "";
    newCell.classList.add("player");
    newCell.textContent = "👤";
}

function updateScoreDisplay() {
    document.getElementById("score").textContent = `Score : ${score} | Meilleur : ${bestScore}`;
}

function findPlayerPosition() {
    for (let row = 0; row < initialGrid.length; row++) {
        for (let col = 0; col < initialGrid[row].length; col++) {
            if (initialGrid[row][col] === "P") {
                return [row, col];
            }
        }
    }
}

function isValidMove(newRow, newCol) {
    if (newRow >= 0 && newRow <= 4 && newCol >= 0 && newCol <= 4) {
        if (initialGrid[newRow][newCol] === "#") {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function nextLevel() {
    document.querySelector(".victory-modal").remove();
    loadLevel(currentLevel + 1);

    localStorage.setItem(`gridRunnerProgress_${name}`, JSON.stringify({
        level: currentLevel,
        score: score
    }));
}
window.nextLevel = nextLevel;

function movePlayer(direction) {
    if (gameOver) return;

    let [row, col] = findPlayerPosition();
    let newRow = row;
    let newCol = col;

    if (direction === "up") {
        newRow = row -1;
    }else if (direction === "down") {
        newRow = row + 1;
    } else if (direction === "left") {
        newCol = col - 1;
    } else if (direction === "right") {
        newCol = col + 1;
    }

    if (isValidMove(newRow,newCol)) {
        if (initialGrid[newRow][newCol] === "⭐") {
            score += 10;
            updateScoreDisplay();
        }
        if(initialGrid[newRow][newCol] === "☠️") {
            gameOver = true;
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('gridRunnerBestScore', bestScore);
            }

            localStorage.removeItem(`gridRunnerProgress_${name}`);

            let modal = document.createElement("div");
            modal.classList.add("defeat-modal");  // 👈 Classe différente
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>💀 Dommage ${name} ! 💀</h2>
                    <p>Vous avez touché un piège...</p>
                    <p>Score final : ${score}</p>
                    <button onclick="location.reload()">Réessayer</button>
                </div>
            `;
            document.body.appendChild(modal);

        }
        if(initialGrid[newRow][newCol] === "🏁") {
            gameOver = true;
            if(currentLevel < levels.length -1) {
                let modal = document.createElement("div");
                modal.classList.add("victory-modal");
                modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Niveau ${currentLevel + 1} terminé ! 🎉</h2>
                <p>Score : ${score}</p>
                <button onclick="nextLevel()">Niveau suivant</button>
            </div>
        `;
                document.body.appendChild(modal);
            }else {
                const isNewRecord = score > bestScore;
                if (isNewRecord) {
                    bestScore = score;
                    localStorage.setItem('gridRunnerBestScore', bestScore);
                }

                localStorage.removeItem(`gridRunnerProgress_${name}`);

                let modal = document.createElement("div");
                modal.classList.add("victory-modal");
                modal.innerHTML = `
                    <div class="modal-content">
                        <h2>🎉 Bravo ${name} ! 🎉</h2>
                        <p>Vous avez terminé tous les niveaux !</p>
                        <p>Score final : ${score}</p>
                         ${isNewRecord ? '<p class="new-record">🏆 NOUVEAU RECORD ! 🏆</p>' : ''}
                        <button onclick="location.reload()">Rejouer</button>
                    </div>
                `;
                document.body.appendChild(modal);
            }
        }
        initialGrid[row][col] = "."
        initialGrid[newRow][newCol] = "P"
        updateGrid(row, col, newRow, newCol);
    }
}


document.addEventListener("keyup", event => {
    if (event.key === "ArrowUp") {
        movePlayer('up');
    } else if (event.key === "ArrowDown") {
        movePlayer('down');
    } else if (event.key === "ArrowLeft") {
        movePlayer('left');
    } else if (event.key === "ArrowRight") {
        movePlayer('right');
    }
});


function addTouchControls() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    if (btnUp) btnUp.addEventListener('click', () => movePlayer('up'));
    if (btnDown) btnDown.addEventListener('click', () => movePlayer('down'));
    if (btnLeft) btnLeft.addEventListener('click', () => movePlayer('left'));
    if (btnRight) btnRight.addEventListener('click', () => movePlayer('right'));

    let touchStartX = 0;
    let touchStartY = 0;

    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return;

    gameBoard.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    gameBoard.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 30) movePlayer('right');
            if (diffX < -30) movePlayer('left');
        } else {
            if (diffY > 30) movePlayer('down');
            if (diffY < -30) movePlayer('up');
        }
    });
}