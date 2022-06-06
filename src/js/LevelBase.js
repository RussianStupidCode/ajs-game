import { getRandomElements } from "./random_generators";

export default class LevelBase {
  constructor(levelProperties = []) {
    this.levelProperties = levelProperties;
  }

  addLevelProperty(levelProperty) {
    this.levelProperties.push(levelProperty);
  }

  getLevelProperty(levelNumber) {
    if (levelNumber < 1 || levelNumber >= this.levelProperties.length) {
      return getRandomElements(this.levelProperties, 1)[0];
    }
    return this.levelProperties[levelNumber - 1];
  }
}
