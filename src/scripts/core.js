import "./PixiHelper";

import _BaseStageCreater from "./BaseLayer"
import _SliceStageCreater from "./SliceLayer"

import "./TiledOGLoader/TiledObjGroupLoader"
import "./DragonBoneLoader";


var _App = null,
  _LRes = null,
  //_Renderer = null,
  //_IntManager = null,
  _SlicedStage = null;

var Init = function Init() {
  _App = new PIXI.Application({
    width: 1920,
    height: 1080,
    backgroundColor: 0xffffff
  });

  //Так надо, стандартные не будут отображатся
  _App.stage = new PIXI.display.Stage();

  _LRes = _App.loader.resources;
  window._LRes = _LRes;

//  _IntManager = _App.renderer.plugins.interaction;
  
  let container = document.querySelector("#game_container");
  container.appendChild(_App.view);
  onResize();
  window.onresize = onResize;

  _BaseStageCreater(_App);
//  _App.stage.interactive = true;
    
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