import Character from '../Character';

export default class Bowman extends Character {
  constructor(name) {
    super(name, 25, 25, { attack: 2, move: 2 }, 'bowman');
  }
}
