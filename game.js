const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnRight = document.querySelector('#right');
const btnLeft = document.querySelector('#left');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
let margin = 8;

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
		canvasSize = window.innerWidth * 0.7;
	} else {
		canvasSize = window.innerHeight * 0.7;
	}

	canvasSize = Number(canvasSize.toFixed(0));

	elementsSize = Math.ceil(canvasSize / 10);

	canvasSize = elementsSize * 10;

	canvas.setAttribute('width', canvasSize);
	canvas.setAttribute('height', canvasSize + margin); // Margin

	playerPosition.x = undefined;
	playerPosition.y = undefined;
	startGame();
}

function startGame() {
	game.font = elementsSize + 'px Verdana';
	game.textAlign = 'end';

	const map = maps[level];

	if (!map) {
		screenGameFinished();
		return;
	}

	if (!timeStart) {
		timeStart = Date.now();
		timeInterval = setInterval(showTime, 1000);
		showRecord();
	}

	const mapRows = map.trim().split('\n');
	const mapRowCols = mapRows.map(row => row.trim().split(''));
	
	showLives();

	enemyPositions = [];
	game.clearRect(0, 0, canvasSize, canvasSize);
	mapRowCols.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = elementsSize * (colIndex + 1);
			const posY = elementsSize * (rowIndex + 1);
			
			if (col == 'O') {
				if (!playerPosition.x && !playerPosition.y) {
					playerPosition.x = posX + margin;
					playerPosition.y = posY;
				}
			} else if (col == 'I') {
				giftPosition.x = posX + margin;
				giftPosition.y = posY;
			} else if (col == 'X') {
				enemyPositions.push({
					x: posX + margin,
					y: posY
				});
			}

			game.fillText(emoji, posX + margin, posY);
		});
	});

	movePlayer();
}

function screenLevelFailed() {
	const map = maps[level];

	const mapRows = map.trim().split('\n');
	const mapRowCols = mapRows.map(row => row.trim().split(''));

	playerPosition.x = undefined;
	playerPosition.y = undefined;
	game.clearRect(0, 0, canvasSize, canvasSize);
	mapRowCols.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			let emoji = emojis[col];
			const posX = elementsSize * (colIndex + 1);
			const posY = elementsSize * (rowIndex + 1);
			
			if (col == 'X') {
				emoji = emojis['GAME_OVER'];
			}

			game.fillText(emoji, posX + margin, posY);
		});
	});

	setTimeout(() => {levelFailed()}, 1500);
}

function screenGameFinished() {
	const map = maps[level - 1];

	const mapRows = map.trim().split('\n');
	const mapRowCols = mapRows.map(row => row.trim().split(''));

	game.clearRect(0, 0, canvasSize, canvasSize);
	mapRowCols.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			let emoji = emojis[col];
			const posX = elementsSize * (colIndex + 1);
			const posY = elementsSize * (rowIndex + 1);
			
			if (col == 'X') {
				emoji = emojis['WIN'];
			}

			game.fillText(emoji, posX + margin, posY);
		});
	});

	setTimeout(() => {gameFinished()}, 1500);
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
		if (lives > 1) {
			bombExplosion(enemyCollision);
		} else {
			screenLevelFailed();
		}
	}

	game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function bombExplosion(posEnemy) {
	playerPosition.x = undefined;
	playerPosition.y = undefined;
	game.clearRect(
		posEnemy.x - elementsSize - margin, 
		posEnemy.y - elementsSize + margin, 
		elementsSize, 
		elementsSize
	);
	game.fillText(emojis['BOOM'], posEnemy.x, posEnemy.y);
	setTimeout(() => {levelFailed()}, 500);
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
		timeStart = undefined;
	}
	playerPosition.x = undefined;
	playerPosition.y = undefined;
	startGame();
}

function gameFinished() {
	clearInterval(timeInterval);
	const recordTime = localStorage.getItem('record_time');
	const playerTime = Math.floor((Date.now() - timeStart) / 1000);
	if (recordTime) {
		if (recordTime >= playerTime) {
			localStorage.setItem('record_time', playerTime);
			pResult.innerHTML = 'SUPERASTE EL RECORD!';
		} else {
			pResult.innerHTML = 'Lo siento, no has superado el record';
		}
	} else {
		localStorage.setItem('record_time', playerTime);
	}

	window.location.reload();
}

function showLives() {
	const heartsArray = Array(lives).fill(emojis['HEART']);
	spanLives.innerHTML = '';
	heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
	spanTime.innerHTML = Math.floor((Date.now() - timeStart) / 1000);
}

function showRecord() {
	const record = localStorage.getItem('record_time');
	spanRecord.innerHTML = record ? record : 'Aún no hay un record registrado.';
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
	if (playerPosition.x + margin < canvasSize) {
		playerPosition.x += elementsSize;
		startGame();
	}
}

function moveLeft() {
	if (playerPosition.x - 8 > elementsSize) {
		playerPosition.x -= elementsSize;
		startGame();
	}
}