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

        this.body = Bodies.rectangle(0, 0, 4, 40, { density: 10 });
        this.head = Bodies.polygon(0, -25, 3, 6, {
            density: 200,
            angle: Phaser.Math.DegToRad(90),
        });

        this.compoundBody = Body.create({
            parts: [this.head, this.body],
        });
        Body.setCentre(this.compoundBody, { x: 0, y: -5 }, true);
        this.image = this.scene.matter.add.image(0, 0, "arrow");

        this.image.setExistingBody(this.compoundBody as BodyType);
        this.image.setOrigin(0.5, 0.4);
        this.image.setPosition(this.x, this.y);
        this.image.setIgnoreGravity(true);

        console.log("DZQN", this.compoundBody);
    }

    // Angle in radians
    setRotation(angle: number) {
        this.compoundBody.angle = angle + Math.PI / 2;
    }

    // Percent of total power, not actual strength
    shoot(power: number) {
        this.image.setIgnoreGravity(false);

        Body.applyForce(
            this.compoundBody,
            {
                x: this.compoundBody.position.x + 0.1,
                y: this.compoundBody.position.y - 0.1,
            },
            {
                x: 700,
                y: -1500,
            },
        );
    }

    destroy() {
        this.image.destroy();
    }

    update(time: number, delta: number) {}
}
