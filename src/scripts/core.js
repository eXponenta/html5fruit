import _SliceStageCreater from "./SliceLayer"
import "./TiledOGLoader/TiledObjGroupLoader.js"

var _App = null,
  _LRes = null,
  _Renderer = null,
  _IntManager = null,
  _SlicedStage = null;

var Init = function Init() {
  _App = new PIXI.Application({
    width: 1280,
    height: 720,
    backgroundColor: 0xffffff
  });

  //Так надо, стандартные не будут отображатся
  _App.stage = new PIXI.display.Stage();

  _LRes = _App.loader.resources;
  window._LRes = _LRes;

  _IntManager = _App.renderer.plugins.interaction;

  document.body.appendChild(_App.view);
  onResize();
  window.onresize = onResize;

  _App.ticker.add(onUpdate, this);

  _App.stage.interactive = true;

  _App.loader
        .add("base_stage", "./src/maps/base.json")
        .load((l, res) => {

            res.base_stage.stage.scale.set(
                _App.renderer.width / res.base_stage.stage.layerWidth,
                _App.renderer.height / res.base_stage.stage.layerHeight
            );
            
            _App.stage.addChild(res.base_stage.stage);
        });
  
};

// update function, pass Window as scope (this = _App)
var onUpdate = function onUpdate() {
  var dt = _App.ticker.deltaTime;
};

//invoked after loading game resources
var GameLoaded = function GameLoaded() {
  console.log("Game is loaded");

  _SlicedStage =  _SliceStageCreater(_App); //_LRes.slice_js.function(_App);

  _App.stage.addChild(_SlicedStage);

  _App.LoadStage.destroy();
};

var LoadGame = function LoadGame() {
  var loader = _App.loader;

  loader
    .add("blade_tex", "./src/images/blade.png")
    .add("bunny", "./src/images/bunny_ss.json")
    .load(function(l, res) {

      GameLoaded();
    });

  console.log("Game start load");
};

// resize
var onResize = function onResize(event) {
  var _w = document.body.clientWidth;
  var _h = document.body.clientHeight;

  if (_w / _h < 16 / 9) {
    _App.view.style.width = _w + "px";
    _App.view.style.height = _w * 9 / 16 + "px";
  } else {
    _App.view.style.width = _h * 16 / 9 + "px";
    _App.view.style.height = _h + "px";
  }
};

window.LoadGame = LoadGame;
window.onload = Init;