import { PhaserUtils, PlanckUtils, getMiddlePosition } from '../utils/utils'
import { useBodyFactory } from '../factory/factory'
import * as planck from 'planck-js'

export function useJumpBall({ config, data: _data }) {
    let event = null
    const subscriptions = {} 
    const notify = (event, data) => subscriptions[event]?.forEach(c => c(data))
    return {
        init: () => {
            return {
                subscribe: (event, callback) => subscriptions[event] ? subscriptions[event].push(callback) : subscriptions[event] = [ callback ],
                create: (ctx) => {

                    const { startGameLoop }      = PhaserUtils
                    const { updateBodyPosition } = PlanckUtils
                    const data                   = { ..._data }
                    const world                  = planck.World({ gravity: planck.Vec2(0, config.gravity) })
                    const { createBox }          = useBodyFactory({ world, ctx })
        
                    setPlayerDataStartPosition({ data, config })
        
                    const player = createBox({ 
                        type: 'dynamic', 
                        ...data.player
                    })
        
                    const lineProps = {
                        width: config.width / 4,
                        height: 5,
                        bgcolor: 0x116A7B,
                        type: 'static'
                    }
        
                    const ceiling = createBox({
                        ...lineProps,
                        x: config.width / 2 - lineProps.width / 2,
                        y: 10,
                    })
        
                    const ground = createBox({
                        ...lineProps,
                        x: config.width / 2 - lineProps.width / 2,
                        y: config.height - lineProps.height * 2,
                    })
        
                    ctx.input.on('pointerdown', () => jump(player, -17))
        
                    const collissionMapping = [
                        {
                            a   : player,
                            b   : ceiling,
                            then: () => notify('restart')
                        }
                    ]
        
                    world.on('begin-contact', (contact) => {
                        const fixtureA = contact.getFixtureA()
                        const fixtureB = contact.getFixtureB()
        
                        const bodyA = fixtureA.getBody()
                        const bodyB = fixtureB.getBody()
        
                        const bodies = [bodyA, bodyB]
        
                        collissionMapping.forEach(cm => {
                            if(bodies.includes(cm.a) && bodies.includes(cm.b))
                                cm.then()
                        })
                    })
        
                    event = startGameLoop({ctx, world, fps: 60, callback: () => {
                        updateBodyPosition(player)
                    }})
                },
                unload: () => event.stop()
            }
        },
       
    }
}

const setPlayerDataStartPosition = ({ config, data }) => {
    const { player } = data
    player.x = getMiddlePosition(config.width, player.width)
    player.y = config.height - (player.height * 4)
    return data
}

const jump = (body, velocityY) => {
    const v = body.getLinearVelocity()
    body.setLinearVelocity(planck.Vec2(v.x, velocityY))
}
