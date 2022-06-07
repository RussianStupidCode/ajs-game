import gameStage from './game_stage';
import Team from './Team';

export default class GameState {
  static from(object) {
    return new GameState(object);
  }

  constructor({ 
    level = 1,
    isPlayerStep = true,
    selectCellIndex = null,
    playerTeam = {},
    computerTeam = {},
    maxScore = 0,
    currentScore = 0,
    stage = gameStage.wait,
  }) {
    this.level = level;
    this.isPlayerStep = isPlayerStep;
    this.selectCellIndex = selectCellIndex;
    this.stage = stage;
    this.maxScore = maxScore;
    this.currentScore = currentScore;

    if(Object.keys(playerTeam).length > 0 && Object.keys(computerTeam).length > 0) {
      this.computerTeam = Team.from(computerTeam);
      this.playerTeam = Team.from(playerTeam);
    }

  }
}
