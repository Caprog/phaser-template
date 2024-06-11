import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { useGenericScene } from "./scenes/GenericScene";
import { useAnimation } from "./game/animation";
import { useText } from "./game/text";
import { useShapes } from "./game/shapes";
import { usePreloader } from "./game/preloader";
import { useMove } from "./game/move";
import { useInput } from "./game/input";

export const config = {
    type       : Phaser.AUTO,
    width      : 480,
    height     : 768,
    pixelArt   : false,
    parent     : 'game-container',
    transparent: true,
    gravity    : 30,
    debug: true,
    scale: {
        mode      : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
}

config.scene = [
    Boot,
    useGenericScene({
        sceneName: 'Preloader',
        game: usePreloader({ config })
    }),
    useGenericScene({
        sceneName: 'Text',
        game: useText({ config })
    }),
    useGenericScene({
        sceneName: 'Input',
        game: useInput({ config })
    }),
    useGenericScene({
        sceneName: 'Shapes',
        game: useShapes({ config })
    }),
    useGenericScene({
        sceneName: 'Animation',
        game: useAnimation({ config })
    }),
    useGenericScene({
        sceneName: 'Move',
        game: useMove({ config })
    }),
    GameOver
]