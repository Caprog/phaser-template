function buildPaddle(scene, object) {
    const paddle = scene.add.rectangle(object.x, object.y, object.width, object.height, object.fill)
    scene.physics.add.existing(paddle)
    paddle.body.pushable = false
    paddle.body.setCollideWorldBounds(true, 0, 0)
    paddle.body.onWorldBounds = true
    return paddle
}

function buildBall(scene, object) {
    const ball = scene.add.rectangle(object.x, object.y, object.size, object.size, object.fill)
    scene.physics.add.existing(ball)
    ball.body.setCollideWorldBounds(true, 1, 1)
    ball.body.setBounce(1, 1)
    ball.body.setVelocity(object.velocityX, object.velocityY)
    return ball
}

function hexToCSS(hex) {
    const hexString = hex.toString(16).padStart(6, '0')
    return `#${hexString}`
}

function buildText(scene, object) {
    const text = scene.add.text(object.x, object.y, object.text,
        {
            font: object.font,
            fill: hexToCSS(object.font?.fill ?? 0xFFFFFF),
        }
    )
    text.setOrigin(0.5, 0.5)
    return text
}

function buildBlock(scene, object) {
    const block = scene.add.rectangle(object.x, object.y, object.width, object.height, object.fill)
    scene.physics.add.existing(block)
    block.body.pushable = false
    block.body.setCollideWorldBounds(true, 0, 0)
    return block
}



function buildCounter(scene, object) {
    const counter = buildText(scene, object)
    counter.$update = {
        set value(newVal){
            console.log(newVal);
            this.$_value = newVal
            counter.setText(this.$_value)
        },
        get value(){
            return this.$_value
        }
    }
    counter.$update.value = object.value ?? 0
    return counter;
}

const aggData = (factory) => (scene, object) => ({
    ...factory(scene, object),
    $item: object,
})

export const factory = {
    paddle : aggData(buildPaddle),
    ball   : aggData(buildBall),
    counter: aggData(buildCounter),
    block  : aggData(buildBlock)
}