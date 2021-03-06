import React, { Component } from 'react';
import './App.css';
import { 
  hints,
  createMap,
  createHeartMap,
  createUserMap,
  maxVerticalHints,
  maxHorizontalHints,
  isFilled,
  rows,
  cols,
  fillLeft,
  isComplete,
  populate,
  clearWrongUserValues,
  solveUserValues
} from './model.js';

class Timer extends Component {
  render() {
    return (
      <div className="Timer">
        {renderDuration(this.props.duration)}
      </div>
    );
  }
}

class Assistant extends Component {
  render() {
    return (
      <button className="Assistant" onClick={this.props.onClick}>
        Clear Wrong Values!
      </button>
    );
  }
}

class Sizer extends Component {
  render() {
    return (
      <select className="Sizer" onChange={this.props.onChange} defaultValue={this.props.defaultValue || 10}>
        <option>5</option>
        <option>10</option>
        <option>15</option>
        <option>20</option>
        <option>25</option>
      </select>
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
    const className = [
      'Field',
      'EmptyHint',
      this.props.userComplete ? 'UserComplete' : ''
    ].join(' ')
    return (
      <div className={className} style={{height: `${this.props.height}px`}}>
      </div>
    );
  }
}

class Hint extends Component {
  render() {
    const className = [
      'Field',
      'Hint',
      this.props.userComplete ? 'UserComplete' : ''
    ].join(' ')
    return (
      <div className={className} style={{height: `${this.props.height}px`}}>
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
    const className = [
      'Field',
      'ValueField',
      this.props.userComplete ? 'UserComplete' : '',
      this.props.sixth ? 'SixthField' : ''
    ].join(' ')
    return (
      <div className={className} onClick={this.click} style={{
        height: `${this.props.height}px`,
        backgroundColor: [
          'white',
          '#bbdd00',
          '#ff4444'
        ][this.props.userValue]
      }}>
      </div>
    );
  }
}

function renderDuration(duration) {
  return `${Math.floor(duration / 60)}m ${duration % 60}s`
}

function getSizeFromLocation() {
  const size = parseInt(document.location.hash.replace("#",""), 10)
  return size || 10
}

function setSizeToLocation(size) {
  document.location.hash = `#${size}`
}

function resetMapState(size) {
  let createMapFn = createMap
  // render heart randomly
  if (Math.random() < 0.15) createMapFn = createHeartMap
  return {
    map: createMapFn(size, size),
    userValueMap: createUserMap(size, size),
    duration: 0
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.onClickField = this.onClickField.bind(this)
    this.onClickAssistant = this.onClickAssistant.bind(this)
    this.onChangeSize = this.onChangeSize.bind(this)
    const defaultSize = getSizeFromLocation()
    this.state = resetMapState(defaultSize)
    this.interval = setInterval(() => {
      this.setState({duration: this.state.duration + 1})
    }, 1000)
    window.RUN_SOLVER = () => {
      this.setState({
        userValueMap: solveUserValues(this.state.map, this.state.userValueMap)
      })
    }
  }
  onChangeSize(event) {
    const size = parseInt(event.target.value, 10)
    setSizeToLocation(size)
    this.setState(resetMapState(size))
  }
  onClickField(idx, value) {
    const userMap = [].concat(this.state.userValueMap)
    userMap.x = this.state.userValueMap.x
    userMap.y = this.state.userValueMap.y
    userMap[idx] = value
    this.setState({userValueMap: userMap})
    if (isComplete(this.state.map, userMap)) {
      clearInterval(this.interval)
    }
  }
  onClickAssistant() {
    this.setState({
      userValueMap: clearWrongUserValues(this.state.map, this.state.userValueMap)
    })
  }
  render() {
    const map = this.state.map
    const yHints = maxVerticalHints(map);
    const xHints = maxHorizontalHints(map);
    const mapIsComplete = isComplete(map, this.state.userValueMap)
    return (
      <div className="App">
        <div className="Game">
          {mapIsComplete ? <Overlay>Done. Congratulations!<br/>{renderDuration(this.state.duration)}</Overlay> : ''}
          {populate(yHints).map((_, rowIdx) => {
            return (
              <div key={rowIdx} className="Row">
                {populate(xHints).map((_, colIdx) => {
                  return <EmptyHint key={colIdx} />;
                })}
                {cols(map).map((col, colIdx) => {
                  const hint = fillLeft(hints(col), yHints)[rowIdx]
                  const colComplete = isFilled(cols(this.state.userValueMap)[colIdx])
                  if (hint) {
                    return <Hint key={colIdx} value={hint} userComplete={colComplete} />;
                  } else {
                    return <EmptyHint key={colIdx} userComplete={colComplete} />;
                  }
                })}
              </div>
            )
          })}
          {rows(map).map((row, rowIdx) => {
            const rowComplete = isFilled(rows(this.state.userValueMap)[rowIdx])
            return (
              <div key={rowIdx} className={`Row ${rowIdx % 5 === 0 && rowIdx > 0 ? 'SixthRow' : ''}`}>
                {fillLeft(hints(row), xHints).map((hint, hintIdx) => {
                  if (hint) {
                    return <Hint key={hintIdx} value={hint} userComplete={rowComplete} />;
                  } else {
                    return <EmptyHint key={hintIdx} userComplete={rowComplete} />;
                  }
                })}
                {row.map((node, nodeIdx) => {
                  const colComplete = isFilled(cols(this.state.userValueMap)[nodeIdx])
                  return <Field key={nodeIdx}
                    sixth={nodeIdx % 5 === 0 && nodeIdx > 0}
                    value={node}
                    idx={rowIdx * row.length + nodeIdx}
                    userValue={this.state.userValueMap[rowIdx * row.length + nodeIdx]}
                    userComplete={rowComplete || colComplete}
                    onClick={this.onClickField}
                    />;
                })}
              </div>
            )
          })}
        </div>
        <Timer duration={this.state.duration} />
        <Sizer onChange={this.onChangeSize} defaultValue={getSizeFromLocation()} />
        <Assistant onClick={this.onClickAssistant} />
      </div>
    );
  }
}

export default App;
