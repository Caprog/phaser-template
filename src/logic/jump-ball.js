import { PhaserUtils, PlanckUtils, getMiddlePosition, useSubscriber } from '../utils/utils'
import { useBodyFactory } from '../factory/factory'
import * as planck from 'planck-js'

export function useJumpBall({ config, data: _data,  }) {
    let event = null
    const subscriber = useSubscriber()
    const { subscribe, notify } = subscriber

    return {
        init: () => {
            return {
                subscribe: (e, d) => subscribe(e, d),
                create: (ctx) => {
                    const { startGameLoop }      = PhaserUtils
                    const { updateBodyPosition } = PlanckUtils
                    const data                   = { ..._data }
                    const level                  = data.levels[data.level - 1] ?? {}
                    const { nodes, collisions }  = level
                    const world                  = planck.World({ gravity: planck.Vec2(0, config.gravity) })
                    const { createSquare }       = useBodyFactory({ world, ctx })

                    const factory = {
                        'square': pipe(
                            normalizePhysics,
                            createSquare
                        ),
                        'counter': createText(ctx)
                    }

                    const objects = nodes.map(node => ({
                        node, 
                        item: factory[node.type]?.(node)
                    }))

                    const physics = objects.filter(obj => obj?.node.physics)
                    const find = (arr, predicate) => arr?.find(d => predicate(d))
                    const findOneByName = (name) => (data) => data?.name === name

                    const actions = {
                        jump   : ({ node, physics })  => ctx.input.on('pointerdown', () => jump(physics, -17)),
                        alert  : ({ text }) => alert(text),
                        counter: ({ data, _objects }) => find(_objects, findOneByName(data?.name))
                    }

                    const actionMapping = {
                        'action-jump-when-click': actions.jump
                    }

                    physics.forEach(({ node, item }) => (node.tags ?? []).forEach(t => actionMapping[t]?.({ node, physics: item })))
                    
                    const collisionMapping = collisions.map(c => ({
                        bodyA: findOnePhysics(c.bodyA, objects),
                        bodyB: findOnePhysics(c.bodyB, objects),
                        then : () => c.actions?.forEach(a => actions[a.name]?.({ ...a, objects }))
                    }))

                    world.on('begin-contact', (contact) => {
                        const fixtureA = contact.getFixtureA()
                        const fixtureB = contact.getFixtureB()
        
                        const bodyA = fixtureA.getBody()
                        const bodyB = fixtureB.getBody()
        
                        const bodies = [bodyA, bodyB]
        
                        collisionMapping.forEach(cm => {
                            if(bodies.includes(cm.bodyA) && bodies.includes(cm.bodyB))
                                cm.then()
                        })
                    })
                    debugger
                    event = startGameLoop({ctx, world, fps: 60, callback: () => {
                        physics.forEach(({node, physics}) => updateBodyPosition(physics))
                    }})
                },
                unload: () => event.stop()
            }
        },
       
    }
}

const createText = (ctx) => ({ x, y, text, font }) => ctx.add.text(x, y, text, font);

const findOnePhysics = (collisionConfig, objects) => objects.find(({node, physics}) => node.name === collisionConfig.name)?.physics


const jump = (body, velocityY) => {
    const v = body.getLinearVelocity()
    body.setLinearVelocity(planck.Vec2(v.x, velocityY))
}

const normalizePhysics = (obj) => ({...obj, type: obj?.physics })
const pipe = (...func) => (data) => func.reduce((d, f) => f(d), data)