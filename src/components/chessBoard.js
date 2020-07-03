import Board from "./board"
import ChessState from "./chessState"
import piecesImageFile from "../images/chess_pieces.png"
import { COLOR_THEMES, TRANSPARENT_WHITE } from "./colors"
import { deepCompare } from "./utilities"

const defaultOptions = { chessState: ChessState.initial }

class ChessBoard {
  constructor(p5, x, y, width, height, options) {
    options = { ...options, ...defaultOptions }
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.board = new Board(x, y, width, height, 8, 8)
    this.chessState = options.chessState
    this.selectedPiece = null
    this.selectedSquareColors = {
      piece: COLOR_THEMES.youthful.green,
      move: COLOR_THEMES.youthful.blue,
    }
    let transparency = 0.5
    const hoverPlayer = p5.color(COLOR_THEMES.youthful.green)
    hoverPlayer.setAlpha(transparency * 255)
    const hoverMoveColor = p5.color(COLOR_THEMES.youthful.blue)
    hoverMoveColor.setAlpha(transparency * 255)
    this.hoveredPiece = null
    this.hoveredSquareColors = {
      piece: hoverPlayer,
      move: hoverMoveColor,
    }
  }

  highlightPieceAndMoves(piece, squareColors) {
    this.board.highlightedSquares.push({
      i: piece.i,
      j: piece.j,
      color: squareColors.piece,
    })
    let actions = this.chessState.actionsFor(piece)
    for (let action of actions) {
      this.board.highlightedSquares.push({
        i: action.to.i,
        j: action.to.j,
        color: squareColors.move,
      })
    }
  }

  //TODO: This code is spaghetti, unfortunately :(
  update(p5) {
    // For clarity, separate between last frame and this frame's piece highlights
    const lastSelectedPiece = this.selectedPiece

    // Find which square the cursor is on
    const mouseBoardCoords = this.board.toBoardCoords(p5.mouseX, p5.mouseY)
    this.board.highlightedSquares.push([
      { i: mouseBoardCoords.i, j: mouseBoardCoords.j, color: "#ff000088" },
    ])
    // Update the hovered piece
    let hoveredPiece = this.chessState.pieceAt(
      mouseBoardCoords.i,
      mouseBoardCoords.j
    )

    // Don't let the s select the wrong color!
    if (hoveredPiece && hoveredPiece.player === this.chessState.player()) {
      this.hoveredPiece = hoveredPiece
    } else {
      this.hoveredPiece = null
    }
    // If the mouse is clicked, select that piece
    if (p5.mouseIsPressed) {
      this.selectedPiece = this.hoveredPiece

      // Also, if the mouse is clicked on a valid move, do the move. Otherwise, reselect
      if (lastSelectedPiece) {
        const lastSelectedPos = {
          i: lastSelectedPiece.i,
          j: lastSelectedPiece.j,
        }
        const selectedPos = {
          i: mouseBoardCoords.i,
          j: mouseBoardCoords.j,
        }
        const proposedAction = { from: lastSelectedPos, to: selectedPos }
        if (this.chessState.isValidAction(proposedAction)) {
          // The proposed action is valid -- perform it on this.chessState!
          let last = this.chessState
          this.chessState = this.chessState.result(proposedAction)
        }
      }
    }
  }

  draw(p5) {
    this.update(p5)

    // Reset highlighting
    this.board.highlightedSquares = []
    // Highlight the possible moves for the selected piece
    if (this.hoveredPiece) {
      this.highlightPieceAndMoves(this.hoveredPiece, this.hoveredSquareColors)
    }
    if (this.selectedPiece) {
      this.highlightPieceAndMoves(this.selectedPiece, this.selectedSquareColors)
    }

    this.board.draw(p5)

    this.drawPiece(p5, 0, 0, "queen")
    this.drawPiece(p5, 0, 1, "bishop")
    for (let piece of this.chessState.pieces) {
      this.drawPiece(p5, piece)
    }
  }

  drawPiece(p5, piece) {
    let i = piece.i
    let j = piece.j
    let type = piece.type
    let player = piece.player

    let imageCol
    let imageRow
    if (player === "black") {
      imageRow = 0
    } else if (player === "white") {
      imageRow = 1
    }
    if (type === "queen") {
      imageCol = 0
    } else if (type === "king") {
      imageCol = 1
    } else if (type === "rook") {
      imageCol = 2
    } else if (type === "knight") {
      imageCol = 3
    } else if (type === "bishop") {
      imageCol = 4
    } else if (type === "pawn") {
      imageCol = 5
    }

    const pos = this.board.fromBoardCoords(i, j)
    drawFromSpritesheet(
      p5,
      pos.x,
      pos.y,
      this.board.squareWidth,
      this.board.squareHeight,
      ChessBoard.piecesImage,
      6,
      2,
      imageCol,
      imageRow
    )
  }
}

function drawFromSpritesheet(
  p5,
  x,
  y,
  width,
  height,
  image,
  cols,
  rows,
  col,
  row
) {
  const imageX = (image.width * col) / cols
  const imageY = (image.height * row) / rows
  const imageWidth = image.width / cols
  const imageHeight = image.height / rows
  p5.image(image, x, y, width, height, imageX, imageY, imageWidth, imageHeight)
}

ChessBoard.preload = function (p5) {
  ChessBoard.piecesImage = p5.loadImage(piecesImageFile)
}

export default ChessBoard
