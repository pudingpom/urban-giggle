let grid = [];
let score = 0;

function initGrid() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    document.getElementById('score').textContent = score;
    addNewTile();
    addNewTile();
    updateDisplay();
}

function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({x: i, y: j});
            }
        }
    }
    if (emptyCells.length > 0) {
        const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateDisplay() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
    });

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const value = grid[i][j];
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${value}`;
                tile.textContent = value;
                cells[i * 4 + j].appendChild(tile);
            }
        }
    }
}

function move(direction) {
    let moved = false;
    const oldGrid = grid.map(row => [...row]);

    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = grid[i];
            if (direction === 'right') row = row.reverse();
            
            row = row.filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            if (direction === 'right') row = row.reverse();
            grid[i] = row;
        }
    } else {
        for (let j = 0; j < 4; j++) {
            let column = grid.map(row => row[j]);
            if (direction === 'down') column = column.reverse();
            
            column = column.filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            while (column.length < 4) column.push(0);
            if (direction === 'down') column = column.reverse();
            for (let i = 0; i < 4; i++) {
                grid[i][j] = column[i];
            }
        }
    }

    moved = JSON.stringify(oldGrid) !== JSON.stringify(grid);
    if (moved) {
        addNewTile();
        document.getElementById('score').textContent = score;
    }
    updateDisplay();
    
    if (isGameOver()) {
        alert('游戏结束！');
    }
}

function isGameOver() {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    
    // 检查是否有相邻的相同数字
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    return true;
}

function newGame() {
    initGrid();
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            move('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            move('right');
            break;
        case 'ArrowUp':
            e.preventDefault();
            move('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            move('down');
            break;
    }
});

// 触摸控制
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) move('right');
        else move('left');
    } else {
        if (dy > 0) move('down');
        else move('up');
    }
});

// 初始化游戏
initGrid();
