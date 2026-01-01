import { BACKGROUND_LAYERS, TREADMILL_CONFIG } from '../constants/treadmillConfig'
import { getImage } from './spriteLoader'

export function drawBackgroundLayers(
  ctx,
  scrollOffset,
  canvasWidth,
  canvasHeight
) {
  BACKGROUND_LAYERS.forEach((layer) => {
    const image = getImage(layer.id)

    if (image) {
      // Draw image-based background with parallax scrolling
      const layerOffset = scrollOffset * layer.scrollSpeed
      const imageWidth = image.width
      const layerHeight = canvasHeight * 0.6
      const y = canvasHeight - layerHeight

      // Calculate how many tiles needed to cover entire canvas width
      const startX = -(layerOffset % imageWidth)
      const tilesNeeded = Math.ceil((canvasWidth - startX) / imageWidth) + 1

      // Draw tiles across entire canvas width to prevent gaps
      for (let i = 0; i < tilesNeeded; i++) {
        const x = startX + (i * imageWidth)
        ctx.drawImage(image, x, y, imageWidth, layerHeight)
      }
    } else {
      // Fallback: draw simple colored layers
      drawFallbackLayer(ctx, layer, scrollOffset, canvasWidth, canvasHeight)
    }
  })
}

function drawFallbackLayer(ctx, layer, scrollOffset, canvasWidth, canvasHeight) {
  // Simple colored rectangles as fallback
  const colors = {
    sky: '#87CEEB',
    stadium: '#696969',
    bunting: '#FF6B9D',
    fence: '#FFFFFF',
    grass: '#2D8F3F',
  }

  ctx.fillStyle = colors[layer.id] || '#CCCCCC'

  const layerHeight = canvasHeight * 0.2
  const y = canvasHeight - layerHeight * layer.zIndex

  // Add scrolling effect for non-sky layers
  if (layer.id !== 'sky') {
    const offset = (scrollOffset * layer.scrollSpeed) % 100
    ctx.fillRect(-offset, y, canvasWidth + 100, layerHeight)
  } else {
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }
}

export function drawHorse(ctx, horse) {
  if (!ctx || !horse) return

  const spriteSheet = getImage('horse-gallop')
  const size = TREADMILL_CONFIG.HORSE_SPRITE_SIZE

  // Draw colored background (jockey silks)
  ctx.fillStyle = horse.color
  ctx.fillRect(horse.x - size / 2, horse.y - size / 2, size, size)

  if (spriteSheet) {
    // Draw sprite frame from sprite sheet
    const frameX = horse.spriteFrame * size

    ctx.drawImage(
      spriteSheet,
      frameX,
      0,
      size,
      size,
      horse.x - size / 2,
      horse.y - size / 2,
      size,
      size
    )
  } else {
    // Fallback: draw horse emoji
    ctx.font = '48px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🏇', horse.x, horse.y)
  }

  // Draw horse name/number
  ctx.fillStyle = '#FFFFFF'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 3
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'

  const text = horse.name || horse.id
  ctx.strokeText(text, horse.x, horse.y - size / 2 - 15)
  ctx.fillText(text, horse.x, horse.y - size / 2 - 15)
}

export function drawFinishLine(ctx, finishLine, canvasHeight) {
  if (!ctx || !finishLine || !finishLine.spawned) return

  const squareSize = TREADMILL_CONFIG.FINISH_LINE_SQUARE_SIZE
  const rows = Math.ceil(canvasHeight / squareSize)
  const cols = Math.ceil(finishLine.width / squareSize)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isBlack = (row + col) % 2 === 0
      ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF'
      ctx.fillRect(
        finishLine.x + col * squareSize,
        row * squareSize,
        squareSize,
        squareSize
      )
    }
  }
}

export function drawTimer(ctx, formattedTime, canvasWidth) {
  if (!ctx || !formattedTime) return

  // Timer background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(canvasWidth / 2 - 120, 20, 240, 80)

  // Timer text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 48px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(formattedTime, canvasWidth / 2, 60)
}

export function drawControls(ctx, canvasWidth, canvasHeight) {
  // Optional: Draw control hints
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Press ESC to pause', canvasWidth / 2, canvasHeight - 20)
}
