exports.minimax = function minimax(state) {
  let player = state.player()
  let bestUtilities = new Array(2).fill(-Infinity)
  let bestAction = null
  let bestResult = null
  for (let possAction of state.actions()) {
    let result = state.result(possAction)
    let utilities
    if (result.isTerminal()) {
      utilities = result.utilities()
    } else {
      utilities = minimax(result).bestUtilities
    }
    if (utilities[player] > bestUtilities[player]) {
      bestUtilities = utilities
      bestAction = possAction
      bestResult = result
    }
  }
  return {
    bestUtilities: bestUtilities,
    bestAction: bestAction,
    bestResult: bestResult,
  }
}
