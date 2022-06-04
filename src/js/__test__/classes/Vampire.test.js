import Vampire from '../../classes/Vampire';

test('correct create vampire', () => {
  const person = new Vampire(1);

  const expected = {
    level: 1,
    health: 100,
    attack: 25,
    defense: 25,
    type: 'vampire',
    ranges: {
      attack: 2,
      move: 2,
    },
  };

  expect(expected).toEqual(person);
});
