const grid = document.querySelector('.grid');
const text = document.querySelector('.text h2');

let width = 10;
let bombAmount = 10;
let squares = [];
let isGameOver = false;
let flags = 0;

//create board
function createBoard() {
    isGameOver = false;

    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width * width - bombAmount).fill('valid');

    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);


    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);

        //normal click
        square.addEventListener('click', function(e) {
            click(square);
        });

        //control and left click
        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(square);
        }
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
            if (i >= 10 && squares[i - width].classList.contains('bomb')) total++;
            if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
            if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
            if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
            if (i <= 89 && squares[i + width].classList.contains('bomb')) total++;
            squares[i].setAttribute('data', total);
            console.log(squares[i]);

        }
    }
    text.textContent = `Flags left: ${bombAmount - flags}`;

}

createBoard();

//add flag with right click
function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            square.innerHTML = '🚩';
            square.style.backgroundColor = 'rgba(0,0,0, .5)';
            square.style.border = '2px inset rgba(0,0,0, .5)'
            flags++;
            checkForWin();
        } else {
            square.classList.remove('flag');
            square.style.backgroundColor = '';
            square.style.border = '';
            square.innerHTML = '';
            flags--;
        }
        text.textContent = `Flags left: ${bombAmount - flags}`;
    }
}

//click on square actions
function click(square) {
    let currentId = square.id;

    if (isGameOver) return;
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;

    if (square.classList.contains('bomb')) {
        isGameOver = true;
        gameOver(square);


    } else {
        let total = square.getAttribute('data');
        if (total != 0) {
            if (total == 1) {
                square.classList.add('color1');
            } else if (total == 2) {
                square.classList.add('color2');
            } else if (total == 3) {
                square.classList.add('color3');
            } else if (total == 4) {
                square.classList.add('color4');
            } else if (total == 5) {
                square.classList.add('color5');
            } else {
                square.classList.add('color6');
            }
            square.classList.add('checked');
            square.innerHTML = total;
            return;
        }
        checkSquare(square, currentId);

    }
    square.classList.add('checked');
}

//check neighboring squares once square is cliked
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 10) {
            const newId = squares[parseInt(currentId - width)].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 11 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 - width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 98 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 90 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 88 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId < 89) {
            const newId = squares[parseInt(currentId) + width].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    }, 20);
}

//game over
function gameOver(square) {
    console.log("BOOM!!! Game over");
    isGameOver = true;

    //show all bombs
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '💣';
            square.style.border = '1px inset orange';
            square.style.backgroundColor = "rgba(255, 165, 0, .6)";

        }
    });
}

//check for win
function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++;
        }
        if (matches === bombAmount) {
            console.log('YOU WIN!!!');
            isGameOver = true;
        }
    }
}