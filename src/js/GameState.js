import gameStatus from './game_status';

export default class GameState {
  static from(object) {
    return new GameState(object);
  }

  constructor({ level = 1, isPlayerStep = true, selectCellIndex = null, maxScore = 0, currentScore = 0}) {
    this.level = level;
    this.isPlayerStep = isPlayerStep;
    this.selectCellIndex = selectCellIndex;
    this.gameStatus = gameStatus.wait;
    this.maxScore = maxScore;
    this.currentScore = currentScore;
  }
}
