import { Controller } from "$src/Controller";
import { Scene } from "phaser";

export class GameScene extends Scene {
    map: Phaser.Tilemaps.Tilemap | null = null;

    player: Controller;

    constructor() {
        super("GameScene");

        this.player = new Controller(this, 640, 800);
    }

    preload() {
        this.load.image("tiles", "tilesets/gridtiles.png");
        this.load.tilemapTiledJSON("map", "maps/simple-map.json");
    }

    create() {
        this.map = this.make.tilemap({
            key: "map",
            tileWidth: 32,
            tileHeight: 32,
        });

        const { widthInPixels, heightInPixels } = this.map;
        this.matter.world.setBounds(0, 0, widthInPixels, heightInPixels);

        this.cameras.main.setBounds(0, 0, widthInPixels, heightInPixels);

        const tileset = this.map.addTilesetImage("tiles");
        const layer = this.map.createLayer("Level1", tileset);

        this.map.setCollision([20, 48]);

        this.player.create();
    }

    update(time: number, delta: number) {
        this.player.update(time, delta);
    }
}
