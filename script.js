const width = 10; //width of the grid
const grid = document.querySelector(".container");
let boxes = Array.from(document.querySelectorAll(".container div"));
const display = document.getElementById("no");
let nextRandom = 0;
let score = 0;
const startBtn = document.getElementById("start");
const colours = ["red", "blue", "green", "orange", "purple"];

const lTetramino = [
  //drawing the tetramino on the grid
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];
const zTetramino = [
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
];
const tTetramino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];
const oTetramino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];
const iTetramino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const Tetraminoes = [
  lTetramino,
  zTetramino,
  tTetramino,
  oTetramino,
  iTetramino,
];
var random = Math.floor(Math.random() * Tetraminoes.length);
let currentPosition = 4; //makes the tetraminoes appear in the midle of the grid
let currentRot = 0;
let current = Tetraminoes[random][0];
var timer;
document.addEventListener("keyup", key);

//controls key presses
function key(e) {
  if (e.keyCode === 37) {
    left();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    right();
  } else if (e.keyCode == 40) {
    down();
  }
}

function draw() {
  current.forEach((index) => {
    boxes[currentPosition + index].style.backgroundColor = colours[random];
  });
}

function undraw() {
  current.forEach((index) => {
    boxes[currentPosition + index].style.removeProperty("background-color");
  });
}

function down() {
  undraw();
  currentPosition += width;
  draw();
  stop();
}
//freeze the tetramino when it gets to the bottom
function stop() {
  if (
    current.some((index) =>
      boxes[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      boxes[currentPosition + index].classList.add("taken")
    );

    random = nextRandom;
    nextRandom = Math.floor(Math.random() * Tetraminoes.length);
    current = Tetraminoes[random][currentRot];
    currentPosition = 4;
    draw();
    displayMini();
    addScore();
    gameOver();
  }
}

function left() {
  undraw();
  const allowed = current.some(
    (index) => (currentPosition + index) % width === 0
  );

  if (!allowed) {
    currentPosition -= 1;
  }
  if (
    current.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

function right() {
  undraw();
  const allowed = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  if (!allowed) {
    currentPosition += 1;
  }
  if (
    current.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}
//loops the tetramino rotations ie array
function rotate() {
  undraw();
  currentRot++;
  if (currentRot == current.length) {
    currentRot = 0;
  }
  current = Tetraminoes[random][currentRot];
  draw();
}
//display upcoming tetramino in mini
const mini = Array.from(document.querySelectorAll(".mini div"));
const miniWidth = 4;
const miniIndex = 0;

const next = [
  [1, miniWidth + 1, miniWidth * 2 + 1, 2],//ltetramino
  [0, miniWidth, miniWidth + 1, miniWidth * 2 + 1],//ztetramino
  [1, miniWidth, miniWidth + 1, miniWidth + 2],//ttetramino
  [0, 1, miniWidth, miniWidth + 1],//otetramino
  [1, miniWidth + 1, miniWidth * 2 + 1, miniWidth * 3 + 1],//itetramino
];

function displayMini() {
  mini.forEach((box) => {
    //remove any trace of tetraminoes
    box.style.removeProperty("background-color");
  });
  next[nextRandom].forEach((index) => {
    mini[miniIndex + index].style.backgroundColor = colours[nextRandom];
  });
}
startBtn.addEventListener("click", () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  } else {
    draw();
    timer = setInterval(down, 1000);
    nextRandom = Math.floor(Math.random() * Tetraminoes.length);
    displayMini();
  }
});

function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => boxes[index].classList.contains("taken"))) {
      score += 10;
      display.innerHTML = score;
      row.forEach((index) => {
        boxes[index].classList.remove("taken");
        boxes[index].style.removeProperty("background-color");
      });
      const removed = boxes.splice(i, width);
      boxes = removed.concat(boxes);
      boxes.forEach((box) => grid.appendChild(box));
    }
  }
}

function gameOver() {
  if (
    current.some((index) =>
      boxes[currentPosition + index].classList.contains("taken")
    )
  ) {
    clearInterval(timer);
    grid.innerHTML = "Game Over";
  }
}
