import React, { Component } from 'react';
import './App.css';
import { 
  hints,
  createMap,
  createUserMap,
  maxVerticalHints,
  maxHorizontalHints,
  isFilled,
  rows,
  cols,
  fillLeft,
  isComplete,
  populate
} from './model.js';

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
      <div className="Timer" onClick={this.props.onClick}>
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
      {this.props.helper ? this.props.value : ''}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.onClickField = this.onClickField.bind(this)
    this.onClickTimer = this.onClickTimer.bind(this)
    const yFields = 20;
    const xFields = 20;
    this.state = {
      map: createMap(xFields,yFields),
      userValueMap: createUserMap(xFields, yFields),
      helper: false
    }
  }
  onClickField(idx, value) {
    const userMap = [].concat(this.state.userValueMap)
    userMap.x = this.state.userValueMap.x
    userMap.y = this.state.userValueMap.y
    userMap[idx] = value
    this.setState({userValueMap: userMap})
  }
  onClickTimer() {
    this.setState({helper: !this.state.helper})
  }
  render() {
    const map = this.state.map
    const yHints = maxVerticalHints(map);
    const xHints = maxHorizontalHints(map);
    const mapIsComplete = isComplete(map, this.state.userValueMap)
    return (
      <div className="App">
        <Timer onClick={this.onClickTimer} />
        {mapIsComplete ? <Overlay>Done. Congratulations!</Overlay> : ''}
        {populate(yHints).map((_, rowIdx) => {
          return (
            <div key={rowIdx} className="Row">
              {populate(xHints).map((_, colIdx) => {
                return <EmptyHint key={colIdx} />;
              })}
              {cols(map).map((col, colIdx) => {
                const hint = fillLeft(hints(col), yHints)[rowIdx]
                if (hint) {
                  return <Hint key={colIdx} value={hint} />;
                } else {
                  return <EmptyHint key={colIdx} />;
                }
              })}
            </div>
          )
        })}
        {rows(map).map((row, rowIdx) => {
          const rowComplete = isFilled(rows(this.state.userValueMap)[rowIdx])
          return (
            <div key={rowIdx} className='Row'>
              {fillLeft(hints(row), xHints).map((hint, hintIdx) => {
                if (hint) {
                  return <Hint key={hintIdx} value={hint} />;
                } else {
                  return <EmptyHint key={hintIdx} />;
                }
              })}
              {row.map((node, nodeIdx) => {
                const colComplete = isFilled(cols(this.state.userValueMap)[nodeIdx])
                return <Field key={nodeIdx}
                  helper={this.state.helper}
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

export default App;