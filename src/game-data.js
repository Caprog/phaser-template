import { position } from "./utils/utils";

const useJumpBallData = (config) => {
    const { center } = position
    const quart_size = config.width / 4
    
    const playerSize = {
        width: 32,
        height: 32,
    }

    const playerStartPosition = {
        x : center(config.width, playerSize.width),
        y : config.height - playerSize.height * 4,
    }
    
    const colors = {
        primary: 0x116A7B,
        alert  : 0xBC5A94
    }

    const square = {
        type   : 'square',
        physics: 'static',
        bgcolor: colors.primary,
        width  : quart_size,
        height : 2
    }
    
    const player =  { 
        ...square,
        ...playerSize,
        ...playerStartPosition,
        physics : 'dynamic',
        name    : 'player',
        radius  : 4,
        bgcolor : colors.primary,
        events : [ 
            { 
                listen       : 'screen-click', 
                performAction: { name: 'jump' }
            } 
        ]
    }

    const data = {
        config, 
        data : {
            nodes: [
                { 
                    ...square, 
                    name:"ceiling",
                    x   : center(config.width, square.width),
                    y   : 10
                },
                { 
                    ...square, 
                    name:"ground",
                    x   : center(config.width, square.width),
                    y   : config.height - square.height * 2,
                },
                { 
                    ...square, 
                    name        : 'slider',
                    physics     : 'dynamic',
                    cancelContact   : true,
                    disableVelocityY: true,
                    bgcolor     : colors.alert,
                    gravityScale: 0,
                    x           : center(config.width, square.width),
                    y           : center(config.height, square.height),
                    events      : [ 
                        { 
                            listen       : 'init', 
                            performAction: { name: 'moveX' }
                        },
                        { 
                            listen       : 'out-of-screen-right', 
                            performAction: { name: 'reposition-out-of-screen-left' }
                        }
                    ]
                },
                { 
                    ...square, 
                    name            : 'slider',
                    physics         : 'dynamic',
                    disableVelocityY: true,
                    bgcolor         : colors.alert,
                    gravityScale    : 0,
                    x               : -square.height,
                    y               : center(config.height / 2, square.height),
                    events          : [ 
                        { 
                            listen       : 'init', 
                            performAction: { name: 'moveX' }
                        },
                        { 
                            listen       : 'out-of-screen-right', 
                            performAction: { name: 'reposition-out-of-screen-left' }
                        }
                    ]
                },
                { 
                    type: 'counter',
                    name: 'score',
                    font: { fontSize: '42px', fill: '#5C2FC2' },
                    x   : center(config.width, 1),
                    y   : center(config.height, 1)
                },
                player,
            ],
            collisions: [
                {
                    bodyA  : { name: 'player'  },
                    bodyB  : { name: 'ceiling' },
                    actions: [
                        { 
                            name: 'action' ,
                            node: {
                                name: 'score',
                                action: 'increment'
                            } 
                        }
                    ]
                },
                {
                    bodyA  : { name: 'player'  },
                    bodyB  : { name: 'slider' },
                    actions: [
                        { 
                            name: 'action' ,
                            node: {
                                name: 'score',
                                action: 'clear'
                            } 
                        },
                        { 
                            name: 'setPosition' ,
                            node: {
                                name    : 'player',
                                position: {
                                    ...playerStartPosition
                                }
                            } 
                        },
                    ]
                }
            ]
        }
    }
    
    return data
}

export const GAMES = {
    'jump-ball' : useJumpBallData,
};

