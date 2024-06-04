import * as planck from 'planck-js'

const PlanckWrapper = {
    Vec2: (x, y) => planck.Vec2(pxToMts(x), pxToMts(y)),
    Box: (w, h) => planck.Box(pxToMts(w) / 2, pxToMts(h) / 2)
}

const pxToMts = (x) => x / 30

export const useBodyFactory = ({ world, ctx }) => ({
    createBox: ({ x, y, width, height, bgcolor, type, radius }) => {
        const { createRoundedRectangle } = useShapeFactory({ ctx })
        const body = world.createBody({
            type,
            position: PlanckWrapper.Vec2(x + width / 2, y + height / 2) // Ajuste de posición
        })

        const shape = PlanckWrapper.Box(width, height)
        body.createFixture(shape, {
            restitution: 0.2,
            friction: 0.5,
            density: 2
        })

        const graphics = createRoundedRectangle({ x, y, width, height, bgcolor, radius })

        body.setUserData({
            graphics: graphics,
            bgcolor,
            width,
            height,
        })

        return body
    }
})

const useShapeFactory = ({ ctx }) => ({
    createRoundedRectangle: ({ x, y, bgcolor, width, height, radius = 0 }) => {
        const shape = ctx.add.graphics()
        shape.fillStyle(bgcolor, 1)
        shape.fillRoundedRect(0, 0, width, height, radius)
        shape.setPosition(x, y)
        return shape
    }
})
