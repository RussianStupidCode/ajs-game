import Daemon from '../../classes/Daemon';

test('correct create daemon', () => {
  const person = new Daemon(1);

  const expected = {
    level: 1,
    health: 100,
    attack: 10,
    defense: 40,
    type: 'daemon',
    ranges: {
      attack: 4,
      move: 1,
    },
  };

  expect(expected).toEqual(person);
});
