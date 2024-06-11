export const useText = ({ state = {}, config }) => ({
    
    create: scene => {
        
        const { 
            add,                // MEMO: --< GOF >-- => https://newdocs.phaser.io/docs/3.60.0/Phaser.GameObjects.GameObjectFactory
            input,              // MEMO: => https://newdocs.phaser.io/docs/3.60.0/Phaser.Input.InputPlugin
            scene: sceneManager // MEMO: => https://newdocs.phaser.io/docs/3.60.0/Phaser.Scenes.ScenePlugin
        }  = scene              // MEMO: => https://newdocs.phaser.io/docs/3.60.0/Phaser.Scene
        
        const [ 
            x, 
            y,
            margin,
        ] = [
            config.width  / 2, 
            config.height / 2,
            100
        ]

        add.text(x, y, 'Click to go to the next Scene!', { font: '32px Arial', fill: '#000000' })
            .setOrigin(0.5, 0.5) // center the text horizontally and vertically

        add.text(x, margin, 'Textes', { font: '32px Arial', fill: '#000000' })
            .setOrigin(0.5, 0.5) // center the text horizontally and vertically

        // MEMO: https://newdocs.phaser.io/docs/3.60.0/events
        input.on('pointerdown', _ => sceneManager.start('Input'), scene);
    }
})
