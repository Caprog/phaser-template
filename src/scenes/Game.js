import { Scene } from "phaser";
import { useBodyFactory } from '../factory/factory';

export function useGame({ config, data: _data }) {
    return class Game extends Scene {
        constructor() {
            super('Game');
        }

        create() {
            const ctx = this;
            const { input, time, physics } = ctx;
            const data = { ..._data };
            const { nodes, collisions } = data;
            const factory = useFactory({ ctx, physics });
            const { width: screen_width } = config;

            // Crear los objetos del juego
            const objects = nodes.map(node => ({
                node, 
                item: factory[node.type]?.(node)
            }));

            const updatesFunctions = [];

            const physicsObjects = objects.filter(obj => obj?.node.physics);
            const findByName = ({_objects, node}, callback) => callback(findOneByName(_objects, node?.name) ?? {});
            const actions = {
                jump: ({ node, item }) => item.setVelocityY(-300),
                moveX: ({ node, item }) => item.setVelocityX(100),
                alert: ({ text }) => alert(text),
                action: ({ node, _objects }) => findByName({_objects, node}, ({ item }) => item?.[node?.action]?.()),
                setPosition: ({ node, _objects }) => findByName({_objects, node}, ({ item }) => item.setPosition(node.position.x, node.position.y)),
                'reposition-out-of-screen-left': repositionOutOfScreenLeft
            };

            const callAction = (action, data) => action?.(data);

            const eventMapping = {
                'out-of-screen-right': data => action => updatesFunctions.push(checkIfOutOfScreenRight({ screen_width, data, action })),
                'screen-click': data => action => input.on('pointerdown', () => callAction(action, data)),
                'init': data => action => callAction(action, data)
            };

            const getAndAggListener = event => ({
                ...event,
                listener: eventMapping[event.listen]
            });

            const getAndAggAction = event => ({
                ...event,
                action: actions[event?.performAction?.name]
            });

            objects.forEach(({ node, item }) => getNodeEvents(node)
                .map(getAndAggListener)
                .map(getAndAggAction)
                .forEach(mapActionEvent({ node, item }))
            );

            const collisionMapping = collisions.map(c => ({
                objA: findOnePhysics(c.bodyA, objects),
                objB: findOnePhysics(c.bodyB, objects),
                then: () => c.actions?.forEach(a => actions[a.name]?.({ ...a, _objects: objects }))
            }));

            physics.world.on('worldbounds', (body) => {
                const item = body.gameObject;
                const shouldCancelVelocityY = (item) => item.getData('disableVelocityY');
                const shouldCancelVelocityX = (item) => item.getData('disableVelocityX');
                const shouldCancelContact = (item) => item.getData('cancelContact');

                if (shouldCancelVelocityX(item)) item.setVelocityX(0);
                if (shouldCancelVelocityY(item)) item.setVelocityY(0);
                if (shouldCancelContact(item)) body.setCollideWorldBounds(false);
            });

            const fps = 60;
            const update = () => {
                updatesFunctions.forEach(uf => uf());
                physicsObjects.forEach(({ node, item }) => item.update());
            };

            const event = time.addEvent({
                delay: 1000 / fps,
                callback: () => {
                    update();
                },
                loop: true
            });
        }
    }
}
const useFactory = ({ ctx, physics }) => {
    const { createSquare } = useBodyFactory({ ctx, physics });

    return {
        square: pipe(
            normalizePhysicsData,
            createSquare
        ),
        counter: useCounter(ctx)
    };
};

const useCounter = (ctx) => (data) => {
    const uiText = createText(ctx)(data);
    uiText.setOrigin(0.5, 0.5);
    let val = data?.val ?? 0;
    uiText.setText(val);
    const _setText = (str) => uiText.setText(str);
    return {
        increment: () => _setText(++val),
        clear: () => {
            val = 0;
            _setText(val);
        }
    };
};

// ------------< end factory functions >------------

// ------------< start node functions >------------
const getItemData = (item) => item?.getData() ?? {};
const checkIfOutOfScreenRight = ({ screen_width, data, action }) => () => {
    const item = data?.item;
    const position = item?.body.position;
    const width = getItemData(item)?.width;
    if (position && position.x - width > screen_width) {
        action?.(data);
    }
};

const getNodeEvents = node => node.events ?? [];
const mapActionEvent = ({ node, item }) => event => event?.listener({ node, item })?.(event.action);
const findOneByName = (arr, name) => arr.find(({ node, item }) => node.name === name);
const repositionOutOfScreenLeft = ({ node, item }) => {
    const shapeWidth = getItemData(item)?.width;
    const newPositionX = -(shapeWidth / 30);
    const position = item.body.position;
    item.setPosition(newPositionX, position.y);
};
const bodySetPosition = (body, { x, y }) => body.setPosition(pxToMts(x), pxToMts(y));

// ------------< end node functions >------------

// ------------< start physics functions >------------

const createText = (ctx) => ({ x, y, text, font }) => ctx.add.text(x, y, text, font);

const updateBodyPosition = (body) => {
    body.x += body.body.velocity.x / 60;
    body.y += body.body.velocity.y / 60;
    body.setPosition(body.x, body.y);
};

const handleCollisions = (item, physicsObjects) => {
    physicsObjects.forEach(({ node, item: otherItem }) => {
        if (item !== otherItem) {
            // Check for collision and handle response
            if (Phaser.Geom.Intersects.RectangleToRectangle(item.getBounds(), otherItem.getBounds())) {
                // Handle collision response, for example, bounce
                item.setVelocityX(-item.body.velocity.x);
                item.setVelocityY(-item.body.velocity.y);
            }
        }
    });
};

const findOnePhysics = (collisionConfig, objects) => objects.find(({ node, item }) => node.name === collisionConfig.name);
const getLinearVelocityX = (body) => body.body.velocity.x;
const getLinearVelocityY = (body) => body.body.velocity.y;
const setLinearVelocity = (body, velocity) => body.body.velocity.set(velocity);
const velocityY = (body, velocityY) => setLinearVelocity(
    body,
    { x: getLinearVelocityX(body), y: velocityY }
);
const velocityX = (body, velocityX) => setLinearVelocity(
    body,
    { x: velocityX, y: getLinearVelocityY(body) }
);
const normalizePhysicsData = (obj) => ({ ...obj, type: obj?.physics });

// ------------< end physics functions >------------

// ------------< start utils functions >------------

const pipe = (...func) => (data) => func.reduce((d, f) => f(d), data);

// ------------< end utils functions >------------
