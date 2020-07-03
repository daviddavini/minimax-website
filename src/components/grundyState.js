import _ from "lodash"

class GrundyState {
  constructor(playerIndex = 0, heaps = [11]) {
    this.heaps = heaps
    this.playerIndex = playerIndex
  }

  player() {
    return this.playerIndex
  }

  actions() {
    let actions = []
    for (let i = 0; i < this.heaps.length; i++) {
      for (let amt = 1; amt <= Math.floor((this.heaps[i] - 1) / 2); amt++) {
        let action = { heapIndex: i, splitAmt: amt }
        actions.push(action)
      }
    }
    return actions
  }

  result(action) {
    let result = new GrundyState(
      (this.playerIndex + 1) % 2,
      _.cloneDeep(this.heaps)
    )
    result.heaps.push(action.splitAmt)
    result.heaps.push(this.heaps[action.heapIndex] - action.splitAmt)
    result.heaps.splice(action.heapIndex, 1)
    return result
  }

  isTerminal() {
    return this.actions().length === 0
  }

  utilities() {
    let utilities
    if (this.isTerminal()) {
      utilities = new Array(2).fill(-1)
      let winner = this.playerIndex - 1
      if (winner < 0) {
        winner = 1
      }
      utilities[winner] = 1
      return utilities
    } else {
      utilities = new Array(2).fill(0)
      return utilities
    }
  }
}

export default GrundyState
