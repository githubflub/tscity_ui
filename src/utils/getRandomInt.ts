// Returns a random integer between min (inclusive) and max (inclusive)
export const getRandomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;