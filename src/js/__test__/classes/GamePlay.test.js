import cellActions from '../../cell_actions';
import Bowman from '../../classes/Bowman';
import Swordsman from '../../classes/Swordsman';
import Undead from '../../classes/Undead';
import Vampire from '../../classes/Vampire';
import GamePlay from '../../GamePlay';
import PositionedCharacter from '../../PositionedCharacter';
import Team from '../../Team';

function getGamePlay() {
  const gamePlay = new GamePlay();
  gamePlay.boardSize = 8;
  gamePlay.playerTeam = new Team('good');
  gamePlay.computerTeam = new Team('evil');

  gamePlay.playerTeam.add(
    new PositionedCharacter(new Bowman(), 0),
    new PositionedCharacter(new Swordsman(), 1),
  );

  gamePlay.computerTeam.add(
    new PositionedCharacter(new Undead(), 16),
    new PositionedCharacter(new Vampire(), 18),
  );

  return gamePlay;
}

const CELL_ACTION_TEST_DATA = [
  {
    args: {
      index: 1,
      selectedIndex: 0,
    },
    expected: cellActions.select,
  },
  {
    args: {
      index: 1,
      selectedIndex: undefined,
    },
    expected: cellActions.select,
  },
  {
    args: {
      index: 17,
      selectedIndex: 0,
    },
    expected: cellActions.forbidden,
  },
  {
    args: {
      index: 16,
      selectedIndex: 0,
    },
    expected: cellActions.attack,
  },
];

const getCellActionHandler = test.each(CELL_ACTION_TEST_DATA);
getCellActionHandler('test getCellAction in GamePlay', ({ args, expected }) => {
  const gamePlay = getGamePlay();

  const actual = gamePlay.getCellAction(args.index, args.selectedIndex);
  expect(actual).toBe(expected);
});
