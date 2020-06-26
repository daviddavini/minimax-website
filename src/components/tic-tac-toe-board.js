import React from "react"
import { css, jsx } from "@emotion/core"

const exampleBoard = () => [
  [" ", " ", " "],
  ["X", "X", "X"],
  ["O", "O", "O"],
]

class TicTacToeBoard extends React.Component {
  static defaultProps = {
    rows: 3,
    cols: 3,
    width: 400,
    height: 400,
  }

  constructor(props) {
    super(props)
    this.state = {
      board: exampleBoard(), //this.blankBoard(props.rows, props.cols),
    }
    this.pieceSize = 50
    console.log(this.state.board)
  }
  blankBoard(R, C) {
    return Array.from({ length: R }, () => Array.from({ length: C }, () => " "))
  }

  render() {
    return (
      <canvas
        css={css`
          border-radius: 50px;
          padding: 10px;
          border: 2px solid;
        `}
        ref="canvas"
        width={400}
        height={400}
      />
    )
  }

  drawX(ctx, x, y) {
    const R = this.pieceSize / 2

    ctx.beginPath()
    ctx.moveTo(x - R, y - R)
    ctx.lineTo(x + R, y + R)
    ctx.moveTo(x - R, y + R)
    ctx.lineTo(x + R, y - R)
    ctx.stroke()
  }

  drawO(ctx, x, y) {
    const R = this.pieceSize / 2

    ctx.beginPath()
    ctx.arc(x, y, R, 0, 2 * Math.PI)
    ctx.stroke()
  }

  draw() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height
    const gap = 10

    // Reset the canvas
    ctx.fillStyle = "#dce5ff"
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = "#000000"
    ctx.lineCap = "round"
    ctx.lineWidth = 10
    // Draw horizontal lines
    ctx.beginPath()
    ctx.moveTo(gap, H / 3)
    ctx.lineTo(W - gap, H / 3)
    ctx.moveTo(gap, (H * 2) / 3)
    ctx.lineTo(W - gap, (H * 2) / 3)
    // Draw vertical lines
    ctx.moveTo(W / 3, gap)
    ctx.lineTo(W / 3, H - gap)
    ctx.moveTo((W * 2) / 3, gap)
    ctx.lineTo((W * 2) / 3, H - gap)
    ctx.stroke()

    // Draw X's and O's
    const percentAtIndex = [1 / 6, 1 / 2, 5 / 6]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.state.board[i][j] == "X") {
          this.drawX(ctx, W * percentAtIndex[j], H * percentAtIndex[i])
        } else if (this.state.board[i][j] == "O") {
          this.drawO(ctx, W * percentAtIndex[j], H * percentAtIndex[i])
        }
      }
    }
  }

  componentDidMount() {
    this.draw()
  }
  componentDidUpdate() {
    this.draw()
  }
}

export default TicTacToeBoard
