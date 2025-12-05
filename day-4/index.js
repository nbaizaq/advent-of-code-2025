const fs = require("fs");
const path = require("path");

function importFile(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  return file;
}

function isAccessible(grid, i, j) {
  let count = 0;
  const positionsAround = [
    [i - 1, j - 1], // top left
    [i - 1, j], // left
    [i - 1, j + 1], // bottom left
    [i, j - 1], // top
    [i, j + 1], // bottom
    [i + 1, j - 1], // top right
    [i + 1, j], // right
    [i + 1, j + 1], // bottom right
  ];
  for (let i = 0; i < positionsAround.length; i++) {
    const [x, y] = positionsAround[i];
    if (x < 0 || y < 0 || x >= grid.length || y >= grid[x].length) {
      continue;
    }

    if (isRoll(grid, x, y)) {
      count++;
    }
  }

  return count < 4;
}

const isRoll = (grid, i, j) => grid[i][j] === "@";

function countAccessible(grid) {
  let sum = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (isRoll(grid, i, j) && isAccessible(grid, i, j)) {
        sum++;
      }
    }
  }
  return sum;
}

function countAccessible2(grid) {
  let sum = 0;

  let accessiblePositions = [];

  while (true) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (isRoll(grid, i, j) && isAccessible(grid, i, j)) {
          accessiblePositions.push([i, j]);
          sum++;
        }
      }
    }

    if (accessiblePositions.length === 0) {
      break;
    }

    removeAccessiblePositions(grid, accessiblePositions);
    accessiblePositions = [];
  }

  return sum;
}

function removeAccessiblePositions(grid, accessiblePositions) {
  for (let i = 0; i < accessiblePositions.length; i++) {
    const [x, y] = accessiblePositions[i];
    grid[x][y] = ".";
  }
}

function main() {
  const contents = importFile(path.join(__dirname, "input.txt"));
  const lines = contents.split("\n").map((line) => line.split(""));

  const sum = countAccessible(lines);
  const sum2 = countAccessible2(lines);

  console.log("Answer for part 1: ", sum);
  console.log("Answer for part 2: ", sum2);
}

main();
