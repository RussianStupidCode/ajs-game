import GameState from './GameState';
import themes from './themes';
import GamePlay from './GamePlay';
import { getCharacterTooltip } from './utils';
import cellActions from './cell_actions';
import cursors from './cursors';
import AIController from './AIController';
import gameStatus from './game_status';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = new GameState({});
    this.currentCellIndex = null;
    this.currentAction = null;
    this.computer = new AIController(this.gamePlay, {
      attack: this.attack.bind(this),
      move: this.move.bind(this),
      select: this.select.bind(this),
      pass: this.pass.bind(this),
    });

  }

  init() {
    this.gamePlay.setGameStatusChangeCallbacks({
      playerWin: this.nextLevel.bind(this),
      computerWin: this.endGame.bind(this),
    });

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

  nextLevel() {
    this.state.gameStatus = gameStatus.playerWin;
    this.state.level++;
    this.state.isPlayerStep = true;
    this.gamePlay.startNewLevel(this.state.level);
    this.state.gameStatus = gameStatus.game;
  }

  endGame() {
    console.log('computer win');
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
    this.state.gameStatus = gameStatus.game;
    this.gamePlay.startNewGame();
  }

  move(oldIndex, newIndex) {
    if (oldIndex !== null) {
      this.gamePlay.deselectCell(oldIndex);
    }

    this.gamePlay.moveCharacter(oldIndex, newIndex);
    this.gamePlay.deselectCell(newIndex);
    this.state.selectCellIndex = null;
    this.currentAction = cellActions.none
    this.setCursor(this.currentAction);
    this.state.isPlayerStep = !this.state.isPlayerStep;
  }

  pass() {
    if (this.state.selectCellIndex != null) {
      this.gamePlay.deselectCell(this.state.selectCellIndex);
    }
    this.state.selectCellIndex = null;
    this.setCursor(cellActions.none);

    this.state.isPlayerStep = !this.state.isPlayerStep;
  }

  setCursor(action) {
    const cursor = this.getCursor(action);
    this.gamePlay.setCursor(cursor);
  }

  select(index) {
    if (this.state.selectCellIndex === index || !this.gamePlay.getCharacter(index)) {
      return;
    }

    if (this.state.isPlayerStep && !this.gamePlay.isUserCharacter(index)) {
      return;
    }

    if (!this.state.isPlayerStep && !this.gamePlay.isComputerCharacter(index)) {
      return;
    }

    if (this.state.selectCellIndex != null) {
      this.gamePlay.deselectCell(this.state.selectCellIndex);
    }

    this.state.selectCellIndex = index;
    this.gamePlay.selectCell(index);
  }

  async attack(attackerIndex, targetIndex) {
  
    await this.gamePlay.attack(attackerIndex, targetIndex);
    this.currentAction = cellActions.none;
    this.setCursor(this.currentAction);
    this.state.isPlayerStep = !this.state.isPlayerStep;
    this.state.selectCellIndex = null;
    this.gamePlay.deselectCell(targetIndex);
    this.gamePlay.deselectCell(attackerIndex);
  }

  async onCellClick(index) {
    if(!this.state.isPlayerStep || this.state.gameStatus !== gameStatus.game) {
      return;
    }

    switch (this.currentAction) {
      case cellActions.move:
        this.move(this.state.selectCellIndex, index);
        break;
      case cellActions.select:
        this.select(index);
        break;
      case cellActions.attack:
        await this.attack(this.state.selectCellIndex, index);
        break;
    }

    this.nextLevel();

    if(!this.state.isPlayerStep && this.state.gameStatus === gameStatus.game) {
      this.computer.takeStep();
    }
  }

  onCellEnter(index) {
    const positionedCharacter = this.gamePlay.getCharacter(index);
    if (positionedCharacter) {
      const characterInfo = getCharacterTooltip(positionedCharacter.character);
      this.gamePlay.showCellTooltip(characterInfo, index);
    }

    if(!this.state.isPlayerStep) {
      this.currentAction = cellActions.none;
      return;
    }

    this.currentAction = this.gamePlay.getCellAction(index, this.state.selectCellIndex);
    this.setCursor(this.currentAction);
    this.cellHighlight(index, this.currentAction);
  }

  onCellLeave(index) {
    this.currentAction = null;
    this.setCursor(this.currentAction);

    if (!this.gamePlay.getCharacter(index)) {
      return;
    }

    this.gamePlay.hideCellTooltip(index);
  }
}
