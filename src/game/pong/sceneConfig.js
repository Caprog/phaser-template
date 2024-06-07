const colors = {
    primary: 0x116A7B,
    alert  : 0xBC5A94,
    white  : 0xFFFFFF,
}

const speed        = 350
const screen = {
    width : 480,
    height: 768
}
const centerWidth  = screen.width  / 2
const centerHeight = screen.height / 2
const margin       = screen.height * 0.10
const controls = {
    actions: {
        moveLeft : Phaser.Input.Keyboard.KeyCodes.LEFT,
        moveRight: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        pause    : Phaser.Input.Keyboard.KeyCodes.P
    },
    mouse: true
}

const objects = [
    {
        type   : 'paddle',
        x      : centerWidth,
        y      : margin,
        width  : 200,
        height : 5,
        fill   : colors.primary,
        speed   
    },
    {
        type   : 'paddle',
        x      : centerWidth,
        y      : screen.height - margin - 5,
        width  : 200,
        height : 5,
        fill   : colors.primary,
        speed
    },
    {
        type      : 'ball',
        x         : 200,
        y         : 200,
        velocity  : speed,
        velocityX : speed,
        velocityY : speed,
        size      : 20,
        fill      : colors.alert,
    },
    { 
        type : 'counter',
        name : 'score',
        value: 0,
        font : { fontSize: '52px', fontFamily: 'sans-serif', fill: colors.primary },
        x    : centerWidth,
        y    : centerHeight
    },
    { 
        type  : 'block',
        name  : 'top-goal',
        x     : 0,
        y     : 0,
        width : screen.width,
        height: 10,
        fill  : colors.alert,
    },
    { 
        type  : 'block',
        name  : 'bottom-goal',
        x     : 0,
        y     : screen.height,
        width : screen.width,
        height: 10,
        fill  : colors.alert,
    },
]

export const SCENE_CONFIG = {
    controls,
    objects
}