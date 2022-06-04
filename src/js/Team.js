export default class Team {
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
    this.positionedCharacters = this.onlyLiveCharacters;
  }

  * [Symbol.iterator]() {
    yield* this.positionedCharacters;
  }

  get onlyLiveCharacters() {
    return this.positionedCharacters.filter((el) => el.character.health > 0);
  }

  clear() {
    this.positionedCharacters = [];
  }
}
