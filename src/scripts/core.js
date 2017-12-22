import "./PixiHelper";

import _BaseStage from "./BaseLayer"

import "./TiledOGLoader/TiledObjGroupLoader"
import "./DragonBoneLoader";


window.game = {
  allowClosing: false,

  restore : function() {
    //console.log("Can't implemented before loading!!");
    Init();
  },
  closing:function(){
    console.warn("You must override `window.game.closing` !! \n But this destroy APP");
    console.log("For restoring app you must call `window.game.restore` !!");
  }
}


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

  _App.closing = function() {
      _App.destroy(true);
      window.game.closing();
    
  }

  //Так надо, стандартные не будут отображатся
  _App.stage = new PIXI.display.Stage();

  _LRes = _App.loader.resources;
  window._LRes = _LRes;
  window._App = _App;
  
  let container = document.querySelector("#game_container");
  container.appendChild(_App.view);
  onResize();
  window.onresize = onResize;

  new _BaseStage(_App);
    
};

// resize
var onResize = function onResize(event) {

  var _parent = _App.renderer.view.parentNode.parentNode;
  var _w = _parent.clientWidth;
  var _h = _parent.clientHeight;

  if (_w / _h < 16 / 9) {
    _App.view.style.width = _w + "px";
    _App.view.style.height = _w * 9 / 16 + "px";
  } else {
    _App.view.style.width = _h * 16 / 9 + "px";
    _App.view.style.height = _h + "px";
  }
};

window.onload = Init;