import { getRandomElements } from "./random_generators";

export default class AIController {
  constructor(gamePlay, functions = { 
    attack: (attackerIndex, targetIndex) => {},
    move: (oldIndex, newIndex) => {}, 
    select: (index) => {} 
  }, tick = 1500) {
    this.gamePlay = gamePlay;
    this.functions = functions;
    this.tick = 1000;
  }

  takeStep() {
    const positionedCharacter = getRandomElements(this.gamePlay.computerTeam, 1)[0];

    setTimeout(() => {
      this.functions.select(positionedCharacter.position);
    }, this.tick);
  }
}
