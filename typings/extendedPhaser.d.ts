import * as Phaser from "phaser";

declare module "phaser" {
    namespace Loader {
        interface LoaderPlugin {
            goodAtlas(
                key: string,
                imageUrl: string,
                atlasUrl?: string,
            ): Phaser.Loader.LoaderPlugin;
        }
    }

    interface Scene {
        ensureGoodAtlas(
            id: string,
            filePath: string,
            atlasPath?: string,
        ): Promise<void>;
    }

    namespace GameObjects {
        interface Sprite {
            setOriginFromTextureData(): this;
            playOwnAnim(
                key: string,
                ignoreIfPlaying?: boolean,
                startFrame?: number,
            ): this;
        }

        interface Image {
            setOriginFromTextureData(): this;
        }
    }

    interface Game {
        onReady(callback: () => void);
        offReady(callback: () => void);
    }
}
