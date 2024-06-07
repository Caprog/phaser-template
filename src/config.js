import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { GameOver } from "./scenes/GameOver";
import { usePong } from "./game/pong/pong";
import { useGenericScene } from "./scenes/GenericScene";

export const config = {
    type       : Phaser.AUTO,
    width      : 480,
    height     : 768,
    parent     : 'game-container',
    transparent: true,
    gravity    : 30,
    scale: {
        mode      : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
}

config.scene = [
    Boot,
    Preloader,
    useGenericScene({
        sceneName: 'Game',
        game: usePong({ config })
    }),
    GameOver
]