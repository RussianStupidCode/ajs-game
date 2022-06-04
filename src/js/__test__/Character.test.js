import Character from '../Character';

test('create error', () => {
  let messageError = 'empty';

  try {
    const character = new Character();
    expect(character.level).toBe(0);
  } catch (error) {
    messageError = String(error);
  }

  expect(messageError).toBe('TypeError: class Character is abstract class');
});
