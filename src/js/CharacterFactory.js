import Bowman from './classes/Bowman';
import Daemon from './classes/Daemon';
import Magician from './classes/Magician';
import Swordsman from './classes/Swordsman';
import Undead from './classes/Undead';
import Vampire from './classes/Vampire';

export default class CharacterFactory {
  static createCharacter({
    level,
    attack,
    defense,
    ranges,
    type,
  }) {
    let character = null;
    switch (type) {
      case 'bowman':
        character = new Bowman(level, attack, defense, ranges, type);
        break;
      case 'daemon':
        character = new Daemon(level, attack, defense, ranges, type);
        break;
      case 'magician':
        character = new Magician(level, attack, defense, ranges, type);
        break;
      case 'swordsman':
        character = new Swordsman(level, attack, defense, ranges, type);
        break;
      case 'undead':
        character = new Undead(level, attack, defense, ranges, type);
        break;
      case 'vampire':
        character = new Vampire(level, attack, defense, ranges, type);
        break;
      default:
        break;
    }

    // нужно установить действительыне занчнеия аттаки и защиты из-за levelup в конструкторе
    character.attack = attack;
    character.defense = defense;

    return character;
  }
}
