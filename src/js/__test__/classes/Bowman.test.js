import Bowman from '../../classes/Bowman';

test('correct create bowerman', () => {
  const person = new Bowman(1);

  const expected = {
    level: 1,
    health: 100,
    attack: 25,
    defense: 25,
    type: 'bowman',
    ranges: {
      attack: 2,
      move: 2,
    },
  };

  expect(expected).toEqual(person);
});
