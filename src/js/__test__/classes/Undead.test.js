import Undead from '../../classes/Undead';

test('correct create undead', () => {
  const person = new Undead(1);

  const expected = {
    level: 1,
    health: 100,
    attack: 40,
    defense: 10,
    type: 'undead',
    ranges: {
      attack: 1,
      move: 4,
    },
  };

  expect(expected).toEqual(person);
});
