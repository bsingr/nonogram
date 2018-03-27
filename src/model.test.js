import App from './App';

it('generates hints', () => {
  expect(App.hints([1,1])).toEqual([2])
  expect(App.hints([1,0,1])).toEqual([1,1])
  expect(App.hints([1,0,1,0,1])).toEqual([1,1,1])
  expect(App.hints([1,0,1,1,1])).toEqual([1,3])
});
