import { useGame } from "./scenes/Game";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { GameOver } from "./scenes/GameOver";
import { useJumpBall } from "./logic/jump-ball";
import { GAMES } from "./game-data";

export const config = {
    type       : Phaser.AUTO,
    width      : 480,
    height     : 768,
    parent     : 'game-container',
    transparent: true,
    gravity: 30,
    scale: {
        mode      : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

config.scene = [
    Boot,
    Preloader,
    useGame(GAMES["jump-ball"]?.(config)),
    GameOver
]