import React from "react"
import { css } from "@emotion/core"
import ChessGame from "../components/game"

const GamePage = () => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      height: 100vh;
      align-items: center;
    `}
  >
    <ChessGame />
  </div>
)

export default GamePage
