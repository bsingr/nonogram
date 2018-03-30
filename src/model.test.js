import { 
  hints,
  createMap,
  createUserMap,
  rows,
  cols,
  fillLeft,
  rowForIdx,
  colForIdx,
  isComplete,
  populate,
  clearWrongUserValues,
  FIELD_UNFILLED,
  FIELD_FILLED,
  USER_FILLED,
  USER_UNFILLED,
  USER_NONE
} from './model';

it('generates hints', () => {
  expect(hints([1,1])).toEqual([2])
  expect(hints([1,0,1])).toEqual([1,1])
  expect(hints([1,0,1,0,1])).toEqual([1,1,1])
  expect(hints([1,0,1,1,1])).toEqual([1,3])
});

it('gets rows', () => {
  const map = createMap(2,3)
  expect(rows(map)).toEqual([
    [map[0], map[1]],
    [map[2], map[3]],
    [map[4], map[5]]
  ])
});

it('isComplete', () => {
  expect(isComplete([0,1,0], [0,1,0])).toEqual(false)
  expect(isComplete([0,1,0], [2,1,2])).toEqual(true)
  expect(isComplete([0,1,0], [2,0,2])).toEqual(false)
});

it('gets rowForIdx', () => {
  const map = createMap(2,3)
  expect(rowForIdx(map, 0)).toEqual(0)
  expect(rowForIdx(map, 1)).toEqual(0)
  expect(rowForIdx(map, 2)).toEqual(1)
  expect(rowForIdx(map, 3)).toEqual(1)
  expect(rowForIdx(map, 4)).toEqual(2)
  expect(rowForIdx(map, 5)).toEqual(2)
});

it('gets colForIdx', () => {
  const map = createMap(2,3)
  expect(colForIdx(map, 0)).toEqual(0)
  expect(colForIdx(map, 1)).toEqual(1)
  expect(colForIdx(map, 2)).toEqual(0)
  expect(colForIdx(map, 3)).toEqual(1)
  expect(colForIdx(map, 4)).toEqual(0)
  expect(colForIdx(map, 5)).toEqual(1)
});

it('gets cols', () => {
  const map = createMap(2,3)
  expect(cols(map)).toEqual([
    [map[0], map[2], map[4]],
    [map[1], map[3], map[5]]
  ])
});

it('gets fillLeft', () => {
  expect(fillLeft([0,1,2], 3)).toEqual([0,1,2])
  expect(fillLeft([0,1,2], 5)).toEqual([undefined,undefined,0,1,2])
});

it('clearWrongUserValues', () => {
  const map = createMap(2,2)
  const userMap = createUserMap(2,2)
  map[0] = FIELD_FILLED
  userMap[0] = USER_FILLED
  map[1] = FIELD_FILLED
  userMap[1] = USER_UNFILLED
  map[2] = FIELD_UNFILLED
  userMap[2] = USER_FILLED
  map[3] = FIELD_UNFILLED
  userMap[3] = USER_UNFILLED
  const correctedUserMap = clearWrongUserValues(map,userMap)
  expect(correctedUserMap[0]).toEqual(USER_FILLED)
  expect(correctedUserMap[1]).toEqual(USER_NONE)
  expect(correctedUserMap[2]).toEqual(USER_NONE)
  expect(correctedUserMap[3]).toEqual(USER_UNFILLED)
});
