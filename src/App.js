import React, { Component } from 'react';
import './App.css';

class Timer extends Component {
  constructor() {
    super()
    this.state = {duration: 0}
    this.state.interval = setInterval(() => {
      this.setState({duration: this.state.duration + 1})
    }, 1000)
  }
  render() {
    return (
      <div className="Timer">
        {Math.floor(this.state.duration / 3600)}h {Math.floor(this.state.duration / 60)}m {this.state.duration % 60}s
      </div>
    );
  }
}


class Overlay extends Component {
  render() {
    return (
      <div className="Overlay">
        {this.props.children}
      </div>
    );
  }
}

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
    this.props.onClick(this.props.idx, (this.props.userValue + 1) % 3)
  }
  render() {
    const className = `Field ValueField ${this.props.rowComplete ? 'RowComplete' : ''} ${this.props.colComplete ? 'ColComplete' : ''}`
    return (
      <div className={className} onClick={this.click} style={{
        height: `${this.props.height}px`,
        backgroundColor: [
          'white',
          'green',
          'red'
        ][this.props.userValue]
      }}>
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

function createUserMap(x,y) {
  const map = []
  for (let i = 0; i < (x * y); i++) {
    map.push(0)
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

function rowForIdx(map, idx) {
  return Math.floor(idx / map.x)
}

function colForIdx(map, idx) {
  return idx % map.x
}

function isComplete(streak, userStreak) {
  let complete = true
  streak.forEach((node, nodeIdx) => {
    if ((node === 0 && userStreak[nodeIdx] === 1) ||
        (node === 1 && userStreak[nodeIdx] === 2) ||
        (userStreak[nodeIdx] === 0)) {
      complete = false
      return
    }
  })
  return complete
}

class App extends Component {
  constructor(props) {
    super(props)
    this.onClickField = this.onClickField.bind(this)
    const yFields = 10;
    const xFields = 10;
    this.state = {
      map: createMap(xFields,yFields),
      userValueMap: createUserMap(xFields, yFields)
    }
  }
  onClickField(idx, value) {
    const userMap = [].concat(this.state.userValueMap)
    userMap.x = this.state.userValueMap.x
    userMap.y = this.state.userValueMap.y
    userMap[idx] = value
    this.setState({userValueMap: userMap})
  }
  render() {
    const map = this.state.map
    const yHints = maxVerticalHints(map);
    const xHints = maxHorizontalHints(map);
    const fieldHeight = window.innerHeight / (yHints + map.y);
    const mapIsComplete = isComplete(map, this.state.userValueMap)
    return (
      <div className="App">
        <Timer />
        {mapIsComplete ? <Overlay>Done. Congratulations!</Overlay> : ''}
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
          const rowComplete = isComplete(row, rows(this.state.userValueMap)[rowIdx])
          return (
            <div key={rowIdx} className='Row'>
              {fillLeft(hints(row), xHints).map((hint, hintIdx) => {
                if (hint) {
                  return <Hint key={hintIdx} height={fieldHeight} value={hint} />;
                } else {
                  return <EmptyHint key={hintIdx} height={fieldHeight} />;
                }
              })}
              {row.map((node, nodeIdx) => {
                const colComplete = isComplete(cols(map)[nodeIdx], cols(this.state.userValueMap)[nodeIdx])
                return <Field key={nodeIdx}
                  height={fieldHeight}
                  value={node}
                  idx={rowIdx * row.length + nodeIdx}
                  userValue={this.state.userValueMap[rowIdx * row.length + nodeIdx]}
                  rowComplete={rowComplete}
                  colComplete={colComplete}
                  onClick={this.onClickField}
                  />;
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
App.rowForIdx = rowForIdx;
App.colForIdx = colForIdx;
App.isComplete = isComplete
App.populate = populate;

export default App;
