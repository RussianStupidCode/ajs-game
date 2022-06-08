import GameController from '../GameController';
import GamePlay from '../GamePlay';

jest.mock('../GamePlay');
GamePlay.showError.mockImplementation(() => {
  throw new Error('error load state');
});

test('error load state', () => {
  let errorMessage = 'empty';
  const controller = new GameController();

  try {
    controller.onLoadGameClick();
    expect(controller.gamePlay).toBe(null);
  } catch (error) {
    errorMessage = String(error);
  }

  expect(errorMessage).toBe('Error: error load state');
});
