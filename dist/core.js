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

function CreateSlicableObject(pos, engine) {
  var texSH = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


  var obj = null;

  if (texSH) {
    obj = new PIXI.Sprite(texSH.tex);

    if (texSH.pivot) {
      obj.anchor.set(texSH.pivot.x, texSH.pivot.y);
      //console.log(texSH.pivot);
    }
  } else {

    obj = new PIXI.Graphics();
    obj.beginFill(0x9966f * Math.random());
    obj.drawCircle(0, 0, 50);
    obj.endFill();
  }

  obj.x = pos.x;
  obj.y = pos.y;
  obj.onslice = function () {
    console.log("NOT IMPLEMENTED YET");
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

  var stage = new PIXI.display.Stage();

  var _lres = app.loader.resources;

  var sliceUpGroup = new PIXI.display.Group(1, false);
  var sliceMiddleGroup = new PIXI.display.Group(0, false);
  var sliceDownGroup = new PIXI.display.Group(-1, false);
  var uiGroup = new PIXI.display.Group(10, false);

  console.log(_filterDropShadow.DropShadowFilter);
  console.log(PIXI.filters.DropShadowFilter);
  stage.filters = [new _filterDropShadow.DropShadowFilter()];

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
      var obj = (0, _SlicableObject2.default)(pos, engine, {
        tex: bdata.textures.bunny,
        pivot: bdata.data.frames.bunny.pivot
      });

      obj.scale.set(0.2, 0.2);
      obj.parentGroup = sliceDownGroup;
      obj.phBody.canSlice = true;
      //длиннннный калбек
      obj.onslice = function () {
        var downPart = (0, _SlicableObject2.default)(this.position, engine, {
          tex: bdata.textures.bunny_torse,
          pivot: bdata.data.frames.bunny_torse.pivot
        });

        downPart.scale.set(0.2, 0.2);
        downPart.parentGroup = sliceDownGroup;

        _MB.setMass(downPart.phBody, this.phBody.mass * 0.5);
        _MB.setVelocity(downPart.phBody, this.phBody.velocity);
        _MB.setAngle(downPart.phBody, this.phBody.sliceAngle);

        _MB.applyForce(downPart.phBody, downPart.phBody.position, {
          x: this.phBody.sliceVector.y * 0.02,
          y: this.phBody.sliceVector.x * 0.02
        });

        //downPart.phBody.torque = this.phBody.torque * 10;

        stage.addChild(downPart);

        var upPart = (0, _SlicableObject2.default)(this.position, engine, {
          tex: bdata.textures.bunny_head,
          pivot: bdata.data.frames.bunny_head.pivot
        });

        upPart.scale.set(0.2, 0.2);
        upPart.parentGroup = sliceDownGroup;

        _MB.setMass(upPart.phBody, this.phBody.mass * 0.5);
        _MB.setVelocity(upPart.phBody, this.phBody.velocity);
        _MB.setAngle(upPart.phBody, this.phBody.sliceAngle);
        _MB.applyForce(upPart.phBody, upPart.phBody.position, {
          x: this.phBody.sliceVector.y * 0.02,
          y: -this.phBody.sliceVector.x * 0.02
        });
        //upPart.phBody.torque = this.phBody.torque * 10;

        stage.addChild(upPart);
      };
      // --- до сюдда

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

var _SliceLayer = require("./SliceLayer");

var _SliceLayer2 = _interopRequireDefault(_SliceLayer);

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

  console.log(_SliceLayer2.default);
  _SlicedStage = (0, _SliceLayer2.default)(_App); //_LRes.slice_js.function(_App);

  _App.stage.addChild(_SlicedStage);

  _App.LoadStage.destroy();
};

var LoadGame = function LoadGame() {
  var loader = _App.loader;

  loader
  // .add("blade_js", "./src/scripts/Blade_new.js")
  //.add("slice_js", "./src/scripts/SliceLayer.js")
  .add("blade_tex", "./src/images/blade.png").add("bunny", "./src/images/bunny_ss.json").load(function (l, res) {

    //   res.blade_js.function = (new Function(res.blade_js.data))();
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

},{"./SliceLayer":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsInNyY1xcc2NyaXB0c1xcQmxhZGUuanMiLCJzcmNcXHNjcmlwdHNcXFNsaWNhYmxlT2JqZWN0LmpzIiwic3JjXFxzY3JpcHRzXFxTbGljZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7a0JDTndCLEs7O0FBRnhCOztBQUVlLFNBQVMsS0FBVCxDQUFlLE9BQWYsRUFBd0I7QUFDckMsTUFBSSxRQUNGLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEVBRHRFO0FBRUEsTUFBSSxVQUNGLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEVBRHRFO0FBRUEsTUFBSSxXQUNGLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEVBRHRFOztBQUdBLE1BQUksU0FBUyxFQUFiO0FBQ0EsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxPQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsT0FBSyxjQUFMLEdBQXNCLE1BQXRCO0FBQ0EsT0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLENBQXZC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QkQ7O0FBbUJBO0FBQ0EsSUFBSSxXQUFXLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QjtBQUN0QyxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsV0FBdkI7QUFDQSxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsWUFBdkI7O0FBRUEsTUFBSSxLQUFLLEVBQUwsR0FBVSxLQUFLLENBQW5CLEVBQXNCO0FBQ3BCLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsS0FBSyxJQUE3QjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsS0FBSyxDQUFMLEdBQVMsRUFBVCxHQUFjLElBQXZDO0FBQ0QsR0FIRCxNQUdPO0FBQ0wsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixLQUFoQixHQUF3QixLQUFLLEVBQUwsR0FBVSxDQUFWLEdBQWMsSUFBdEM7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLE1BQWhCLEdBQXlCLEtBQUssSUFBOUI7QUFDRDtBQUNGLENBWEQ7O0FBY0EsT0FBTyxNQUFQLEdBQWdCLElBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IC0gdjIuMy4xXG4gKiBDb21waWxlZCBXZWQsIDI5IE5vdiAyMDE3IDE2OjQ1OjE5IFVUQ1xuICpcbiAqIHBpeGktZmlsdGVycyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUodC5fX2ZpbHRlcl9kcm9wX3NoYWRvdz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSB2ZWMzIGNvbG9yO1xcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBVbi1wcmVtdWx0aXBseSBhbHBoYSBiZWZvcmUgYXBwbHlpbmcgdGhlIGNvbG9yXFxuICAgIGlmIChzYW1wbGUuYSA+IDAuMCkge1xcbiAgICAgICAgc2FtcGxlLnJnYiAvPSBzYW1wbGUuYTtcXG4gICAgfVxcblxcbiAgICAvLyBQcmVtdWx0aXBseSBhbHBoYSBhZ2FpblxcbiAgICBzYW1wbGUucmdiID0gY29sb3IucmdiICogc2FtcGxlLmE7XFxuXFxuICAgIC8vIGFscGhhIHVzZXIgYWxwaGFcXG4gICAgc2FtcGxlICo9IGFscGhhO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBzYW1wbGU7XFxufVwiLGk9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaShpLG4sbyxhLGwpe3ZvaWQgMD09PWkmJihpPTQ1KSx2b2lkIDA9PT1uJiYobj01KSx2b2lkIDA9PT1vJiYobz0yKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1sJiYobD0uNSksdC5jYWxsKHRoaXMpLHRoaXMudGludEZpbHRlcj1uZXcgUElYSS5GaWx0ZXIoZSxyKSx0aGlzLmJsdXJGaWx0ZXI9bmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyLHRoaXMuYmx1ckZpbHRlci5ibHVyPW8sdGhpcy50YXJnZXRUcmFuc2Zvcm09bmV3IFBJWEkuTWF0cml4LHRoaXMucm90YXRpb249aSx0aGlzLnBhZGRpbmc9bix0aGlzLmRpc3RhbmNlPW4sdGhpcy5hbHBoYT1sLHRoaXMuY29sb3I9YX10JiYoaS5fX3Byb3RvX189dCksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciBuPXtkaXN0YW5jZTp7Y29uZmlndXJhYmxlOiEwfSxyb3RhdGlvbjp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9LGFscGhhOntjb25maWd1cmFibGU6ITB9LGNvbG9yOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxlLHIsaSl7dmFyIG49dC5nZXRSZW5kZXJUYXJnZXQoKTtuLnRyYW5zZm9ybT10aGlzLnRhcmdldFRyYW5zZm9ybSx0aGlzLnRpbnRGaWx0ZXIuYXBwbHkodCxlLG4sITApLHRoaXMuYmx1ckZpbHRlci5hcHBseSh0LG4sciksdC5hcHBseUZpbHRlcih0aGlzLGUscixpKSxuLnRyYW5zZm9ybT1udWxsLHQucmV0dXJuUmVuZGVyVGFyZ2V0KG4pfSxpLnByb3RvdHlwZS5fdXBkYXRlUGFkZGluZz1mdW5jdGlvbigpe3RoaXMucGFkZGluZz10aGlzLmRpc3RhbmNlKzIqdGhpcy5ibHVyfSxpLnByb3RvdHlwZS5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy50YXJnZXRUcmFuc2Zvcm0udHg9dGhpcy5kaXN0YW5jZSpNYXRoLmNvcyh0aGlzLmFuZ2xlKSx0aGlzLnRhcmdldFRyYW5zZm9ybS50eT10aGlzLmRpc3RhbmNlKk1hdGguc2luKHRoaXMuYW5nbGUpfSxuLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kaXN0YW5jZX0sbi5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5fZGlzdGFuY2U9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCksdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4ucm90YXRpb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYW5nbGUvUElYSS5ERUdfVE9fUkFEfSxuLnJvdGF0aW9uLnNldD1mdW5jdGlvbih0KXt0aGlzLmFuZ2xlPXQqUElYSS5ERUdfVE9fUkFELHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1ckZpbHRlci5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1ckZpbHRlci5ibHVyPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpfSxuLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGF9LG4uYWxwaGEuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYT10fSxuLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiBQSVhJLnV0aWxzLnJnYjJoZXgodGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sbi5jb2xvci5zZXQ9ZnVuY3Rpb24odCl7UElYSS51dGlscy5oZXgycmdiKHQsdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsbiksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Ecm9wU2hhZG93RmlsdGVyPWksdC5Ecm9wU2hhZG93RmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1kcm9wLXNoYWRvdy5qcy5tYXBcbiIsIlxyXG4vL0JsYWRlIEpTIGNvbnN0cnVjdG9yXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGFkZSh0ZXh0dXJlKSB7XHJcbiAgdmFyIGNvdW50ID1cclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTA7XHJcbiAgdmFyIG1pbkRpc3QgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiA0MDtcclxuICB2YXIgbGl2ZVRpbWUgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAyMDtcclxuXHJcbiAgdmFyIHBvaW50cyA9IFtdO1xyXG4gIHRoaXMuY291bnQgPSBjb3VudDtcclxuICB0aGlzLm1pbkRpc3QgPSBtaW5EaXN0O1xyXG4gIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgdGhpcy5taW5Nb3Rpb25TcGVlZCA9IDQwMDAuMDtcclxuICB0aGlzLmxpdmVUaW1lID0gbGl2ZVRpbWU7XHJcbiAgdGhpcy5sYXN0TW90aW9uU3BlZWQgPSAwO1xyXG4gIHRoaXMudGFyZ2V0UG9zaXRpb24gPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHJcbiAgdGhpcy5ib2R5ID0gbmV3IFBJWEkubWVzaC5Sb3BlKHRleHR1cmUsIHBvaW50cyk7XHJcblxyXG4gIHZhciBsYXN0UG9zaXRpb24gPSBudWxsO1xyXG4gIHRoaXMuVXBkYXRlID0gZnVuY3Rpb24odGlja2VyKSB7XHJcbiAgICB2YXIgaXNEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBwb2ludHMgPSB0aGlzLmJvZHkucG9pbnRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgaWYgKHBvaW50c1tpXS5sYXN0VGltZSArIHRoaXMubGl2ZVRpbWUgPCB0aWNrZXIubGFzdFRpbWUpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBpc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB0ID0gbmV3IFBJWEkuUG9pbnQoXHJcbiAgICAgIHRoaXMudGFyZ2V0UG9zaXRpb24ueCAvIHRoaXMuYm9keS5zY2FsZS54LFxyXG4gICAgICB0aGlzLnRhcmdldFBvc2l0aW9uLnkgLyB0aGlzLmJvZHkuc2NhbGUueVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAobGFzdFBvc2l0aW9uID09IG51bGwpIGxhc3RQb3NpdGlvbiA9IHQ7XHJcblxyXG4gICAgdC5sYXN0VGltZSA9IHRpY2tlci5sYXN0VGltZTtcclxuXHJcbiAgICB2YXIgcCA9IGxhc3RQb3NpdGlvbjtcclxuXHJcbiAgICB2YXIgZHggPSB0LnggLSBwLng7XHJcbiAgICB2YXIgZHkgPSB0LnkgLSBwLnk7XHJcblxyXG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgIHRoaXMubGFzdE1vdGlvblNwZWVkID0gZGlzdCAqIDEwMDAgLyB0aWNrZXIuZWxhcHNlZE1TO1xyXG4gICAgaWYgKGRpc3QgPiBtaW5EaXN0KSB7XHJcbiAgICAgIGlmICh0aGlzLmxhc3RNb3Rpb25TcGVlZCA+IHRoaXMubWluTW90aW9uU3BlZWQpIHtcclxuICAgICAgICBwb2ludHMucHVzaCh0KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IHRoaXMuY291bnQpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaXNEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGFzdFBvc2l0aW9uID0gdDtcclxuICAgIGlmIChpc0RpcnR5KSB7XHJcbiAgICAgIHRoaXMuYm9keS5yZWZyZXNoKHRydWUpO1xyXG4gICAgICB0aGlzLmJvZHkucmVuZGVyYWJsZSA9IHBvaW50cy5sZW5ndGggPiAxO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuUmVhZENhbGxiYWNrcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRhcmdldC5tb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHNlbGYudGFyZ2V0UG9zaXRpb24gPSBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQubW91c2VvdmVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAvL1x0c2VsZi50YXJnZXRQb3NpdGlvbiA9ICBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgICAvL1x0Y29uc29sZS5sb2coXCJvdmVyXCIpO1xyXG4gICAgICAvLyAgc2VsZi5Nb3ZlQWxsKGUuZGF0YS5nbG9iYWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQudG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIG1vdmVcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5kYXRhKTtcclxuICAgICAgc2VsZi50YXJnZXRQb3NpdGlvbiA9IGUuZGF0YS5nbG9iYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaHN0YXJ0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIHN0YXJ0XCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUuZGF0YSk7XHJcbiAgICAgIC8vICBzZWxmLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJUb3VjaCBzdGFydFwiKTtcclxuICAgICAgLy8gX0JsYWRlLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG4gICAgLy8g0LAg0YLQviDQu9Cw0L/RiNCwINC60LDQutCw0Y8t0YLQvlxyXG4gIH07XHJcbn07XHJcblxyXG4vL3JldHVybiBCbGFkZTtcclxuXHJcbiIsIlxyXG52YXIgX01FID0gTWF0dGVyLkVuZ2luZSxcclxuICAgIF9NVyA9IE1hdHRlci5Xb3JsZCxcclxuICAgIF9NQnMgPSBNYXR0ZXIuQm9kaWVzLFxyXG4gICAgX01CID0gTWF0dGVyLkJvZHksXHJcbiAgICBfTUMgPSBNYXR0ZXIuQ29tcG9zaXRlLFxyXG4gICAgX01FdiA9IE1hdHRlci5FdmVudHMsXHJcbiAgICBfTVYgPSBNYXR0ZXIuVmVjdG9yO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3JlYXRlU2xpY2FibGVPYmplY3QocG9zLCBlbmdpbmUsIHRleFNIID0gbnVsbCkge1xyXG4gIFxyXG4gIHZhciBvYmogPSBudWxsO1xyXG5cclxuICBpZiAodGV4U0gpIHtcclxuICAgIG9iaiA9IG5ldyBQSVhJLlNwcml0ZSh0ZXhTSC50ZXgpO1xyXG5cclxuICAgIGlmICh0ZXhTSC5waXZvdCkge1xyXG4gICAgICBvYmouYW5jaG9yLnNldCh0ZXhTSC5waXZvdC54LCB0ZXhTSC5waXZvdC55KTtcclxuICAgICAgLy9jb25zb2xlLmxvZyh0ZXhTSC5waXZvdCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICBcclxuICAgIG9iaiA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcbiAgICBvYmouYmVnaW5GaWxsKDB4OTk2NmYgKiBNYXRoLnJhbmRvbSgpKTtcclxuICAgIG9iai5kcmF3Q2lyY2xlKDAsIDAsIDUwKTtcclxuICAgIG9iai5lbmRGaWxsKCk7XHJcbiAgXHJcbiAgfVxyXG5cclxuICBvYmoueCA9IHBvcy54O1xyXG4gIG9iai55ID0gcG9zLnk7XHJcbiAgb2JqLm9uc2xpY2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEIFlFVFwiKTtcclxuICB9O1xyXG5cclxuICBvYmoua2lsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMucGhCb2R5LnNsaWNlZCAmJiB0aGlzLm9uc2xpY2UpIHtcclxuICAgICAgdGhpcy5vbnNsaWNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZXN0cm95KHsgY2hpbGRyZW46IHRydWUgfSk7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMucGhCb2R5ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIF9NQy5yZW1vdmUoZW5naW5lLndvcmxkLCB0aGlzLnBoQm9keSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIHBoQm9keSA9IF9NQnMuY2lyY2xlKHBvcy54LCBwb3MueSwgNTApO1xyXG4gIHBoQm9keS5jb2xsaXNpb25GaWx0ZXIubWFzayAmPSB+cGhCb2R5LmNvbGxpc2lvbkZpbHRlci5jYXRlZ29yeTtcclxuICBfTVcuYWRkKGVuZ2luZS53b3JsZCwgcGhCb2R5KTtcclxuXHJcbiAgcGhCb2R5LnBpT2JqID0gb2JqO1xyXG4gIG9iai5waEJvZHkgPSBwaEJvZHk7XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn1cclxuIiwiaW1wb3J0IHtEcm9wU2hhZG93RmlsdGVyfSBmcm9tICdAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cnXHJcbmltcG9ydCBDcmVhdGVTbGljYWJsZU9iamVjdCBmcm9tICcuL1NsaWNhYmxlT2JqZWN0J1xyXG5pbXBvcnQgQmxhZGUgZnJvbSAnLi9CbGFkZSdcclxuXHJcbi8vIGZ1bmN0aW9uLCB3aG8gY3JlYXRlIGFuZCBpbnN0YW5jZSBTbGljZWRMYXlvdXRcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2xpY2VMYXllciAoYXBwKSB7XHJcbiAgdmFyIF9NRSA9IE1hdHRlci5FbmdpbmUsXHJcbiAgICBfTVcgPSBNYXR0ZXIuV29ybGQsXHJcbiAgICBfTUJzID0gTWF0dGVyLkJvZGllcyxcclxuICAgIF9NQiA9IE1hdHRlci5Cb2R5LFxyXG4gICAgX01DID0gTWF0dGVyLkNvbXBvc2l0ZSxcclxuICAgIF9NRXYgPSBNYXR0ZXIuRXZlbnRzLFxyXG4gICAgX01WID0gTWF0dGVyLlZlY3RvcixcclxuICAgIF9MUmVzID0gYXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcblxyXG4gIHZhciBlbmdpbmUgPSBfTUUuY3JlYXRlKCk7XHJcbiAgZW5naW5lLndvcmxkLnNjYWxlID0gMC4wMDAxO1xyXG4gIGVuZ2luZS53b3JsZC5ncmF2aXR5LnkgPSAwLjM1O1xyXG5cclxuICBfTUUucnVuKGVuZ2luZSk7XHJcblxyXG5cclxuXHJcbiAgdmFyIHN0YWdlID0gbmV3IFBJWEkuZGlzcGxheS5TdGFnZSgpO1xyXG5cclxuICB2YXIgX2xyZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIHNsaWNlVXBHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMSwgZmFsc2UpO1xyXG4gIHZhciBzbGljZU1pZGRsZUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgwLCBmYWxzZSk7XHJcbiAgdmFyIHNsaWNlRG93bkdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgtMSwgZmFsc2UpO1xyXG4gIHZhciB1aUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgxMCwgZmFsc2UpO1xyXG4gIFxyXG4gIGNvbnNvbGUubG9nKERyb3BTaGFkb3dGaWx0ZXIpO1xyXG4gIGNvbnNvbGUubG9nKFBJWEkuZmlsdGVycy5Ecm9wU2hhZG93RmlsdGVyKVxyXG4gIHN0YWdlLmZpbHRlcnMgPSBbbmV3IERyb3BTaGFkb3dGaWx0ZXIoKV07XHJcblxyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VVcEdyb3VwKSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzbGljZURvd25Hcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VNaWRkbGVHcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIodWlHcm91cCkpO1xyXG5cclxuICAvL3N0YWdlLmdyb3VwLmVuYWJsZVNvcnQgPSB0cnVlO1xyXG4gIHN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgc3RhZ2UuX2RlYnVnVGV4dCA9IG5ldyBQSVhJLlRleHQoXCJCb2R5IGNvdW50OiAwXCIsIHtcclxuICAgIGZvbnRGYW1pbHk6IFwiQXJpYWxcIixcclxuICAgIGZvbnRTaXplOiAzMixcclxuICAgIGZpbGw6IDB4ZmYxMDEwLFxyXG4gICAgc3Ryb2tlOiAweDAwY2MxMCxcclxuICAgIGFsaWduOiBcImxlZnRcIlxyXG4gIH0pO1xyXG5cclxuICBzdGFnZS5fZGVidWdUZXh0LnBvc2l0aW9uLnNldCgxMCwgNDIpO1xyXG4gLy8gY29uc29sZS5sb2coXCJwcmVcIik7XHJcbiAgc3RhZ2UuYmxhZGUgPSBuZXcgQmxhZGUoXHJcbiAgICBfbHJlcy5ibGFkZV90ZXgudGV4dHVyZSxcclxuICAgIDMwLFxyXG4gICAgMTAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHN0YWdlLmJsYWRlLm1pbk1vdmFibGVTcGVlZCA9IDEwMDA7XHJcbiAgc3RhZ2UuYmxhZGUuYm9keS5wYXJlbnRHcm91cCA9IHNsaWNlTWlkZGxlR3JvdXA7XHJcbiAgc3RhZ2UuYmxhZGUuUmVhZENhbGxiYWNrcyhzdGFnZSk7XHJcblxyXG4gIHN0YWdlLmFkZENoaWxkKHN0YWdlLmJsYWRlLmJvZHkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKHN0YWdlLl9kZWJ1Z1RleHQpO1xyXG5cclxuICB2YXIgc2xpY2VzID0gMDtcclxuICAvLyBzbGljZXMgdmlhIFJheWNhc3QgVGVzdGluZ1xyXG4gIHZhciBSYXlDYXN0VGVzdCA9IGZ1bmN0aW9uIFJheUNhc3RUZXN0KGJvZGllcykge1xyXG4gICAgaWYgKHN0YWdlLmJsYWRlLmxhc3RNb3Rpb25TcGVlZCA+IHN0YWdlLmJsYWRlLm1pbk1vdGlvblNwZWVkKSB7XHJcbiAgICAgIHZhciBwcHMgPSBzdGFnZS5ibGFkZS5ib2R5LnBvaW50cztcclxuXHJcbiAgICAgIGlmIChwcHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgTWF0aC5taW4ocHBzLmxlbmd0aCwgNCk7IGkrKykge1xyXG4gICAgICAgICAgLy8gNCDQv9C+0YHQu9C10LTQvdC40YUg0YHQtdCz0LzQtdC90YLQsFxyXG5cclxuICAgICAgICAgIHZhciBzcCA9IHBwc1tpIC0gMV07XHJcbiAgICAgICAgICB2YXIgZXAgPSBwcHNbaV07XHJcblxyXG4gICAgICAgICAgdmFyIGNvbGxpc2lvbnMgPSBNYXR0ZXIuUXVlcnkucmF5KGJvZGllcywgc3AsIGVwKTtcclxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sbGlzaW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoY29sbGlzaW9uc1tqXS5ib2R5LmNhblNsaWNlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHN2ID0geyB5OiBlcC55IC0gc3AueSwgeDogZXAueCAtIHNwLnggfTtcclxuICAgICAgICAgICAgICBzdiA9IF9NVi5ub3JtYWxpc2Uoc3YpO1xyXG5cclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VBbmdsZSA9IF9NVi5hbmdsZShzcCwgZXApO1xyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZVZlY3RvciA9IHN2O1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJib2R5IHNsaWNlIGFuZ2xlOlwiLCBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VBbmdsZSk7XHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgIHNsaWNlcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIGZyYW1lcyA9IDA7XHJcbiAgdmFyIGxhc3RTaG90WCA9IG51bGw7XHJcblxyXG4gIC8vIHVwZGF0ZSB2aWV3XHJcbiAgdmFyIFVwZGF0ZSA9IGZ1bmN0aW9uIFVwZGF0ZSgpIHtcclxuICAgIHN0YWdlLl9kZWJ1Z1RleHQudGV4dCA9XHJcbiAgICAgIFwi0JLRiyDQtNC10YDQt9C60L4g0LfQsNGA0LXQt9Cw0LvQuCBcIiArIHNsaWNlcy50b1N0cmluZygpICsgXCIg0LrRgNC+0LvQuNC6b9CyKNC60LApKFwiO1xyXG5cclxuICAgIHZhciBib2RpZXMgPSBfTUMuYWxsQm9kaWVzKGVuZ2luZS53b3JsZCk7XHJcblxyXG4gICAgZnJhbWVzKys7XHJcbiAgICBpZiAoZnJhbWVzID49IDIwICYmIGJvZGllcy5sZW5ndGggPCA1KSB7XHJcbiAgICAgIGZyYW1lcyA9IDA7XHJcbiAgICAgIHZhciBwb3MgPSB7XHJcbiAgICAgICAgeDpcclxuICAgICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb21SYW5nZSgwLCAxMCkpICpcclxuICAgICAgICAgIE1hdGguZmxvb3IoKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCkgLyAxMCksXHJcbiAgICAgICAgeTogYXBwLnJlbmRlcmVyLmhlaWdodCArIDEwMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgd2hpbGUgKGxhc3RTaG90WCAhPT0gbnVsbCAmJiBNYXRoLmFicyhsYXN0U2hvdFggLSBwb3MueCkgPCAyMDApIHtcclxuICAgICAgICBwb3MueCA9XHJcbiAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tUmFuZ2UoMCwgMTApKSAqXHJcbiAgICAgICAgICBNYXRoLmZsb29yKChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApIC8gMTApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsYXN0U2hvdFggPSBwb3MueDtcclxuXHJcbiAgICAgIHBvcy54IC09IDEwMDsgLy9vZmZzZXRcclxuXHJcbiAgICAgIC8vLyDQktGL0L3QtdGB0YLQuCDRjdGC0L4g0LPQvtCy0L3QviDQutGD0LTQsC3QvdC40LHRg9C00Ywg0LIg0LTRgNGD0LPQvtC1INC80LXRgdGC0L5cclxuXHJcbiAgICAgIC8vYmFubnlcclxuICAgICAgdmFyIGJkYXRhID0gX0xSZXMuYnVubnkuc3ByaXRlc2hlZXQ7XHJcbiAgICAgIHZhciBvYmogPSBDcmVhdGVTbGljYWJsZU9iamVjdChwb3MsIGVuZ2luZSwge1xyXG4gICAgICAgIHRleDogYmRhdGEudGV4dHVyZXMuYnVubnksXHJcbiAgICAgICAgcGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55LnBpdm90XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgICAgIG9iai5wYXJlbnRHcm91cCA9IHNsaWNlRG93bkdyb3VwO1xyXG4gICAgICBvYmoucGhCb2R5LmNhblNsaWNlID0gdHJ1ZTtcclxuICAgICAgLy/QtNC70LjQvdC90L3QvdC90YvQuSDQutCw0LvQsdC10LpcclxuICAgICAgb2JqLm9uc2xpY2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZG93blBhcnQgPSBDcmVhdGVTbGljYWJsZU9iamVjdCh0aGlzLnBvc2l0aW9uLCBlbmdpbmUsIHtcclxuICAgICAgICAgIHRleDogYmRhdGEudGV4dHVyZXMuYnVubnlfdG9yc2UsXHJcbiAgICAgICAgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnlfdG9yc2UucGl2b3RcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZG93blBhcnQuc2NhbGUuc2V0KDAuMiwgMC4yKTtcclxuICAgICAgICBkb3duUGFydC5wYXJlbnRHcm91cCA9IHNsaWNlRG93bkdyb3VwO1xyXG5cclxuICAgICAgICBfTUIuc2V0TWFzcyhkb3duUGFydC5waEJvZHksIHRoaXMucGhCb2R5Lm1hc3MgKiAwLjUpO1xyXG4gICAgICAgIF9NQi5zZXRWZWxvY2l0eShkb3duUGFydC5waEJvZHksIHRoaXMucGhCb2R5LnZlbG9jaXR5KTtcclxuICAgICAgICBfTUIuc2V0QW5nbGUoZG93blBhcnQucGhCb2R5LCB0aGlzLnBoQm9keS5zbGljZUFuZ2xlKTtcclxuXHJcbiAgICAgICAgX01CLmFwcGx5Rm9yY2UoZG93blBhcnQucGhCb2R5LCBkb3duUGFydC5waEJvZHkucG9zaXRpb24sIHtcclxuICAgICAgICAgIHg6IHRoaXMucGhCb2R5LnNsaWNlVmVjdG9yLnkgKiAwLjAyLFxyXG4gICAgICAgICAgeTogdGhpcy5waEJvZHkuc2xpY2VWZWN0b3IueCAqIDAuMDJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9kb3duUGFydC5waEJvZHkudG9ycXVlID0gdGhpcy5waEJvZHkudG9ycXVlICogMTA7XHJcblxyXG4gICAgICAgIHN0YWdlLmFkZENoaWxkKGRvd25QYXJ0KTtcclxuXHJcbiAgICAgICAgdmFyIHVwUGFydCA9IENyZWF0ZVNsaWNhYmxlT2JqZWN0KHRoaXMucG9zaXRpb24sZW5naW5lLCB7XHJcbiAgICAgICAgICB0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55X2hlYWQsXHJcbiAgICAgICAgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnlfaGVhZC5waXZvdFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1cFBhcnQuc2NhbGUuc2V0KDAuMiwgMC4yKTtcclxuICAgICAgICB1cFBhcnQucGFyZW50R3JvdXAgPSBzbGljZURvd25Hcm91cDtcclxuXHJcbiAgICAgICAgX01CLnNldE1hc3ModXBQYXJ0LnBoQm9keSwgdGhpcy5waEJvZHkubWFzcyAqIDAuNSk7XHJcbiAgICAgICAgX01CLnNldFZlbG9jaXR5KHVwUGFydC5waEJvZHksIHRoaXMucGhCb2R5LnZlbG9jaXR5KTtcclxuICAgICAgICBfTUIuc2V0QW5nbGUodXBQYXJ0LnBoQm9keSwgdGhpcy5waEJvZHkuc2xpY2VBbmdsZSk7XHJcbiAgICAgICAgX01CLmFwcGx5Rm9yY2UodXBQYXJ0LnBoQm9keSwgdXBQYXJ0LnBoQm9keS5wb3NpdGlvbiwge1xyXG4gICAgICAgICAgeDogdGhpcy5waEJvZHkuc2xpY2VWZWN0b3IueSAqIDAuMDIsXHJcbiAgICAgICAgICB5OiAtdGhpcy5waEJvZHkuc2xpY2VWZWN0b3IueCAqIDAuMDJcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL3VwUGFydC5waEJvZHkudG9ycXVlID0gdGhpcy5waEJvZHkudG9ycXVlICogMTA7XHJcblxyXG4gICAgICAgIHN0YWdlLmFkZENoaWxkKHVwUGFydCk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIC0tLSDQtNC+INGB0Y7QtNC00LBcclxuXHJcbiAgICAgIHZhciBfb2Z4ID0gMC41IC0gKHBvcy54ICsgMTAwKSAvIChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApO1xyXG5cclxuICAgICAgdmFyIHJhbmdlID0gMC44O1xyXG4gICAgICB2YXIgaW1wID0ge1xyXG4gICAgICAgIHg6IHJhbmdlICogX29meCxcclxuICAgICAgICB5OiAtTWF0aC5yYW5kb21SYW5nZSgwLjQsIDAuNSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIF9NQi5hcHBseUZvcmNlKG9iai5waEJvZHksIG9iai5waEJvZHkucG9zaXRpb24sIGltcCk7XHJcbiAgICAgIG9iai5waEJvZHkudG9ycXVlID0gTWF0aC5yYW5kb21SYW5nZSgtMTAsIDEwKTtcclxuXHJcbiAgICAgIHN0YWdlLmFkZENoaWxkKG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHRpY2tlciA9IGFwcC50aWNrZXI7XHJcbiAgICBzdGFnZS5ibGFkZS5VcGRhdGUodGlja2VyKTtcclxuXHJcbiAgICAvL0Nhc3RUZXN0XHJcbiAgICBSYXlDYXN0VGVzdChib2RpZXMpO1xyXG5cclxuICAgIF9NRS51cGRhdGUoZW5naW5lKTtcclxuICAgIC8vIGl0ZXJhdGUgb3ZlciBib2RpZXMgYW5kIGZpeHR1cmVzXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGJvZGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICB2YXIgYm9keSA9IGJvZGllc1tpXTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgYm9keS5waU9iaiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIChib2R5LnBvc2l0aW9uLnkgPiBhcHAucmVuZGVyZXIuaGVpZ2h0ICsgMTAwICYmXHJcbiAgICAgICAgICAgIGJvZHkudmVsb2NpdHkueSA+IDApIHx8XHJcbiAgICAgICAgICBib2R5LnNsaWNlZFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgYm9keS5waU9iai5raWxsKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJvZHkucGlPYmoueCA9IGJvZHkucG9zaXRpb24ueDtcclxuICAgICAgICAgIGJvZHkucGlPYmoueSA9IGJvZHkucG9zaXRpb24ueTtcclxuICAgICAgICAgIGJvZHkucGlPYmoucm90YXRpb24gPSBib2R5LmFuZ2xlO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhib2R5LmFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBNYXRoLnJhbmRvbVJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcbiAgfTtcclxuICAvL3J1biBVcGRhdGVcclxuICBhcHAudGlja2VyLmFkZChVcGRhdGUsIHRoaXMpO1xyXG5cclxuICAvLy8vIFJFVFVSTlxyXG4gIHJldHVybiBzdGFnZTtcclxufVxyXG5cclxuLy9leHBvcnQge1NsaWNlTGF5ZXIgfTtcclxuLy9tb2R1bGUuZXhwb3J0cyA9IFNsaWNlTGF5ZXI7XHJcbi8vcmV0dXJuIFNsaWNlTGF5ZXI7XHJcbiIsImltcG9ydCBfU2xpY2VTdGFnZUNyZWF0ZXIgZnJvbSBcIi4vU2xpY2VMYXllclwiXHJcblxyXG52YXIgX0FwcCA9IG51bGwsXHJcbiAgX0xSZXMgPSBudWxsLFxyXG4gIF9SZW5kZXJlciA9IG51bGwsXHJcbiAgX0ludE1hbmFnZXIgPSBudWxsLFxyXG4gIF9TbGljZWRTdGFnZSA9IG51bGw7XHJcblxyXG52YXIgSW5pdCA9IGZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgX0FwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHtcclxuICAgIHdpZHRoOiAxMjgwLFxyXG4gICAgaGVpZ2h0OiA3MjAsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IDB4ZmZmZmZmXHJcbiAgfSk7XHJcbiAgLy/QotCw0Log0L3QsNC00L4sINGB0YLQsNC90LTQsNGA0YLQvdGL0LUg0L3QtSDQsdGD0LTRg9GCINC+0YLQvtCx0YDQsNC20LDRgtGB0Y9cclxuICBfQXBwLnN0YWdlID0gbmV3IFBJWEkuZGlzcGxheS5TdGFnZSgpO1xyXG5cclxuICBfTFJlcyA9IF9BcHAubG9hZGVyLnJlc291cmNlcztcclxuICBfSW50TWFuYWdlciA9IF9BcHAucmVuZGVyZXIucGx1Z2lucy5pbnRlcmFjdGlvbjtcclxuXHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfQXBwLnZpZXcpO1xyXG4gIG9uUmVzaXplKCk7XHJcbiAgd2luZG93Lm9ucmVzaXplID0gb25SZXNpemU7XHJcblxyXG4gIF9BcHAudGlja2VyLmFkZChvblVwZGF0ZSwgdGhpcyk7XHJcblxyXG4gIF9BcHAuc3RhZ2UuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG5cclxuICB2YXIgbG9hZFN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gIHZhciBsb2FkQnV0dG9uID0gbmV3IFBJWEkuVGV4dChcIlRoaXMgaXMgYSBMb2FkIEJ1dHRvblwiLCB7XHJcbiAgICBmb250RmFtaWx5OiBcIkFyaWFsXCIsXHJcbiAgICBmb250U2l6ZTogNzQsXHJcbiAgICBmaWxsOiAweGZmMTAxMCxcclxuICAgIGFsaWduOiBcImNlbnRlclwiXHJcbiAgfSk7XHJcblxyXG4gIGxvYWRCdXR0b24uYW5jaG9yLnNldCgwLjUsIDAuNSk7XHJcbiAgbG9hZEJ1dHRvbi5idXR0b25Nb2RlID0gdHJ1ZTtcclxuICBsb2FkQnV0dG9uLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgbG9hZEJ1dHRvbi5wb3NpdGlvbi5zZXQoX0FwcC5yZW5kZXJlci53aWR0aCAvIDIsIF9BcHAucmVuZGVyZXIuaGVpZ2h0IC8gMik7XHJcblxyXG4gIGxvYWRCdXR0b24uY2xpY2sgPSBMb2FkR2FtZTtcclxuICBsb2FkU3RhZ2UuYWRkQ2hpbGQobG9hZEJ1dHRvbik7XHJcblxyXG4gIF9BcHAuTG9hZFN0YWdlID0gbG9hZFN0YWdlO1xyXG4gIF9BcHAuc3RhZ2UuYWRkQ2hpbGQobG9hZFN0YWdlKTtcclxufTtcclxuXHJcbi8vIHVwZGF0ZSBmdW5jdGlvbiwgcGFzcyBXaW5kb3cgYXMgc2NvcGUgKHRoaXMgPSBfQXBwKVxyXG52YXIgb25VcGRhdGUgPSBmdW5jdGlvbiBvblVwZGF0ZSgpIHtcclxuICB2YXIgZHQgPSBfQXBwLnRpY2tlci5kZWx0YVRpbWU7XHJcbn07XHJcblxyXG4vL2ludm9rZWQgYWZ0ZXIgbG9hZGluZyBnYW1lIHJlc291cmNlc1xyXG52YXIgR2FtZUxvYWRlZCA9IGZ1bmN0aW9uIEdhbWVMb2FkZWQoKSB7XHJcbiAgY29uc29sZS5sb2coXCJHYW1lIGlzIGxvYWRlZFwiKTtcclxuXHJcbiAgY29uc29sZS5sb2coX1NsaWNlU3RhZ2VDcmVhdGVyKTtcclxuICBfU2xpY2VkU3RhZ2UgPSAgX1NsaWNlU3RhZ2VDcmVhdGVyKF9BcHApOyAvL19MUmVzLnNsaWNlX2pzLmZ1bmN0aW9uKF9BcHApO1xyXG5cclxuICBfQXBwLnN0YWdlLmFkZENoaWxkKF9TbGljZWRTdGFnZSk7XHJcblxyXG4gIF9BcHAuTG9hZFN0YWdlLmRlc3Ryb3koKTtcclxufTtcclxuXHJcbnZhciBMb2FkR2FtZSA9IGZ1bmN0aW9uIExvYWRHYW1lKCkge1xyXG4gIHZhciBsb2FkZXIgPSBfQXBwLmxvYWRlcjtcclxuXHJcbiAgbG9hZGVyXHJcbiAgIC8vIC5hZGQoXCJibGFkZV9qc1wiLCBcIi4vc3JjL3NjcmlwdHMvQmxhZGVfbmV3LmpzXCIpXHJcbiAgICAvLy5hZGQoXCJzbGljZV9qc1wiLCBcIi4vc3JjL3NjcmlwdHMvU2xpY2VMYXllci5qc1wiKVxyXG4gICAgLmFkZChcImJsYWRlX3RleFwiLCBcIi4vc3JjL2ltYWdlcy9ibGFkZS5wbmdcIilcclxuICAgIC5hZGQoXCJidW5ueVwiLCBcIi4vc3JjL2ltYWdlcy9idW5ueV9zcy5qc29uXCIpXHJcbiAgICAubG9hZChmdW5jdGlvbihsLCByZXMpIHtcclxuXHJcbiAgIC8vICAgcmVzLmJsYWRlX2pzLmZ1bmN0aW9uID0gKG5ldyBGdW5jdGlvbihyZXMuYmxhZGVfanMuZGF0YSkpKCk7XHJcbiAgICAvLyAgcmVzLnNsaWNlX2pzLmZ1bmN0aW9uID0gKG5ldyBGdW5jdGlvbihyZXMuc2xpY2VfanMuZGF0YSkpKCk7XHJcblxyXG4gICAgICBHYW1lTG9hZGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0IGxvYWRcIik7XHJcbn07XHJcblxyXG4vLyByZXNpemVcclxudmFyIG9uUmVzaXplID0gZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcclxuICB2YXIgX3cgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gIHZhciBfaCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBpZiAoX3cgLyBfaCA8IDE2IC8gOSkge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX3cgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX3cgKiA5IC8gMTYgKyBcInB4XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF9oICogMTYgLyA5ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF9oICsgXCJweFwiO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG53aW5kb3cub25sb2FkID0gSW5pdDsiXX0=
