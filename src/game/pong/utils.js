import { hasValue } from "../../utils/utils"

export const initPointer = ({scene, state}) => scene.input.on('pointermove', pointer => state.pointer = pointer)

export const createAndInitSceneGameObjects = ({scene, state, objects, factory }) => {

    const gameObjects = objects.reduce((nMapping, item) => {
        const node = factory?.[item.type]?.(scene, item)
        if(node === null) return nMapping
        
        if(!hasValue(nMapping[item.type])) nMapping[item.type] = []

        nMapping[item.type].push(node)

        return nMapping
    }, {})

    state.gameObjects   = gameObjects
}

export const initControls = ({ state, controls, scene }) => {
    const { input : { keyboard }} = scene
    const actionKeys = Object
            .entries(controls?.actions)
            .reduce((acc, [key, value]) => {
                acc[key] = keyboard.addKey(value)
                return acc
            }, {})

    state.controls = {
        cursors: keyboard.createCursorKeys(),
        actions: actionKeys
    }

    setupPauseControl({ scene, controls })
}

export const listerControls = ({ controls: { actions }, notify, pointer }) => {
    const log = (msg, isTrue) => {
        // if(!!isTrue) console.log(msg)
        return isTrue
    }

    const activatedActions = Object.entries(actions)
        .filter(([key, val]) => val?.isDown)
        .map(([k, v]) => k)
    
    const action = getFirst(activatedActions)
    
    if(action) notify({ action })
    else if(
        pointer && 
        pointer._last_position_x != pointer.x){
        pointer._last_position_x = pointer.x
        notify({ pointer })
    } else 
        notify({})
}

function setupPauseControl({scene, controls }) {
    console.dir(controls.actions)
    if(!controls.actions?.pause) return

    const { input, game } = scene
    const { pause } = controls.actions
    const togglePause = () => {
        game.isPaused
            ? game.resume()
            : game.pause()
    }

    let pauseKeyDown = false
    input.keyboard.on('keydown', keyEvent => {
        if(keyEvent.keyCode === pause && !pauseKeyDown) {
            pauseKeyDown = true
            togglePause()
        }        
    })

    input.keyboard.on('keyup', keyEvent => {
        if(keyEvent.keyCode === pause) pauseKeyDown = false
    })
}

export const getFirst = arr => arr?.length > 0 ? arr[0] : undefined

export const create = ({ 
        state, 
        config, 
        data: { objects, controls }, 
        scene,
        factory = {},
        initCollisions = () => {}
    }) => {
        console.log('on create')
        const { physics } = scene
        createAndInitSceneGameObjects({ scene, state, objects, factory })
        initCollisions({ physics, gameObjects: state.gameObjects, config })
        initControls({ scene, state, controls })
        initPointer({ scene, state })

    }

