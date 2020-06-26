import React from "react"
import { css } from "@emotion/core"
import TicTacToeBoard from "../components/tic-tac-toe-board"

const TicTacToePage = () => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      height: 100vh;
      align-items: center;
    `}
  >
    <TicTacToeBoard />
  </div>
)

export default TicTacToePage
