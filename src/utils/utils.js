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