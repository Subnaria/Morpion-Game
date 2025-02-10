document.addEventListener("DOMContentLoaded", () => {
    const introScreen = document.getElementById('intro-screen');
    const lobby = document.getElementById('lobby');
    const gameContainer = document.getElementById('game-container');
    const board = document.getElementById('board');
    const btnReplay = document.getElementById('btn-replay');
    const btnMenu = document.getElementById('btn-menu');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    let boardState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let playerSymbol, botSymbol;
    let currentTurn = "player";  // "player" ou "bot"

    const rondImage = "Assets/img/rond.bleu.png";
    const croixImage = "Assets/img/croix.rouge.png";

    // Initialiser la cinématique et afficher le lobby
    setTimeout(() => {
        introScreen.style.display = 'none'; // Cacher l'écran d'intro
        lobby.style.display = 'block'; // Afficher le lobby
    }, 4000); // Après 4 secondes (durée de la cinématique)

    // Démarrer une nouvelle partie avec un niveau
    window.startGame = (level) => {
        // Initialiser la partie
        boardState = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentTurn = "player"; // Le joueur commence toujours

        resultContainer.style.display = "none";  // Cacher le résultat

        lobby.style.display = 'none';  // Cacher le lobby
        gameContainer.style.display = 'block';  // Afficher le jeu

        // Créer les cases du tableau
        board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.addEventListener("click", handleClick);
            board.appendChild(cell);
        }

        // Assignation aléatoire des symboles pour le joueur et le bot
        assignRandomSymbols();
    };

    // Assigner des symboles X et O au hasard
    function assignRandomSymbols() {
        if (Math.random() < 0.5) {
            playerSymbol = "X";
            botSymbol = "O";
        } else {
            playerSymbol = "O";
            botSymbol = "X";
        }
    }

    // Gérer le clic sur une case du morpion
    function handleClick(event) {
        if (!gameActive || currentTurn !== "player") return;

        const cell = event.target;
        const index = cell.dataset.index;

        // Vérifier si la case est déjà occupée
        if (boardState[index] !== "") return;

        // Le joueur prend sa case
        boardState[index] = playerSymbol;
        cell.innerHTML = `<img src="${playerSymbol === 'X' ? croixImage : rondImage}" class="symbol">`;

        // Vérifier si le joueur a gagné
        if (checkWin(playerSymbol)) {
            endGame(`Le joueur (${playerSymbol}) a gagné !`);
            return;
        }

        // Vérifier si la partie est terminée
        if (boardState.every(cell => cell !== "")) {
            endGame("Égalité ! Personne n'a gagné !");
            return;
        }

        // Passer au tour du bot
        currentTurn = "bot";
        setTimeout(botMove, 500); // Le bot joue après une courte pause
    }

    // Le bot joue
    function botMove() {
        if (!gameActive || currentTurn !== "bot") return;

        let move = randomMove();  // Le bot fait un mouvement aléatoire

        // Mettre à jour la case avec le symbole du bot
        if (move !== undefined) {
            boardState[move] = botSymbol;
            document.querySelector(`[data-index='${move}']`).innerHTML = `<img src="${botSymbol === 'X' ? croixImage : rondImage}" class="symbol">`;

            // Vérifier si le bot a gagné
            if (checkWin(botSymbol)) {
                endGame(`Le bot (${botSymbol}) a gagné !`);
                return;
            }

            // Vérifier si la partie est terminée
            if (boardState.every(cell => cell !== "")) {
                endGame("Égalité ! Personne n'a gagné !");
                return;
            }

            // Passer au tour du joueur
            currentTurn = "player";
        }
    }

    // Déplacer le bot (déplacement aléatoire pour simplification)
    function randomMove() {
        let availableCells = boardState.map((val, idx) => (val === "" ? idx : null)).filter(val => val !== null);
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    // Vérifier si un joueur a gagné
    function checkWin(symbol) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => boardState[index] === symbol));
    }

    // Fin de la partie, afficher le message
    function endGame(message) {
        gameActive = false;
        resultText.textContent = message;
        resultContainer.style.display = "block";
        
        // Afficher les boutons "Rejouer" et "Retour au menu"
        btnReplay.style.display = "inline-block";
        btnMenu.style.display = "inline-block";
    }

    // Réinitialiser la partie
    btnReplay.addEventListener("click", () => startGame());
    btnMenu.addEventListener("click", () => {
        gameContainer.style.display = "none";
        lobby.style.display = "block";
        btnReplay.style.display = "none";
        btnMenu.style.display = "none";
    });
});
