const initialGrid = [
    ["P", ".", ".", "#", "."],
    [".", "#", ".", "#", "."],
    [".", ".", "⭐", ".", "."],
    ["#", ".", "#", ".", "☠️"],
    [".", ".", ".", ".", "🏁"]
];

function displayGrid() {
    let gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    for (let i = 0; i < initialGrid.length; i++) {
        for (let j = 0; j < initialGrid[i].length; j++) {
            let newElement = document.createElement("div")
            newElement.classList.add("cell");
            let symbol = initialGrid[i][j]
            gameBoard.appendChild(newElement);

            switch (symbol) {
                case "P":
                    newElement.classList.add("player");
                break;
                case ".":
                    newElement.classList.add("empty");
                break;
                case "#":
                    newElement.classList.add("wall");
                break;
                case "⭐":
                    newElement.classList.add("star");
                break;
                case "☠️":
                    newElement.classList.add("trap");
                break;
                case "🏁":
                    newElement.classList.add("exit")
                break;
            }
        }
    }
}

displayGrid();
