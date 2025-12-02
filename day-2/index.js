const fs = require("fs");
const path = require("path");

function importFile(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  return file;
}

function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

function isInvalid(number) {
  const numberString = number.toString();
  return (
    numberString.length % 2 == 0 &&
    numberString.slice(0, numberString.length / 2) ===
      numberString.slice(numberString.length / 2)
  );
}

function isInvalidPart2(number) {
  for (let i = 1; i <= number.length; i++) {
    if (number.length % i !== 0) continue;

    const part = number.slice(0, i);
    const parts = number.split(part);
    if (parts.every((part) => part === "") && parts.length >= 3) {
      return true;
    }
  }
  // throw new Error("No invalid part 2 found");
  return false;
}

function main() {
  const contents = importFile(path.join(__dirname, "input.txt"));
  const ranges = contents.split(",");
  const rangePairs = ranges.map((range) => {
    const [start, end] = range.split("-");
    return { start: parseInt(start), end: parseInt(end) };
  });
  let sum = 0;
  let sum2 = 0;
  rangePairs.forEach((rangePair) => {
    for (const number of range(rangePair.start, rangePair.end)) {
      if (isInvalid(number)) {
        sum += number;
      }

      if (isInvalidPart2(number.toString())) {
        sum2 += number;
      }
    }
  });

  console.log("Answer for part 1: ", sum);
  console.log("Answer for part 2: ", sum2);
}

main();
