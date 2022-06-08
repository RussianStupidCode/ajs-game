import { round } from './utils';

export default class Character {
  constructor(level, attack = 0, defense = 0, ranges = { attack: 0, move: 0 }, type = 'generic') {
    this.level = 1;
    this.attack = attack;
    this.defense = defense;
    this.health = 100;
    this.ranges = ranges;
    this.type = type;
    if (new.target.name === Character.name) {
      throw TypeError('class Character is abstract class');
    }

    // т.к. логи повышения уровня очень странная,
    // чтобы сделать зависимость от уровня придется делать в цикле
    for (let i = 0; i < level - 1; i += 1) {
      this.health = 50;
      this.levelUp();
    }
  }

  clone() {
    return new this.constructor(
      this.level,
      this.attack,
      this.defense,
      { ...this.ranges },
      this.type,
    );
  }

  giveDamage(target) {
    const damage = Math.max(this.attack - target.defense, this.attack * 0.1);
    target.takeDamage(damage);
    return damage;
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }

    this.health = round(this.health);
  }

  levelUp() {
    if (this.health < 1) {
      return;
    }

    this.level += 1;
    this.attack = round(Math.max(this.attack, this.attack * 0.01 * (180 - this.health)));
    this.defense = round(Math.max(this.defense, this.defense * 0.01 * (180 - this.health)));
    this.health = round(Math.min(this.health + 80, 100));
  }
}
