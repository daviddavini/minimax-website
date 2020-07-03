import React from "react"
import { css, jsx } from "@emotion/core"
import { createContext } from "react"

const BG_COLOR = "#ffff00"
const LINE_COLOR = "#000000" //"#5522bb"
const SQUARE_COLOR_2 = "#dce5ff"
const SQUARE_COLOR = "#aaffaa"
const HOVER_SHADER = "#ffff0088"
const LINE_WIDTH = 8
const N_SQUARES = 8

class ChessGame extends React.Component {
  static defaultProps = {
    rows: 3,
    cols: 3,
    width: 400,
    height: 400,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <canvas
        css={css`
          padding: 10px;
          border: 2px solid;
        `}
        ref="canvas"
        width={600}
        height={600}
        onClick={e => this.handleClick(e)}
        onMouseOver={e => this.handleMouseOver(e)}
        onMouseOut={e => this.handleMouseOut(e)}
        onMouseMove={e => this.handleMouseMove(e)}
      />
    )
  }

  drawSquares(ctx, W, H) {
    for (let i = 0; i < N_SQUARES; i++) {
      for (let j = 0; j < N_SQUARES; j++) {
        if ((i + j) % 2 == 0) {
          ctx.fillStyle = SQUARE_COLOR
        } else {
          ctx.fillStyle = SQUARE_COLOR_2
        }
        this.drawSquare(ctx, i, j, W, H)
      }
    }
  }

  drawSquare(ctx, i, j) {
    const B = LINE_WIDTH / 2
    ctx.fillRect(
      B + (i * this.innerW) / N_SQUARES + B,
      B + (j * this.innerH) / N_SQUARES + B,
      this.innerW / N_SQUARES - 2 * B,
      this.innerH / N_SQUARES - 2 * B
    )
  }

  findSquare(x, y) {
    const i = Math.floor(((x - LINE_WIDTH) * N_SQUARES) / this.innerW)
    const j = Math.floor(((y - LINE_WIDTH) * N_SQUARES) / this.innerH)
    return [i, j]
  }

  draw() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height
    this.innerW = this.W - LINE_WIDTH
    this.innerH = this.H - LINE_WIDTH
    this.W = W
    this.H = H

    // Reset the canvas
    ctx.fillStyle = LINE_COLOR
    ctx.fill()
    ctx.fillRect(0, 0, W, H)

    // Draw squares
    this.drawSquares(ctx, W, H)

    ctx.strokeStyle = "#000000"
    ctx.lineCap = "round"
    ctx.lineWidth = 10

    ctx.fillStyle = HOVER_SHADER
    this.drawSquare(ctx, 0, 1, W, H)

    if (this.hoverSquare) {
      this.drawSquare(ctx, ...this.hoverSquare)
    }
  }

  componentDidMount() {
    this.draw()
  }
  componentDidUpdate() {
    this.draw()
  }

  canvasCoords(clientX, clientY) {
    const canvas = this.refs.canvas
    const borderY = (canvas.clientHeight - canvas.height) / 2
    const borderX = (canvas.clientWidth - canvas.width) / 2
    const x = clientX - this.refs.canvas.offsetLeft - borderX
    const y = clientY - this.refs.canvas.offsetTop - borderY
    return [x, y]
  }

  handleMouseMove(e) {
    const coords = this.canvasCoords(e.clientX, e.clientY)
    this.hoverSquare = this.findSquare(...coords)
    this.draw()
  }

  handleClick(e) {}

  handleMouseOver(e) {
    this.bgColor = "#ff0000"
    this.draw()
  }

  handleMouseOut(e) {
    this.bgColor = "#dce5ff"
    this.draw()
  }
}

export default ChessGame
