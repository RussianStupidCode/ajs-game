import Bowman from '../classes/Bowman';
import Swordsman from '../classes/Swordsman';
import { calcTileType, CoordinateConverter, getCharacterTooltip } from '../utils';

const CALC_TYPE_TEST_DATA = [
  {
    args: {
      rowIndex: 0,
      columnIndex: 0,
      rowSize: 8,
    },
    expected: 'top-left',
  },
  {
    args: {
      rowIndex: 0,
      columnIndex: 0,
      rowSize: 8,
      columnSize: 8,
    },
    expected: 'top-left',
  },
  {
    args: {
      rowIndex: 0,
      columnIndex: 1,
      rowSize: 4,
    },
    expected: 'top',
  },
  {
    args: {
      rowIndex: 0,
      columnIndex: 3,
      rowSize: 4,
    },
    expected: 'top-right',
  },
  {
    args: {
      rowIndex: 3,
      columnIndex: 3,
      rowSize: 4,
    },
    expected: 'bottom-right',
  },
  {
    args: {
      rowIndex: 3,
      columnIndex: 0,
      rowSize: 4,
    },
    expected: 'bottom-left',
  },
  {
    args: {
      rowIndex: 3,
      columnIndex: 1,
      rowSize: 4,
    },
    expected: 'bottom',
  },
  {
    args: {
      rowIndex: 2,
      columnIndex: 1,
      rowSize: 4,
    },
    expected: 'center',
  },
  {
    args: {
      rowIndex: 1,
      columnIndex: 0,
      rowSize: 4,
    },
    expected: 'left',
  },
  {
    args: {
      rowIndex: 1,
      columnIndex: 3,
      rowSize: 4,
    },
    expected: 'right',
  },
];

const calcTileTypeHandler = test.each(CALC_TYPE_TEST_DATA);
calcTileTypeHandler('test calctype', ({ args, expected }) => {
  let actual = null;
  if (args.columnIndex === undefined) {
    actual = calcTileType(args.rowIndex, args.columnIndex, args.rowSize);
  } else {
    actual = calcTileType(args.rowIndex, args.columnIndex, args.rowSize, args.columnSize);
  }

  expect(actual).toBe(expected);
});

const COORDINATE_CONVERTER_TEST_DATA = [
  {
    args: {
      coordinate: 0,
      rowSize: 8,
    },
    expected: {
      rowIndex: 0,
      columnIndex: 0,
    },
  },
  {
    args: {
      coordinate: 8,
      rowSize: 8,
    },
    expected: {
      rowIndex: 1,
      columnIndex: 0,
    },
  },
  {
    args: {
      coordinate: 13,
      rowSize: 8,
    },
    expected: {
      rowIndex: 1,
      columnIndex: 5,
    },
  },
];

const coordinateConverterHandler = test.each(COORDINATE_CONVERTER_TEST_DATA);
coordinateConverterHandler('test coordinate converter', ({ args, expected }) => {
  const actual = CoordinateConverter.linearToSquare(args.coordinate, args.rowSize);

  expect(actual).toEqual(expected);
});

const GET_CHARACTER_TOOLTIP_DATA = [
  {
    character: new Bowman(1),
    expected: '🎖1⚔25🛡25❤100',
  },
  {
    character: new Swordsman(10),
    expected: '🎖10⚔40🛡10❤100',
  },
];

const getCharacterTooltipHandler = test.each(GET_CHARACTER_TOOLTIP_DATA);
getCharacterTooltipHandler('test get character tooltip', ({ character, expected }) => {
  const actual = getCharacterTooltip(character);

  expect(actual).toEqual(expected);
});
