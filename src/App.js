import React, { Component } from 'react';
import './App.css';

class Hint extends Component {
  render() {
    return (
      <div className="Field Hint" style={{height: `${this.props.height}px`}}>
        {this.props.value}
      </div>
    );
  }
}

class Field extends Component {
  render() {
    return (
      <div className="Field" style={{height: `${this.props.height}px`}}>
        {this.props.value}
      </div>
    );
  }
}

function createMap(x,y) {
  const map = []
  for (let i = 0; i < y; i++) {
    const row = [];
    for (let j = 0; j < x; j++) {
      row.push(Math.random() > 0.5 ? 1 : 0)
    }
    map.push(row)
  }
  return map;
}

function hints(streak) {
  const hints = [];
  streak.forEach((node, nodeIdx) => {
    if (nodeIdx === 0 && node === 1) {
      hints.push(1)
    } else if (nodeIdx > 0) {
      if (node === 1) {
        if (streak[nodeIdx - 1] === 1) {
          hints[hints.length - 1] = hints[hints.length - 1] + 1;
        } else {
          hints.push(1)
        }
      }
    }
  })
  return hints
}

function maxHorizontalHints(map) {
  let max = 0;
  map.forEach(row => {
    const current = hints(row).length
    if (current > max) {
      max = current
    }
  })
  return max
}

function rotateMap(map) {
  const rotateMap = [];
  map.forEach(row => {
    row.forEach(() => rotateMap.push([]))
    row.forEach((node, nodeIdx) => {
      rotateMap[nodeIdx].push(node)
    })
  })
  return rotateMap;
}

function maxVerticalHints(map) {
  return maxHorizontalHints(rotateMap(map))
}

class App extends Component {
  render() {
    const yFields = 3;
    const xFields = 3;
    const map = createMap(xFields,yFields)
    const yHints = maxVerticalHints(map);
    const fieldHeight = window.innerHeight / (yHints + yFields);
    return (
      <div className="App">
        {map.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="Row">
              {hints(row).map((hint, hintIdx) => {
                return <Hint key={hintIdx} height={fieldHeight} value={hint} />;
              })}
              {row.map((node, nodeIdx) => {
                return <Field key={nodeIdx} height={fieldHeight} value={node} />;
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

App.hints = hints;

export default App;
