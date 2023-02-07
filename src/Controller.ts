import { Scene } from "phaser";

const MOUSE_DEADZONE = 20;

export class Controller {
    scene: Scene;

    x: number;

    y: number;

    arrow: Phaser.GameObjects.Rectangle | null = null;

    aimStartPoint: { x: number; y: number } | null = null;

    aimCircle: Phaser.GameObjects.Graphics | null = null;

    aimAngleText: Phaser.GameObjects.Text | null = null;

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
                const mouseAngle =
                    Phaser.Math.Angle.BetweenPoints(
                        pointer,
                        this.aimStartPoint,
                    ) -
                    Phaser.Math.PI2 / 2;

                const mouseDegreeAngle = Math.round(
                    Phaser.Math.RadToDeg(mouseAngle * -1),
                );

                if (mouseDistance > MOUSE_DEADZONE) {
                    if (!this.arrow) {
                        this.arrow = this.scene.add
                            .rectangle(this.x + 32, this.y, 50, 6, 0x12ff33, 1)
                            .setOrigin(0, 0.5);
                    }

                    if (!this.aimCircle) {
                        this.aimCircle = this.scene.add.graphics({
                            x: 0,
                            y: 0,
                            lineStyle: {
                                color: 0xeeee89,
                                alpha: 0.8,
                                width: 2,
                            },
                        });
                    }
                    if (!this.aimAngleText) {
                        this.aimAngleText = this.scene.add.text(
                            this.aimStartPoint.x - 20,
                            this.aimStartPoint.y - 110,
                            `${mouseDegreeAngle}°`,
                            { fontSize: "26px", color: "#eeee89" },
                        );
                    }

                    this.aimCircle
                        .clear()
                        .strokeCircle(
                            this.aimStartPoint.x,
                            this.aimStartPoint.y,
                            75,
                        );

                    this.aimAngleText.x =
                        this.aimStartPoint.x -
                        (7 + 7 * String(mouseDegreeAngle).length);
                    this.aimAngleText.text = `${mouseDegreeAngle}°`;

                    this.arrow.rotation = mouseAngle;
                }
            }
        });

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (this.arrow) {
                this.arrow.destroy();

                this.arrow = null;
                this.aimStartPoint = null;
            }

            if (this.aimCircle) {
                this.aimCircle.destroy();
                this.aimCircle = null;
            }

            if (this.aimAngleText) {
                this.aimAngleText.destroy();
                this.aimAngleText = null;
            }
        });
    }

    update(time: number, delta: number) {}
}
