import { Scene } from "phaser";
import { Arrow } from "./Arrow";

const MOUSE_DEADZONE_DISTANCE = 15;
const MAX_AIM_DISTANCE = 75;

export class Controller {
    scene: Scene;

    x: number;

    y: number;

    arrow: Arrow | null = null;

    bow: Phaser.GameObjects.Image | null = null;

    aimStartPoint: { x: number; y: number } | null = null;

    aimCircle: Phaser.GameObjects.Graphics | null = null;

    aimAngleText: Phaser.GameObjects.Text | null = null;

    aimPowerPreview: Phaser.GameObjects.Rectangle | null = null;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    preload() {
        this.scene.load.image("bow", "images/bow.png");
        this.scene.load.image("arrow", "images/arrow.png");
    }

    create() {
        this.scene.add.rectangle(this.x + 16, this.y, 32, 64, 0xff0066, 0.8);
        this.bow = this.scene.add
            .image(this.x + 32, this.y, "bow")
            .setOrigin(1, 0.5);

        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.aimStartPoint = { x: pointer.worldX, y: pointer.worldY };
        });

        this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (this.aimStartPoint) {
                const mouseDistance = Phaser.Math.Distance.BetweenPoints(
                    this.aimStartPoint,
                    { x: pointer.worldX, y: pointer.worldY },
                );
                const mouseAngle = Phaser.Math.Angle.BetweenPoints(
                    { x: pointer.worldX, y: pointer.worldY },
                    this.aimStartPoint,
                );

                let mouseDegreeAngle = Math.round(
                    Phaser.Math.RadToDeg(mouseAngle * -1),
                );

                // Only display positive angles between 0 and 360 that way
                if (mouseDegreeAngle < 0) {
                    mouseDegreeAngle += 360;
                }

                if (mouseDistance > MOUSE_DEADZONE_DISTANCE) {
                    if (!this.arrow) {
                        this.arrow = new Arrow(this.scene, this.x + 32, this.y);
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
                            fillStyle: {
                                color: 0xeeee89,
                                alpha: 0.8,
                            },
                        });
                    }

                    if (!this.aimAngleText) {
                        this.aimAngleText = this.scene.add.text(
                            this.aimStartPoint.x - 20,
                            this.aimStartPoint.y - MAX_AIM_DISTANCE - 30,
                            `${mouseDegreeAngle}°`,
                            { fontSize: "26px", color: "#eeee89" },
                        );
                    }

                    if (!this.aimPowerPreview) {
                        this.aimPowerPreview = this.scene.add
                            .rectangle(
                                this.aimStartPoint.x,
                                this.aimStartPoint.y,
                                Math.min(
                                    MAX_AIM_DISTANCE - MOUSE_DEADZONE_DISTANCE,
                                    mouseDistance,
                                ),
                                6,
                                0x12ff33,
                                0.9,
                            )
                            .setOrigin(0, 0.5);
                    }

                    // Outer aim circle
                    this.aimCircle
                        .clear()
                        .strokeCircle(
                            this.aimStartPoint.x,
                            this.aimStartPoint.y,
                            MAX_AIM_DISTANCE,
                        );
                    // Show deadzone
                    this.aimCircle.fillCircle(
                        this.aimStartPoint.x,
                        this.aimStartPoint.y,
                        MOUSE_DEADZONE_DISTANCE,
                    );

                    // Shift angle text based on angle length (1, 2 or 3 digits)
                    this.aimAngleText.x =
                        this.aimStartPoint.x -
                        (7 + 7 * String(mouseDegreeAngle).length);
                    this.aimAngleText.text = `${mouseDegreeAngle}°`;

                    // Power bar preview length based on % of distance
                    this.aimPowerPreview.width = Math.min(
                        MAX_AIM_DISTANCE - MOUSE_DEADZONE_DISTANCE,
                        mouseDistance,
                    );

                    // Move power bar preview to the edge of the deadzone circle preview
                    this.aimPowerPreview.x =
                        this.aimStartPoint.x +
                        MOUSE_DEADZONE_DISTANCE * Math.cos(mouseAngle);
                    this.aimPowerPreview.y =
                        this.aimStartPoint.y +
                        MOUSE_DEADZONE_DISTANCE * Math.sin(mouseAngle);

                    // Rotate both the preview and the actual arrow
                    this.aimPowerPreview.rotation = mouseAngle;
                    this.bow!.rotation = mouseAngle;
                    this.arrow.setRotation(mouseAngle);
                }
            }
        });

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (this.aimStartPoint) {
                const mouseDistance = Phaser.Math.Distance.BetweenPoints(
                    this.aimStartPoint,
                    { x: pointer.worldX, y: pointer.worldY },
                );
                const clampedDistance = Math.min(
                    Math.max(mouseDistance, MOUSE_DEADZONE_DISTANCE),
                    MAX_AIM_DISTANCE,
                );

                console.log("DKNQZ", mouseDistance, clampedDistance);
                if (this.arrow) {
                    this.arrow.shoot(
                        (clampedDistance * 100) / MAX_AIM_DISTANCE,
                    );
                }

                if (this.aimCircle) {
                    this.aimCircle.destroy();
                    this.aimCircle = null;
                }

                if (this.aimAngleText) {
                    this.aimAngleText.destroy();
                    this.aimAngleText = null;
                }

                if (this.aimPowerPreview) {
                    this.aimPowerPreview.destroy();
                    this.aimPowerPreview = null;
                }
            }

            this.aimStartPoint = null;
        });
    }

    update(time: number, delta: number) {}
}
