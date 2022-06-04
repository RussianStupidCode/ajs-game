export default class Character {
  constructor(level, attack = 0, defense = 0, ranges = { attack: 0, move: 0 }, type = 'generic') {
    this.level = level;
    this.attack = attack;
    this.defense = defense;
    this.health = 100;
    this.ranges = ranges;
    this.type = type;
    if (new.target.name === Character.name) {
      throw TypeError('class Character is abstract class');
    }
  }
}
