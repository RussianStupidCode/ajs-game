import Character from '../Character';

export default class Magician extends Character {
  constructor(name) {
    super(name, 10, 40, { attack: 4, move: 1 }, 'magician');
  }
}
