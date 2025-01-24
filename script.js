function cursor(c) {
  // CONSTANTS
  const CELL_SIZE = 30;
  const COLOR_R = 250;
  const COLOR_G = 249;
  const COLOR_B = 218;
  const STARTING_ALPHA = 200;
  const BACKGROUND_COLOR = "#A9A1C8";
  const PROB_OF_NEIGHBOR = 0.3;
  const AMT_FADE_PER_FRAME = 10;
  const STROKE_WEIGHT = 1;

  // VARIABLES
  let colorWithAlpha;
  let numRows;
  let numCols;
  let currentRow = -1;
  let currentCol = -1;
  let allNeighbors = [];

  c.setup = function () {
    let cnv = c.createCanvas(c.windowWidth, c.windowHeight);
    cnv.style("position", "fixed");
    cnv.style("inset", 0);
    cnv.style("z-index", -1);
    colorWithAlpha = c.color(COLOR_R, COLOR_G, COLOR_B, STARTING_ALPHA);
    c.noFill();
    c.stroke(colorWithAlpha);
    c.strokeWeight(STROKE_WEIGHT);
    numRows = Math.ceil(c.windowHeight / CELL_SIZE);
    numCols = Math.ceil(c.windowWidth / CELL_SIZE);
  };

  c.draw = function () {
    c.clear();
    c.background(c.color(BACKGROUND_COLOR + "AA"));

    let row = Math.floor(c.mouseY / CELL_SIZE);
    let col = Math.floor(c.mouseX / CELL_SIZE);

    if (row !== currentRow || col !== currentCol) {
      currentRow = row;
      currentCol = col;

      allNeighbors.push(...getRandomNeighbors(row, col));
    }

    let x = currentCol * CELL_SIZE;
    let y = currentRow * CELL_SIZE;

    c.stroke(colorWithAlpha);
    c.rect(x, y, CELL_SIZE, CELL_SIZE);

    for (let neighbor of allNeighbors) {
      let neighborX = neighbor.col * CELL_SIZE;
      let neighborY = neighbor.row * CELL_SIZE;
      neighbor.opacity = Math.max(0, neighbor.opacity - AMT_FADE_PER_FRAME);
      c.stroke(COLOR_R, COLOR_G, COLOR_B, neighbor.opacity);
      c.rect(neighborX, neighborY, CELL_SIZE, CELL_SIZE);
    }

    allNeighbors = allNeighbors.filter((n) => n.opacity > 0);
  };

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

  c.windowResized = function () {
    c.resizeCanvas(c.windowWidth, c.windowHeight);
    numRows = Math.ceil(c.windowHeight / CELL_SIZE);
    numCols = Math.ceil(c.windowWidth / CELL_SIZE);
  };
}

new p5(cursor);

function foregroundCanvas(f) {
  let angle = 0;
  let shuttle;

  f.preload = function () {
    shuttle = f.loadModel("shuttle.obj", true);
    earth = f.loadImage(
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExajgyM3B6eGJ0NGUwbjRwMTh3NzNjdG83bThlOXJqYTloMW02bnVydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GiXbMe92rt9NS/giphy.gif"
    );
  };

  f.setup = function () {
    let cnv = f.createCanvas(500, 500, f.WEBGL);
    cnv.style("position", "fixed");
    cnv.style("z-index", 1);
    cnv.style("bottom", "0px");
    cnv.style("right", "0px");
    f.describe("A space shuttle orbiting the earth.");
  };

  f.draw = function () {
    f.clear();
    f.background(255, 255, 255, 0);

    f.push();
    f.translate(0, 0);
    f.imageMode(f.CENTER);
    f.image(earth, 0, 0, 200, 200);
    f.pop();

    let radius = 200;
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);

    let tangentAngle = angle + Math.PI / 100;

    f.push();
    f.translate(x, y, 0);
    f.rotateZ(tangentAngle);
    f.rotateY(angle);
    f.scale(0.5);
    f.normalMaterial();
    f.model(shuttle);
    f.pop();

    angle -= 0.02;
  };

  // f.windowResized = function () {
  //   f.resizeCanvas(f.windowWidth, f.windowHeight);
  // };
}

new p5(foregroundCanvas);
