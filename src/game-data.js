import { useJumpBall } from "./logic/jump-ball"
import { config } from './config';

export const GAMES = {
    'jump-ball' : () => 
        useJumpBall({
            config, 
            data : {
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