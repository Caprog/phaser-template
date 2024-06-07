
import { SCENE_CONFIG } from "./sceneConfig"
import { factory } from "./factory"
import { listerControls, create, getFirst } from "./utils"

const initCollisions = ({ physics: { add }, gameObjects, config }) => {
    const ball    = getFirst(gameObjects?.ball)
    const score   = getFirst(gameObjects?.counter)
    
    const paddles = gameObjects?.paddle ?? []
    paddles.forEach(paddle => add.collider(ball, paddle, () => {
        score.$update.value++
    }))

    const goals = gameObjects?.block ?? []
    goals.forEach(goal => add.collider(ball, goal, () => {
        score.$update.value = 0
    }))
}

function update({ scene : { game }, state: { gameObjects, controls, pointer }, config }) {
    listerControls({ 
        controls, 
        notify: ({ pointer, action }) => {
            
            gameObjects.paddle?.forEach(p => {
                const speed = p?.$item?.speed ?? 0
                
                if(pointer)  {
                    const x = pointer.x - p.width / 2
                    const min = 0
                    const max = config.width - p.width
                    p.body.x = Phaser.Math.Clamp(x, min, max)
                }

                if(action) {
                    if(['moveLeft', 'moveRight'].includes(action)) {
                        const x = 'moveLeft' === action ? -1 : 1
                        p.body.setVelocity(x * speed, 0)
                    }
                }

                if(!action && ! pointer) p.body.setVelocity(0, 0)
            })
    }, pointer })
}

export const usePong = ({ state = {}, config }) => ({
    create: scene => create({ state, config, data: SCENE_CONFIG, scene, initCollisions, factory }),
    update: scene => update({ state, config, data: SCENE_CONFIG, scene })
})
