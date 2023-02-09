import { BodyType } from "matter";
import { Scene } from "phaser";
import CustomMatter from "typings/matter";

const {
    Bodies,
    Body,
    Sleeping,
}: {
    Bodies: typeof CustomMatter.Bodies;
    Body: typeof CustomMatter.Body;
    Sleeping: typeof CustomMatter.Sleeping;
} =
    // @ts-ignore
    Phaser.Physics.Matter.Matter;

export class Arrow {
    scene: Scene;

    x: number;

    y: number;

    head: CustomMatter.Body;

    body: CustomMatter.Body;

    compoundBody: CustomMatter.Body;

    image: Phaser.Physics.Matter.Image;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.body = Bodies.rectangle(0, 0, 4, 40, { density: 100 });
        this.head = Bodies.polygon(0, -25, 3, 6, {
            density: 300,
            angle: Phaser.Math.DegToRad(90),
        });

        this.compoundBody = Body.create({
            parts: [this.head, this.body],
        });
        this.image = this.scene.matter.add.image(0, 0, "arrow");

        this.image.setExistingBody(this.compoundBody as BodyType);
        this.image.setOrigin(0.5, 0.4);
        this.image.setPosition(this.x, this.y);
        this.image.setIgnoreGravity(true);
    }

    // Angle in radians
    setRotation(angle: number) {
        this.compoundBody.angle = angle + Math.PI / 2;
    }

    // Percent of total power, not actual strength
    shoot(power: number) {
        console.log("POWER", power);
        this.image.setIgnoreGravity(false);

        Body.applyForce(this.compoundBody, this.compoundBody.position, {
            x: 50,
            y: -3000,
        });
    }

    destroy() {
        this.image.destroy();
    }

    update(time: number, delta: number) {}
}
