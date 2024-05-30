import { Game } from "./scenes/Game";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { GameOver } from "./scenes/GameOver";

export const config = {
    type       : Phaser.AUTO,
    width      : 480,
    height     : 768,
    parent     : 'game-container',
    transparent: true,
    physics: {
        default: 'box2d',
        box2d: {
            gravity: { y: 9.8 },
            debug: true
        }
    },
    scale: {
        mode      : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        Game,
        GameOver
    ]
};