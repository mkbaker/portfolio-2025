// CONSTANTS
const CELL_SIZE = 30;
const COLOR_R = 250;
const COLOR_G = 249;
const COLOR_B = 218;
const STARTING_ALPHA = 255;
const BACKGROUND_COLOR = "#A9A1C8";
const PROB_OF_NEIGHBOR = 0.3;
const AMT_FADE_PER_FRAME = 25;
const STROKE_WEIGHT = 1;

// VARIABLES
let colorWithAlpha;
let numRows;
let currentRow = -1;
let currentCol = -1;
let allNeighbors = [];

let font;
let points = [];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style("position", "fixed");
  cnv.style("inset", 0);
  cnv.style("z-index", -1);
  colorWithAlpha = color(COLOR_R, COLOR_G, COLOR_B, STARTING_ALPHA);
  noFill();
  //   stroke(colorWithAlpha);
  strokeWeight(STROKE_WEIGHT);
  numRows = Math.ceil(windowHeight / CELL_SIZE);
  numCols = Math.ceil(windowWidth / CELL_SIZE);
}

function draw() {
  background(BACKGROUND_COLOR);
  let row = floor(mouseY / CELL_SIZE);
  let col = floor(mouseX / CELL_SIZE);

  if (row !== currentRow || col !== currentCol) {
    currentRow = row;
    currentCol = col;

    // rect(x, y, CELL_SIZE, CELL_SIZE);
    allNeighbors.push(...getRandomNeighbors(row, col));
  }

  let x = currentCol * CELL_SIZE;
  let y = currentRow * CELL_SIZE;

  stroke(colorWithAlpha);
  rect(x, y, CELL_SIZE, CELL_SIZE);

  for (let neighbor of allNeighbors) {
    let neighborX = neighbor.col * CELL_SIZE;
    let neighborY = neighbor.row * CELL_SIZE;
    neighbor.opacity = max(0, neighbor.opacity - AMT_FADE_PER_FRAME);
    stroke(COLOR_R, COLOR_G, COLOR_B, neighbor.opacity);
    rect(neighborX, neighborY, CELL_SIZE, CELL_SIZE);
  }

  allNeighbors = allNeighbors.filter((n) => n.opacity > 0);
}

function getRandomNeighbors(row, col) {
  let neighbors = [];

  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      let neighborRow = row + dRow;
      let neighborCol = col + dCol;

      let isCurrentCell = dRow === 0 && dCol === 0;

      let isInBounds =
        neighborRow >= 0 &&
        neighborRow < numRows &&
        neighborCol >= 0 &&
        neighborCol < numCols;

      if (!isCurrentCell && isInBounds && Math.random() < PROB_OF_NEIGHBOR) {
        neighbors.push({
          row: neighborRow,
          col: neighborCol,
          opacity: STARTING_ALPHA,
        });
      }
    }
  }

  return neighbors;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  numRows = Math.ceil(windowHeight / CELL_SIZE);
  numCols = Math.ceil(windowWidth / CELL_SIZE);
}
