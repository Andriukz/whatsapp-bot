function getRandom(min, max) {
  const floatRandom = Math.random();

  const difference = max - min;

  // random between 0 and the difference
  const random = Math.round(difference * floatRandom);

  const randomWithinRange = random + min;

  return randomWithinRange;
}

/**
 * Gets a random element from an array
 * @param {*} arr
 * @returns random element
 */
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysFromDateToToday(date) {
  const today = new Date();
  const differenceInTime = today.getTime() - date.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.floor(differenceInDays);
}

export default {
  getRandom,
  getRandomElement,
  daysFromDateToToday,
};
