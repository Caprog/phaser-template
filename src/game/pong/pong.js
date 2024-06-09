
import { SCENE_CONFIG } from "./sceneConfig"
import { factory } from "./factory"
import { listerControls, create, getFirst, findByName } from "./utils"

const initCollisions = ({ physics: { add }, gameObjects, config, eventManager: { notify } }) => {
    const ball    = getFirst(gameObjects?.ball)
    
    const paddles = gameObjects?.paddle ?? []
    paddles.forEach(paddle => add.collider(ball, paddle, () => {
        notify('paddle_collision_ball', { paddle, ball })
    }))

    const goals = gameObjects?.block ?? []
    goals.forEach(goal => add.collider(ball, goal, () => {
        notify('ball_collision_goal', { goal, ball })
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


function useEventManager({  scene, data, state: { gameObjects } } ){

    return {
        notify(event, data){
            const events = {
                paddle_collision_ball: _ => {
                    const score   = getFirst(gameObjects?.counter)
                    score.$update.value++
                },

                ball_collision_goal: _ => {
                    const score    = getFirst(gameObjects?.counter)
                    const scoreVal = score.$update.value
                    const bestScore   = findByName(gameObjects?.text, 'bestScore')
                    const normalizeBestScore = bestScore.$update.value === '' ? '0' : bestScore.$update.value
                    if(scoreVal > parseInt(normalizeBestScore)) bestScore.$update.value = scoreVal
                    score.$update.value = 0
                }
            }

            events[event]?.(data)
        }
    }
}

export const usePong = ({ state = {}, config }) => ({
    create: scene => create({ state, config, data: SCENE_CONFIG, scene, initCollisions, useEventManager, factory }),
    update: scene => update({ state, config, data: SCENE_CONFIG, scene })
})
