import _SliceStageCreater from "./SliceLayer"

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
  _IntManager = _App.renderer.plugins.interaction;

  document.body.appendChild(_App.view);
  onResize();
  window.onresize = onResize;

  _App.ticker.add(onUpdate, this);

  _App.stage.interactive = true;

  var loadStage = new PIXI.Container();

  var loadButton = new PIXI.Text("This is a Load Button", {
    fontFamily: "Arial",
    fontSize: 74,
    fill: 0xff1010,
    align: "center"
  });

  loadButton.anchor.set(0.5, 0.5);
  loadButton.buttonMode = true;
  loadButton.interactive = true;

  loadButton.position.set(_App.renderer.width / 2, _App.renderer.height / 2);

  loadButton.click = LoadGame;
  loadStage.addChild(loadButton);

  _App.LoadStage = loadStage;
  _App.stage.addChild(loadStage);
};

// update function, pass Window as scope (this = _App)
var onUpdate = function onUpdate() {
  var dt = _App.ticker.deltaTime;
};

//invoked after loading game resources
var GameLoaded = function GameLoaded() {
  console.log("Game is loaded");

  console.log(_SliceStageCreater);
  _SlicedStage =  _SliceStageCreater(_App); //_LRes.slice_js.function(_App);

  _App.stage.addChild(_SlicedStage);

  _App.LoadStage.destroy();
};

var LoadGame = function LoadGame() {
  var loader = _App.loader;

  loader
    .add("blade_js", "./src/scripts/Blade_new.js")
    //.add("slice_js", "./src/scripts/SliceLayer.js")
    .add("blade_tex", "./src/images/blade.png")
    .add("bunny", "./src/images/bunny_ss.json")
    .load(function(l, res) {

      res.blade_js.function = (new Function(res.blade_js.data))();
    //  res.slice_js.function = (new Function(res.slice_js.data))();

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


window.onload = Init;