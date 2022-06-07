import CharacterFactory from './CharacterFactory';
import PositionedCharacter from './PositionedCharacter';

export default class Team {
  static from(object) {
    const team = new Team(object.name, object.maxLength);

    const positionedCharacters = object.positionedCharacters.map(({ character, position }) => {
      const restoredCharacter = CharacterFactory.createCharacter(character);
      return new PositionedCharacter(restoredCharacter, position);
    })
    team.add(...positionedCharacters);

    return team;
  }

  constructor(name, maxLength = -1) {
    this.classes = new Set();
    this.name = name;
    this.positionedCharacters = [];
    this.maxLength = maxLength;
  }

  add(...positionedCharacters) {
    if (this.maxLength > -1 && this.length >= this.maxLength) {
      return;
    }

    positionedCharacters.forEach((el) => {
      if (this.maxLength == -1 || this.length < this.maxLength) {
        this.positionedCharacters.push(el);
        this.classes.add(el.character.type);
      }
    });
  }

  isExistCharacterClass(type) {
    return this.classes.has(type);
  }

  getCharacter(position) {
    return this.positionedCharacters.find((el) => el.position === position);
  }

  get length() {
    return this.positionedCharacters.length;
  }

  get characters() {
    return this.positionedCharacters;
  }

  clearDeadСharacters() {
    this.positionedCharacters = this.positionedCharacters.filter((el) => el.character.health > 0);
  }

  * [Symbol.iterator]() {
    yield* this.positionedCharacters;
  }

  levelUp() {
    this.positionedCharacters.forEach((el) => {
      el.character.levelUp();
    });
  }

  get sumHealth() {
    return this.characters.reduce((acc, el) => acc + el.character.health, 0);
  }

  clear() {
    this.positionedCharacters = [];
  }
}
