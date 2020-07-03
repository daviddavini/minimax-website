import React from "react"
import { css } from "@emotion/core"
import {
  drawBoard,
  fillCurvedRect,
  fillPartialCircle,
  fillBoard,
} from "../components/canvasArt"

class ArtTestingPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <canvas
        css={css`
          padding: 0px;
          border: 2px solid;
        `}
        ref="canvas"
        width={500}
        height={500}
      />
    )
  }

  draw() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    // Clear Canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#00ffff88"
    fillBoard(ctx, 100, 100, 200, 150, 4, 3, 5, 10)
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate() {
    this.draw()
  }
}

export default ArtTestingPage
