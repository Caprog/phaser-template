import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { useGenericScene } from "./scenes/GenericScene";
import { useText } from "./game/text";
import { useShapes } from "./game/shapes";
import { usePreloader } from "./game/preloader";
import { useMove } from "./game/move";
import { useInput } from "./game/input";
import { useSpriteAnimation } from "./game/sprite-animation";
import { usePhysicsCollisions } from "./game/physics-collisions";

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
        sceneName: 'SpriteAnimation',
        game: useSpriteAnimation({ config })
    }),
    useGenericScene({
        sceneName: 'Move',
        game: useMove({ config })
    }),
    useGenericScene({
        sceneName: 'PhysicsCollisions',
        game: usePhysicsCollisions({ config })
    }),
    GameOver
]