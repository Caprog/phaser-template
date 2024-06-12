export const useInput = ({ state = {}, config }) => ({
    create: scene => {
        
        const { 
            add, 
            input,
            input: { keyboard },
            scene: sceneManager
        } = scene

        const [
            centerX,
            centerY,
            margin,
        ] = [
            config.width / 2, 
            config.height / 2,
            100
        ]

        const [
            mouseText,
            clickText,
            keyText,
            changeSceneTextBackground,
            changeSceneText,
        ] = [
            add.text(10, 10, '', { font: '16px Arial', fill: '#000000' }),
            add.text(centerX, centerY + margin, '', { font: '32px Arial', fill: '#000000' }).setOrigin(0.5, 0.5),
            add.text(centerX, centerY, '', { font: '32px Arial', fill: '#000000' }).setOrigin(0.5, 0.5),
            add.rectangle(centerX, config.height - margin, 300, 50, 0x00FF00),
            add.text(centerX, config.height - margin, 'Load Next Scene', { font: '32px Arial', fill: '#000000' }).setOrigin(0.5, 0.5),
        ]
        
        const clickableRect = add.rectangle(centerX, centerY + 2 * margin, 100, 50, 0x00FF00)
                .setInteractive()
                .on('pointerdown', () => {
                    alert('Rectangle clicked!')
                })
        
        changeSceneTextBackground.setInteractive()
            .on('pointerdown', () => {
                sceneManager.start('Shapes')
            })

        input.on('pointermove', pointer => {
            mouseText.setText(`X: ${pointer.x}, Y: ${pointer.y}`)
        })
        
        input.on('pointerdown', pointer => {
            if (pointer.leftButtonDown())  clickText.setText('Left Click')
            if (pointer.rightButtonDown()) clickText.setText('Right Click')
        })

        input.on('pointerup', _ => clickText.setText(''))

        keyboard.on('keydown', event => {
            if (event.key === 'Backspace') keyText.setText(keyText.text.slice(0, -1))
            if (event.key.length === 1)    keyText.setText(keyText.text + event.key)
        })
    }
})
