const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnRight = document.querySelector('#right');
const btnLeft = document.querySelector('#left');

let canvasSize;
let elementsSize;

const playerPosition = {
	x: undefined,
	y: undefined
}

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
	if (window.innerHeight > window.innerWidth) {
		canvasSize = window.innerWidth * 0.8;
	} else {
		canvasSize = window.innerHeight * 0.8;
	}

	canvas.setAttribute('width', canvasSize);
	canvas.setAttribute('height', canvasSize);

	elementsSize = canvasSize / 10;

	startGame();
}

function startGame() {
	console.log({canvasSize, elementsSize});
	game.font = elementsSize + 'px Verdana';
	game.textAlign = 'end';

	const map = maps[0];
	const mapRows = map.trim().split('\n');
	const mapRowCols = mapRows.map(row => row.trim().split(''));

	game.clearRect(0, 0, canvasSize, canvasSize);
	mapRowCols.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = elementsSize * (colIndex + 1);
			const posY = elementsSize * (rowIndex + 1);
			
			if (col == 'O') {
				if (!playerPosition.x && !playerPosition.y) {
					playerPosition.x = posX;
					playerPosition.y = posY;
				}
			}
			
			game.fillText(emoji, posX, posY);
		});
	});

	movePlayer();
}

function movePlayer() {
	game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnRight.addEventListener('click', moveRight);
btnLeft.addEventListener('click', moveLeft);

function moveByKeys(event) {
	// Cuando el if tiene una sola linea se puede abreviar quitando las llaves
	if (event.key == 'ArrowUp') moveUp();
	else if (event.key == 'ArrowDown') moveDown();
	else if (event.key == 'ArrowRight') moveRight();
	else if (event.key == 'ArrowLeft') moveLeft();
}

function moveUp() {
	if (playerPosition.y > elementsSize) {
		playerPosition.y -= elementsSize;
		startGame();
	}
}

function moveDown() {
	if (playerPosition.y < canvasSize) {
		playerPosition.y += elementsSize;
		startGame();
	}
}

function moveRight() {
	if (playerPosition.x < canvasSize) {
		playerPosition.x += elementsSize;
		startGame();
	}
}

function moveLeft() {
	if (playerPosition.x > elementsSize) {
		playerPosition.x -= elementsSize;
		startGame();
	}
}