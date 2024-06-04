export const pipe = (...funcs) => (data) => {
    return funcs.reduce((acc, func) => func(acc), data);
};

export const getMiddlePosition = (a, b) => (a / 2) - (b / 2)

export const PlanckUtils = {
    updateBodyPosition: (body) => {
        const userData = body.getUserData()
        const position = body.getPosition()
        const x = position.x * 30 - userData.width / 2
        const y = position.y * 30 - userData.height / 2
        if (userData.graphics) userData.graphics.setPosition(x, y)
    }
}


export const PhaserUtils = {
    startGameLoop : ({ ctx,  world, fps, callback }) => {
        const event = ctx.time.addEvent({
            delay: 1000 / 60,
            callback: () => {
                world?.step(1 / 60)
                callback(fps)
            },
            loop: true
        })
        
        return {
            stop: () => ctx.time.removeEvent(event)
        }
    }
}


export const useSubscriber = () => {
    const subscriptions = {} 
    const subscribe = (event, callback) => subscriptions[event] ? subscriptions[event].push(callback) : subscriptions[event] = [ callback ]
    const notify = (event, data) => subscriptions[event]?.forEach(c => c(data))
    return {
        subscribe(e, c){
            subscribe(e, c)
            return this
        },
        notify(e, d){
            notify(e, d)
            return this
        }
    }
}