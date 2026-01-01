const imageCache = new Map()

export async function loadSprites() {
  const imagesToLoad = [
    { id: 'horse-gallop', path: '/sprites/horse-gallop.png' },
    { id: 'sky', path: '/backgrounds/sky.png' },
    { id: 'stadium', path: '/backgrounds/stadium.png' },
    { id: 'bunting', path: '/backgrounds/bunting.png' },
    { id: 'fence', path: '/backgrounds/fence.png' },
    { id: 'grass', path: '/backgrounds/grass.png' },
  ]

  const loadPromises = imagesToLoad.map(({ id, path }) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        imageCache.set(id, img)
        console.log(`✓ Loaded ${id}`)
        resolve()
      }
      img.onerror = () => {
        console.warn(`✗ Failed to load ${id} from ${path} - will use fallback`)
        resolve() // Resolve anyway to not block loading
      }
      img.src = path
    })
  })

  await Promise.all(loadPromises)
  console.log('Asset loading complete')
}

export function getImage(id) {
  return imageCache.get(id)
}
