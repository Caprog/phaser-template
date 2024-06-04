import { useJumpBall } from "./logic/jump-ball"
import { config } from './config';

export const GAMES = {
    'jump-ball' : () => 
        useJumpBall({
            config, 
            data : {
                level: 1,
                levels: [
                    {
                        objects: [
                            { type: 'red-block', x: 0, y: 150, width: 200, height: 50, action: 'slide-right' }
                        ]
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
        }),
};