import Phaser from "phaser";
import { registerFileType } from "$src/phaser/loader/fileTypes/GoodAtlasFile";

export default class BetterSpritePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super("BetterSpritePlugin", pluginManager);

        registerFileType();

        if (
            typeof Phaser.GameObjects.Sprite.prototype.playOwnAnim !==
            "function"
        ) {
            Phaser.GameObjects.Sprite.prototype.playOwnAnim =
                function playOwnAnim(key, ...args) {
                    return this.play(`${this.texture.key}_${key}`, ...args);
                };
        }

        if (typeof Phaser.Scene.prototype.ensureGoodAtlas !== "function") {
            /**
             *
             * @param {String} id
             * @param {String} filePath
             * @param {String | undefined} atlasPath
             * @returns
             */
            Phaser.Scene.prototype.ensureGoodAtlas = function ensureGoodAtlas(
                id,
                filePath,
                atlasPath,
            ) {
                return new Promise((resolve) => {
                    if (this.load.textureManager.exists(id)) {
                        resolve();
                    } else {
                        let realAtlas = atlasPath;

                        if (!realAtlas) {
                            realAtlas = filePath.replace(/\.(.*)/, ".json");
                        }

                        this.load.goodAtlas(id, filePath, realAtlas);
                        this.load.once("complete", () => {
                            resolve();
                        });

                        this.load.start();
                    }
                });
            };
        }

        const setOriginFromTextureData = function setOriginFromTextureData() {
            if (!this.texture || !this.texture.customData) {
                throw new Error(
                    `${this.key} does not have a texture or it does not contain a customData.`,
                );
            }

            const { originX, originY, frameWidth, frameHeight } =
                this.texture.customData;

            const oX = originX || 0;
            const oY = originY || 0;

            const fW = frameWidth || config.tileSize;
            const fH = frameHeight || config.tileSize;

            this.pixelOriginX = oX;
            this.pixelOriginY = oY;

            return this.setOrigin(oX / fW, oY / fH);
        };

        if (
            typeof Phaser.GameObjects.Sprite.prototype
                .setOriginFromTextureData !== "function"
        ) {
            Phaser.GameObjects.Sprite.prototype.setOriginFromTextureData =
                setOriginFromTextureData;
        }

        if (
            typeof Phaser.GameObjects.Image.prototype
                .setOriginFromTextureData !== "function"
        ) {
            Phaser.GameObjects.Image.prototype.setOriginFromTextureData =
                setOriginFromTextureData;
        }
    }

    init() {
        // eslint-disable-next-line no-console
        console.log("Plugin BetterSpritePlugin is alive");
    }
}
