import App from './App';

it('generates hints', () => {
  expect(App.hints([1,1])).toEqual([2])
  expect(App.hints([1,0,1])).toEqual([1,1])
  expect(App.hints([1,0,1,0,1])).toEqual([1,1,1])
  expect(App.hints([1,0,1,1,1])).toEqual([1,3])
});

it('gets rows', () => {
  const map = App.createMap(2,3)
  expect(App.rows(map)).toEqual([
    [map[0], map[1]],
    [map[2], map[3]],
    [map[4], map[5]]
  ])
});

it('isComplete', () => {
  expect(App.isComplete([0,1,0], [0,1,0])).toEqual(false)
  expect(App.isComplete([0,1,0], [2,1,2])).toEqual(true)
  expect(App.isComplete([0,1,0], [2,0,2])).toEqual(false)
});

it('gets rowForIdx', () => {
  const map = App.createMap(2,3)
  expect(App.rowForIdx(map, 0)).toEqual(0)
  expect(App.rowForIdx(map, 1)).toEqual(0)
  expect(App.rowForIdx(map, 2)).toEqual(1)
  expect(App.rowForIdx(map, 3)).toEqual(1)
  expect(App.rowForIdx(map, 4)).toEqual(2)
  expect(App.rowForIdx(map, 5)).toEqual(2)
});

it('gets colForIdx', () => {
  const map = App.createMap(2,3)
  expect(App.colForIdx(map, 0)).toEqual(0)
  expect(App.colForIdx(map, 1)).toEqual(1)
  expect(App.colForIdx(map, 2)).toEqual(0)
  expect(App.colForIdx(map, 3)).toEqual(1)
  expect(App.colForIdx(map, 4)).toEqual(0)
  expect(App.colForIdx(map, 5)).toEqual(1)
});

it('gets cols', () => {
  const map = App.createMap(2,3)
  expect(App.cols(map)).toEqual([
    [map[0], map[2], map[4]],
    [map[1], map[3], map[5]]
  ])
});

it('gets fillLeft', () => {
  expect(App.fillLeft([0,1,2], 3)).toEqual([0,1,2])
  expect(App.fillLeft([0,1,2], 5)).toEqual([undefined,undefined,0,1,2])
});
