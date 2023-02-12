import { BodyType } from "matter";
import { Scene } from "phaser";
import CustomMatter from "typings/matter";

// @ts-ignore
const { Bodies, Body } = Phaser.Physics.Matter.Matter as typeof CustomMatter;

const POWER_RATIO = 1500;

export class Arrow {
    scene: Scene;

    x: number;

    y: number;

    head: CustomMatter.Body;

    body: CustomMatter.Body;

    compoundBody: CustomMatter.Body;

    image: Phaser.Physics.Matter.Image;

    frozenAngle: number | null = null;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.body = Bodies.rectangle(0, 0, 3, 40, { density: 10 });
        this.head = Bodies.polygon(0, -23, 3, 8, {
            density: 200,
            angle: Phaser.Math.DegToRad(90),
        });

        this.compoundBody = Body.create({
            parts: [this.head, this.body],
        });
        Body.setCentre(this.compoundBody, { x: 0, y: -5 }, true);
        this.image = this.scene.matter.add.image(0, 0, "arrow");

        this.image.setExistingBody(this.compoundBody as BodyType);
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

            const xOffset =
                Math.abs(this.frozenAngle) > Math.PI / 2 ? 0.1 : -0.1;
            const yOffset = this.frozenAngle < 0 ? 0.1 : -0.1;

            const xTarget =
                ((POWER_RATIO * power) / 100) * Math.cos(this.frozenAngle);
            const yTarget =
                ((POWER_RATIO * power) / 100) * Math.sin(this.frozenAngle);

            this.frozenAngle = null;
            console.log("DZQK", xOffset, yOffset);
            Body.applyForce(
                this.compoundBody,
                {
                    x: this.compoundBody.position.x + xOffset,
                    y: this.compoundBody.position.y + yOffset,
                },
                {
                    x: xTarget,
                    y: yTarget,
                },
            );
            this.scene.add.image(this.x + xTarget, this.y + yTarget, "arrow");
        }
    }

    destroy() {
        this.image.destroy();
    }

    update(time: number, delta: number) {
        if (this.frozenAngle) {
            this.compoundBody.angle = this.frozenAngle + Math.PI / 2;
        }
    }
}
