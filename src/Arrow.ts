import { BodyType } from "matter";
import { Scene } from "phaser";

import CustomMatter from "typings/matter";

// @ts-ignore
const { Body } = Phaser.Physics.Matter.Matter as typeof CustomMatter;

const POWER_RATIO = 1500;

export class Arrow {
    scene: Scene;

    x: number;

    y: number;

    head: Phaser.Physics.Matter.Image;

    shaft: Phaser.Physics.Matter.Image;

    frozenAngle: number | null = null;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        const cat1 = this.scene.matter.world.nextGroup(true);

        this.head = this.scene.matter.add.image(this.x, this.y, "arrowhead");
        // this.head.setCollisionGroup(cat1);
        this.head.setIgnoreGravity(true);

        // this.shaft = this.scene.matter.add.image(this.x, this.y + 28, "shaft");
        // this.shaft.setCollisionGroup(cat1);
        // this.shaft.setIgnoreGravity(true);

        // this.scene.matter.add.constraint(
        //     this.head.body as BodyType,
        //     this.shaft.body as BodyType,
        //     15,
        //     0.5,
        //     {
        //         pointB: { x: 0, y: -20 },
        //     },
        // );
    }

    // Angle in radians
    setRotation(angle: number) {
        this.frozenAngle = angle;
    }

    // Percent of total power, not actual strength
    shoot(power: number) {
        if (this.frozenAngle) {
            this.head.setIgnoreGravity(false);
            // this.shaft.setIgnoreGravity(false);
            const xFrom = 100 * Math.cos(this.frozenAngle + Math.PI);
            const yFrom = 100 * Math.sin(this.frozenAngle + Math.PI);

            const xTarget =
                ((POWER_RATIO * power) / 100) * Math.cos(this.frozenAngle);
            const yTarget =
                ((POWER_RATIO * power) / 100) * Math.sin(this.frozenAngle);

            this.frozenAngle = null;
            this.head.applyForce(
                new Phaser.Math.Vector2({ x: xTarget, y: yTarget }),
            );
            // Body.applyForce(
            //     this.head.body as CustomMatter.Body,
            //     {
            //         x: this.head.x + xFrom,
            //         y: this.head.y + yFrom,
            //     },
            //     {
            //         x: xTarget,
            //         y: yTarget,
            //     },
            // );
        }
    }

    destroy() {}

    update(time: number, delta: number) {
        if (this.frozenAngle) {
            this.head.angle = this.frozenAngle + Math.PI / 2;
        }
    }
}
