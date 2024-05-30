import { Scene } from 'phaser';
import { config } from '../config';
import * as planck from 'planck-js';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        console.log(config);
        this.data = { ...DATA };
        this.data.player = pipe(
            setBottomScene,
            setMiddleScene
        )({ config, data: this.data.player })?.data;

        // Crear el mundo de Planck
        this.world = planck.World({ gravity: planck.Vec2(0, 10) });

        const player = drawRectRounded({ ctx: this, data: this.data.player });
        const ground = createGround(this);

        // Manejar clic para saltar
        this.input.on('pointerdown', () => jump(player, -10)); // Ajusta la velocidad de salto según sea necesario

        // Crear bucle de actualización
        this.time.addEvent({
            delay: 1000 / 60, // 60 FPS
            callback: () => {
                this.world.step(1 / 60);
                updatePlayerPosition(this, player);
            },
            loop: true
        });
    }

    update() {
        // Lógica del juego aquí si es necesario
    }
}

const DATA = {
    player: {
        x: 0,
        y: 0,
        bgcolor: 0x116A7B,
        width: 32,
        height: 32,
        radius: 4
    }
};

const setBottomScene = ({ config, data }) => {
    data.y = config.height - (data.height * 2);
    return { config, data };
};

const setMiddleScene = ({ config, data }) => {
    data.x = (config.width / 2) - data.width / 2;
    return { config, data };
};

const pipe = (...funcs) => (data) => {
    return funcs.reduce((acc, func) => func(acc), data);
};

const createPlayer = (ctx, playerData) => {
    const { x, y, width, height } = playerData;

    const playerBody = ctx.world.createBody({
        type: 'dynamic',
        position: planck.Vec2((x + width / 2) / 30, (y + height / 2) / 30), // Convertir a metros
    });

    const playerShape = planck.Box(width / 60, height / 60); // Convertir a metros
    playerBody.createFixture(playerShape, {
        restitution: 0.2,
        friction: 0.5,
        density: 1
    });

    return playerBody;
};

const createGround = (ctx) => {
    const groundBody = ctx.world.createBody({
        type: 'static',
        position: planck.Vec2(config.width / 2 / 30, (config.height - 10) / 30), // Convertir a metros
    });

    const groundShape = planck.Box(config.width / 2 / 30, 10 / 30); // Convertir a metros
    groundBody.createFixture(groundShape, {
        restitution: 0.2,
        friction: 0.5,
        density: 2
    });

    const graphics = ctx.add.graphics();
    const middle = config.width / 2
    const width = middle / 2
    graphics.fillStyle(0x116A7B, 1);
    graphics.fillRect(0, 0, middle / 2, 2);
    graphics.setPosition(middle - width / 2, config.height - 20);

    groundBody.setUserData({
        graphics: graphics
    });

    return groundBody;
};

const jump = (player, velocityY) => {
    const v = player.getLinearVelocity();
    player.setLinearVelocity(planck.Vec2(v.x, velocityY));
};

const updatePlayerPosition = (ctx, player) => {
    const userData = player.getUserData();
    const position = player.getPosition();

    // Convertir la posición de metros a píxeles
    const x = position.x * 30 - userData.width / 2;
    const y = position.y * 30 - userData.height / 2;

    // Actualiza la posición del objeto gráfico en Phaser
    if (userData.graphics) {
        userData.graphics.setPosition(x, y);
    }
};

// Este método crea un objeto gráfico de Phaser y lo asocia con el cuerpo de Planck.js
const drawRectRounded = ({ data: player, ctx }) => {
    const { x, y, bgcolor, width, height, radius } = player;
    const graphics = ctx.add.graphics();
    graphics.fillStyle(bgcolor, 1);
    graphics.fillRoundedRect(0, 0, width, height, radius);

    // Inicializa la posición del gráfico
    graphics.setPosition(x, y);

    // Asocia el gráfico con el cuerpo de Planck.js
    const playerBody = createPlayer(ctx, player);
    playerBody.setUserData({
        graphics: graphics,
        color: bgcolor,
        width: width,
        height: height
    });

    return playerBody;
};
