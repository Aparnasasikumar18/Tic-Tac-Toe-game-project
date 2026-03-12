document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const gameStatus = document.getElementById('game-status');
    const restartBtn = document.getElementById('restart-btn');
    const pvpModeBtn = document.getElementById('pvpModeBtn');
    const pvcModeBtn = document.getElementById('pvcModeBtn');
    const cells = document.querySelectorAll('.cell');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'pvc'

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Game Logic Functions ---

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        board[clickedCellIndex] = currentPlayer; // Update board array
        clickedCell.textContent = currentPlayer; // Update cell text
        clickedCell.classList.add(currentPlayer.toLowerCase()); // Add class for styling
        checkResult(); // Check for win/draw
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Toggle player
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function checkResult() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue; // Skip if any cell in condition is empty
            }
            if (a === b && b === c) {
                roundWon = true;
                // Highlight winning cells
                winCondition.forEach(index => {
                    cells[index].classList.add('winning-cell');
                });
                break;
            }
        }

        if (roundWon) {
            gameStatus.textContent = `Player ${currentPlayer} Wins!`;
            gameActive = false;
            return;
        }

        // Check for Draw
        if (!board.includes('')) { // If no empty cells left
            gameStatus.textContent = `It's a Draw!`;
            gameActive = false;
            return;
        }

        // If no win or draw, change player
        handlePlayerChange();

        // If in Player vs Computer mode and it's O's (computer's) turn
        if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 500); // Give a small delay for better UX
        }
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

        // If game not active or cell already taken, do nothing
        if (!gameActive || board[clickedCellIndex] !== '') {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
    }

    function restartGame() {
        gameActive = true;
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        gameStatus.textContent = `Player X's Turn`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell'); // Clear marks and highlights
        });

        // If starting in PVC mode and computer is first, trigger its move
        if (gameMode === 'pvc' && currentPlayer === 'O') { // Can happen if O won last game
             setTimeout(computerMove, 500);
        }
    }

    // --- Computer AI Logic (Basic: Random Move) ---
    function computerMove() {
        const availableCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                availableCells.push(i);
            }
        }

        if (availableCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const cellIndex = availableCells[randomIndex];
            const targetCell = cells[cellIndex];

            // Simulate click or directly update cell
            handleCellPlayed(targetCell, cellIndex);
        }
    }

    // --- Mode Switching ---
    function switchMode(mode) {
        gameMode = mode;
        pvpModeBtn.classList.remove('active');
        pvcModeBtn.classList.remove('active');
        if (mode === 'pvp') {
            pvpModeBtn.classList.add('active');
        } else {
            pvcModeBtn.classList.add('active');
        }
        restartGame(); // Restart game with new mode
    }

    // --- Event Listeners ---
    gameBoard.addEventListener('click', handleCellClick);
    restartBtn.addEventListener('click', restartGame);
    pvpModeBtn.addEventListener('click', () => switchMode('pvp'));
    pvcModeBtn.addEventListener('click', () => switchMode('pvc'));

    // Initial setup
    restartGame(); // Set up initial game state
});