import React, { Component } from 'react';
import './App.css';

class EmptyHint extends Component {
  render() {
    return (
      <div className="Field EmptyHint" style={{height: `${this.props.height}px`}}>
      </div>
    );
  }
}

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
  constructor(props) {
    super(props)
    this.click = this.click.bind(this);
  }
  click() {
    this.props.onClick(this.props.idx, this.props.userValue + 1 % 3)
  }
  render() {
    return (
      <div className="Field ValueField" onClick={this.click} style={{
        height: `${this.props.height}px`,
        backgroundColor: [
          'white',
          'green',
          'red'
        ][this.props.userValue]
      }}>
        {this.props.value}
      </div>
    );
  }
}

function createMap(x,y) {
  const map = []
  for (let i = 0; i < (x * y); i++) {
    map.push(Math.random() > 0.5 ? 1 : 0)
  }
  map.x = x
  map.y = y
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

function rows(map) {
  const rows = []
  map.forEach((node, idx) => {
    if (idx % map.x === 0) {
      rows.push([])
    }
    rows[rows.length - 1].push(node)
  })
  return rows
}

// x=3
// y=2
//
// [0,1,2,3,4,5]
//
// rows
// [[0,1,2]
//  [3,4,5]]
//
// cols
// [[0,3],
//  [1,4],
//  [2,5]]
function cols(map) {
  const cols = []
  for (let i = 0; i < map.x; i++) {
    const col = []
    cols.push(col)
  }
  map.forEach((node, idx) => {
    cols[idx % map.x].push(node)
  })
  return cols
}

function maxHorizontalHints(map) {
  let max = 0;
  rows(map).forEach(row => {
    const current = hints(row).length
    if (current > max) {
      max = current
    }
  })
  return max
}

function maxVerticalHints(map) {
  let max = 0;
  cols(map).forEach(col => {
    const current = hints(col).length
    if (current > max) {
      max = current
    }
  })
  return max
}

function fillLeft(streak, size) {
  const missingSize = size - streak.length
  const missing = [];
  for (let i = 0; i < missingSize; i++) {
    missing.push(undefined)
  }
  return missing.concat(streak);
}

function populate(size, value) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(value)
  }
  return arr;
}

class App extends Component {
  constructor(props) {
    super(props)
    this.onClickField = this.onClickField.bind(this)
    const yFields = 10;
    const xFields = 10;
    this.state = {
      map: createMap(xFields,yFields),
      userValueMap: populate(xFields * yFields, 0)
    }
  }
  onClickField(idx, value) {
    const map = [].concat(this.state.userValueMap)
    map[idx] = value
    this.setState({userValueMap: map})
  }
  render() {
    const map = this.state.map
    const yHints = maxVerticalHints(map);
    const xHints = maxHorizontalHints(map);
    const fieldHeight = window.innerHeight / (yHints + map.y);
    return (
      <div className="App">
        {populate(yHints).map((_, rowIdx) => {
          return (
            <div key={rowIdx} className="Row">
              {populate(xHints).map((_, colIdx) => {
                return <EmptyHint key={colIdx} height={fieldHeight} />;
              })}
              {cols(map).map((col, colIdx) => {
                const hint = fillLeft(hints(col), yHints)[rowIdx]
                if (hint) {
                  return <Hint key={colIdx} height={fieldHeight} value={hint} />;
                } else {
                  return <EmptyHint key={colIdx} height={fieldHeight} />;
                }
              })}
            </div>
          )
        })}
        {rows(map).map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="Row">
              {fillLeft(hints(row), xHints).map((hint, hintIdx) => {
                if (hint) {
                  return <Hint key={hintIdx} height={fieldHeight} value={hint} />;
                } else {
                  return <EmptyHint key={hintIdx} height={fieldHeight} />;
                }
              })}
              {row.map((node, nodeIdx) => {
                return <Field key={nodeIdx} height={fieldHeight} value={node} idx={rowIdx * row.length + nodeIdx} userValue={this.state.userValueMap[rowIdx * row.length + nodeIdx]} onClick={this.onClickField} />;
              })}
            </div>
          )
        })}
      </div>
    );
  }
}

App.hints = hints;
App.createMap = createMap;
App.rows = rows;
App.cols = cols;
App.fillLeft = fillLeft;

export default App;
