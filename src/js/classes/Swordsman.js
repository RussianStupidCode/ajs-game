import Character from '../Character';

export default class Swordsman extends Character {
  constructor(name) {
    super(name, 40, 10, { attack: 1, move: 4 }, 'swordsman');
  }
}
