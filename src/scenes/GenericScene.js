import { Scene } from "phaser";

export const useGenericScene = ({ sceneName, game }) => {
    return class Game extends Scene {
        constructor() {
            super(sceneName);
        }
        
        init() {
            game?.init?.(this)
        }

        preload() {
            game?.preload?.(this)
        }

        create() {
            game?.create?.(this)
        }

        update() {
            game?.update?.(this)
        }
    }
}