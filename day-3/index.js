const fs = require("fs");
const path = require("path");

function importFile(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  return file;
}

function findMaxLessThan(numbers, options) {
  let start = options?.start ?? 0;
  let end = options?.end ?? numbers.length;
  let max, pointer;
  for (let i = start; i < end; i++) {
    if (max === undefined) {
      max = numbers[i];
      pointer = i;
    }

    if (numbers[i] > max) {
      max = numbers[i];
      pointer = i;
    }
  }
  if (max === undefined) return undefined;

  return { value: max, pointer };
}

function getHighestNumber(numbers) {
  let max, secondMax;
  while (true) {
    if (max === undefined) {
      max = findMaxLessThan(numbers);
      if (max === undefined) throw new Error("No max found");
    }

    if (secondMax === undefined) {
      secondMax = findMaxLessThan(numbers, {
        start: max.pointer + 1,
      });
      if (secondMax === undefined) {
        max = findMaxLessThan(numbers, {
          end: max.pointer,
        });
        continue;
      }

      return Number(max.value + "" + secondMax.value);
    }
  }
}

function getHighestNumber2(numbers) {
  let max = [];
  while (true) {
    if (max.length === 12) break;

    let last = max.length > 0 ? max[max.length - 1] : undefined;
    if (last === undefined) {
      last = findMaxLessThan(numbers, {
        end: numbers.length - 12 + 1,
      });
      if (last === undefined) throw new Error("No max found");
      max.push(last);
    } else {
      const next = findMaxLessThan(numbers, {
        start: last.pointer + 1,
        end: numbers.length - 12 + max.length + 1,
      });
      if (next === undefined) {
        max.pop();
        continue;
      } else {
        max.push(next);
      }
    }
  }
  return Number(max.map((m) => m.value).join(""));
}

function main() {
  const contents = importFile(path.join(__dirname, "input.txt"));
  const lines = contents.split("\n").map((line) => line.split("").map(Number));

  let sum = 0;
  let sum2 = 0;
  lines.forEach((line, index) => {
    const highestNumber = getHighestNumber(line);
    const highestNumber2 = getHighestNumber2(line);
    sum += highestNumber;
    sum2 += highestNumber2;
  });

  console.log("Answer for part 1: ", sum);
  console.log("Answer for part 2: ", sum2);
}

main();
