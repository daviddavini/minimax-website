import { COLOR_THEMES } from "./colors.js"

const defaultOptions = {
  lineSize: 3,
  borderRadius: 6,
  lineColor: "black",
  squareColor: COLOR_THEMES.youthful.orange,
  squareColor2: COLOR_THEMES.youthful.yellow,
  highlightedSquares: [], //eg. { i: 5, j: 5, color: "#ff000088" }
}

// A blank grid of highlightable squares (for chess, checkers, etc)
class Board {
  constructor(x, y, width, height, cols, rows, options) {
    options = { ...defaultOptions, ...options }
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.cols = cols
    this.rows = rows
    this.lineSize = options.lineSize
    this.borderRadius = options.borderRadius
    this.lineColor = options.lineColor
    this.squareColor = options.squareColor
    this.squareColor2 = options.squareColor2
    this.highlightedSquares = options.highlightedSquares

    this.squareWidth = (width - this.lineSize) / cols - this.lineSize
    this.squareHeight = (height - this.lineSize) / rows - this.lineSize
  }

  toBoardCoords(posX, posY) {
    let i = (posX - this.x - this.lineSize) / (this.squareWidth + this.lineSize)
    let j =
      (posY - this.y - this.lineSize) / (this.squareHeight + this.lineSize)
    i = Math.floor(i)
    j = Math.floor(j)
    return { i: i, j: j }
  }

  fromBoardCoords(i, j) {
    let x = this.x + this.lineSize + (this.squareWidth + this.lineSize) * i
    let y = this.y + this.lineSize + (this.squareHeight + this.lineSize) * j
    return { x: x, y: y }
  }

  drawSquare(p5, i, j) {
    p5.rect(
      this.x + this.lineSize + (this.squareWidth + this.lineSize) * i,
      this.y + this.lineSize + (this.squareHeight + this.lineSize) * j,
      this.squareWidth,
      this.squareHeight,
      this.borderRadius
    )
  }

  draw(p5) {
    // Unpack extra params (leftover)
    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const cols = this.cols
    const rows = this.rows
    const lineSize = this.lineSize
    const borderRadius = this.borderRadius
    const lineColor = this.lineColor
    const squareColor = this.squareColor
    const squareColor2 = this.squareColor2
    const highlightedSquares = this.highlightedSquares

    // Draw lines via background
    p5.fill(lineColor)
    p5.rect(x, y, width, height, borderRadius)

    // Draw square grid
    p5.strokeWeight(0)
    const squareWidth = (width - lineSize) / cols - lineSize
    const squareHeight = (height - lineSize) / rows - lineSize
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if ((i + j) % 2 === 0) {
          p5.fill(squareColor)
        } else {
          p5.fill(squareColor2)
        }
        this.drawSquare(p5, i, j)
      }
    }

    // Draw square highlights
    for (let highlightedSquare of highlightedSquares) {
      if (
        !(highlightedSquare.i >= 0 && highlightedSquare.i < cols) ||
        !(highlightedSquare.j >= 0 && highlightedSquare.j < rows)
      ) {
        continue
      }
      p5.fill(highlightedSquare.color)
      this.drawSquare(p5, highlightedSquare.i, highlightedSquare.j)
    }
  }
}

export default Board
