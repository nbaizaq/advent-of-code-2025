const fs = require("fs");
const path = require("path");

function importFile(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  return file;
}

function getOperationFunction(operation) {
  if (operation === "+") {
    return (a, b) => a + b;
  } else if (operation === "*") {
    return (a, b) => a * b;
  } else {
    throw new Error(`Invalid operation: ${operation}`);
  }
}

function calculateCol(numbers, col, _operationFunction) {
  if (numbers.length === 0) return 0;

  let result = numbers[0][col];
  for (let row = 1; row < numbers.length; row++) {
    result = _operationFunction(result, numbers[row][col]);
  }
  return result;
}

function calculate(numbers, operations) {
  let sum = 0;
  for (let col = 0; col < operations.length; col++) {
    const operation = operations[col];
    const operationFunction = getOperationFunction(operation);

    let result = calculateCol(numbers, col, operationFunction);
    sum += result;
  }
  return sum;
}

function calculateCol2(numbers, col, _operationFunction) {
  if (numbers.length === 0) return 0;

  let columnNumbers = numbers.map((row) => row[col]).map(String);
  let maxLength = 0;
  for (let i = 0; i < columnNumbers.length; i++) {
    const number = columnNumbers[i];
    if (number.length > maxLength) {
      maxLength = number.length;
    }
  }

  for (let i = 0; i < columnNumbers.length; i++) {
    let number = columnNumbers[i];
    number = number.padEnd(maxLength, " ");
    columnNumbers[i] = number;
  }

  const newNumbers = [];
  while (columnNumbers.length > 0) {
    let newNumber = "";
    for (let i = 0; i < columnNumbers.length; i++) {
      let number = columnNumbers[i];
      newNumber += number.slice(number.length - 1);
      number = number.slice(0, number.length - 1);
      columnNumbers[i] = number;
    }
    columnNumbers = columnNumbers.filter((number) => number.length > 0);
    newNumbers.push(Number(newNumber.trim()));
  }

  return 0;
}

function calculate2(numbers, operations, separators) {
  let sum = 0;
  let lastSeparator = separators.pop();
  let lastOperation = operations.pop();
  let lastOperationFunction = getOperationFunction(lastOperation);

  let i = numbers[0].length - 1;
  let columnNumbers = [];
  while (true) {
    if (i === lastSeparator) {
      let _sum = columnNumbers.pop();
      while (columnNumbers.length > 0) {
        _sum = lastOperationFunction(_sum, columnNumbers.pop());
      }
      sum += _sum;
      columnNumbers = [];

      lastSeparator = separators.pop();
      lastOperation = operations.pop();
      lastOperationFunction = getOperationFunction(lastOperation);
      i--;
      continue;
    }

    if (i < 0) {
      let _sum = columnNumbers.pop();
      while (columnNumbers.length > 0) {
        _sum = lastOperationFunction(_sum, columnNumbers.pop());
      }
      sum += _sum;

      break;
    }

    const number = numbers
      .map((row) => row[i])
      .join("")
      .trim();
    columnNumbers.push(Number(number));
    i--;
  }
  return sum;
}

function parseLines(rawNumbers) {
  let separators = [];
  for (let i = 0; i < rawNumbers[0].length; i++) {
    const isSeparator = rawNumbers.every((number) => number[i] === " ");
    if (isSeparator) {
      separators.push(i);
    }
  }
  return separators;
}

function main() {
  const contents = importFile(path.join(__dirname, "input.txt"));

  const lines = contents
    .split("\n")
    .map((line) => line.split(" ").filter(Boolean));
  const numbers = lines
    .slice(0, lines.length - 1)
    .map((line) => line.map(Number));
  const operations = lines.slice(lines.length - 1).flatMap((line) => line);
  const sum = calculate(numbers, operations);
  console.log("Answer for part 1: ", sum);

  const rawLines = contents.split("\n");
  const rawNumbers = rawLines.slice(0, rawLines.length - 1);
  const separators = parseLines(rawNumbers);
  const sum2 = calculate2(rawNumbers, operations, separators);
  console.log("Answer for part 2: ", sum2);
}

main();
