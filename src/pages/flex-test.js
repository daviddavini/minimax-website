import React from "react"
import { css } from "@emotion/core"

class TicTacToeBoard extends React.Component {
  static defaultProps = {
    rows: 3,
    cols: 3,
  }

  constructor(props) {
    super(props)
    this.state = {
      rows: props.rows,
      cols: props.cols,
      board: this.blank_board(props.rows, props.cols),
    }
    console.log(this.state.board)
  }
  blank_board(R, C) {
    return Array.from({ length: R }, () => Array.from({ length: C }, () => " "))
  }
  render() {
    return <canvas ref="canvas" width={400} height={400} />
  }
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

function TicTacToePage() {
  return (
    <div
      css={css`
        display: flex;
        align-items: stretch;
        background-color: purple;
        height: 100vh;
      `}
    >
      <div
        css={css`
          flex: 3 1 0;
          background-color: white;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <TicTacToeBoard />
      </div>
      <div
        css={css`
          flex: 2 1 0;
          background-color: gray;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <h1
          css={css`
            width: 75%;
          `}
        >
          This is a message to the side!
        </h1>
      </div>
    </div>
  )
}

export default TicTacToePage
