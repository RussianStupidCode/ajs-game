import { calcHealthLevel, calcTileType, CoordinateConverter } from './utils';
import Team from './Team';
import LevelBase from './LevelBase';
import LevelProperty from './LevelProperty';
import themes from './themes';
import {
  Vampire,
  Swordsman,
  Daemon,
  Magician,
  Bowman,
  Undead,
} from './classes/classes';
import { getRandomElements } from './random_generators';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './team_generators';
import cellActions from './cell_actions';

export default class GamePlay {
  static addTeamForLevel(team, classesList, characterCount, level) {
    const characters = generateTeam(classesList, level, characterCount);
    team.add(...characters.map((el) => new PositionedCharacter(el, -1)));
  }

  static setPositionForTeam(team, positions) {
    team.characters.forEach((el, index) => {
      const character = el;
      character.position = positions[index];
    });
  }

  static isCharacterMoving(maxCharacterRange, range) {
    const remainder = range / Math.sqrt(2);

    if (range % 1 === 0 && maxCharacterRange >= range) {
      return true;
    }

    if (remainder > maxCharacterRange) {
      return false;
    }

    return CoordinateConverter.isDoubleEqual(remainder % 1, 1) || remainder % 1 === 0;
  }

  static isCharacterAttack(maxCharacterRange, range) {
    const remainder = range / Math.sqrt(2);

    if (range % 1 === 0 && maxCharacterRange >= range) {
      return true;
    }

    return range < maxCharacterRange + 1;
  }

  constructor(gameStageChangeCallbacks = {
    playerWin: () => {},
    computerWin: () => {},
  }) {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
    this.playerTeam = new Team('playerTeam', 16);
    this.computerTeam = new Team('computerTeam', 16);
    this.LevelBase = new LevelBase([
      new LevelProperty('1', themes.prairie, [Swordsman, Bowman], [Daemon, Undead, Vampire], 2),
      new LevelProperty('2', themes.desert, [Swordsman, Bowman, Magician], [Daemon, Undead, Vampire], 2),
      new LevelProperty('3', themes.arctic, [Swordsman, Bowman, Magician], [Daemon, Undead, Vampire], 2),
      new LevelProperty('4', themes.mountain, [Swordsman, Bowman, Magician], [Daemon, Undead, Vampire], 2),
    ]);
    this.gameStageChangeCallbacks = gameStageChangeCallbacks;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  setGameStageChangeCallbacks(gameStageChangeCallbacks) {
    this.gameStageChangeCallbacks = gameStageChangeCallbacks;
  }

  getAllEmptyCells() {
    const nonEmptyIndices = new Set([...this.playerTeam, ...this.computerTeam].map((el) => el.position));
    const allCellIndices = Array(this.boardSize ** 2).fill(0).map((el, index) => index);
    return allCellIndices.filter((el) => !nonEmptyIndices.has(el));
  }

  getComputerTeamCoordinates() {
    const startCharacterRowNumber = Array(this.boardSize).fill(0).map((el, index) => index);
    const startCharacterColumnNumber = [this.boardSize - 2, this.boardSize - 1];
    return CoordinateConverter.createLinearCoordinateList(
      startCharacterRowNumber,
      startCharacterColumnNumber,
      this.boardSize,
    );
  }

  getPlayerTeamCoordinates() {
    const startCharacterRowNumber = Array(this.boardSize).fill(0).map((el, index) => index);
    const startCharacterColumnNumber = [0, 1];
    return CoordinateConverter.createLinearCoordinateList(
      startCharacterRowNumber,
      startCharacterColumnNumber,
      this.boardSize,
    );
  }

  startNewLevel(level) {
    const levelProperty = this.LevelBase.getLevelProperty(level);
    this.playerTeam.levelUp();
    this.drawUi(levelProperty.theme);
    this.refreshTeamsForNewLevel(levelProperty, level);
  }

  startLoadPoint(state) {
    this.playerTeam = state.playerTeam;
    this.computerTeam = state.computerTeam;
    const levelProperty = this.LevelBase.getLevelProperty(state.level);
    this.drawUi(levelProperty.theme);
    this.redrawPositions([...this.playerTeam, ...this.computerTeam]);
  }

  startNewGame() {
    this.computerTeam.clear();
    this.playerTeam.clear();

    const levelProperty = this.LevelBase.getLevelProperty(1);
    this.drawUi(levelProperty.theme);
    this.refreshTeamsForNewLevel(levelProperty, 1);
  }

  refreshTeamsForNewLevel(levelProperty, level) {
    this.computerTeam.clear();
    this.playerTeam.clearDeadСharacters();

    GamePlay.addTeamForLevel(
      this.playerTeam,
      levelProperty.playerCharacterClasses,
      levelProperty.playerCharacterCount,
      level,
    );

    GamePlay.addTeamForLevel(
      this.computerTeam,
      levelProperty.computerCharacterClasses,
      this.playerTeam.length,
      level,
    );

    const computerTeamCoordinates = this.getComputerTeamCoordinates();
    const playerTeamCoordinates = this.getPlayerTeamCoordinates();

    GamePlay.setPositionForTeam(
      this.playerTeam,
      getRandomElements(playerTeamCoordinates, this.playerTeam.length),
    );

    GamePlay.setPositionForTeam(
      this.computerTeam,
      getRandomElements(computerTeamCoordinates, this.computerTeam.length),
    );

    this.redrawPositions([...this.playerTeam, ...this.computerTeam]);
  }

  getCellAction(index, selectCellIndex) {
    if (selectCellIndex == undefined) {
      return this.getCellActionNoSelectedCell(index);
    }

    return this.getCellActionForSelectedCell(index, selectCellIndex);
  }

  getCellActionNoSelectedCell(index) {
    if (this.isUserCharacter(index)) {
      return cellActions.select;
    }

    if (this.isComputerCharacter(index)) {
      return cellActions.forbidden;
    }

    return cellActions.none;
  }

  getCellActionForSelectedCell(index, selectedCellIndex) {
    const character = this.getCharacter(selectedCellIndex).character;

    if (this.isUserCharacter(index) && this.isUserCharacter(selectedCellIndex)) {
      return cellActions.select;
    }

    if (this.isComputerCharacter(index) && this.isComputerCharacter(selectedCellIndex)) {
      return cellActions.select;
    }

    const range = CoordinateConverter.getRangeForLinearCoordinate(selectedCellIndex, index, this.boardSize);

    if (GamePlay.isCharacterMoving(character.ranges.move, range) && !this.getCharacter(index)) {
        return cellActions.move;
    }

    if (GamePlay.isCharacterAttack(character.ranges.attack, range) && this.getCharacter(index)) {
      return cellActions.attack;
    }

    return cellActions.forbidden;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      const coordinate = CoordinateConverter.linearToSquare(i, this.boardSize);
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(coordinate.rowIndex, coordinate.columnIndex, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  async attack(attackerIndex, targetIndex) {
    const attacker = this.getCharacter(attackerIndex).character;
    const target = this.getCharacter(targetIndex).character;

    const damage = attacker.giveDamage(target);

   await this.showDamage(targetIndex, damage).then(() => {
      this.playerTeam.clearDeadСharacters();
      this.computerTeam.clearDeadСharacters();

      if(this.playerTeam.length === 0) {
        this.gameStageChangeCallbacks.computerWin();
        return;
      } 

      if(this.computerTeam.length === 0) {
        this.gameStageChangeCallbacks.playerWin();
      }

      this.redrawPositions([...this.playerTeam, ...this.computerTeam]);
    });
  }

  isUserCharacter(index) {
    return this.playerTeam.getCharacter(index) !== undefined;
  }

  isComputerCharacter(index) {
    return this.computerTeam.getCharacter(index) !== undefined;
  }

  getCharacter(index) {
    return this.playerTeam.getCharacter(index) || this.computerTeam.getCharacter(index);
  }

  moveCharacter(oldPosition, newPosition) {
    const positionedCharacter = this.getCharacter(oldPosition);
    positionedCharacter.position = newPosition;
    this.redrawPositions([...this.playerTeam, ...this.computerTeam]);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  addNextLevelC(callback) {

  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach((o) => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach((o) => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach((o) => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  static showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
}
