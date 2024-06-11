export const useAnimation = ({ state = {}, config }) => ({
    create: scene => {
        
        const { add , anims, input, scene: sceneManager }  = scene
        const { keyboard } = input

        const [ repeat, frameRate ] = [ -1, 4 ]

        anims.create({
            key: 'idle',
            frames: anims.generateFrameNumbers('bunny', { 
                start: 0, 
                end: 1,
            }),
            frameRate,
            repeat // auto replay
        })


        anims.create({
            key: 'move-down',
            frames: anims.generateFrameNumbers('bunny', { 
                start: 2, 
                end: 3,
            }),
            frameRate,
            repeat // auto replay
        })

        anims.create({
            key: 'move-right',
            frames: anims.generateFrameNumbers('bunny', { 
                start: 14, 
                end: 15,
            }),
            frameRate,
            repeat // auto replay
        })

        anims.create({
            key: 'move-left',
            frames: anims.generateFrameNumbers('bunny', { 
                start: 10, 
                end: 11,
                
            }),
            frameRate,
            repeat // auto replay
        })

        anims.create({
            key: 'move-up',
            frames: anims.generateFrameNumbers('bunny', { 
                start: 6, 
                end: 7,
            }),
            frameRate,
            repeat // auto replay
        })
        
        const [
            centerX,
            centerY,
            margin,
        ] = [
            config.width / 2, 
            config.height / 2,
            100
        ]

        add.text(centerX, margin, 'Sprite Animation', { font: '32px Arial', fill: '#000000' })
            .setOrigin(0.5, 0.5) // center the text horizontally and vertically

        state.player = add.sprite(centerX, centerY, 'bunny')
                .setScale(6)
                .anims.play('idle')

        state.player.texture.setFilter(Phaser.ScaleModes.NEAREST)

        state.controls = {
            left : keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up   : keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down : keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        }

        input.on('pointerdown', _ => sceneManager.start('Move'), scene);
    },
    
    update: scene => {
        const { controls, player } = state

        const isNotCurrentAnim = (player, animName) => player.anims?.currentAnim?.key !== animName
        
        if(controls.down.isDown  && isNotCurrentAnim(player, 'move-down'))  player.anims.play('move-down')
        if(controls.up.isDown    && isNotCurrentAnim(player, 'move-up'))    player.anims.play('move-up')
        if(controls.left.isDown  && isNotCurrentAnim(player, 'move-left'))  player.anims.play('move-left')
        if(controls.right.isDown && isNotCurrentAnim(player, 'move-right')) player.anims.play('move-right')
        
        if(
            !controls.right.isDown && 
                !controls.left.isDown && 
                    !controls.up.isDown &&
                        !controls.down.isDown &&
                            isNotCurrentAnim(player, 'idle')
        ) player.anims.play('idle')
    }
})
