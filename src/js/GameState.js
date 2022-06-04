export default class GameState {
  static from(object) {
    return new GameState(object);
  }

  constructor({ level = 1, isPlayerStep = true, selectCellIndex = null }) {
    this.level = level;
    this.isPlayerStep = isPlayerStep;
    this.selectCellIndex = selectCellIndex;
  }
}
