export default class LevelBase {
  constructor(levelProperties = []) {
    this.levelProperties = levelProperties;
  }

  addLevelProperty(levelProperty) {
    this.levelProperties.push(levelProperty);
  }

  getLevelProperty(levelNumber) {
    if (levelNumber < 1 || levelNumber >= this.levelProperties) {
      throw Error(`not found levelProperty for level number = ${levelNumber}`);
    }
    return this.levelProperties[levelNumber - 1];
  }
}
