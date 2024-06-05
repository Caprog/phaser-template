import { useJumpBall } from "./logic/jump-ball"
import { config } from './config';
import { position } from "./utils/utils";

const useJumpBallData = (config) => {
    const { center } = position
    
    const colors = {
        primary: 0x116A7B
    }

    const square = {
        type   : 'square',
        bgcolor: colors.primary,
        physics: 'static',
        width  : config.width / 4,
        height : 2
    }
    
    const playerSize = {
        width: 32,
        height: 32,
    }

    const player =  { 
        ...square,
        ...playerSize,
        physics : 'dynamic',
        name    : 'player',
        radius  : 4,
        bgcolor : colors.primary,
        x       : center(config.width, playerSize.width),
        y       : config.height - playerSize.height * 4,
        tags    : [ 'action-jump-when-click' ]
    }

    const data = {
        config, 
        data : {
            level : 1,
            levels: [
                {
                    nodes: [
                        { 
                            ...square, 
                            name:"ceiling",
                            x: center(config.width, square.width),
                            y: 10
                        },
                        { 
                            ...square, 
                            name:"ground",
                            x: center(config.width, square.width),
                            y: config.height - square.height * 2
                        },
                        { 
                            type: 'counter',
                            name:"score",
                            x: center(config.width, 1),
                            y: center(config.height, 1)
                        },
                        player,
                    ],
                    collisions: [
                        {
                            bodyA   : { name: 'player' },
                            bodyB   : { name: 'ceiling' },
                            actions : [ 
                                { name: 'alert'  , text: 'collision' }, 
                                { name: 'counter', data: {
                                    name  : 'counter',
                                    action: 'increment'
                                }},
                            ]
                        }
                    ],
                }
            ],
            player: {
                x: 0,
                y: 0,
                bgcolor: 0x116A7B,
                width: 32,
                height: 32,
                radius: 4
            }
        }
    }
    
    return data
}

export const GAMES = {
    'jump-ball' : () => useJumpBall(useJumpBallData(config)),
};

