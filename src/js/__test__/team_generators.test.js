import { getRandomNumber, getNotUniqueRandomSequence } from '../random_generators';
import { generateTeam } from '../team_generators';
import { Daemon, Vampire, Undead } from '../classes/classes';

jest.mock('../random_generators');

test('team generator', () => {
  getRandomNumber.mockReturnValue(2);
  getNotUniqueRandomSequence.mockReturnValue([0, 2]);

  const team = generateTeam([Daemon, Vampire, Undead], 2, 2);

  expect(team).toEqual([new Daemon(2), new Undead(2)]);
});
