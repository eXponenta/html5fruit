(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * @pixi/filter-drop-shadow - v2.3.1
 * Compiled Wed, 29 Nov 2017 16:45:19 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.__filter_drop_shadow={})}(this,function(t){"use strict";var e="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}",i=function(t){function i(i,n,o,a,l){void 0===i&&(i=45),void 0===n&&(n=5),void 0===o&&(o=2),void 0===a&&(a=0),void 0===l&&(l=.5),t.call(this),this.tintFilter=new PIXI.Filter(e,r),this.blurFilter=new PIXI.filters.BlurFilter,this.blurFilter.blur=o,this.targetTransform=new PIXI.Matrix,this.rotation=i,this.padding=n,this.distance=n,this.alpha=l,this.color=a}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var n={distance:{configurable:!0},rotation:{configurable:!0},blur:{configurable:!0},alpha:{configurable:!0},color:{configurable:!0}};return i.prototype.apply=function(t,e,r,i){var n=t.getRenderTarget();n.transform=this.targetTransform,this.tintFilter.apply(t,e,n,!0),this.blurFilter.apply(t,n,r),t.applyFilter(this,e,r,i),n.transform=null,t.returnRenderTarget(n)},i.prototype._updatePadding=function(){this.padding=this.distance+2*this.blur},i.prototype._updateTargetTransform=function(){this.targetTransform.tx=this.distance*Math.cos(this.angle),this.targetTransform.ty=this.distance*Math.sin(this.angle)},n.distance.get=function(){return this._distance},n.distance.set=function(t){this._distance=t,this._updatePadding(),this._updateTargetTransform()},n.rotation.get=function(){return this.angle/PIXI.DEG_TO_RAD},n.rotation.set=function(t){this.angle=t*PIXI.DEG_TO_RAD,this._updateTargetTransform()},n.blur.get=function(){return this.blurFilter.blur},n.blur.set=function(t){this.blurFilter.blur=t,this._updatePadding()},n.alpha.get=function(){return this.tintFilter.uniforms.alpha},n.alpha.set=function(t){this.tintFilter.uniforms.alpha=t},n.color.get=function(){return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color)},n.color.set=function(t){PIXI.utils.hex2rgb(t,this.tintFilter.uniforms.color)},Object.defineProperties(i.prototype,n),i}(PIXI.Filter);PIXI.filters.DropShadowFilter=i,t.DropShadowFilter=i,Object.defineProperty(t,"__esModule",{value:!0})});


},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Blade;

//Blade JS constructor

function Blade(texture) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var minDist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
  var liveTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;

  var points = [];
  this.count = count;
  this.minDist = minDist;
  this.texture = texture;
  this.minMotionSpeed = 4000.0;
  this.liveTime = liveTime;
  this.lastMotionSpeed = 0;
  this.targetPosition = new PIXI.Point(0, 0);

  this.body = new PIXI.mesh.Rope(texture, points);

  var lastPosition = null;
  this.Update = function (ticker) {
    var isDirty = false;

    var points = this.body.points;

    for (var i = points.length - 1; i >= 0; i--) {
      if (points[i].lastTime + this.liveTime < ticker.lastTime) {
        points.shift();
        isDirty = true;
      }
    }

    var t = new PIXI.Point(this.targetPosition.x / this.body.scale.x, this.targetPosition.y / this.body.scale.y);

    if (lastPosition == null) lastPosition = t;

    t.lastTime = ticker.lastTime;

    var p = lastPosition;

    var dx = t.x - p.x;
    var dy = t.y - p.y;

    var dist = Math.sqrt(dx * dx + dy * dy);

    this.lastMotionSpeed = dist * 1000 / ticker.elapsedMS;
    if (dist > minDist) {
      if (this.lastMotionSpeed > this.minMotionSpeed) {
        points.push(t);
      }
      if (points.length > this.count) {
        points.shift();
      }

      isDirty = true;
    }

    lastPosition = t;
    if (isDirty) {
      this.body.refresh(true);
      this.body.renderable = points.length > 1;
    }
  };

  this.ReadCallbacks = function (target) {
    var self = this;

    target.mousemove = function (e) {
      self.targetPosition = e.data.global;
    };

    target.mouseover = function (e) {
      //	self.targetPosition =  e.data.global;
      //	console.log("over");
      //  self.MoveAll(e.data.global);
    };

    target.touchmove = function (e) {
      console.log("Touch move");
      //console.log(e.data);
      self.targetPosition = e.data.global;
    };

    target.touchstart = function (e) {
      console.log("Touch start");
      //console.log(e.data);
      //  self.MoveAll(e.data.global);
    };

    target.touchend = function (e) {
      console.log("Touch start");
      // _Blade.MoveAll(e.data.global);
    };
    // а то лапша какая-то
  };
};

//return Blade;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CreateSlicableObject;

var _ME = Matter.Engine,
    _MW = Matter.World,
    _MBs = Matter.Bodies,
    _MB = Matter.Body,
    _MC = Matter.Composite,
    _MEv = Matter.Events,
    _MV = Matter.Vector;

var CreateSubBody = function CreateSubBody(parent, texData) {

  var obj = CreateSlicableObject(parent.position, parent.engine, texData);

  obj.scale.set(0.2, 0.2);
  obj.parentGroup = texData.group;

  _MB.setMass(obj.phBody, parent.phBody.mass * 0.5);
  _MB.setVelocity(obj.phBody, parent.phBody.velocity);
  _MB.setAngle(obj.phBody, parent.phBody.sliceAngle);

  var anchored_dir = _MV.normalise({ x: obj.anchor.x - 0.5, y: 0.5 - obj.anchor.y });
  anchored_dir = _MV.rotate(anchored_dir, parent.phBody.sliceAngle);

  _MB.applyForce(obj.phBody, obj.phBody.position, {
    x: anchored_dir.x * 0.02,
    y: anchored_dir.y * 0.02
  });

  //downPart.phBody.torque = this.phBody.torque * 10;

  parent.parent.addChild(obj);

  return obj;
};

function CreateSlicableObject(pos, engine, data) {

  var obj = null;
  if (data && data.normal) {
    obj = new PIXI.Sprite(data.normal.tex);

    if (data.normal.pivot) {
      obj.anchor.set(data.normal.pivot.x, data.normal.pivot.y);
      //console.log(texSH.pivot);
    }
  } else {

    obj = new PIXI.Graphics();
    obj.beginFill(0x9966f * Math.random());
    obj.drawCircle(0, 0, 50);
    obj.endFill();
  }

  obj.spriteData = data;
  obj.engine = engine;
  obj.x = pos.x;
  obj.y = pos.y;

  obj.onslice = function () {

    for (var i = 0; i < obj.spriteData.parts.length; i++) {
      CreateSubBody(obj, { normal: obj.spriteData.parts[i] });
    }
  };

  obj.kill = function () {
    if (this.phBody.sliced && this.onslice) {
      this.onslice();
    }

    this.destroy({ children: true });
    if (typeof this.phBody !== "undefined") {
      _MC.remove(engine.world, this.phBody);
    }
  };

  var phBody = _MBs.circle(pos.x, pos.y, 50);
  phBody.collisionFilter.mask &= ~phBody.collisionFilter.category;
  _MW.add(engine.world, phBody);

  phBody.piObj = obj;
  obj.phBody = phBody;

  return obj;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SliceLayer;

var _filterDropShadow = require('@pixi/filter-drop-shadow');

var _SlicableObject = require('./SlicableObject');

var _SlicableObject2 = _interopRequireDefault(_SlicableObject);

var _Blade = require('./Blade');

var _Blade2 = _interopRequireDefault(_Blade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// function, who create and instance SlicedLayout
function SliceLayer(app) {
  var _ME = Matter.Engine,
      _MW = Matter.World,
      _MBs = Matter.Bodies,
      _MB = Matter.Body,
      _MC = Matter.Composite,
      _MEv = Matter.Events,
      _MV = Matter.Vector,
      _LRes = app.loader.resources;

  var engine = _ME.create();
  engine.world.scale = 0.0001;
  engine.world.gravity.y = 0.35;

  _ME.run(engine);

  var stage = new PIXI.Container();

  var _lres = app.loader.resources;

  var sliceUpGroup = new PIXI.display.Group(1, false);
  var sliceMiddleGroup = new PIXI.display.Group(0, false);
  var sliceDownGroup = new PIXI.display.Group(-1, false);
  var uiGroup = new PIXI.display.Group(10, false);

  // stage.filters = [new DropShadowFilter()];

  stage.addChild(new PIXI.display.Layer(sliceUpGroup));
  stage.addChild(new PIXI.display.Layer(sliceDownGroup));
  stage.addChild(new PIXI.display.Layer(sliceMiddleGroup));
  stage.addChild(new PIXI.display.Layer(uiGroup));

  //stage.group.enableSort = true;
  stage.interactive = true;

  stage._debugText = new PIXI.Text("Body count: 0", {
    fontFamily: "Arial",
    fontSize: 32,
    fill: 0xff1010,
    stroke: 0x00cc10,
    align: "left"
  });

  stage._debugText.position.set(10, 42);
  // console.log("pre");
  stage.blade = new _Blade2.default(_lres.blade_tex.texture, 30, 10, 100);
  stage.blade.minMovableSpeed = 1000;
  stage.blade.body.parentGroup = sliceMiddleGroup;
  stage.blade.ReadCallbacks(stage);

  stage.addChild(stage.blade.body);
  stage.addChild(stage._debugText);

  var slices = 0;
  // slices via Raycast Testing
  var RayCastTest = function RayCastTest(bodies) {
    if (stage.blade.lastMotionSpeed > stage.blade.minMotionSpeed) {
      var pps = stage.blade.body.points;

      if (pps.length > 1) {
        for (var i = 1; i < Math.min(pps.length, 4); i++) {
          // 4 последних сегмента

          var sp = pps[i - 1];
          var ep = pps[i];

          var collisions = Matter.Query.ray(bodies, sp, ep);
          for (var j = 0; j < collisions.length; j++) {
            if (collisions[j].body.canSlice) {
              var sv = { y: ep.y - sp.y, x: ep.x - sp.x };
              sv = _MV.normalise(sv);

              collisions[j].body.sliceAngle = _MV.angle(sp, ep);
              collisions[j].body.sliceVector = sv;
              //console.log("body slice angle:", collisions[j].body.sliceAngle);
              collisions[j].body.sliced = true;

              slices++;
            }
          }
        }
      }
    }
  };

  var frames = 0;
  var lastShotX = null;

  // update view
  var Update = function Update() {

    //stage.updateStage();
    stage._debugText.text = "Вы дерзко зарезали " + slices.toString() + " кроликoв(ка)(";

    var bodies = _MC.allBodies(engine.world);

    frames++;
    if (frames >= 20 && bodies.length < 5) {
      frames = 0;
      var pos = {
        x: Math.round(Math.randomRange(0, 10)) * Math.floor((app.renderer.width + 200) / 10),
        y: app.renderer.height + 100
      };

      while (lastShotX !== null && Math.abs(lastShotX - pos.x) < 200) {
        pos.x = Math.round(Math.randomRange(0, 10)) * Math.floor((app.renderer.width + 200) / 10);
      }

      lastShotX = pos.x;

      pos.x -= 100; //offset

      /// Вынести это говно куда-нибудь в другое место

      //banny
      var bdata = _LRes.bunny.spritesheet;

      var data = {
        normal: {
          tex: bdata.textures.bunny,
          pivot: bdata.data.frames.bunny.pivot,
          group: sliceDownGroup
        },
        parts: [{
          tex: bdata.textures.bunny_torse,
          pivot: bdata.data.frames.bunny_torse.pivot,
          group: sliceDownGroup
        }, {
          tex: bdata.textures.bunny_head,
          pivot: bdata.data.frames.bunny_head.pivot,
          group: sliceUpGroup
        }]
      };

      var obj = (0, _SlicableObject2.default)(pos, engine, data);

      obj.scale.set(0.2, 0.2);
      obj.phBody.canSlice = true;

      var _ofx = 0.5 - (pos.x + 100) / (app.renderer.width + 200);

      var range = 0.8;
      var imp = {
        x: range * _ofx,
        y: -Math.randomRange(0.4, 0.5)
      };

      _MB.applyForce(obj.phBody, obj.phBody.position, imp);
      obj.phBody.torque = Math.randomRange(-10, 10);

      stage.addChild(obj);
    }

    var ticker = app.ticker;
    stage.blade.Update(ticker);

    //CastTest
    RayCastTest(bodies);

    _ME.update(engine);
    // iterate over bodies and fixtures

    for (var i = bodies.length - 1; i >= 0; i--) {
      var body = bodies[i];

      if (typeof body.piObj !== "undefined") {
        if (body.position.y > app.renderer.height + 100 && body.velocity.y > 0 || body.sliced) {
          body.piObj.kill();
        } else {
          body.piObj.x = body.position.x;
          body.piObj.y = body.position.y;
          body.piObj.rotation = body.angle;
          //console.log(body.angle);
        }
      }
    }
  };

  Math.randomRange = function (min, max) {
    return Math.random() * (max - min) + min;
  };
  //run Update
  app.ticker.add(Update, this);

  //// RETURN
  return stage;
}

//export {SliceLayer };
//module.exports = SliceLayer;
//return SliceLayer;

},{"./Blade":2,"./SlicableObject":3,"@pixi/filter-drop-shadow":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
								value: true
});
exports.default = OGParser;

var Layer = PIXI.display.Layer;
var Group = PIXI.display.Group;
var Stage = PIXI.display.Stage;

function OGParser() {
								return function (resource, next) {
																//fallback 
																if (!resource.data || !(resource.data.type !== undefined && resource.data.type == 'map')) {
																								next();
																								return;
																}

																console.log("Run Tilde OG importer");
																var _data = resource.data;
																var _stage = new PIXI.Container();

																_stage.layerHeight = _data.height;
																_stage.layerWidth = _data.width;

																var _this = this;
																var baseUrl = resource.url.replace(this.baseUrl, "");
																var lastIndexOf = baseUrl.lastIndexOf("/");

																if (lastIndexOf == -1) lastIndexOf = baseUrl.lastIndexOf("\\");

																if (lastIndexOf == -1) {
																								console.log("Can't parse:" + baseUrl);
																								next();
																								return;
																}

																baseUrl = baseUrl.substring(0, lastIndexOf);
																console.log("Dir url:" + baseUrl);

																var loadOptions = {
																								crossOrigin: resource.crossOrigin,
																								loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
																								parentResource: resource
																};

																//Check Tiler Map type
																// if(_data.type !== undefined && _data.type == 'map')
																{

																								if (_data.layers) {
																																for (var i = 0; i < _data.layers.length; i++) {

																																								var _l = _data.layers[i];

																																								var _group = new Group(i, true);
																																								var _layer = new Layer(_group);
																																								_layer.name = _l.name;
																																								_stage[_l.name] = _layer;
																																								_layer.visible = _data.layers[i].visibility;
																																								_layer.position.set(_l.x, _l.y);
																																								_layer.alpha = _l.opacity;

																																								_stage.addChild(_layer);

																																								if (_l.objects) {
																																																for (var j = 0; j < _l.objects.length; j++) {

																																																								var _o = _l.objects[j];
																																																								if (!_o.name || _o.name == "") _o.name = "obj_" + j;

																																																								// image Loader
																																																								if (_data.tilesets && _data.tilesets.length > 0 && _o.gid) {
																																																																var _ts = undefined; //_data.tilesets[0];
																																																																for (var _i = 0; _i < _data.tilesets.length; _i++) {
																																																																								if (_data.tilesets[_i].firstgid <= _o.gid) {
																																																																																_ts = _data.tilesets[_i];
																																																																								}
																																																																}

																																																																if (!_ts) {
																																																																								console.log("Image with gid:" + _o.gid + " not found!");
																																																																								continue;;
																																																																}

																																																																var _realGid = _o.gid - _ts.firstgid;

																																																																var _img = _ts.tiles["" + _realGid];

																																																																var url = baseUrl + "/" + _img.image;
																																																																if (!_img) {

																																																																								console.log("Load res MISSED gid:" + _realGid + " url:" + url);
																																																																								continue;
																																																																}

																																																																//	console.log("ADD Res:" + _realGid + " url:" + url + " name:" + _o.name);

																																																																//this.add("ts:" + _o.name, url, loadOptions, function()
																																																																{

																																																																								//	console.log("Loaded Res:" + _o.gid + " url:" + url);

																																																																								//let tex = resource["ts:"+_o.name];//.texture;
																																																																								//console.log(tex);
																																																																								var spr = new PIXI.Sprite.fromImage(url);
																																																																								spr.name = _o.name;
																																																																								spr.anchor.set(0, 1); // set down to anchor
																																																																								spr.width = _o.width;
																																																																								spr.height = _o.height;
																																																																								spr.rotation = _o.rotation * Math.PI / 180;
																																																																								spr.alpha = _o.opacity;
																																																																								spr.x = _o.x;
																																																																								spr.y = _o.y;
																																																																								spr.parentGroup = _layer.group;

																																																																								_stage.addChild(spr);
																																																																}
																																																																//);
																																																								}

																																																								// TextLoader

																																																								if (_o.text) {

																																																																var _text = new PIXI.Text();
																																																																_text.name = _o.name;
																																																																_text.tag_type = _o.type;

																																																																_text.width = _o.width;
																																																																_text.height = _o.height;
																																																																_text.anchor.set(0, 0);

																																																																_text.rotation = _o.rotation * Math.PI / 180;
																																																																_text.text = _o.text.text;
																																																																_text.alpha = _o.opacity;

																																																																_text.position.set(_o.x, _o.y);

																																																																_text.style = {
																																																																								wordWrap: _o.text.wrap,
																																																																								fill: _o.text.color || 0x000000,
																																																																								align: _o.text.valign || "center",
																																																																								fontSize: _o.text.pixelsize || 24,
																																																																								fontFamily: _o.text.fontfamily || "Arial",
																																																																								fontWeight: _o.text.bold ? "bold" : "normal",
																																																																								fontStyle: _o.text.italic ? "italic" : "normal",
																																																																								stroke: _o.text.strokeColor || _o.text.color,
																																																																								strokeThickness: _o.text.strokeThickness || 0
																																																																};

																																																																_text.parentGroup = _layer.group;
																																																																_stage.addChild(_text);
																																																								}
																																																}
																																								}
																																}
																								}
																}

																resource.stage = _stage;

																// call next loader
																next();
								};
}

},{}],6:[function(require,module,exports){
"use strict";

var _OGParser = require("./OGParser");

var _OGParser2 = _interopRequireDefault(_OGParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

PIXI.loaders.Loader.addPixiMiddleware(_OGParser2.default);
PIXI.loader.use((0, _OGParser2.default)());
// nothing to export

},{"./OGParser":5}],7:[function(require,module,exports){
"use strict";

var _SliceLayer = require("./SliceLayer");

var _SliceLayer2 = _interopRequireDefault(_SliceLayer);

require("./TiledOGLoader/TiledObjGroupLoader.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  _App.loader.add("tiled_map", "./src/maps/test.json").load(function (l, res) {

    _App.stage.addChild(res.tiled_map.stage);
  });
};

// update function, pass Window as scope (this = _App)
var onUpdate = function onUpdate() {
  var dt = _App.ticker.deltaTime;
};

//invoked after loading game resources
var GameLoaded = function GameLoaded() {
  console.log("Game is loaded");

  _SlicedStage = (0, _SliceLayer2.default)(_App); //_LRes.slice_js.function(_App);

  _App.stage.addChild(_SlicedStage);

  _App.LoadStage.destroy();
};

var LoadGame = function LoadGame() {
  var loader = _App.loader;

  loader.add("blade_tex", "./src/images/blade.png").add("bunny", "./src/images/bunny_ss.json").load(function (l, res) {

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

},{"./SliceLayer":4,"./TiledOGLoader/TiledObjGroupLoader.js":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsInNyY1xcc2NyaXB0c1xcQmxhZGUuanMiLCJzcmNcXHNjcmlwdHNcXFNsaWNhYmxlT2JqZWN0LmpzIiwic3JjXFxzY3JpcHRzXFxTbGljZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxPR1BhcnNlci5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcVGlsZWRPYmpHcm91cExvYWRlci5qcyIsInNyY1xcc2NyaXB0c1xcY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O2tCQ053QixLOztBQUZ4Qjs7QUFFZSxTQUFTLEtBQVQsQ0FBZSxPQUFmLEVBQXdCO0FBQ3JDLE1BQUksUUFDRixVQUFVLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0IsVUFBVSxDQUFWLE1BQWlCLFNBQXpDLEdBQXFELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxFQUR0RTtBQUVBLE1BQUksVUFDRixVQUFVLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0IsVUFBVSxDQUFWLE1BQWlCLFNBQXpDLEdBQXFELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxFQUR0RTtBQUVBLE1BQUksV0FDRixVQUFVLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0IsVUFBVSxDQUFWLE1BQWlCLFNBQXpDLEdBQXFELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxFQUR0RTs7QUFHQSxNQUFJLFNBQVMsRUFBYjtBQUNBLE9BQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxPQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsT0FB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QixFQUF5QjtBQUN0QyxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsV0FBdkI7QUFDQSxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsWUFBdkI7O0FBRUEsTUFBSSxLQUFLLEVBQUwsR0FBVSxLQUFLLENBQW5CLEVBQXNCO0FBQ3BCLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsS0FBSyxJQUE3QjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsS0FBSyxDQUFMLEdBQVMsRUFBVCxHQUFjLElBQXZDO0FBQ0QsR0FIRCxNQUdPO0FBQ0wsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixLQUFoQixHQUF3QixLQUFLLEVBQUwsR0FBVSxDQUFWLEdBQWMsSUFBdEM7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLE1BQWhCLEdBQXlCLEtBQUssSUFBOUI7QUFDRDtBQUNGLENBWEQ7O0FBYUEsT0FBTyxRQUFQLEdBQWtCLFFBQWxCO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLElBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IC0gdjIuMy4xXG4gKiBDb21waWxlZCBXZWQsIDI5IE5vdiAyMDE3IDE2OjQ1OjE5IFVUQ1xuICpcbiAqIHBpeGktZmlsdGVycyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUodC5fX2ZpbHRlcl9kcm9wX3NoYWRvdz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSB2ZWMzIGNvbG9yO1xcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBVbi1wcmVtdWx0aXBseSBhbHBoYSBiZWZvcmUgYXBwbHlpbmcgdGhlIGNvbG9yXFxuICAgIGlmIChzYW1wbGUuYSA+IDAuMCkge1xcbiAgICAgICAgc2FtcGxlLnJnYiAvPSBzYW1wbGUuYTtcXG4gICAgfVxcblxcbiAgICAvLyBQcmVtdWx0aXBseSBhbHBoYSBhZ2FpblxcbiAgICBzYW1wbGUucmdiID0gY29sb3IucmdiICogc2FtcGxlLmE7XFxuXFxuICAgIC8vIGFscGhhIHVzZXIgYWxwaGFcXG4gICAgc2FtcGxlICo9IGFscGhhO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBzYW1wbGU7XFxufVwiLGk9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaShpLG4sbyxhLGwpe3ZvaWQgMD09PWkmJihpPTQ1KSx2b2lkIDA9PT1uJiYobj01KSx2b2lkIDA9PT1vJiYobz0yKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1sJiYobD0uNSksdC5jYWxsKHRoaXMpLHRoaXMudGludEZpbHRlcj1uZXcgUElYSS5GaWx0ZXIoZSxyKSx0aGlzLmJsdXJGaWx0ZXI9bmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyLHRoaXMuYmx1ckZpbHRlci5ibHVyPW8sdGhpcy50YXJnZXRUcmFuc2Zvcm09bmV3IFBJWEkuTWF0cml4LHRoaXMucm90YXRpb249aSx0aGlzLnBhZGRpbmc9bix0aGlzLmRpc3RhbmNlPW4sdGhpcy5hbHBoYT1sLHRoaXMuY29sb3I9YX10JiYoaS5fX3Byb3RvX189dCksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciBuPXtkaXN0YW5jZTp7Y29uZmlndXJhYmxlOiEwfSxyb3RhdGlvbjp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9LGFscGhhOntjb25maWd1cmFibGU6ITB9LGNvbG9yOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxlLHIsaSl7dmFyIG49dC5nZXRSZW5kZXJUYXJnZXQoKTtuLnRyYW5zZm9ybT10aGlzLnRhcmdldFRyYW5zZm9ybSx0aGlzLnRpbnRGaWx0ZXIuYXBwbHkodCxlLG4sITApLHRoaXMuYmx1ckZpbHRlci5hcHBseSh0LG4sciksdC5hcHBseUZpbHRlcih0aGlzLGUscixpKSxuLnRyYW5zZm9ybT1udWxsLHQucmV0dXJuUmVuZGVyVGFyZ2V0KG4pfSxpLnByb3RvdHlwZS5fdXBkYXRlUGFkZGluZz1mdW5jdGlvbigpe3RoaXMucGFkZGluZz10aGlzLmRpc3RhbmNlKzIqdGhpcy5ibHVyfSxpLnByb3RvdHlwZS5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy50YXJnZXRUcmFuc2Zvcm0udHg9dGhpcy5kaXN0YW5jZSpNYXRoLmNvcyh0aGlzLmFuZ2xlKSx0aGlzLnRhcmdldFRyYW5zZm9ybS50eT10aGlzLmRpc3RhbmNlKk1hdGguc2luKHRoaXMuYW5nbGUpfSxuLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kaXN0YW5jZX0sbi5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5fZGlzdGFuY2U9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCksdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4ucm90YXRpb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYW5nbGUvUElYSS5ERUdfVE9fUkFEfSxuLnJvdGF0aW9uLnNldD1mdW5jdGlvbih0KXt0aGlzLmFuZ2xlPXQqUElYSS5ERUdfVE9fUkFELHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1ckZpbHRlci5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1ckZpbHRlci5ibHVyPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpfSxuLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGF9LG4uYWxwaGEuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYT10fSxuLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiBQSVhJLnV0aWxzLnJnYjJoZXgodGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sbi5jb2xvci5zZXQ9ZnVuY3Rpb24odCl7UElYSS51dGlscy5oZXgycmdiKHQsdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsbiksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Ecm9wU2hhZG93RmlsdGVyPWksdC5Ecm9wU2hhZG93RmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1kcm9wLXNoYWRvdy5qcy5tYXBcbiIsIlxyXG4vL0JsYWRlIEpTIGNvbnN0cnVjdG9yXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGFkZSh0ZXh0dXJlKSB7XHJcbiAgdmFyIGNvdW50ID1cclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTA7XHJcbiAgdmFyIG1pbkRpc3QgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiA0MDtcclxuICB2YXIgbGl2ZVRpbWUgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAyMDtcclxuXHJcbiAgdmFyIHBvaW50cyA9IFtdO1xyXG4gIHRoaXMuY291bnQgPSBjb3VudDtcclxuICB0aGlzLm1pbkRpc3QgPSBtaW5EaXN0O1xyXG4gIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgdGhpcy5taW5Nb3Rpb25TcGVlZCA9IDQwMDAuMDtcclxuICB0aGlzLmxpdmVUaW1lID0gbGl2ZVRpbWU7XHJcbiAgdGhpcy5sYXN0TW90aW9uU3BlZWQgPSAwO1xyXG4gIHRoaXMudGFyZ2V0UG9zaXRpb24gPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHJcbiAgdGhpcy5ib2R5ID0gbmV3IFBJWEkubWVzaC5Sb3BlKHRleHR1cmUsIHBvaW50cyk7XHJcblxyXG4gIHZhciBsYXN0UG9zaXRpb24gPSBudWxsO1xyXG4gIHRoaXMuVXBkYXRlID0gZnVuY3Rpb24odGlja2VyKSB7XHJcbiAgICB2YXIgaXNEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBwb2ludHMgPSB0aGlzLmJvZHkucG9pbnRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgaWYgKHBvaW50c1tpXS5sYXN0VGltZSArIHRoaXMubGl2ZVRpbWUgPCB0aWNrZXIubGFzdFRpbWUpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBpc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB0ID0gbmV3IFBJWEkuUG9pbnQoXHJcbiAgICAgIHRoaXMudGFyZ2V0UG9zaXRpb24ueCAvIHRoaXMuYm9keS5zY2FsZS54LFxyXG4gICAgICB0aGlzLnRhcmdldFBvc2l0aW9uLnkgLyB0aGlzLmJvZHkuc2NhbGUueVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAobGFzdFBvc2l0aW9uID09IG51bGwpIGxhc3RQb3NpdGlvbiA9IHQ7XHJcblxyXG4gICAgdC5sYXN0VGltZSA9IHRpY2tlci5sYXN0VGltZTtcclxuXHJcbiAgICB2YXIgcCA9IGxhc3RQb3NpdGlvbjtcclxuXHJcbiAgICB2YXIgZHggPSB0LnggLSBwLng7XHJcbiAgICB2YXIgZHkgPSB0LnkgLSBwLnk7XHJcblxyXG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgIHRoaXMubGFzdE1vdGlvblNwZWVkID0gZGlzdCAqIDEwMDAgLyB0aWNrZXIuZWxhcHNlZE1TO1xyXG4gICAgaWYgKGRpc3QgPiBtaW5EaXN0KSB7XHJcbiAgICAgIGlmICh0aGlzLmxhc3RNb3Rpb25TcGVlZCA+IHRoaXMubWluTW90aW9uU3BlZWQpIHtcclxuICAgICAgICBwb2ludHMucHVzaCh0KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IHRoaXMuY291bnQpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaXNEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGFzdFBvc2l0aW9uID0gdDtcclxuICAgIGlmIChpc0RpcnR5KSB7XHJcbiAgICAgIHRoaXMuYm9keS5yZWZyZXNoKHRydWUpO1xyXG4gICAgICB0aGlzLmJvZHkucmVuZGVyYWJsZSA9IHBvaW50cy5sZW5ndGggPiAxO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuUmVhZENhbGxiYWNrcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRhcmdldC5tb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHNlbGYudGFyZ2V0UG9zaXRpb24gPSBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQubW91c2VvdmVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAvL1x0c2VsZi50YXJnZXRQb3NpdGlvbiA9ICBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgICAvL1x0Y29uc29sZS5sb2coXCJvdmVyXCIpO1xyXG4gICAgICAvLyAgc2VsZi5Nb3ZlQWxsKGUuZGF0YS5nbG9iYWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQudG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIG1vdmVcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5kYXRhKTtcclxuICAgICAgc2VsZi50YXJnZXRQb3NpdGlvbiA9IGUuZGF0YS5nbG9iYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaHN0YXJ0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIHN0YXJ0XCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUuZGF0YSk7XHJcbiAgICAgIC8vICBzZWxmLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJUb3VjaCBzdGFydFwiKTtcclxuICAgICAgLy8gX0JsYWRlLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG4gICAgLy8g0LAg0YLQviDQu9Cw0L/RiNCwINC60LDQutCw0Y8t0YLQvlxyXG4gIH07XHJcbn07XHJcblxyXG4vL3JldHVybiBCbGFkZTtcclxuXHJcbiIsIlxyXG52YXIgX01FID0gTWF0dGVyLkVuZ2luZSxcclxuICAgIF9NVyA9IE1hdHRlci5Xb3JsZCxcclxuICAgIF9NQnMgPSBNYXR0ZXIuQm9kaWVzLFxyXG4gICAgX01CID0gTWF0dGVyLkJvZHksXHJcbiAgICBfTUMgPSBNYXR0ZXIuQ29tcG9zaXRlLFxyXG4gICAgX01FdiA9IE1hdHRlci5FdmVudHMsXHJcbiAgICBfTVYgPSBNYXR0ZXIuVmVjdG9yO1xyXG5cclxubGV0IENyZWF0ZVN1YkJvZHkgPSBmdW5jdGlvbihwYXJlbnQsIHRleERhdGEpe1xyXG5cclxuICBsZXQgb2JqID0gQ3JlYXRlU2xpY2FibGVPYmplY3QocGFyZW50LnBvc2l0aW9uLCBwYXJlbnQuZW5naW5lLCB0ZXhEYXRhKTtcclxuICBcclxuICBvYmouc2NhbGUuc2V0KDAuMiwgMC4yKTtcclxuICBvYmoucGFyZW50R3JvdXAgPSB0ZXhEYXRhLmdyb3VwO1xyXG5cclxuICBfTUIuc2V0TWFzcyhvYmoucGhCb2R5LCBwYXJlbnQucGhCb2R5Lm1hc3MgKiAwLjUpO1xyXG4gIF9NQi5zZXRWZWxvY2l0eShvYmoucGhCb2R5LCBwYXJlbnQucGhCb2R5LnZlbG9jaXR5KTtcclxuICBfTUIuc2V0QW5nbGUob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS5zbGljZUFuZ2xlKTtcclxuXHJcbiAgbGV0IGFuY2hvcmVkX2RpciA9IF9NVi5ub3JtYWxpc2Uoe3g6b2JqLmFuY2hvci54IC0gMC41LCB5OiAwLjUgLSBvYmouYW5jaG9yLnkgfSk7XHJcbiAgYW5jaG9yZWRfZGlyID0gX01WLnJvdGF0ZShhbmNob3JlZF9kaXIsIHBhcmVudC5waEJvZHkuc2xpY2VBbmdsZSk7XHJcblxyXG4gIF9NQi5hcHBseUZvcmNlKG9iai5waEJvZHksIG9iai5waEJvZHkucG9zaXRpb24sIHtcclxuICAgIHg6ICBhbmNob3JlZF9kaXIueCAqIDAuMDIsXHJcbiAgICB5OiAgYW5jaG9yZWRfZGlyLnkgKiAwLjAyXHJcbiAgfSk7XHJcblxyXG4gIC8vZG93blBhcnQucGhCb2R5LnRvcnF1ZSA9IHRoaXMucGhCb2R5LnRvcnF1ZSAqIDEwO1xyXG5cclxuICBwYXJlbnQucGFyZW50LmFkZENoaWxkKG9iaik7XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENyZWF0ZVNsaWNhYmxlT2JqZWN0KHBvcywgZW5naW5lLCBkYXRhKSB7XHJcbiAgXHJcbiAgdmFyIG9iaiA9IG51bGw7XHJcbiAgaWYgKGRhdGEgJiYgZGF0YS5ub3JtYWwpIHtcclxuICAgIG9iaiA9IG5ldyBQSVhJLlNwcml0ZShkYXRhLm5vcm1hbC50ZXgpO1xyXG5cclxuICAgIGlmIChkYXRhLm5vcm1hbC5waXZvdCkge1xyXG4gICAgICBvYmouYW5jaG9yLnNldChkYXRhLm5vcm1hbC5waXZvdC54LCBkYXRhLm5vcm1hbC5waXZvdC55KTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh0ZXhTSC5waXZvdCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICBcclxuICAgIG9iaiA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcbiAgICBvYmouYmVnaW5GaWxsKDB4OTk2NmYgKiBNYXRoLnJhbmRvbSgpKTtcclxuICAgIG9iai5kcmF3Q2lyY2xlKDAsIDAsIDUwKTtcclxuICAgIG9iai5lbmRGaWxsKCk7XHJcbiAgXHJcbiAgfVxyXG5cclxuICBvYmouc3ByaXRlRGF0YSA9IGRhdGE7XHJcbiAgb2JqLmVuZ2luZSA9IGVuZ2luZTtcclxuICBvYmoueCA9IHBvcy54O1xyXG4gIG9iai55ID0gcG9zLnk7XHJcblxyXG4gIG9iai5vbnNsaWNlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IG9iai5zcHJpdGVEYXRhLnBhcnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgQ3JlYXRlU3ViQm9keShvYmosIHtub3JtYWw6IG9iai5zcHJpdGVEYXRhLnBhcnRzW2ldfSk7XHJcbiAgICB9XHJcblxyXG4gIH07XHJcblxyXG4gIG9iai5raWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5waEJvZHkuc2xpY2VkICYmIHRoaXMub25zbGljZSkge1xyXG4gICAgICB0aGlzLm9uc2xpY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3koeyBjaGlsZHJlbjogdHJ1ZSB9KTtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5waEJvZHkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgX01DLnJlbW92ZShlbmdpbmUud29ybGQsIHRoaXMucGhCb2R5KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgcGhCb2R5ID0gX01Ccy5jaXJjbGUocG9zLngsIHBvcy55LCA1MCk7XHJcbiAgcGhCb2R5LmNvbGxpc2lvbkZpbHRlci5tYXNrICY9IH5waEJvZHkuY29sbGlzaW9uRmlsdGVyLmNhdGVnb3J5O1xyXG4gIF9NVy5hZGQoZW5naW5lLndvcmxkLCBwaEJvZHkpO1xyXG5cclxuICBwaEJvZHkucGlPYmogPSBvYmo7XHJcbiAgb2JqLnBoQm9keSA9IHBoQm9keTtcclxuXHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG4iLCJpbXBvcnQge0Ryb3BTaGFkb3dGaWx0ZXJ9IGZyb20gJ0BwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdydcclxuaW1wb3J0IENyZWF0ZVNsaWNhYmxlT2JqZWN0IGZyb20gJy4vU2xpY2FibGVPYmplY3QnXHJcbmltcG9ydCBCbGFkZSBmcm9tICcuL0JsYWRlJ1xyXG5cclxuLy8gZnVuY3Rpb24sIHdobyBjcmVhdGUgYW5kIGluc3RhbmNlIFNsaWNlZExheW91dFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTbGljZUxheWVyIChhcHApIHtcclxuICB2YXIgX01FID0gTWF0dGVyLkVuZ2luZSxcclxuICAgIF9NVyA9IE1hdHRlci5Xb3JsZCxcclxuICAgIF9NQnMgPSBNYXR0ZXIuQm9kaWVzLFxyXG4gICAgX01CID0gTWF0dGVyLkJvZHksXHJcbiAgICBfTUMgPSBNYXR0ZXIuQ29tcG9zaXRlLFxyXG4gICAgX01FdiA9IE1hdHRlci5FdmVudHMsXHJcbiAgICBfTVYgPSBNYXR0ZXIuVmVjdG9yLFxyXG4gICAgX0xSZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIGVuZ2luZSA9IF9NRS5jcmVhdGUoKTtcclxuICBlbmdpbmUud29ybGQuc2NhbGUgPSAwLjAwMDE7XHJcbiAgZW5naW5lLndvcmxkLmdyYXZpdHkueSA9IDAuMzU7XHJcblxyXG4gIF9NRS5ydW4oZW5naW5lKTtcclxuXHJcblxyXG5cclxuICB2YXIgc3RhZ2UgPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuXHJcbiAgdmFyIF9scmVzID0gYXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcblxyXG4gIHZhciBzbGljZVVwR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDEsIGZhbHNlKTtcclxuICB2YXIgc2xpY2VNaWRkbGVHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMCwgZmFsc2UpO1xyXG4gIHZhciBzbGljZURvd25Hcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoLTEsIGZhbHNlKTtcclxuICB2YXIgdWlHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMTAsIGZhbHNlKTtcclxuICBcclxuIC8vIHN0YWdlLmZpbHRlcnMgPSBbbmV3IERyb3BTaGFkb3dGaWx0ZXIoKV07XHJcblxyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VVcEdyb3VwKSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzbGljZURvd25Hcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VNaWRkbGVHcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIodWlHcm91cCkpO1xyXG5cclxuICAvL3N0YWdlLmdyb3VwLmVuYWJsZVNvcnQgPSB0cnVlO1xyXG4gIHN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgc3RhZ2UuX2RlYnVnVGV4dCA9IG5ldyBQSVhJLlRleHQoXCJCb2R5IGNvdW50OiAwXCIsIHtcclxuICAgIGZvbnRGYW1pbHk6IFwiQXJpYWxcIixcclxuICAgIGZvbnRTaXplOiAzMixcclxuICAgIGZpbGw6IDB4ZmYxMDEwLFxyXG4gICAgc3Ryb2tlOiAweDAwY2MxMCxcclxuICAgIGFsaWduOiBcImxlZnRcIlxyXG4gIH0pO1xyXG5cclxuICBzdGFnZS5fZGVidWdUZXh0LnBvc2l0aW9uLnNldCgxMCwgNDIpO1xyXG4gLy8gY29uc29sZS5sb2coXCJwcmVcIik7XHJcbiAgc3RhZ2UuYmxhZGUgPSBuZXcgQmxhZGUoXHJcbiAgICBfbHJlcy5ibGFkZV90ZXgudGV4dHVyZSxcclxuICAgIDMwLFxyXG4gICAgMTAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHN0YWdlLmJsYWRlLm1pbk1vdmFibGVTcGVlZCA9IDEwMDA7XHJcbiAgc3RhZ2UuYmxhZGUuYm9keS5wYXJlbnRHcm91cCA9IHNsaWNlTWlkZGxlR3JvdXA7XHJcbiAgc3RhZ2UuYmxhZGUuUmVhZENhbGxiYWNrcyhzdGFnZSk7XHJcblxyXG4gIHN0YWdlLmFkZENoaWxkKHN0YWdlLmJsYWRlLmJvZHkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKHN0YWdlLl9kZWJ1Z1RleHQpO1xyXG5cclxuICB2YXIgc2xpY2VzID0gMDtcclxuICAvLyBzbGljZXMgdmlhIFJheWNhc3QgVGVzdGluZ1xyXG4gIHZhciBSYXlDYXN0VGVzdCA9IGZ1bmN0aW9uIFJheUNhc3RUZXN0KGJvZGllcykge1xyXG4gICAgaWYgKHN0YWdlLmJsYWRlLmxhc3RNb3Rpb25TcGVlZCA+IHN0YWdlLmJsYWRlLm1pbk1vdGlvblNwZWVkKSB7XHJcbiAgICAgIHZhciBwcHMgPSBzdGFnZS5ibGFkZS5ib2R5LnBvaW50cztcclxuXHJcbiAgICAgIGlmIChwcHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgTWF0aC5taW4ocHBzLmxlbmd0aCwgNCk7IGkrKykge1xyXG4gICAgICAgICAgLy8gNCDQv9C+0YHQu9C10LTQvdC40YUg0YHQtdCz0LzQtdC90YLQsFxyXG5cclxuICAgICAgICAgIHZhciBzcCA9IHBwc1tpIC0gMV07XHJcbiAgICAgICAgICB2YXIgZXAgPSBwcHNbaV07XHJcblxyXG4gICAgICAgICAgdmFyIGNvbGxpc2lvbnMgPSBNYXR0ZXIuUXVlcnkucmF5KGJvZGllcywgc3AsIGVwKTtcclxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sbGlzaW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoY29sbGlzaW9uc1tqXS5ib2R5LmNhblNsaWNlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHN2ID0geyB5OiBlcC55IC0gc3AueSwgeDogZXAueCAtIHNwLnggfTtcclxuICAgICAgICAgICAgICBzdiA9IF9NVi5ub3JtYWxpc2Uoc3YpO1xyXG5cclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VBbmdsZSA9IF9NVi5hbmdsZShzcCwgZXApO1xyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZVZlY3RvciA9IHN2O1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJib2R5IHNsaWNlIGFuZ2xlOlwiLCBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VBbmdsZSk7XHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgIHNsaWNlcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIGZyYW1lcyA9IDA7XHJcbiAgdmFyIGxhc3RTaG90WCA9IG51bGw7XHJcblxyXG4gIC8vIHVwZGF0ZSB2aWV3XHJcbiAgdmFyIFVwZGF0ZSA9IGZ1bmN0aW9uIFVwZGF0ZSgpIHtcclxuXHJcbiAgXHQvL3N0YWdlLnVwZGF0ZVN0YWdlKCk7XHJcbiAgICBzdGFnZS5fZGVidWdUZXh0LnRleHQgPVxyXG4gICAgICBcItCS0Ysg0LTQtdGA0LfQutC+INC30LDRgNC10LfQsNC70LggXCIgKyBzbGljZXMudG9TdHJpbmcoKSArIFwiINC60YDQvtC70LjQum/QsijQutCwKShcIjtcclxuXHJcbiAgICB2YXIgYm9kaWVzID0gX01DLmFsbEJvZGllcyhlbmdpbmUud29ybGQpO1xyXG5cclxuICAgIGZyYW1lcysrO1xyXG4gICAgaWYgKGZyYW1lcyA+PSAyMCAmJiBib2RpZXMubGVuZ3RoIDwgNSkge1xyXG4gICAgICBmcmFtZXMgPSAwO1xyXG4gICAgICB2YXIgcG9zID0ge1xyXG4gICAgICAgIHg6XHJcbiAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tUmFuZ2UoMCwgMTApKSAqXHJcbiAgICAgICAgICBNYXRoLmZsb29yKChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApIC8gMTApLFxyXG4gICAgICAgIHk6IGFwcC5yZW5kZXJlci5oZWlnaHQgKyAxMDBcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHdoaWxlIChsYXN0U2hvdFggIT09IG51bGwgJiYgTWF0aC5hYnMobGFzdFNob3RYIC0gcG9zLngpIDwgMjAwKSB7XHJcbiAgICAgICAgcG9zLnggPVxyXG4gICAgICAgICAgTWF0aC5yb3VuZChNYXRoLnJhbmRvbVJhbmdlKDAsIDEwKSkgKlxyXG4gICAgICAgICAgTWF0aC5mbG9vcigoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKSAvIDEwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGFzdFNob3RYID0gcG9zLng7XHJcblxyXG4gICAgICBwb3MueCAtPSAxMDA7IC8vb2Zmc2V0XHJcblxyXG4gICAgICAvLy8g0JLRi9C90LXRgdGC0Lgg0Y3RgtC+INCz0L7QstC90L4g0LrRg9C00LAt0L3QuNCx0YPQtNGMINCyINC00YDRg9Cz0L7QtSDQvNC10YHRgtC+XHJcblxyXG4gICAgICAvL2Jhbm55XHJcblx0ICAgIGxldCBiZGF0YSA9IF9MUmVzLmJ1bm55LnNwcml0ZXNoZWV0O1xyXG5cclxuXHRcdGxldCBkYXRhID0ge1xyXG5cdCAgICAgIFx0bm9ybWFsOiB7XHJcblx0ICAgICBcdCAgIHRleDogYmRhdGEudGV4dHVyZXMuYnVubnksXHJcblx0ICAgICBcdCAgIHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueS5waXZvdCxcclxuXHQgICAgIFx0ICAgZ3JvdXA6c2xpY2VEb3duR3JvdXBcclxuXHQgICAgICBcdH0sXHJcblx0ICAgICAgXHRwYXJ0czpbXHJcblx0XHQgICAgICBcdHtcclxuXHRcdCAgICAgICAgICB0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55X3RvcnNlLFxyXG5cdFx0ICAgICAgICAgIHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueV90b3JzZS5waXZvdCxcclxuXHRcdCAgICAgICAgICBncm91cDogc2xpY2VEb3duR3JvdXBcclxuXHRcdCAgICAgICAgfSxcclxuXHRcdCAgICAgICAge1xyXG5cdFx0ICAgICAgICBcdHRleDogYmRhdGEudGV4dHVyZXMuYnVubnlfaGVhZCxcclxuXHRcdCAgICAgICAgXHRwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnlfaGVhZC5waXZvdCxcclxuXHRcdCAgICAgICAgXHRncm91cDogc2xpY2VVcEdyb3VwXHJcblx0ICAgICAgICBcdH1cclxuXHQgICAgICAgIF1cclxuXHQgICAgfTtcclxuXHJcbiAgICAgIHZhciBvYmogPSBDcmVhdGVTbGljYWJsZU9iamVjdChwb3MsIGVuZ2luZSwgZGF0YSk7XHJcblxyXG4gICAgICBvYmouc2NhbGUuc2V0KDAuMiwgMC4yKTtcclxuICAgICAgb2JqLnBoQm9keS5jYW5TbGljZSA9IHRydWU7XHJcblxyXG4gICAgICB2YXIgX29meCA9IDAuNSAtIChwb3MueCArIDEwMCkgLyAoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKTtcclxuXHJcbiAgICAgIHZhciByYW5nZSA9IDAuODtcclxuICAgICAgdmFyIGltcCA9IHtcclxuICAgICAgICB4OiByYW5nZSAqIF9vZngsXHJcbiAgICAgICAgeTogLU1hdGgucmFuZG9tUmFuZ2UoMC40LCAwLjUpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBfTUIuYXBwbHlGb3JjZShvYmoucGhCb2R5LCBvYmoucGhCb2R5LnBvc2l0aW9uLCBpbXApO1xyXG4gICAgICBvYmoucGhCb2R5LnRvcnF1ZSA9IE1hdGgucmFuZG9tUmFuZ2UoLTEwLCAxMCk7XHJcblxyXG4gICAgICBzdGFnZS5hZGRDaGlsZChvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0aWNrZXIgPSBhcHAudGlja2VyO1xyXG4gICAgc3RhZ2UuYmxhZGUuVXBkYXRlKHRpY2tlcik7XHJcblxyXG4gICAgLy9DYXN0VGVzdFxyXG4gICAgUmF5Q2FzdFRlc3QoYm9kaWVzKTtcclxuXHJcbiAgICBfTUUudXBkYXRlKGVuZ2luZSk7XHJcbiAgICAvLyBpdGVyYXRlIG92ZXIgYm9kaWVzIGFuZCBmaXh0dXJlc1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBib2RpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgdmFyIGJvZHkgPSBib2RpZXNbaV07XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGJvZHkucGlPYmogIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAoYm9keS5wb3NpdGlvbi55ID4gYXBwLnJlbmRlcmVyLmhlaWdodCArIDEwMCAmJlxyXG4gICAgICAgICAgICBib2R5LnZlbG9jaXR5LnkgPiAwKSB8fFxyXG4gICAgICAgICAgYm9keS5zbGljZWRcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGJvZHkucGlPYmoua2lsbCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnggPSBib2R5LnBvc2l0aW9uLng7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnkgPSBib2R5LnBvc2l0aW9uLnk7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnJvdGF0aW9uID0gYm9keS5hbmdsZTtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coYm9keS5hbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgTWF0aC5yYW5kb21SYW5nZSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG4gIH07XHJcbiAgLy9ydW4gVXBkYXRlXHJcbiAgYXBwLnRpY2tlci5hZGQoVXBkYXRlLCB0aGlzKTtcclxuXHJcbiAgLy8vLyBSRVRVUk5cclxuICByZXR1cm4gc3RhZ2U7XHJcbn1cclxuXHJcbi8vZXhwb3J0IHtTbGljZUxheWVyIH07XHJcbi8vbW9kdWxlLmV4cG9ydHMgPSBTbGljZUxheWVyO1xyXG4vL3JldHVybiBTbGljZUxheWVyO1xyXG4iLCJcclxubGV0IExheWVyID0gUElYSS5kaXNwbGF5LkxheWVyO1xyXG5sZXQgR3JvdXAgPSBQSVhJLmRpc3BsYXkuR3JvdXA7XHJcbmxldCBTdGFnZSA9IFBJWEkuZGlzcGxheS5TdGFnZTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE9HUGFyc2VyKCl7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIChyZXNvdXJjZSwgbmV4dCkge1xyXG5cdFx0Ly9mYWxsYmFjayBcclxuXHRcdCBpZiAoIXJlc291cmNlLmRhdGEgfHwgIShyZXNvdXJjZS5kYXRhLnR5cGUgIT09IHVuZGVmaW5lZCAmJiByZXNvdXJjZS5kYXRhLnR5cGUgPT0gJ21hcCcpKSB7XHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW4gVGlsZGUgT0cgaW1wb3J0ZXJcIik7XHJcbiAgICAgICAgbGV0IF9kYXRhID0gcmVzb3VyY2UuZGF0YTsgXHJcbiAgICAgICAgbGV0IF9zdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cclxuICAgICAgICBfc3RhZ2UubGF5ZXJIZWlnaHQgPSBfZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgX3N0YWdlLmxheWVyV2lkdGggPSBfZGF0YS53aWR0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGxldCBiYXNlVXJsID0gcmVzb3VyY2UudXJsLnJlcGxhY2UodGhpcy5iYXNlVXJsLFwiXCIpO1xyXG4gICAgICAgIGxldCBsYXN0SW5kZXhPZiA9IGJhc2VVcmwubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGxhc3RJbmRleE9mID09IC0xKVxyXG4gICAgICAgIFx0bGFzdEluZGV4T2YgPSBiYXNlVXJsLmxhc3RJbmRleE9mKFwiXFxcXFwiKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihsYXN0SW5kZXhPZiA9PSAtMSApXHJcbiAgICBcdHtcclxuICAgIFx0XHRjb25zb2xlLmxvZyhcIkNhbid0IHBhcnNlOlwiICsgYmFzZVVybCk7XHJcbiAgICBcdFx0bmV4dCgpO1xyXG4gICAgXHRcdHJldHVybjtcclxuICAgIFx0fVxyXG5cclxuICAgICAgICBiYXNlVXJsID0gYmFzZVVybC5zdWJzdHJpbmcoMCwgbGFzdEluZGV4T2YpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlyIHVybDpcIiArIGJhc2VVcmwpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBsZXQgbG9hZE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNyb3NzT3JpZ2luOiByZXNvdXJjZS5jcm9zc09yaWdpbixcclxuICAgICAgICAgICAgbG9hZFR5cGU6IFBJWEkubG9hZGVycy5SZXNvdXJjZS5MT0FEX1RZUEUuSU1BR0UsXHJcbiAgICAgICAgICAgIHBhcmVudFJlc291cmNlOiByZXNvdXJjZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgVGlsZXIgTWFwIHR5cGVcclxuICAgICAgIC8vIGlmKF9kYXRhLnR5cGUgIT09IHVuZGVmaW5lZCAmJiBfZGF0YS50eXBlID09ICdtYXAnKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgXHRpZihfZGF0YS5sYXllcnMpIFxyXG4gICAgICAgIFx0e1xyXG4gICAgICAgIFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgX2RhdGEubGF5ZXJzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHJcbiAgICAgICAgXHRcdFx0bGV0IF9sID0gX2RhdGEubGF5ZXJzW2ldO1xyXG4gICAgICAgIFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdGxldCBfZ3JvdXAgPSBuZXcgR3JvdXAoaSwgdHJ1ZSk7XHJcbiAgICAgICAgXHRcdFx0bGV0IF9sYXllciA9IG5ldyBMYXllcihfZ3JvdXApO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci5uYW1lID0gX2wubmFtZTtcclxuICAgICAgICBcdFx0XHRfc3RhZ2VbX2wubmFtZV0gPSBfbGF5ZXI7XHJcbiAgICAgICAgXHRcdFx0X2xheWVyLnZpc2libGUgPSBfZGF0YS5sYXllcnNbaV0udmlzaWJpbGl0eTtcclxuICAgICAgICBcdFx0XHRfbGF5ZXIucG9zaXRpb24uc2V0KF9sLngsIF9sLnkpO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci5hbHBoYSA9IF9sLm9wYWNpdHk7XHJcblxyXG4gICAgICAgIFx0XHRcdF9zdGFnZS5hZGRDaGlsZChfbGF5ZXIpO1xyXG5cclxuICAgICAgICBcdFx0XHRpZihfbC5vYmplY3RzKSBcclxuICAgICAgICBcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IF9sLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgXHRcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX28gPSBfbC5vYmplY3RzW2pdO1xyXG4gICAgICAgIFx0XHRcdFx0XHRpZighX28ubmFtZSB8fCBfby5uYW1lID09IFwiXCIpXHJcbiAgICAgICAgXHRcdFx0XHRcdFx0X28ubmFtZSA9IFwib2JqX1wiICsgajtcclxuXHJcbiAgICAgICAgXHRcdFx0XHRcdC8vIGltYWdlIExvYWRlclxyXG5cdFx0XHRcdFx0XHRcdGlmKF9kYXRhLnRpbGVzZXRzICYmIF9kYXRhLnRpbGVzZXRzLmxlbmd0aCA+IDAgJiYgX28uZ2lkKVxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBfdHMgPSB1bmRlZmluZWQ7IC8vX2RhdGEudGlsZXNldHNbMF07XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgX2RhdGEudGlsZXNldHMubGVuZ3RoOyBpICsrKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYoX2RhdGEudGlsZXNldHNbaV0uZmlyc3RnaWQgPD0gX28uZ2lkKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRfdHMgPSBfZGF0YS50aWxlc2V0c1tpXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFfdHMpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkltYWdlIHdpdGggZ2lkOlwiICsgX28uZ2lkICsgXCIgbm90IGZvdW5kIVwiKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y29udGludWU7O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGxldCBfcmVhbEdpZCA9IF9vLmdpZCAtIF90cy5maXJzdGdpZDtcclxuXHJcblx0XHRcdFx0XHQgICAgICAgIFx0bGV0IF9pbWcgPSBfdHMudGlsZXNbXCJcIiArIF9yZWFsR2lkXTtcclxuXHRcdFx0XHRcdCAgICAgICAgXHRcclxuXHRcdFx0XHRcdCAgICAgICAgXHRsZXQgdXJsID0gIGJhc2VVcmwgKyBcIi9cIiArIF9pbWcuaW1hZ2U7XHJcblx0XHRcdFx0XHQgICAgICAgIFx0aWYoIV9pbWcpe1xyXG5cclxuXHRcdFx0XHRcdCAgICAgICAgXHRcdGNvbnNvbGUubG9nKFwiTG9hZCByZXMgTUlTU0VEIGdpZDpcIiArIF9yZWFsR2lkICsgXCIgdXJsOlwiICsgdXJsKTtcclxuXHRcdFx0XHRcdCAgICAgICAgXHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0ICAgICAgICBcdH1cclxuXHJcblx0XHRcdFx0XHQgICAgICAgIC8vXHRjb25zb2xlLmxvZyhcIkFERCBSZXM6XCIgKyBfcmVhbEdpZCArIFwiIHVybDpcIiArIHVybCArIFwiIG5hbWU6XCIgKyBfby5uYW1lKTtcclxuXHJcblx0XHRcdFx0XHQgICAgICAgIFx0Ly90aGlzLmFkZChcInRzOlwiICsgX28ubmFtZSwgdXJsLCBsb2FkT3B0aW9ucywgZnVuY3Rpb24oKVxyXG5cdFx0XHRcdFx0ICAgICAgICBcdHtcclxuXHJcblx0XHRcdFx0XHQgICAgICAgIFx0Ly9cdGNvbnNvbGUubG9nKFwiTG9hZGVkIFJlczpcIiArIF9vLmdpZCArIFwiIHVybDpcIiArIHVybCk7XHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHRcclxuXHRcdFx0XHRcdCAgICAgICAgXHRcdC8vbGV0IHRleCA9IHJlc291cmNlW1widHM6XCIrX28ubmFtZV07Ly8udGV4dHVyZTtcclxuXHRcdFx0XHRcdCAgICAgICAgXHRcdC8vY29uc29sZS5sb2codGV4KTtcclxuXHRcdFx0XHRcdCAgICAgICAgXHRcdGxldCBzcHIgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKHVybCk7XHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHRzcHIubmFtZSA9IF9vLm5hbWU7XHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHRzcHIuYW5jaG9yLnNldCgwLCAxKTsgLy8gc2V0IGRvd24gdG8gYW5jaG9yXHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHRzcHIud2lkdGggPSBfby53aWR0aDtcclxuXHRcdFx0XHRcdCAgICAgICAgXHRcdHNwci5oZWlnaHQgPSBfby5oZWlnaHQ7XHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHRzcHIucm90YXRpb24gPSBfby5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHRzcHIuYWxwaGEgPSBfby5vcGFjaXR5O1xyXG5cdFx0XHRcdFx0ICAgICAgICBcdFx0c3ByLnggPSBfby54O1xyXG5cdFx0XHRcdFx0ICAgICAgICBcdFx0c3ByLnkgPSBfby55O1xyXG5cdFx0XHRcdFx0ICAgICAgICBcdFx0c3ByLnBhcmVudEdyb3VwID0gX2xheWVyLmdyb3VwO1xyXG5cclxuXHRcdFx0XHRcdCAgICAgICAgXHRcdF9zdGFnZS5hZGRDaGlsZChzcHIpO1xyXG5cdFx0XHRcdFx0ICAgICAgICBcdH1cclxuXHRcdFx0XHRcdCAgICAgICAgXHQvLyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gVGV4dExvYWRlclxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZihfby50ZXh0KSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IF90ZXh0ID0gbmV3IFBJWEkuVGV4dCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0X3RleHQubmFtZSA9IF9vLm5hbWU7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGV4dC50YWdfdHlwZSA9IF9vLnR5cGU7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0X3RleHQud2lkdGggPSBfby53aWR0aDtcclxuXHRcdFx0XHRcdFx0XHRcdF90ZXh0LmhlaWdodCA9IF9vLmhlaWdodDtcclxuXHRcdFx0XHRcdFx0XHRcdF90ZXh0LmFuY2hvci5zZXQoMCwwKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRfdGV4dC5yb3RhdGlvbiA9IF9vLnJvdGF0aW9uICogTWF0aC5QSSAvIDE4MDtcclxuXHRcdFx0XHRcdFx0XHRcdF90ZXh0LnRleHQgPSBfby50ZXh0LnRleHQ7XHJcblx0XHRcdFx0XHRcdFx0XHRfdGV4dC5hbHBoYSA9IF9vLm9wYWNpdHlcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRfdGV4dC5wb3NpdGlvbi5zZXQoX28ueCwgX28ueSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0X3RleHQuc3R5bGUgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHdvcmRXcmFwOiBfby50ZXh0LndyYXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZpbGw6IF9vLnRleHQuY29sb3IgfHwgMHgwMDAwMDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGFsaWduOiBfby50ZXh0LnZhbGlnbiB8fCBcImNlbnRlclwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb250U2l6ZTogX28udGV4dC5waXhlbHNpemUgfHwgMjQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvbnRGYW1pbHk6IF9vLnRleHQuZm9udGZhbWlseSB8fCBcIkFyaWFsXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZvbnRXZWlnaHQ6IF9vLnRleHQuYm9sZCA/IFwiYm9sZFwiOiBcIm5vcm1hbFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb250U3R5bGU6IF9vLnRleHQuaXRhbGljID8gXCJpdGFsaWNcIiA6IFwibm9ybWFsXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHN0cm9rZTogX28udGV4dC5zdHJva2VDb2xvciB8fCBfby50ZXh0LmNvbG9yLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHJva2VUaGlja25lc3M6IF9vLnRleHQuc3Ryb2tlVGhpY2tuZXNzIHx8IDBcclxuIFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuIFx0XHRcdFx0XHRcdFx0XHRfdGV4dC5wYXJlbnRHcm91cCA9IF9sYXllci5ncm91cDtcclxuIFx0XHRcdFx0XHRcdFx0XHRfc3RhZ2UuYWRkQ2hpbGQoX3RleHQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0XHR9XHJcbiAgICAgICAgXHRcdFx0fVxyXG4gICAgICAgIFx0XHR9XHJcbiAgICAgICAgXHR9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb3VyY2Uuc3RhZ2UgPSBfc3RhZ2U7XHJcblxyXG5cdFx0Ly8gY2FsbCBuZXh0IGxvYWRlclxyXG5cdFx0bmV4dCgpO1xyXG5cclxuXHR9O1xyXG59XHJcbiIsImltcG9ydCBPR1BhcnNlciBmcm9tIFwiLi9PR1BhcnNlclwiXHJcblxyXG5QSVhJLmxvYWRlcnMuTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKE9HUGFyc2VyKTtcclxuUElYSS5sb2FkZXIudXNlKE9HUGFyc2VyKCkpO1xyXG4vLyBub3RoaW5nIHRvIGV4cG9ydFxyXG4iLCJpbXBvcnQgX1NsaWNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL1NsaWNlTGF5ZXJcIlxyXG5pbXBvcnQgXCIuL1RpbGVkT0dMb2FkZXIvVGlsZWRPYmpHcm91cExvYWRlci5qc1wiXHJcblxyXG52YXIgX0FwcCA9IG51bGwsXHJcbiAgX0xSZXMgPSBudWxsLFxyXG4gIF9SZW5kZXJlciA9IG51bGwsXHJcbiAgX0ludE1hbmFnZXIgPSBudWxsLFxyXG4gIF9TbGljZWRTdGFnZSA9IG51bGw7XHJcblxyXG52YXIgSW5pdCA9IGZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgX0FwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHtcclxuICAgIHdpZHRoOiAxMjgwLFxyXG4gICAgaGVpZ2h0OiA3MjAsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IDB4ZmZmZmZmXHJcbiAgfSk7XHJcblxyXG4gIC8v0KLQsNC6INC90LDQtNC+LCDRgdGC0LDQvdC00LDRgNGC0L3Ri9C1INC90LUg0LHRg9C00YPRgiDQvtGC0L7QsdGA0LDQttCw0YLRgdGPXHJcbiAgX0FwcC5zdGFnZSA9IG5ldyBQSVhJLmRpc3BsYXkuU3RhZ2UoKTtcclxuXHJcbiAgX0xSZXMgPSBfQXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcbiAgd2luZG93Ll9MUmVzID0gX0xSZXM7XHJcblxyXG4gIF9JbnRNYW5hZ2VyID0gX0FwcC5yZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9BcHAudmlldyk7XHJcbiAgb25SZXNpemUoKTtcclxuICB3aW5kb3cub25yZXNpemUgPSBvblJlc2l6ZTtcclxuXHJcbiAgX0FwcC50aWNrZXIuYWRkKG9uVXBkYXRlLCB0aGlzKTtcclxuXHJcbiAgX0FwcC5zdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIF9BcHAubG9hZGVyXHJcbiAgICAgICAgLmFkZChcInRpbGVkX21hcFwiLCBcIi4vc3JjL21hcHMvdGVzdC5qc29uXCIpXHJcbiAgICAgICAgLmxvYWQoKGwsIHJlcykgPT4ge1xyXG5cclxuICAgICAgICAgICAgX0FwcC5zdGFnZS5hZGRDaGlsZChyZXMudGlsZWRfbWFwLnN0YWdlKTtcclxuICAgICAgICB9KTtcclxuICBcclxufTtcclxuXHJcbi8vIHVwZGF0ZSBmdW5jdGlvbiwgcGFzcyBXaW5kb3cgYXMgc2NvcGUgKHRoaXMgPSBfQXBwKVxyXG52YXIgb25VcGRhdGUgPSBmdW5jdGlvbiBvblVwZGF0ZSgpIHtcclxuICB2YXIgZHQgPSBfQXBwLnRpY2tlci5kZWx0YVRpbWU7XHJcbn07XHJcblxyXG4vL2ludm9rZWQgYWZ0ZXIgbG9hZGluZyBnYW1lIHJlc291cmNlc1xyXG52YXIgR2FtZUxvYWRlZCA9IGZ1bmN0aW9uIEdhbWVMb2FkZWQoKSB7XHJcbiAgY29uc29sZS5sb2coXCJHYW1lIGlzIGxvYWRlZFwiKTtcclxuXHJcbiAgX1NsaWNlZFN0YWdlID0gIF9TbGljZVN0YWdlQ3JlYXRlcihfQXBwKTsgLy9fTFJlcy5zbGljZV9qcy5mdW5jdGlvbihfQXBwKTtcclxuXHJcbiAgX0FwcC5zdGFnZS5hZGRDaGlsZChfU2xpY2VkU3RhZ2UpO1xyXG5cclxuICBfQXBwLkxvYWRTdGFnZS5kZXN0cm95KCk7XHJcbn07XHJcblxyXG52YXIgTG9hZEdhbWUgPSBmdW5jdGlvbiBMb2FkR2FtZSgpIHtcclxuICB2YXIgbG9hZGVyID0gX0FwcC5sb2FkZXI7XHJcblxyXG4gIGxvYWRlclxyXG4gICAgLmFkZChcImJsYWRlX3RleFwiLCBcIi4vc3JjL2ltYWdlcy9ibGFkZS5wbmdcIilcclxuICAgIC5hZGQoXCJidW5ueVwiLCBcIi4vc3JjL2ltYWdlcy9idW5ueV9zcy5qc29uXCIpXHJcbiAgICAubG9hZChmdW5jdGlvbihsLCByZXMpIHtcclxuXHJcbiAgICAgIEdhbWVMb2FkZWQoKTtcclxuICAgIH0pO1xyXG5cclxuICBjb25zb2xlLmxvZyhcIkdhbWUgc3RhcnQgbG9hZFwiKTtcclxufTtcclxuXHJcbi8vIHJlc2l6ZVxyXG52YXIgb25SZXNpemUgPSBmdW5jdGlvbiBvblJlc2l6ZShldmVudCkge1xyXG4gIHZhciBfdyA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgdmFyIF9oID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGlmIChfdyAvIF9oIDwgMTYgLyA5KSB7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUud2lkdGggPSBfdyArIFwicHhcIjtcclxuICAgIF9BcHAudmlldy5zdHlsZS5oZWlnaHQgPSBfdyAqIDkgLyAxNiArIFwicHhcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX2ggKiAxNiAvIDkgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX2ggKyBcInB4XCI7XHJcbiAgfVxyXG59O1xyXG5cclxud2luZG93LkxvYWRHYW1lID0gTG9hZEdhbWU7XHJcbndpbmRvdy5vbmxvYWQgPSBJbml0OyJdfQ==
