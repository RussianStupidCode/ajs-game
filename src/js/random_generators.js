export function getRandomNumber(max, min = 0) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}

export function getUniqueRandomSequence(length, maxValue, minValue = 0) {
  const sequence = new Set();
  while (sequence.size < length) {
    const randomNumber = getRandomNumber(maxValue, minValue);

    if (!sequence.has(randomNumber)) {
      sequence.add(randomNumber);
    }
  }

  return sequence;
}

export function getNotUniqueRandomSequence(length, maxValue, minValue = 0) {
  return Array(length).fill(0).map(() => getRandomNumber(maxValue, minValue));
}

export function getRandomElements(iterable, count) {
  const elements = [...iterable];
  const indices = getUniqueRandomSequence(count, elements.length - 1);

  return elements.filter((el, index) => indices.has(index));
}
