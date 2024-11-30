document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    const movesCounter = document.getElementById("moves");
    const matchesCounter = document.getElementById("matches");
    const timerDisplay = document.getElementById("timer");
    const introPage = document.getElementById("intro-page");
    const playButton = document.getElementById("play-button");
    const restartButton = document.getElementById("restart-button");
    const nextLevelButton = document.getElementById("next-level-button");
    const backgroundMusic = document.getElementById("game-sound");
    let moves = 0;
    let matches = 0;
    let flippedCards = [];
    let lockBoard = false;
    let timer;
    let timeElapsed = 0;
    let currentLevel = 0;

    const levels = [
        {
            cardValues: [
                "🍎", "🍌", "🍇", "🍒",
                "🍎", "🍌", "🍇", "🍒",
                "🍋", "🍓", "🍉", "🍍",
                "🍋", "🍓", "🍉", "🍍"
            ],
            gridTemplate: "repeat(4, 100px)" // Grille 4x4
        },
        {
            cardValues: [
                "🍎", "🍌", "🍇", "🍒", "🍋", "🍓",
                "🍎", "🍌", "🍇", "🍒", "🍋", "🍓",
                "🍉", "🍍", "🥝", "🍏", "🍉", "🍍",
                "🥝", "🍏", "🍑", "🍊", "🍑", "🍊"
            ],
            gridTemplate: "repeat(6, 100px)" // Grille 6x4
        }
    ];

    playButton.addEventListener("click", () => {
        introPage.style.display = "none";
        document.getElementById("status").style.display = "block";
        document.getElementById("controls").style.display = "block";
        gameContainer.style.display = "grid";
        backgroundMusic.play();
        initGame(currentLevel);
    });

    restartButton.addEventListener("click", () => {
        currentLevel = 0;
        initGame(currentLevel);
    });

    nextLevelButton.addEventListener("click", () => {
        currentLevel++;
        initGame(currentLevel);
    });

    function initGame(level) {
        // Reset variables and UI
        moves = matches = timeElapsed = 0;
        flippedCards = [];
        lockBoard = false;
        movesCounter.textContent = moves;
        matchesCounter.textContent = matches;
        timerDisplay.textContent = "0s";
        startTimer();

        // Setup game board
        const { cardValues, gridTemplate } = levels[level];
        shuffle(cardValues);

        gameContainer.innerHTML = "";
        gameContainer.style.gridTemplateColumns = gridTemplate;

        cardValues.forEach((value) => {
            const card = createCard(value);
            gameContainer.appendChild(card);
        });

        // Show or hide the "Next Level" button
        nextLevelButton.style.display = level < levels.length - 1 ? "none" : "block";
    }

    function createCard(value) {
        const card = document.createElement("div");
        card.classList.add("card");

        const front = document.createElement("div");
        front.classList.add("card-front");
        front.textContent = value;

        const back = document.createElement("div");
        back.classList.add("card-back");
        back.textContent = "❓";

        card.append(front, back);

        card.addEventListener("click", () => flipCard(card));
        return card;
    }

    function flipCard(card) {
        if (lockBoard || flippedCards.includes(card) || card.classList.contains("matched")) return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) checkForMatch();
    }

    function checkForMatch() {
        lockBoard = true;
        const [card1, card2] = flippedCards;

        if (card1.querySelector(".card-front").textContent === card2.querySelector(".card-front").textContent) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matches++;
            matchesCounter.textContent = matches;

            if (matches === levels[currentLevel].cardValues.length / 2) {
                stopTimer();
                if (currentLevel < levels.length - 1) {
                    nextLevelButton.style.display = "block";
                }
            }
            flippedCards = [];
            lockBoard = false;
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                flippedCards = [];
                lockBoard = false;
            }, 800);
        }

        moves++;
        movesCounter.textContent = moves;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeElapsed++;
            timerDisplay.textContent = `${timeElapsed}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }
});
