import Phaser from "phaser";

const {
    Animations: { Animation },
    Loader: {
        FileTypesManager,
        FileTypes: { AtlasJSONFile },
    },
    Utils: {
        Objects: { Clone },
    },
} = Phaser;

const GoodAtlasJSONFile = class extends AtlasJSONFile {
    parseFrames(texture, sourceIndex, json) {
        if (!Object.hasOwnProperty.call(json, "frames")) {
            throw new Error(
                "Invalid Texture Atlas JSON Hash given, missing 'frames' Object",
            );
        }

        const { frameWidth, frameHeight } = json;
        let horizontalFrameCount = 0;

        const source = texture.source[sourceIndex];

        if (frameWidth && frameHeight) {
            horizontalFrameCount = source.width / frameWidth;
        }

        texture.add("__BASE", sourceIndex, 0, 0, source.width, source.height);

        const { frames } = json;
        let newFrame;

        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const key in frames) {
            const src = frames[key];

            // If the frame handling is index-based
            if (typeof src === "number" || typeof src.frame === "number") {
                if (!frameWidth || !frameHeight) {
                    throw new Error(
                        "Invalid json file. Using indexes without frameWidth/frameHeight specified.",
                    );
                }

                let index = src;
                if (typeof index !== "number") {
                    index = src.frame;
                }

                const x = (index % horizontalFrameCount) * frameWidth;
                const y =
                    Math.floor(index / horizontalFrameCount) * frameHeight;
                newFrame = texture.add(
                    key,
                    sourceIndex,
                    x,
                    y,
                    frameWidth,
                    frameHeight,
                );
            } else if (Array.isArray(src)) {
                if (!frameWidth || !frameHeight) {
                    throw new Error(
                        "Invalid json file. Using array of indexes without frameWidth/frameHeight specified.",
                    );
                }

                let i = 0;
                const makeFrame = (index) => {
                    const x = (index % horizontalFrameCount) * frameWidth;
                    const y =
                        Math.floor(index / horizontalFrameCount) * frameHeight;

                    newFrame = texture.add(
                        `${key}_${i++}`,
                        sourceIndex,
                        x,
                        y,
                        frameWidth,
                        frameHeight,
                    );
                };

                for (const spec of src) {
                    if (typeof spec === "number") {
                        makeFrame(spec);
                    } else if (Array.isArray(spec)) {
                        for (let j = spec[0]; j <= spec[1]; ++j) {
                            makeFrame(j);
                        }
                    }
                }

                continue; // eslint-disable-line no-continue
            } else {
                // Otherwise, we use the default handling.
                newFrame = texture.add(
                    key,
                    sourceIndex,
                    src.frame.x,
                    src.frame.y,
                    src.frame.w,
                    src.frame.h,
                );
            }

            if (src.trimmed) {
                newFrame.setTrim(
                    src.sourceSize.w,
                    src.sourceSize.h,
                    src.spriteSourceSize.x,
                    src.spriteSourceSize.y,
                    src.spriteSourceSize.w,
                    src.spriteSourceSize.h,
                );
            }

            if (src.rotated) {
                newFrame.rotated = true;
                newFrame.updateUVsInverted();
            }

            newFrame.customData = Clone(src);
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const dataKey in json) {
            if (dataKey !== "frames") {
                if (Array.isArray(json[dataKey])) {
                    texture.customData[dataKey] = json[dataKey].slice(0);
                } else {
                    texture.customData[dataKey] = json[dataKey];
                }
            }
        }

        return texture;
    }

    createAnim(spriteKey, json) {
        const key = `${spriteKey}_${json.key}`;
        const animationManager = this.loader.systems.anims;

        if (!json.key || animationManager.anims.has(key)) {
            // eslint-disable-next-line no-console
            console.warn(
                `Invalid Animation Key, or Key already in use: ${key}`,
            );
            return;
        }

        if (Array.isArray(json.frames)) {
            json.frames = json.frames.map((frame) =>
                typeof frame === "string" ? { key: spriteKey, frame } : frame,
            );
        }

        const anim = new Animation(animationManager, key, json);
        animationManager.anims.set(key, anim);

        return anim;
    }

    parseAnims(spriteKey, texture, sourceIndex, json) {
        if (!Object.hasOwnProperty.call(json, "anims")) {
            return;
        }

        const output = [];

        if (Array.isArray(json.anims)) {
            for (let i = 0; i < json.anims.length; i++) {
                output.push(this.createAnim(spriteKey, json.anims[i]));
            }

            if (Object.hasOwnProperty.call(json, "globalTimeScale")) {
                this.globalTimeScale = json.globalTimeScale;
            }
        } else if (
            Object.hasOwnProperty.call(json, "key") &&
            json.type === "frame"
        ) {
            output.push(this.createAnim(spriteKey, json));
        }

        return texture;
    }

    parseJson(spriteKey, texture, sourceIndex, json) {
        this.parseFrames(texture, sourceIndex, json);
        this.parseAnims(spriteKey, texture, sourceIndex, json);
    }

    addToCache() {
        if (this.isReadyToProcess()) {
            const { key, data: source } = this.files[0];
            const json = this.files[1];
            const { data } = json;
            const dataSource = this.files[2] ? this.files[2].data : null;
            const tm = this.loader.textureManager;
            let texture;

            if (tm.checkKey(key)) {
                texture = tm.create(key, source);

                if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        this.parseJson(key, texture, i, data[i]);
                    }
                } else {
                    this.parseJson(key, texture, 0, data);
                }

                if (dataSource) {
                    texture.setDataSource(dataSource);
                }

                tm.emit("addtexture", key, texture);
            }

            json.addToCache();

            this.complete = true;
        }
    }
};

export const registerFileType = function registerFileType() {
    FileTypesManager.register(
        "goodAtlas",
        function goodAtlasRegistrator(
            key,
            textureURL,
            atlasURL,
            textureXhrSettings,
            atlasXhrSettings,
        ) {
            if (Array.isArray(key)) {
                for (let i = 0; i < key.length; i++) {
                    const multifile = new GoodAtlasJSONFile(this, key[i]);

                    this.addFile(multifile.files);
                }
            } else {
                const multifile = new GoodAtlasJSONFile(
                    this,
                    key,
                    textureURL,
                    atlasURL,
                    textureXhrSettings,
                    atlasXhrSettings,
                );

                this.addFile(multifile.files);
            }

            return this;
        },
    );
};

export default GoodAtlasJSONFile;
