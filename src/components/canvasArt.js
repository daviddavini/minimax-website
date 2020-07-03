exports.Board = class {
  constructor(ctx, x, y, width, height, rows, cols) {
    this.lineColor = "black"
    this.squareColor1 = "purple"
    this.squareColor2 = "orange"
    this.hoveredColor = "#ffff0088"
  }

  draw(ctx) {
    ctx.fillStyle = this.lineColor
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

function fillBoard(
  ctx,
  x,
  y,
  width,
  height,
  cols,
  rows,
  lineSize,
  borderRadius
) {
  fillCurvedRect(ctx, x, y, width, height, borderRadius)
  const squareColor = "#ffff00"
  ctx.fillStyle = squareColor
  const squareWidth = (width - lineSize) / cols - lineSize
  const squareHeight = (height - lineSize) / rows - lineSize
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fillCurvedRect(
        ctx,
        x + lineSize + (squareWidth + lineSize) * i,
        y + lineSize + (squareHeight + lineSize) * j,
        squareWidth,
        squareHeight,
        borderRadius
      )
    }
  }
}

// Fill a "pizza slice" shape
function fillPartialCircle(ctx, cx, cy, radius, startAngle, endAngle) {
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, radius, startAngle, endAngle)
  ctx.closePath()
  ctx.fill()
}

// Fill a rectangle with rounded corners
function fillCurvedRect(ctx, x, y, width, height, borderRadius) {
  console.log(ctx)
  ctx.fillRect(x, y + borderRadius, width, height - 2 * borderRadius)
  ctx.fillRect(x + borderRadius, y, width - 2 * borderRadius, borderRadius)
  ctx.fillRect(
    x + borderRadius,
    y + height - borderRadius,
    width - 2 * borderRadius,
    borderRadius
  )
  const cornersX = [
    x + width - borderRadius,
    x + borderRadius,
    x + borderRadius,
    x + width - borderRadius,
  ]
  const cornersY = [
    y + height - borderRadius,
    y + height - borderRadius,
    y + borderRadius,
    y + borderRadius,
  ]
  for (let i = 0; i < 4; i++) {
    fillPartialCircle(
      ctx,
      cornersX[i],
      cornersY[i],
      borderRadius,
      (i * Math.PI) / 2,
      ((i + 1) * Math.PI) / 2
    )
  }
}

exports.fillPartialCircle = fillPartialCircle
exports.fillCurvedRect = fillCurvedRect

exports.fillBoard = fillBoard
