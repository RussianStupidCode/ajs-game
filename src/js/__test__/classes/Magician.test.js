import Magician from '../../classes/Magician';

test('correct create magician', () => {
  const person = new Magician(1);

  const expected = {
    level: 1,
    health: 100,
    attack: 10,
    defense: 40,
    type: 'magician',
    ranges: {
      attack: 4,
      move: 1,
    },
  };

  expect(expected).toEqual(person);
});
