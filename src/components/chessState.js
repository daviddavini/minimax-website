import _ from "lodash"

// Represents a valid positioning of chess pieces (and valid moves)
const GRID_DIRS = [
  { i: 1, j: 0 },
  { i: -1, j: 0 },
  { i: 0, j: 1 },
  { i: 0, j: -1 },
]

const DIAGONAL_DIRS = [
  { i: 1, j: 1 },
  { i: -1, j: 1 },
  { i: 1, j: -1 },
  { i: -1, j: -1 },
]

const ALL_DIRS = GRID_DIRS.concat(DIAGONAL_DIRS)

const HORSE_OFFSETS = [
  { i: 1, j: 2 },
  { i: 2, j: 1 },
  { i: -1, j: 2 },
  { i: -2, j: 1 },
  { i: 1, j: -2 },
  { i: 2, j: -1 },
  { i: -1, j: -2 },
  { i: -2, j: -1 },
]

const PIECE_VALUES = {
  pawn: 1,
  bishop: 5,
  rook: 5,
  horse: 3,
  queen: 8,
  king: Infinity,
}

const PIECE_COLORS = ["white", "black"]

class ChessState {
  constructor(playerIndex = 0, pieces = []) {
    this.playerIndex = playerIndex
    this.pieces = pieces
    this.capturedPieces = []
  }

  actions() {
    let res = []
    for (let piece of this.pieces) {
      res.push(...this.actionsFor(piece))
    }
    return res
  }

  player() {
    return PIECE_COLORS[this.playerIndex % 2]
  }

  // Assumes that action is valid, and performs it to get the state
  result(action) {
    const result = new ChessState(
      this.playerIndex + 1,
      _.cloneDeep(this.pieces)
    )
    // FIRST, remove any captured
    const capturedPiece = result.pieceAt(action.to.i, action.to.j)
    if (capturedPiece) {
      const i = result.pieces.indexOf(capturedPiece)
      result.pieces.splice(i, 1)
      this.capturedPieces.push(capturedPiece)
    }
    // NOW, update pos of moving piece
    const movingPiece = result.pieceAt(action.from.i, action.from.j)
    movingPiece.i = action.to.i
    movingPiece.j = action.to.j
    return result
  }

  heuristic() {
    let utilities = { white: 0, black: 0 }
    for (let piece of this.capturedPieces) {
      let color = piece.color
      utilities[player] += PIECE_VALUES[piece.type]
    }
    return utilities
  }

  // isTerminal() {
  //   // If the king was taken, it is a lose for that player
  //   return this.utilities() !==
  // }

  utilities() {
    // Check if a king was taken, and calculate utilities on this
    for (let piece of this.capturedPieces) {
      if (piece.type === "king") {
        if (piece.color === "white") {
          return { white: -1, black: 1 }
        } else {
          return { white: 1, black: -1 }
        }
      }
    }
    return { white: 0, black: 0 }
  }

  actionsFor(piece) {
    let res = []
    if (piece.type === "pawn") {
      res.push(...this.actionsForPawn(piece))
    } else if (piece.type === "rook") {
      res.push(...this.actionsForRook(piece))
    } else if (piece.type === "bishop") {
      res.push(...this.actionsForBishop(piece))
    } else if (piece.type === "queen") {
      res.push(...this.actionsForQueen(piece))
    } else if (piece.type === "knight") {
      res.push(...this.actionsForKnight(piece))
    } else if (piece.type === "king") {
      res.push(...this.actionsForKing(piece))
    }
    return res
  }

  // Get all possible actions for this pawn
  actionsForPawn(piece) {
    let dirJ
    let hasMoved
    if (piece.player === "white") {
      dirJ = -1
      hasMoved = !(piece.j === 6)
    } else if (piece.player === "black") {
      dirJ = 1
      hasMoved = !(piece.j === 1)
    }
    let res = []
    let pos = { i: piece.i, j: piece.j }
    let oneStepPos = { i: piece.i, j: piece.j + dirJ }
    let twoStepPos = { i: piece.i, j: piece.j + 2 * dirJ }
    if (this.isOpenPos(oneStepPos.i, oneStepPos.j)) {
      res.push({ from: pos, to: oneStepPos })
      if (!hasMoved && this.isOpenPos(twoStepPos.i, twoStepPos.j)) {
        res.push({ from: pos, to: twoStepPos })
      }
    }
    // Add pawn attacks
    let leftStepPos = { i: piece.i + 1, j: piece.j + dirJ }
    let rightStepPos = { i: piece.i - 1, j: piece.j + dirJ }
    for (let sidePos of [leftStepPos, rightStepPos]) {
      if (this.isValidPos(sidePos.i, sidePos.j)) {
        let pieceOnSidePos = this.pieceAt(sidePos.i, sidePos.j)
        if (pieceOnSidePos && pieceOnSidePos.player !== piece.color) {
          res.push({ from: pos, to: sidePos })
        }
      }
    }
    return res
  }

  actionsForRook(piece) {
    return this.actionsForLineMover(piece, GRID_DIRS)
  }

  actionsForBishop(piece) {
    return this.actionsForLineMover(piece, DIAGONAL_DIRS)
  }

  actionsForQueen(piece) {
    return this.actionsForLineMover(piece, ALL_DIRS)
  }

  actionsForKnight(piece) {
    return this.actionsForOffsetMover(piece, HORSE_OFFSETS)
  }

  actionsForKing(piece) {
    return this.actionsForOffsetMover(piece, ALL_DIRS)
  }

  actionsForOffsetMover(piece, offsets) {
    let res = []
    let pos = { i: piece.i, j: piece.j }
    for (let offset of offsets) {
      let offsetPos = { i: pos.i + offset.i, j: pos.j + offset.j }
      // Add move if its in a valid location and blank or black
      if (
        this.isOpenPos(offsetPos.i, offsetPos.j) ||
        (this.isValidPos(offsetPos.i, offsetPos.j) &&
          this.pieceAt(offsetPos.i, offsetPos.j).player !== piece.player)
      ) {
        res.push({ from: pos, to: offsetPos })
      }
    }
    return res
  }

  // Reusable code for rooks and bishops and queens
  actionsForLineMover(piece, dirs) {
    let pos = { i: piece.i, j: piece.j }
    let linePos
    let res = []
    for (let dir of dirs) {
      // Start adjacent to current position in direction dir
      linePos = { i: pos.i + dir.i, j: pos.j + dir.j }
      // Keep adding and going in a line
      while (this.isOpenPos(linePos.i, linePos.j)) {
        res.push({ from: pos, to: linePos })
        linePos = { i: linePos.i + dir.i, j: linePos.j + dir.j }
      }
      // If opponent piece ends, add it!
      if (
        this.isValidPos(linePos.i, linePos.j) &&
        this.pieceAt(linePos.i, linePos.j).player !== piece.player
      ) {
        res.push({ from: pos, to: linePos })
      }
    }
    return res
  }

  // Check if pos is empty and on board
  isOpenPos(i, j) {
    return this.isValidPos(i, j) && this.pieceAt(i, j) === null
  }

  // Check if pos on board
  isValidPos(i, j) {
    return i >= 0 && j >= 0 && i < 8 && j < 8
  }

  // Replace this with more efficient code
  pieceAt(i, j) {
    for (let piece of this.pieces) {
      if (piece.i === i && piece.j === j) return piece
    }
    return null
  }

  isValidAction(possAction) {
    let piece = this.pieceAt(possAction.from.i, possAction.from.j)
    // if there is no piece there, the action must be false
    if (piece === null) {
      return false
    }
    // otherwise, we must check all actions that piece can make
    let actions = this.actionsFor(piece)
    for (let action of actions) {
      if (possAction.to.i === action.to.i && possAction.to.j === action.to.j) {
        return true
      }
    }
    return false
  }
}

const frontRowTypes = [
  "rook",
  "knight",
  "bishop",
  "king",
  "queen",
  "bishop",
  "knight",
  "rook",
]
const pieceCoords = []

let i = 0
for (let frontRowType of frontRowTypes) {
  pieceCoords[i] = {
    i: i,
    j: 0,
    type: frontRowType,
    player: "black",
  }
  pieceCoords[i + 8] = {
    i: i,
    j: 7,
    type: frontRowType,
    player: "white",
  }
  pieceCoords[i + 16] = {
    i: i,
    j: 1,
    type: "pawn",
    player: "black",
  }
  pieceCoords[i + 24] = {
    i: i,
    j: 6,
    type: "pawn",
    player: "white",
  }
  i++
}

ChessState.initial = new ChessState(0, pieceCoords)

export default ChessState
