import GameState from './GameState';
import themes from './themes';
import GamePlay from './GamePlay';
import { getCharacterTooltip } from './utils';
import cellActions from './cell_actions';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = new GameState({});
    this.currentCellIndex = null;
    this.currentAction = null;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.addGameContolsListeners();
    this.addCellListeners();
  }

  getCursor(action) {

    switch(action) {
      case cellActions.none:
        return cursors.auto;
      case cellActions.move:
        return cursors.pointer;
      case cellActions.attack:
        return cursors.crosshair;
      case cellActions.select:
        return cursors.pointer;
      case cellActions.forbidden:
        return cursors.notallowed;
      default:
        return cursors.auto;
    }
  }

  cellHighlight(index, action) {
    if (this.currentCellIndex !== null && this.currentCellIndex !== this.state.selectCellIndex) {
      this.gamePlay.deselectCell(this.currentCellIndex);
    }

    this.currentCellIndex = index;

    if (action !== cellActions.move && action !== cellActions.attack) {
      return;
    }

    if (action === cellActions.move) {
      this.gamePlay.selectCell(this.currentCellIndex, 'green');
      return;
    } 

    if (action === cellActions.attack) {
      this.gamePlay.selectCell(this.currentCellIndex, 'red');
      return;
    } 
  }

  addGameContolsListeners() {
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
  }

  addCellListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onNewGameClick() {
    this.state = new GameState({});
    this.gamePlay.startNewGame();
  }

  onCellClick(index) {
    if (this.state.selectCellIndex === index || !this.gamePlay.getCharacter(index)) {
      return;
    }

    if (this.state.isPlayerStep && !this.gamePlay.isUserCharacter(index)) {
      return;
    }

    if (this.state.selectCellIndex != null) {
      this.gamePlay.deselectCell(this.state.selectCellIndex);
    }

    this.state.selectCellIndex = index;
    this.gamePlay.selectCell(index);
  }

  onCellEnter(index) {
    const positionedCharacter = this.gamePlay.getCharacter(index);
    if (positionedCharacter) {
      const characterInfo = getCharacterTooltip(positionedCharacter.character);
      this.gamePlay.showCellTooltip(characterInfo, index);
    }

    const action = this.gamePlay.getCellAction(index, this.state.selectCellIndex);
    const cursor = this.getCursor(action);
    this.gamePlay.setCursor(cursor);
    this.cellHighlight(index, action);
  }

  onCellLeave(index) {
    if (!this.gamePlay.getCharacter(index)) {
      return;
    }

    this.gamePlay.hideCellTooltip(index);
  }
}
