import React from "react"

import { css } from "@emotion/core"

// === -- test that these are EXACTLY equal (same type)
// == -- test equality, allowing for type differences

class MovingButton extends React.Component {
  constructor(props) {
    // props.children -- array of React Components nested inside of this guy
    // props.prop1, props.prop2, etc...
    super(props)
    this.state = { padX: 0, padY: 0 }
  }

  handleClick() {
    const newPadX = 1000 * Math.random()
    const newPadY = 100 * Math.random()
    console.log(newPadX)
    this.setState((state, props) => ({ padX: newPadX, padY: newPadY }))
  }

  // setState => render
  // more like an updateState

  render() {
    const style = `margin: ${this.state.padX}px ${this.state.padY}px`
    return (
      <button css={css(style)} onClick={() => this.handleClick()}>
        ;D
      </button>
    )
  }
}

function clicky(e) {
  e.preventDefault()
  alert("hey dont do that!")
}

// props -- immutable params given to Component on creation
// state -- changing internal state of componente

const TicTacToePage = () => (
  // Syntactic Sugar
  <div>
    <h1
      css={css`
        width: 300px;
        border: 15px solid green;
        padding: 50px;
        margin: 20px;
        text-decoration: underline overline;
      `}
    >
      Hello there lets play!
    </h1>
    {/*<button onClick={clicky}>Click me!</button>*/}
    <MovingButton />
  </div>
)

export default TicTacToePage

// JS has 2 diff types of imports/exports
// import mainFunction from "mymodule"  -- unnamed import
// import { aFunction, anotherFunction } from "mymodule" -- named import

// export default mainFunction -- unnamed export
// exports.aFunction = aFunction -- named export
