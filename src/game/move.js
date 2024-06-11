export const useMove = ({ state = {}, config }) => ({
    create: scene => {
        
        const { 
            add, 
            physics, // MEMO: 
            input : { keyboard }
        }  = scene

        const [
            centerX,
            centerY,
            margin,
        ] = [
            config.width / 2, 
            config.height / 2,
            100
        ]

        add.text(centerX, margin, 'Move Sprite', { font: '32px Arial', fill: '#000000' })
            .setOrigin(0.5, 0.5) // center the text horizontally and vertically

        state.player = {
            state  : 'idle',
            speed  : 200,
            sprite : physics.add.sprite(centerX, centerY, 'bunny')
                .setScale(6)
                .anims.play('idle'),                
        }

        state.player.sprite.texture.setFilter(Phaser.ScaleModes.NEAREST)

        state.controls = {
            left : keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up   : keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down : keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        }
    },
    
    update: scene => {
        [
            {
                when: ({ controls }) => controls.down.isDown,
                then: ({ state }) => setPlayerState(state.player, 'move-down')
            },
            {
                when: ({ controls }) => controls.right.isDown,
                then: ({ state }) => setPlayerState(state.player, 'move-right')
            },
            {
                when: ({ controls }) => controls.left.isDown,
                then: ({ state }) => setPlayerState(state.player, 'move-left')
            },
            {
                when: ({ controls }) => controls.up.isDown,
                then: ({ state }) => setPlayerState(state.player, 'move-up')
            },
            {
                when: () => true,
                then: ({ state }) => setPlayerState(state.player, 'idle')
            },
        ].find(p => p.when(state))?.then({ state })
    }
})


const setPlayerState = (player, state) => {
    if(player.state === state) return

    player.state = state
    
    const { 
        sprite,
        speed 
    } = player

    sprite.anims.play(state)
    
    const velocityX = {
        'move-left' : -speed,
        'move-right': speed,
    }?.[state] ?? 0

    const velocityY = {
        'move-up'  : -speed,
        'move-down': speed,
    }?.[state] ?? 0

    sprite.setVelocity(velocityX, velocityY)
}