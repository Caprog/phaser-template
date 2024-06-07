import { Scene } from "phaser";

export function useGenericScene({ sceneName, game }) {
    return class Game extends Scene {
        constructor() {
            super(sceneName);
        }

        create() {
            game.create(this)
        }

        update() {
            game.update(this)
        }
    }
}