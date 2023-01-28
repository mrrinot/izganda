import Phaser from "phaser";
import BetterSpritePlugin from "./phaser/plugins/BetterSprite";
import { GameScene } from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
    title: "Izganda",
    scene: [GameScene],
    backgroundColor: "#333",
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game-container",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 832,
        height: 1024,
        max: {
            width: 832,
            height: 1024,
        },
    },

    physics: {
        default: "matter",
        matter: {
            gravity: { y: 1 },
        },
    },
    plugins: {
        global: [
            {
                key: "BetterSpritePlugin",
                plugin: BetterSpritePlugin,
                start: true,
            },
        ],
    },
};

window.addEventListener("load", () => {
    // eslint-disable-next-line no-new
    new Phaser.Game(config);
});
