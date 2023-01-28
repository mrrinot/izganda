import TiledObjectLayer from "../Tiled/TiledObjectLayer";
import TiledTileLayer from "../Tiled/TiledTileLayer";

export const isTileLayer = (
    layer: TiledObjectLayer | TiledTileLayer,
): layer is TiledTileLayer => layer.type === "tilelayer";

export const isObjectLayer = (
    layer: TiledObjectLayer | TiledTileLayer,
): layer is TiledObjectLayer => layer.type === "objectgroup";
