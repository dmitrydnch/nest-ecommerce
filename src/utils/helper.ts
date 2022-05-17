export function getRandomNumber(count) {
  let num = '';
  for (let i = 0; i < count; i++) {
    num += getRandomInt(0, 9);
  }

  return num;
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
