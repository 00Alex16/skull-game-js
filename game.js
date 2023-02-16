const canvas = document.querySelector('.game');
const game = canvas.getContext('2d');

let canvasSize;
let elementsSize;

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

	mapRowCols.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const posX = elementsSize * (colIndex + 1);
			const posY = elementsSize * (rowIndex + 1);
			game.fillText(emoji, posX, posY);
		});
	});
}