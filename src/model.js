
export function createMap(x,y) {
  const map = []
  for (let i = 0; i < (x * y); i++) {
    map.push(Math.random() > 0.44 ? 1 : 0)
  }
  map.x = x
  map.y = y
  return map;
}

export function createUserMap(x,y) {
  const map = []
  for (let i = 0; i < (x * y); i++) {
    map.push(0)
  }
  map.x = x
  map.y = y
  return map;
}

export function hints(streak) {
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

export function rows(map) {
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
export function cols(map) {
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

export function maxHorizontalHints(map) {
  let max = 0;
  rows(map).forEach(row => {
    const current = hints(row).length
    if (current > max) {
      max = current
    }
  })
  return max
}

export function maxVerticalHints(map) {
  let max = 0;
  cols(map).forEach(col => {
    const current = hints(col).length
    if (current > max) {
      max = current
    }
  })
  return max
}

export function fillLeft(streak, size) {
  const missingSize = size - streak.length
  const missing = [];
  for (let i = 0; i < missingSize; i++) {
    missing.push(undefined)
  }
  return missing.concat(streak);
}

export function populate(size, value) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(value)
  }
  return arr;
}

export function rowForIdx(map, idx) {
  return Math.floor(idx / map.x)
}

export function colForIdx(map, idx) {
  return idx % map.x
}

export function isFilled(streak) {
  let complete = true
  streak.forEach((node, nodeIdx) => {
    if (node === 0) {
      complete = false
      return
    }
  })
  return complete
}

export function isComplete(streak, userStreak) {
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