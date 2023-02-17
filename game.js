const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnRight = document.querySelector('#right');
const btnLeft = document.querySelector('#left');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

const playerPosition = {
	x: undefined,
	y: undefined
}
const giftPosition = {
	x: undefined,
	y: undefined
}
let enemyPositions = [];

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

	const map = maps[level];

	if (!map) {
		gameFinished();
		return;
	}

	const mapRows = map.trim().split('\n');
	const mapRowCols = mapRows.map(row => row.trim().split(''));

	enemyPositions = [];
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
			} else if (col == 'I') {
				giftPosition.x = posX;
				giftPosition.y = posY;
			} else if (col == 'X') {
				enemyPositions.push({
					x: posX,
					y: posY
				});
			}
			
			game.fillText(emoji, posX, posY);
		});
	});

	movePlayer();
}

function movePlayer() {
	const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
	const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
	const giftCollision = giftCollisionX && giftCollisionY;
	if (giftCollision) {
		nextLevel();
	}

	const enemyCollision = enemyPositions.find(enemy => {
		const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
		const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
		return enemyCollisionX && enemyCollisionY;
	});
	if (enemyCollision) {
		levelFailed();
	}

	game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function nextLevel() {
	level ++;
	startGame();
}

function levelFailed() {
	lives--;
	if (lives <= 0) {
		level = 0;
		lives = 3;
	}
	playerPosition.x = undefined;
	playerPosition.y = undefined;
	startGame();
}

function gameFinished() {
	console.log('You finished the game!');
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