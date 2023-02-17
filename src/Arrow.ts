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

    head: BodyType;

    image: Phaser.Physics.Matter.Image;

    frozenAngle: number | null = null;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.head = this.scene.matter.add.polygon(0, -23, 3, 8, {
            density: 200,
            angle: Phaser.Math.DegToRad(30),
        });

        this.image = this.scene.matter.add.image(0, 0, "arrow");

        this.image.setExistingBody(this.head);
        this.image.setOrigin(0.5, 0.1);
        this.image.setPosition(this.x, this.y);
        this.image.setIgnoreGravity(true);
    }

    // Angle in radians
    setRotation(angle: number) {
        this.frozenAngle = angle;
    }

    // Percent of total power, not actual strength
    shoot(power: number) {
        if (this.frozenAngle) {
            this.image.setIgnoreGravity(false);

            const xFrom = 100 * Math.cos(this.frozenAngle + Math.PI);
            const yFrom = 100 * Math.sin(this.frozenAngle + Math.PI);

            const xTarget =
                ((POWER_RATIO * power) / 100) * Math.cos(this.frozenAngle);
            const yTarget =
                ((POWER_RATIO * power) / 100) * Math.sin(this.frozenAngle);

            this.frozenAngle = null;
            Body.applyForce(
                this.head as CustomMatter.Body,
                {
                    x: this.head.position.x + xFrom,
                    y: this.head.position.y + yFrom,
                },
                {
                    x: xTarget,
                    y: yTarget,
                },
            );
        }
    }

    destroy() {
        this.image.destroy();
    }

    update(time: number, delta: number) {
        if (this.frozenAngle) {
            this.head.angle = this.frozenAngle + Math.PI / 2;
        }
    }
}
