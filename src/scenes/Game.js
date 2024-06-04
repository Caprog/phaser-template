import { Scene } from "phaser"

export function useGame(game) {
    return class Game extends Scene {
        constructor() {
            super('Game')
        }

        create() {
            const load = () => {
                const instance = game?.init(this)
                instance?.subscribe('restart', () => {
                    instance.unload()
                    this.scene.restart();
                })
                instance?.create(this)
            }
            load()
        }
    }
}

