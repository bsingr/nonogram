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
