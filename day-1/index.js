const fs = require("fs");
const path = require("path");

function importFile(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  return file;
}

function Pointer() {
  this.value = 50;
  this.passedZeroCounter = 0;
  this.turnLeft = (value) => {
    const remainder = value % 100;
    const divider = (value - remainder) / 100;
    let passedZero = false;
    if (this.value - remainder < 0) {
      if (this.value !== 0) {
        passedZero = true;
      }
      this.value = 100 + (this.value - remainder);
    } else {
      this.value -= remainder;
    }

    this.value = this.value % 100;
    if ((this.value !== 0 && passedZero) || divider > 0) {
      this.passedZeroCounter += divider + (passedZero ? 1 : 0);
    }
  };
  this.turnRight = (value) => {
    let passedZero = false;
    const remainder = value % 100;
    const divider = (value - remainder) / 100;
    if (this.value + remainder > 100) {
      if (this.value !== 0) {
        passedZero = true;
      }
      this.value = remainder - (100 - this.value);
    } else {
      this.value += remainder;
    }
    this.value = this.value % 100;
    if ((this.value !== 0 && passedZero) || divider > 0) {
      this.passedZeroCounter += divider + (passedZero ? 1 : 0);
    }
  };
  this.turn = (direction, value, callback) => {
    if (direction === "L") {
      this.turnLeft(value);
    } else {
      this.turnRight(value);
    }
    callback(this.value);
  };
  return this;
}

function main() {
  const contents = importFile(path.join(__dirname, "input.txt"));
  let lines = contents.split("\n");

  const parseLine = (line) => {
    const direction = line[0];
    const distance = parseInt(line.slice(1));
    return { direction, distance };
  };

  const pointer = new Pointer();

  let counter = 0;
  lines.forEach((line) => {
    const { direction, distance } = parseLine(line);
    pointer.turn(direction, distance, (value) => {
      if (value === 0) {
        counter++;
      }
    });
  });

  console.log("Answer for part 1: ", counter);
  console.log("Answer for part 2: ", pointer.passedZeroCounter + counter);
}

main();
