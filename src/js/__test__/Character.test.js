import Character from '../Character';

test('create error', () => {
  let errorMessage = 'empty';

  try {
    const character = new Character();
    expect(character.level).toBe(0);
  } catch (error) {
    errorMessage = String(error);
  }

  expect(errorMessage).toBe('TypeError: class Character is abstract class');
});
