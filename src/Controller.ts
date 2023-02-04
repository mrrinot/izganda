import { Scene } from "phaser";

const MOUSE_DEADZONE = 20;

export class Controller {
    scene: Scene;

    x: number;

    y: number;

    arrow: Phaser.GameObjects.Rectangle | null = null;

    aimStartPoint: { x: number; y: number } | null = null;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    create() {
        this.scene.add.rectangle(this.x + 16, this.y, 32, 64, 0xff0066, 0.8);

        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (this.arrow) {
                this.arrow.destroy();
            }
            this.aimStartPoint = { x: pointer.x, y: pointer.y };
        });

        this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (this.aimStartPoint) {
                const mouseDistance = Phaser.Math.Distance.BetweenPoints(
                    this.aimStartPoint,
                    pointer,
                );

                if (mouseDistance > MOUSE_DEADZONE) {
                    if (!this.arrow) {
                        this.arrow = this.scene.add
                            .rectangle(this.x + 32, this.y, 50, 10, 0x12ff33, 1)
                            .setDisplayOrigin(0.5, 0);
                    }

                    this.arrow.rotation = Phaser.Math.Angle.BetweenPoints(
                        this.aimStartPoint,
                        pointer,
                    );
                }
            }
        });

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (this.arrow) {
                this.arrow.destroy();

                this.arrow = null;
                this.aimStartPoint = null;
            }
        });
    }

    update(time: number, delta: number) {}
}
