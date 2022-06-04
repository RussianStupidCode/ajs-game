export function calcTileType(rowIndex, columnIndex, rowSize, columnSize = rowSize) {
  if (rowIndex === 0 && columnIndex === 0) {
    return 'top-left';
  }

  if (rowIndex === 0 && columnIndex === columnSize - 1) {
    return 'top-right';
  }

  if (rowIndex === 0) {
    return 'top';
  }

  if (rowIndex === rowSize - 1 && columnIndex === 0) {
    return 'bottom-left';
  }

  if (rowIndex === rowSize - 1 && columnIndex === columnSize - 1) {
    return 'bottom-right';
  }

  if (rowIndex === rowSize - 1) {
    return 'bottom';
  }

  if (columnIndex === 0) {
    return 'left';
  }

  if (columnIndex === columnSize - 1) {
    return 'right';
  }

  return 'center';
}

export class CoordinateConverter {
  static linearToSquare(coordinate, rowSize) {
    return {
      rowIndex: Math.floor(coordinate / rowSize),
      columnIndex: coordinate % rowSize,
    };
  }

  static squareToLinear(row, column, rowSize) {
    return row * rowSize + column;
  }

  static getRangeForLinearCoordinate(firstPoint, secondPoint, rowSize) {
    const firstSquarePoint = CoordinateConverter.linearToSquare(firstPoint, rowSize);
    const secondSquarePoint = CoordinateConverter.linearToSquare(secondPoint, rowSize);
    
    return CoordinateConverter.getRangeForSquareCoordinate(firstSquarePoint, secondSquarePoint);
  }

  static getRangeForSquareCoordinate(firstPoint, secondPoint) {
    const deltaRow = secondPoint.rowIndex - firstPoint.rowIndex;
    const deltaColumn = secondPoint.columnIndex - firstPoint.columnIndex;

    return Math.sqrt(deltaRow ** 2 + deltaColumn ** 2);
  }

  static createLinearCoordinateList(rowNumbers, columnNumbers, rowSize) {
    const coordinates = new Set();

    rowNumbers.forEach((row) => (
      columnNumbers.forEach((column) => coordinates.add(row * rowSize + column))
    ));
    return [...coordinates];
  }
}

export function getCharacterTooltip(character) {
  return `🎖${character.level}⚔${character.attack}🛡${character.defense}❤${character.health}`;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
