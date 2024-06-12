export const usePhysicsCollisions = ({ state = {}, config }) => ({
    create: scene => {
        
        const { add, physics, input, scene: sceneManager }  = scene

        const [
            centerX,
            centerY,
            margin,
        ] = [
            config.width / 2, 
            config.height / 2,
            100
        ]

        add.text(centerX, margin, 'Collisions and Physics', { font: '32px Arial', fill: '#000000' })
            .setOrigin(0.5, 0.5) // center the text horizontally and vertically

        physics.world.gravity.y = 300
        
        const floor = createBox({ physics, add, x: centerX, y: config.height - margin, h: 10, w: config.width, size: 50, pushable: false, gravity: false })

        const boxes = physics.add.group();
        
        physics.add.collider(boxes, floor)

        physics.add.collider(boxes, boxes)

        input.on('pointerdown', pointer => {
            if (pointer.leftButtonDown())  {
                createBox({ physics, add, x: pointer.x, y: pointer.y, w: 50, h: 50, group: boxes })
            }
        })

        // input.on('pointerdown', _ => sceneManager.start('Move'), scene);
    },
})


const createBox = ({ physics, add, x, y, w, h, pushable = true, gravity = true, group }) => {
    const box = add.rectangle(x, y, w, h, 0x00ff00);
    
    if(group) group.add(box)

    physics.add.existing(box)
    box.body.setCollideWorldBounds(true, 1, 1)
    box.body.setBounce(0.2, 0.2)
    box.body.pushable = pushable
    box.body.setFriction(2,2)
    box.body.preRotation = 20
    box.body.onWorldBounds = true
    box.body.setAllowGravity(gravity)
    
    return box
}
