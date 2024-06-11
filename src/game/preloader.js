export const usePreloader = ({ config }) => ({
    init (scene) {
        
        const { 
            load, 
            add 
        } = scene

        const [
            x,
            y,
            width,
            height,
            halfWidth,
        ] = [
            config.width  / 2,
            config.height / 2,
            200,
            32,
            100
        ]

        // The border of the progress bar
        add.rectangle(x, y, width, height).setStrokeStyle(1, 0x000000)

        const padding   = 2
        const barWidth  = width - padding * 2
        const barHeight = height - padding * 2
        const bar = add.rectangle(x - halfWidth + padding, y, 0, barHeight, 0x000000)

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        load.on('progress', (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = barWidth * progress
        })
    },

    preload (scene)
    {
        const { load } = scene
        //  Load the assets for the game - Replace with your own assets
        load.setPath('assets')
        
        load.spritesheet(
            'bunny', 
            'sprites/bunny.png', 
            {
                frameWidth  : 16,
                frameHeight : 16,
                margin      : 16,
                spacing     : 32,
                antialias   : false
            }
        )
    },

    create (scene)
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        scene.scene.start('Text');
    }
})
