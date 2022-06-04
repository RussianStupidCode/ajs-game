import Swordsman from '../../classes/Swordsman';

test('correct create swordsman', () => {
  const person = new Swordsman(1);

  const expected = {
    level: 1,
    health: 100,
    attack: 40,
    defense: 10,
    type: 'swordsman',
    ranges: {
      attack: 1,
      move: 4,
    },
  };

  expect(expected).toEqual(person);
});
