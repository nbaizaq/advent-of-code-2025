const fs = require("fs");
const path = require("path");

function importFile(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  return file;
}

function getFreshIdCount({ ranges, ids }) {
  let count = 0;
  ids.forEach((id) => {
    let isFresh = ranges.some((range) => id >= range[0] && id <= range[1]);
    count += isFresh ? 1 : 0;
  });

  return count;
}

const isFullOverlap = (range1, range2) => {
  return (
    (range1[0] <= range2[0] && range2[1] <= range1[1]) ||
    (range2[0] <= range1[0] && range1[1] <= range2[1])
  );
};

const isPartialOverlap = (range1, range2) => {
  return (
    (range1[0] <= range2[0] && range2[0] <= range1[1]) ||
    (range2[0] <= range1[0] && range1[0] <= range2[1])
  );
};

const isOverlapping = (range1, range2) => {
  return isFullOverlap(range1, range2) || isPartialOverlap(range1, range2);
};

const getNewRange = (range1, range2) => [
  Math.min(range1[0], range2[0]),
  Math.max(range1[1], range2[1]),
];

function getFreshRangeIdCount(ranges) {
  // NOTE: sort range by start index to faster find overlapping ranges
  ranges.sort((a, b) => a[0] - b[0]);
  let i = 0;
  let j = 0;
  let currentRange, nextRange;
  while (i < ranges.length) {
    if (currentRange === undefined) {
      currentRange = ranges[i];
      j = i + 1;
      nextRange = ranges[j];
    }

    if (nextRange === undefined) {
      break;
    }

    if (isOverlapping(currentRange, nextRange)) {
      const newRange = getNewRange(currentRange, nextRange);
      ranges.splice(i, 2, newRange);
      currentRange = ranges[i];
      nextRange = ranges[j];
    } else {
      i = j;
      j = i + 1;
      currentRange = ranges[i];
      nextRange = ranges[j];
    }
  }

  let count = 0;
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    count += range[1] - range[0] + 1;
  }

  return count;
}

function main() {
  const contents = importFile(path.join(__dirname, "input.txt"));
  const lines = contents.split("\n");

  const ranges = [];
  const ids = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") {
      ranges.push(
        ...lines.slice(0, i).map((line) => line.split("-").map(Number))
      );
      ids.push(...lines.slice(i + 1).map(Number));
    }
  }

  const freshIdCount = getFreshIdCount({ ranges, ids });
  const freshRangeIdCount = getFreshRangeIdCount(ranges);

  console.log("Answer for part 1: ", freshIdCount);
  console.log("Answer for part 2: ", freshRangeIdCount);
}

main();
