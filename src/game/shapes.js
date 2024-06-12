export const useShapes = ({ state = {}, config }) => ({
    create: scene => {
        
        const { 
            add, 
            input, 
            scene: sceneManager 
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

        add.text(centerX, margin, 'Shapes', { font: '32px Arial', fill: '#000000' })
        .   setOrigin(0.5, 0.5) // center the text horizontally and vertically
        

        // ---------< Circle > ----------
        // MEMO: https://newdocs.phaser.io/docs/3.60.0/Phaser.GameObjects.GameObjectFactory#circle
        const circle = ({
            x,          // optional
            y,          // optional
            radius,     // optional 
            fillColor,  // optional
            fillAlpha   // optional
        }) => add.circle(x, y, radius, fillColor, fillAlpha)
        
        circle({ 
            x        : centerX, 
            y        : centerY,
            radius   : 30,
            fillColor: 0x000000,
            fillAlpha: 1
        })
        

        // ---------< Line > ----------
        // MEMO: https://newdocs.phaser.io/docs/3.60.0/Phaser.GameObjects.GameObjectFactory#line
        const line = ({
            x,          // optional
            y,          // optional
            x1,         // optional
            y1,         // optional
            x2,         // optional
            y2,         // optional
            strokeColor,// optional
            strokeAlpha,// optional
        }) => add.line(x, y, x1, y1, x2, y2, strokeColor, strokeAlpha)
        
        line({ 
            x          : centerX,
            y          : centerY + margin,
            x1         : 0,
            y1         : 0,
            x2         : 200,
            y2         : 0,
            strokeColor: 0x000000,
            strokeAlpha: 1,
        })


        // ---------< Square > ----------
        const square = ({
            x,          // optional
            y,          // optional
            size,       // optional 
            fillColor,  // optional
            fillAlpha   // optional
        }) => add.rectangle(x, y, size, size, fillColor, fillAlpha)
        
        square({ 
            x        : centerX - margin, 
            y        : centerY - margin,
            size     : 50,
            fillColor: 0xFF0000,
            fillAlpha: 1
        })


        // ---------< Rectangle > ----------
        const rectangle = ({
            x,          // optional
            y,          // optional
            width,      // optional 
            height,     // optional
            fillColor,  // optional
            fillAlpha   // optional
        }) => add.rectangle(x, y, width, height, fillColor, fillAlpha)
        
        rectangle({ 
            x        : centerX + margin, 
            y        : centerY - margin,
            width    : 100,
            height   : 50,
            fillColor: 0x00FF00,
            fillAlpha: 1
        })


        // ---------< Hexagon > ----------
        const hexagon = ({
            x,          // optional
            y,          // optional
            radius,     // optional 
            fillColor,  // optional
            fillAlpha   // optional
        }) => {
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = Phaser.Math.DegToRad(60 * i);
                const px = radius * Math.cos(angle);
                const py = radius * Math.sin(angle);
                points.push(px, py);
            }
            return add.polygon(x, y, points, fillColor, fillAlpha);
        }
        
        hexagon({ 
            x        : centerX, 
            y        : centerY + 2 * margin,
            radius   : 40,
            fillColor: 0x0000FF,
            fillAlpha: 1
        })


        // ---------< Oval > ----------
        const oval = ({
            x,          // optional
            y,          // optional
            width,      // optional 
            height,     // optional
            fillColor,  // optional
            fillAlpha   // optional
        }) => add.ellipse(x, y, width, height, fillColor, fillAlpha)
        
        oval({ 
            x        : centerX, 
            y        : centerY + 3 * margin,
            width    : 100,
            height   : 50,
            fillColor: 0x000000,
            fillAlpha: 1
        })

        // ---------< Rounded Rectangle > ----------
        const roundedRectangle = ({
            x,          // optional
            y,          // optional
            width,      // optional 
            height,     // optional
            radius,     // optional
            fillColor,  // optional
            fillAlpha   // optional
        }) => {
            const rect = add.graphics()
            rect.fillStyle(fillColor, fillAlpha)
            rect.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius)
            return rect
        }
        
        roundedRectangle({ 
            x        : centerX + margin, 
            y        : centerY + 2 * margin,
            width    : 100,
            height   : 50,
            radius   : 20,
            fillColor: 0xFF00FF,
            fillAlpha: 1
        })

        input.on('pointerdown', _ => sceneManager.start('SpriteAnimation'), scene);
    },
})
