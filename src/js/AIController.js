import cellActions from "./cell_actions";
import { getRandomElements, getRandomNumber } from "./random_generators";

export default class AIController {
  constructor(gamePlay, functions = { 
    attack: (attackerIndex, targetIndex) => {
      console.log('attack', attackerIndex, targetIndex);
    },
    move: (oldIndex, newIndex) => {
      console.log('move', oldIndex, newIndex);
    }, 
    select: (index) => {
      console.log('select', index);
    },
    pass: () => {
      console.log('pass');
    } 
  }, tick = 800, aggression = 0.7) {
    this.gamePlay = gamePlay;
    this.functions = functions;
    this.tick = tick;
    this.aggression = aggression;
  }

  takeStep() {
    const positionedCharacter = getRandomElements(this.gamePlay.computerTeam.onlyLiveCharacters, 1)[0];

    if (positionedCharacter == undefined) {
      this.functions.pass();
    }

    const freeCells = this.gamePlay.getAllEmptyCells().filter((el) => (
      this.gamePlay.getCellActionForSelectedCell(el, positionedCharacter.position) === cellActions.move
    ));

    const enemyPositions = [...this.gamePlay.playerTeam].filter((el) => (
      this.gamePlay.getCellActionForSelectedCell(el.position, positionedCharacter.position) === cellActions.attack
    )).map((el) => el.position);

    if (freeCells.length === 0 && enemyPositions.length === 0) {
      this.functions.pass();
    }

    this.callForTimeout(() => {
      this.functions.select(positionedCharacter.position);

      if (freeCells.length > 0 && enemyPositions.length === 0) {
        this.moveWithDelay(freeCells, positionedCharacter);    
        return;
      }

      if (freeCells.length === 0 && enemyPositions.length > 0) {
        this.attackWithDelay(enemyPositions, positionedCharacter);
        return;
      }

      const random = Math.random();

      if(random < this.aggression) {
        this.attackWithDelay(enemyPositions, positionedCharacter);
      } else {
        this.moveWithDelay(freeCells, positionedCharacter); 
      }
    });
  }

  callForTimeout(callback) {
    setTimeout(callback, this.tick)
  }

  attackWithDelay(enemyPositions, positionedCharacter) {
    this.callForTimeout(() => {
      this.attack(enemyPositions, positionedCharacter);
    });
  }

  moveWithDelay(freeCells, positionedCharacter) {
    this.callForTimeout(() => {
      this.move(freeCells, positionedCharacter);
    });  
  }

  move(freeCells, positionedCharacter) {
    const newCellIndex = getRandomElements(freeCells, 1)[0];
    this.functions.move(positionedCharacter.position, newCellIndex);
  }

  attack(enemyPositions, positionedCharacter) {
    const enemyIndex = getRandomElements(enemyPositions, 1)[0];
    this.functions.attack(positionedCharacter.position, enemyIndex);
  }
}
