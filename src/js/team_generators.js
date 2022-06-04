import { getRandomNumber, getNotUniqueRandomSequence } from './random_generators';

export function getRandomLevel(maxLevel, minLevel = 1) {
  return getRandomNumber(maxLevel, minLevel);
}

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  yield* allowedTypes.map((CharacterClass) => new CharacterClass(getRandomLevel(maxLevel)));
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [...characterGenerator(allowedTypes, maxLevel)];
  const indices = getNotUniqueRandomSequence(characterCount, characters.length - 1, 0);
  return indices.map((index) => characters[index]);
}
