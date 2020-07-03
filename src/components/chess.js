import React from "react"
import Sketch from "react-p5"
import Board from "./board"
import ChessBoard from "./chessBoard"
import { css } from "@emotion/core"

import GrundyState from "./grundyState"
import { minimax } from "./minimax"

class Chess extends React.Component {
  static defaultProps = {
    width: 500,
    height: 500,
  }

  constructor(props) {
    super(props)
  }

  preload = p5 => {
    ChessBoard.preload(p5)
  }

  // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  setup = (p5, canvasParentRef) => {
    p5.createCanvas(this.props.width, this.props.height).parent(canvasParentRef)
    this.chess = new ChessBoard(
      p5,
      50,
      50,
      this.props.width - 100,
      this.props.height - 100
    )
  }

  draw = p5 => {
    p5.background(220)

    this.chess.draw(p5)
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function...
    // pls use normal variables or class properties for this purposes
  }

  render() {
    return <Sketch setup={this.setup} draw={this.draw} preload={this.preload} />
  }
}

export default Chess
