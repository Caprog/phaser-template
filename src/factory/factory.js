import { hasValue } from '../utils/utils'

export const useBodyFactory = ({ ctx, physics }) => ({
    createSquare: createSquare({ ctx, physics })
})

const createSquare = ({ ctx, physics }) => node => {
    const { createRoundedRectangle } = useShapeFactory({ ctx })
    const { type } = node
    const graphics = createRoundedRectangle(node)
    physics.add.existing(graphics)

    if (type === 'static') {
        graphics.body.setImmovable(true)
    } else 
        setDynamicPhysics(graphics, node)

    graphics.setData(node)

    return graphics
}

const setDynamicPhysics = ({ body }, { gravityScale }) => {
    body.setCollideWorldBounds(true)
    body.setBounce(0.2)
    if (hasValue(gravityScale)) body.setGravityY(gravityScale)
}

const useShapeFactory = ({ ctx }) => ({
    createRoundedRectangle: ({ x, y, bgcolor, width, height, radius = 0 }) => {
        const shape = ctx.add.graphics()
        shape.fillStyle(bgcolor, 1)
        shape.fillRoundedRect(0, 0, width, height, radius)
        shape.setPosition(x, y)
        return shape
    }
})
