import OGParser from "./OGParser"

PIXI.loaders.Loader.addPixiMiddleware(OGParser);
PIXI.loader.use(OGParser());
// nothing to export
