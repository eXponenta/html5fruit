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

  var stage = new PIXI.display.Stage();

  var _lres = app.loader.resources;

  var sliceUpGroup = new PIXI.display.Group(1, false);
  var sliceMiddleGroup = new PIXI.display.Group(0, false);
  var sliceDownGroup = new PIXI.display.Group(-1, false);
  var uiGroup = new PIXI.display.Group(10, false);

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

window.onload = Init;

},{"./SliceLayer":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsInNyY1xcc2NyaXB0c1xcQmxhZGUuanMiLCJzcmNcXHNjcmlwdHNcXFNsaWNhYmxlT2JqZWN0LmpzIiwic3JjXFxzY3JpcHRzXFxTbGljZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7a0JDTndCLEs7O0FBRnhCOztBQUVlLFNBQVMsS0FBVCxDQUFlLE9BQWYsRUFBd0I7QUFDckMsTUFBSSxRQUNGLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEVBRHRFO0FBRUEsTUFBSSxVQUNGLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEVBRHRFO0FBRUEsTUFBSSxXQUNGLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEVBRHRFOztBQUdBLE1BQUksU0FBUyxFQUFiO0FBQ0EsT0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLE9BQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxPQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsT0FBSyxjQUFMLEdBQXNCLE1BQXRCO0FBQ0EsT0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsT0FBSyxlQUFMLEdBQXVCLENBQXZC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QUFTLElBQVQsQ0FBYyxZQUF2Qjs7QUFFQSxNQUFJLEtBQUssRUFBTCxHQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDcEIsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixLQUFoQixHQUF3QixLQUFLLElBQTdCO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixNQUFoQixHQUF5QixLQUFLLENBQUwsR0FBUyxFQUFULEdBQWMsSUFBdkM7QUFDRCxHQUhELE1BR087QUFDTCxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLEtBQUssRUFBTCxHQUFVLENBQVYsR0FBYyxJQUF0QztBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsS0FBSyxJQUE5QjtBQUNEO0FBQ0YsQ0FYRDs7QUFjQSxPQUFPLE1BQVAsR0FBZ0IsSUFBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cgLSB2Mi4zLjFcbiAqIENvbXBpbGVkIFdlZCwgMjkgTm92IDIwMTcgMTY6NDU6MTkgVVRDXG4gKlxuICogcGl4aS1maWx0ZXJzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZSh0Ll9fZmlsdGVyX2Ryb3Bfc2hhZG93PXt9KX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBhbHBoYTtcXG51bmlmb3JtIHZlYzMgY29sb3I7XFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIFVuLXByZW11bHRpcGx5IGFscGhhIGJlZm9yZSBhcHBseWluZyB0aGUgY29sb3JcXG4gICAgaWYgKHNhbXBsZS5hID4gMC4wKSB7XFxuICAgICAgICBzYW1wbGUucmdiIC89IHNhbXBsZS5hO1xcbiAgICB9XFxuXFxuICAgIC8vIFByZW11bHRpcGx5IGFscGhhIGFnYWluXFxuICAgIHNhbXBsZS5yZ2IgPSBjb2xvci5yZ2IgKiBzYW1wbGUuYTtcXG5cXG4gICAgLy8gYWxwaGEgdXNlciBhbHBoYVxcbiAgICBzYW1wbGUgKj0gYWxwaGE7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHNhbXBsZTtcXG59XCIsaT1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKGksbixvLGEsbCl7dm9pZCAwPT09aSYmKGk9NDUpLHZvaWQgMD09PW4mJihuPTUpLHZvaWQgMD09PW8mJihvPTIpLHZvaWQgMD09PWEmJihhPTApLHZvaWQgMD09PWwmJihsPS41KSx0LmNhbGwodGhpcyksdGhpcy50aW50RmlsdGVyPW5ldyBQSVhJLkZpbHRlcihlLHIpLHRoaXMuYmx1ckZpbHRlcj1uZXcgUElYSS5maWx0ZXJzLkJsdXJGaWx0ZXIsdGhpcy5ibHVyRmlsdGVyLmJsdXI9byx0aGlzLnRhcmdldFRyYW5zZm9ybT1uZXcgUElYSS5NYXRyaXgsdGhpcy5yb3RhdGlvbj1pLHRoaXMucGFkZGluZz1uLHRoaXMuZGlzdGFuY2U9bix0aGlzLmFscGhhPWwsdGhpcy5jb2xvcj1hfXQmJihpLl9fcHJvdG9fXz10KSwoaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWk7dmFyIG49e2Rpc3RhbmNlOntjb25maWd1cmFibGU6ITB9LHJvdGF0aW9uOntjb25maWd1cmFibGU6ITB9LGJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sYWxwaGE6e2NvbmZpZ3VyYWJsZTohMH0sY29sb3I6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LGUscixpKXt2YXIgbj10LmdldFJlbmRlclRhcmdldCgpO24udHJhbnNmb3JtPXRoaXMudGFyZ2V0VHJhbnNmb3JtLHRoaXMudGludEZpbHRlci5hcHBseSh0LGUsbiwhMCksdGhpcy5ibHVyRmlsdGVyLmFwcGx5KHQsbixyKSx0LmFwcGx5RmlsdGVyKHRoaXMsZSxyLGkpLG4udHJhbnNmb3JtPW51bGwsdC5yZXR1cm5SZW5kZXJUYXJnZXQobil9LGkucHJvdG90eXBlLl91cGRhdGVQYWRkaW5nPWZ1bmN0aW9uKCl7dGhpcy5wYWRkaW5nPXRoaXMuZGlzdGFuY2UrMip0aGlzLmJsdXJ9LGkucHJvdG90eXBlLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLnRhcmdldFRyYW5zZm9ybS50eD10aGlzLmRpc3RhbmNlKk1hdGguY29zKHRoaXMuYW5nbGUpLHRoaXMudGFyZ2V0VHJhbnNmb3JtLnR5PXRoaXMuZGlzdGFuY2UqTWF0aC5zaW4odGhpcy5hbmdsZSl9LG4uZGlzdGFuY2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Rpc3RhbmNlfSxuLmRpc3RhbmNlLnNldD1mdW5jdGlvbih0KXt0aGlzLl9kaXN0YW5jZT10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKSx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5yb3RhdGlvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hbmdsZS9QSVhJLkRFR19UT19SQUR9LG4ucm90YXRpb24uc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYW5nbGU9dCpQSVhJLkRFR19UT19SQUQsdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4uYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyRmlsdGVyLmJsdXJ9LG4uYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyRmlsdGVyLmJsdXI9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCl9LG4uYWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYX0sbi5hbHBoYS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhPXR9LG4uY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxuLmNvbG9yLnNldD1mdW5jdGlvbih0KXtQSVhJLnV0aWxzLmhleDJyZ2IodCx0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpLnByb3RvdHlwZSxuKSxpfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkRyb3BTaGFkb3dGaWx0ZXI9aSx0LkRyb3BTaGFkb3dGaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWRyb3Atc2hhZG93LmpzLm1hcFxuIiwiXHJcbi8vQmxhZGUgSlMgY29uc3RydWN0b3JcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsYWRlKHRleHR1cmUpIHtcclxuICB2YXIgY291bnQgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAxMDtcclxuICB2YXIgbWluRGlzdCA9XHJcbiAgICBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDQwO1xyXG4gIHZhciBsaXZlVGltZSA9XHJcbiAgICBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDIwO1xyXG5cclxuICB2YXIgcG9pbnRzID0gW107XHJcbiAgdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gIHRoaXMubWluRGlzdCA9IG1pbkRpc3Q7XHJcbiAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcclxuICB0aGlzLm1pbk1vdGlvblNwZWVkID0gNDAwMC4wO1xyXG4gIHRoaXMubGl2ZVRpbWUgPSBsaXZlVGltZTtcclxuICB0aGlzLmxhc3RNb3Rpb25TcGVlZCA9IDA7XHJcbiAgdGhpcy50YXJnZXRQb3NpdGlvbiA9IG5ldyBQSVhJLlBvaW50KDAsIDApO1xyXG5cclxuICB0aGlzLmJvZHkgPSBuZXcgUElYSS5tZXNoLlJvcGUodGV4dHVyZSwgcG9pbnRzKTtcclxuXHJcbiAgdmFyIGxhc3RQb3NpdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5VcGRhdGUgPSBmdW5jdGlvbih0aWNrZXIpIHtcclxuICAgIHZhciBpc0RpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgdmFyIHBvaW50cyA9IHRoaXMuYm9keS5wb2ludHM7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IHBvaW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBpZiAocG9pbnRzW2ldLmxhc3RUaW1lICsgdGhpcy5saXZlVGltZSA8IHRpY2tlci5sYXN0VGltZSkge1xyXG4gICAgICAgIHBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIGlzRGlydHkgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHQgPSBuZXcgUElYSS5Qb2ludChcclxuICAgICAgdGhpcy50YXJnZXRQb3NpdGlvbi54IC8gdGhpcy5ib2R5LnNjYWxlLngsXHJcbiAgICAgIHRoaXMudGFyZ2V0UG9zaXRpb24ueSAvIHRoaXMuYm9keS5zY2FsZS55XHJcbiAgICApO1xyXG5cclxuICAgIGlmIChsYXN0UG9zaXRpb24gPT0gbnVsbCkgbGFzdFBvc2l0aW9uID0gdDtcclxuXHJcbiAgICB0Lmxhc3RUaW1lID0gdGlja2VyLmxhc3RUaW1lO1xyXG5cclxuICAgIHZhciBwID0gbGFzdFBvc2l0aW9uO1xyXG5cclxuICAgIHZhciBkeCA9IHQueCAtIHAueDtcclxuICAgIHZhciBkeSA9IHQueSAtIHAueTtcclxuXHJcbiAgICB2YXIgZGlzdCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG4gICAgdGhpcy5sYXN0TW90aW9uU3BlZWQgPSBkaXN0ICogMTAwMCAvIHRpY2tlci5lbGFwc2VkTVM7XHJcbiAgICBpZiAoZGlzdCA+IG1pbkRpc3QpIHtcclxuICAgICAgaWYgKHRoaXMubGFzdE1vdGlvblNwZWVkID4gdGhpcy5taW5Nb3Rpb25TcGVlZCkge1xyXG4gICAgICAgIHBvaW50cy5wdXNoKHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwb2ludHMubGVuZ3RoID4gdGhpcy5jb3VudCkge1xyXG4gICAgICAgIHBvaW50cy5zaGlmdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpc0RpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBsYXN0UG9zaXRpb24gPSB0O1xyXG4gICAgaWYgKGlzRGlydHkpIHtcclxuICAgICAgdGhpcy5ib2R5LnJlZnJlc2godHJ1ZSk7XHJcbiAgICAgIHRoaXMuYm9keS5yZW5kZXJhYmxlID0gcG9pbnRzLmxlbmd0aCA+IDE7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5SZWFkQ2FsbGJhY2tzID0gZnVuY3Rpb24odGFyZ2V0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGFyZ2V0Lm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgc2VsZi50YXJnZXRQb3NpdGlvbiA9IGUuZGF0YS5nbG9iYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC5tb3VzZW92ZXIgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIC8vXHRzZWxmLnRhcmdldFBvc2l0aW9uID0gIGUuZGF0YS5nbG9iYWw7XHJcbiAgICAgIC8vXHRjb25zb2xlLmxvZyhcIm92ZXJcIik7XHJcbiAgICAgIC8vICBzZWxmLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaG1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG91Y2ggbW92ZVwiKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhlLmRhdGEpO1xyXG4gICAgICBzZWxmLnRhcmdldFBvc2l0aW9uID0gZS5kYXRhLmdsb2JhbDtcclxuICAgIH07XHJcblxyXG4gICAgdGFyZ2V0LnRvdWNoc3RhcnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG91Y2ggc3RhcnRcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5kYXRhKTtcclxuICAgICAgLy8gIHNlbGYuTW92ZUFsbChlLmRhdGEuZ2xvYmFsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGFyZ2V0LnRvdWNoZW5kID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIHN0YXJ0XCIpO1xyXG4gICAgICAvLyBfQmxhZGUuTW92ZUFsbChlLmRhdGEuZ2xvYmFsKTtcclxuICAgIH07XHJcbiAgICAvLyDQsCDRgtC+INC70LDQv9GI0LAg0LrQsNC60LDRjy3RgtC+XHJcbiAgfTtcclxufTtcclxuXHJcbi8vcmV0dXJuIEJsYWRlO1xyXG5cclxuIiwiXHJcbnZhciBfTUUgPSBNYXR0ZXIuRW5naW5lLFxyXG4gICAgX01XID0gTWF0dGVyLldvcmxkLFxyXG4gICAgX01CcyA9IE1hdHRlci5Cb2RpZXMsXHJcbiAgICBfTUIgPSBNYXR0ZXIuQm9keSxcclxuICAgIF9NQyA9IE1hdHRlci5Db21wb3NpdGUsXHJcbiAgICBfTUV2ID0gTWF0dGVyLkV2ZW50cyxcclxuICAgIF9NViA9IE1hdHRlci5WZWN0b3I7XHJcblxyXG5sZXQgQ3JlYXRlU3ViQm9keSA9IGZ1bmN0aW9uKHBhcmVudCwgdGV4RGF0YSl7XHJcblxyXG4gIGxldCBvYmogPSBDcmVhdGVTbGljYWJsZU9iamVjdChwYXJlbnQucG9zaXRpb24sIHBhcmVudC5lbmdpbmUsIHRleERhdGEpO1xyXG4gIFxyXG4gIG9iai5zY2FsZS5zZXQoMC4yLCAwLjIpO1xyXG4gIG9iai5wYXJlbnRHcm91cCA9IHRleERhdGEuZ3JvdXA7XHJcblxyXG4gIF9NQi5zZXRNYXNzKG9iai5waEJvZHksIHBhcmVudC5waEJvZHkubWFzcyAqIDAuNSk7XHJcbiAgX01CLnNldFZlbG9jaXR5KG9iai5waEJvZHksIHBhcmVudC5waEJvZHkudmVsb2NpdHkpO1xyXG4gIF9NQi5zZXRBbmdsZShvYmoucGhCb2R5LCBwYXJlbnQucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG5cclxuICBsZXQgYW5jaG9yZWRfZGlyID0gX01WLm5vcm1hbGlzZSh7eDpvYmouYW5jaG9yLnggLSAwLjUsIHk6IDAuNSAtIG9iai5hbmNob3IueSB9KTtcclxuICBhbmNob3JlZF9kaXIgPSBfTVYucm90YXRlKGFuY2hvcmVkX2RpciwgcGFyZW50LnBoQm9keS5zbGljZUFuZ2xlKTtcclxuXHJcbiAgX01CLmFwcGx5Rm9yY2Uob2JqLnBoQm9keSwgb2JqLnBoQm9keS5wb3NpdGlvbiwge1xyXG4gICAgeDogIGFuY2hvcmVkX2Rpci54ICogMC4wMixcclxuICAgIHk6ICBhbmNob3JlZF9kaXIueSAqIDAuMDJcclxuICB9KTtcclxuXHJcbiAgLy9kb3duUGFydC5waEJvZHkudG9ycXVlID0gdGhpcy5waEJvZHkudG9ycXVlICogMTA7XHJcblxyXG4gIHBhcmVudC5wYXJlbnQuYWRkQ2hpbGQob2JqKTtcclxuXHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3JlYXRlU2xpY2FibGVPYmplY3QocG9zLCBlbmdpbmUsIGRhdGEpIHtcclxuICBcclxuICB2YXIgb2JqID0gbnVsbDtcclxuICBpZiAoZGF0YSAmJiBkYXRhLm5vcm1hbCkge1xyXG4gICAgb2JqID0gbmV3IFBJWEkuU3ByaXRlKGRhdGEubm9ybWFsLnRleCk7XHJcblxyXG4gICAgaWYgKGRhdGEubm9ybWFsLnBpdm90KSB7XHJcbiAgICAgIG9iai5hbmNob3Iuc2V0KGRhdGEubm9ybWFsLnBpdm90LngsIGRhdGEubm9ybWFsLnBpdm90LnkpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHRleFNILnBpdm90KTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gIFxyXG4gICAgb2JqID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuICAgIG9iai5iZWdpbkZpbGwoMHg5OTY2ZiAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgb2JqLmRyYXdDaXJjbGUoMCwgMCwgNTApO1xyXG4gICAgb2JqLmVuZEZpbGwoKTtcclxuICBcclxuICB9XHJcblxyXG4gIG9iai5zcHJpdGVEYXRhID0gZGF0YTtcclxuICBvYmouZW5naW5lID0gZW5naW5lO1xyXG4gIG9iai54ID0gcG9zLng7XHJcbiAgb2JqLnkgPSBwb3MueTtcclxuXHJcbiAgb2JqLm9uc2xpY2UgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgb2JqLnNwcml0ZURhdGEucGFydHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBDcmVhdGVTdWJCb2R5KG9iaiwge25vcm1hbDogb2JqLnNwcml0ZURhdGEucGFydHNbaV19KTtcclxuICAgIH1cclxuXHJcbiAgfTtcclxuXHJcbiAgb2JqLmtpbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLnBoQm9keS5zbGljZWQgJiYgdGhpcy5vbnNsaWNlKSB7XHJcbiAgICAgIHRoaXMub25zbGljZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSh7IGNoaWxkcmVuOiB0cnVlIH0pO1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBoQm9keSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBfTUMucmVtb3ZlKGVuZ2luZS53b3JsZCwgdGhpcy5waEJvZHkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBwaEJvZHkgPSBfTUJzLmNpcmNsZShwb3MueCwgcG9zLnksIDUwKTtcclxuICBwaEJvZHkuY29sbGlzaW9uRmlsdGVyLm1hc2sgJj0gfnBoQm9keS5jb2xsaXNpb25GaWx0ZXIuY2F0ZWdvcnk7XHJcbiAgX01XLmFkZChlbmdpbmUud29ybGQsIHBoQm9keSk7XHJcblxyXG4gIHBoQm9keS5waU9iaiA9IG9iajtcclxuICBvYmoucGhCb2R5ID0gcGhCb2R5O1xyXG5cclxuICByZXR1cm4gb2JqO1xyXG59XHJcbiIsImltcG9ydCB7RHJvcFNoYWRvd0ZpbHRlcn0gZnJvbSAnQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93J1xyXG5pbXBvcnQgQ3JlYXRlU2xpY2FibGVPYmplY3QgZnJvbSAnLi9TbGljYWJsZU9iamVjdCdcclxuaW1wb3J0IEJsYWRlIGZyb20gJy4vQmxhZGUnXHJcblxyXG4vLyBmdW5jdGlvbiwgd2hvIGNyZWF0ZSBhbmQgaW5zdGFuY2UgU2xpY2VkTGF5b3V0XHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNsaWNlTGF5ZXIgKGFwcCkge1xyXG4gIHZhciBfTUUgPSBNYXR0ZXIuRW5naW5lLFxyXG4gICAgX01XID0gTWF0dGVyLldvcmxkLFxyXG4gICAgX01CcyA9IE1hdHRlci5Cb2RpZXMsXHJcbiAgICBfTUIgPSBNYXR0ZXIuQm9keSxcclxuICAgIF9NQyA9IE1hdHRlci5Db21wb3NpdGUsXHJcbiAgICBfTUV2ID0gTWF0dGVyLkV2ZW50cyxcclxuICAgIF9NViA9IE1hdHRlci5WZWN0b3IsXHJcbiAgICBfTFJlcyA9IGFwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG5cclxuICB2YXIgZW5naW5lID0gX01FLmNyZWF0ZSgpO1xyXG4gIGVuZ2luZS53b3JsZC5zY2FsZSA9IDAuMDAwMTtcclxuICBlbmdpbmUud29ybGQuZ3Jhdml0eS55ID0gMC4zNTtcclxuXHJcbiAgX01FLnJ1bihlbmdpbmUpO1xyXG5cclxuXHJcblxyXG4gIHZhciBzdGFnZSA9IG5ldyBQSVhJLmRpc3BsYXkuU3RhZ2UoKTtcclxuXHJcbiAgdmFyIF9scmVzID0gYXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcblxyXG4gIHZhciBzbGljZVVwR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDEsIGZhbHNlKTtcclxuICB2YXIgc2xpY2VNaWRkbGVHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMCwgZmFsc2UpO1xyXG4gIHZhciBzbGljZURvd25Hcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoLTEsIGZhbHNlKTtcclxuICB2YXIgdWlHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMTAsIGZhbHNlKTtcclxuICBcclxuICBzdGFnZS5maWx0ZXJzID0gW25ldyBEcm9wU2hhZG93RmlsdGVyKCldO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlVXBHcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VEb3duR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlTWlkZGxlR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHVpR3JvdXApKTtcclxuXHJcbiAgLy9zdGFnZS5ncm91cC5lbmFibGVTb3J0ID0gdHJ1ZTtcclxuICBzdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIHN0YWdlLl9kZWJ1Z1RleHQgPSBuZXcgUElYSS5UZXh0KFwiQm9keSBjb3VudDogMFwiLCB7XHJcbiAgICBmb250RmFtaWx5OiBcIkFyaWFsXCIsXHJcbiAgICBmb250U2l6ZTogMzIsXHJcbiAgICBmaWxsOiAweGZmMTAxMCxcclxuICAgIHN0cm9rZTogMHgwMGNjMTAsXHJcbiAgICBhbGlnbjogXCJsZWZ0XCJcclxuICB9KTtcclxuXHJcbiAgc3RhZ2UuX2RlYnVnVGV4dC5wb3NpdGlvbi5zZXQoMTAsIDQyKTtcclxuIC8vIGNvbnNvbGUubG9nKFwicHJlXCIpO1xyXG4gIHN0YWdlLmJsYWRlID0gbmV3IEJsYWRlKFxyXG4gICAgX2xyZXMuYmxhZGVfdGV4LnRleHR1cmUsXHJcbiAgICAzMCxcclxuICAgIDEwLFxyXG4gICAgMTAwXHJcbiAgKTtcclxuICBzdGFnZS5ibGFkZS5taW5Nb3ZhYmxlU3BlZWQgPSAxMDAwO1xyXG4gIHN0YWdlLmJsYWRlLmJvZHkucGFyZW50R3JvdXAgPSBzbGljZU1pZGRsZUdyb3VwO1xyXG4gIHN0YWdlLmJsYWRlLlJlYWRDYWxsYmFja3Moc3RhZ2UpO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5ibGFkZS5ib2R5KTtcclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5fZGVidWdUZXh0KTtcclxuXHJcbiAgdmFyIHNsaWNlcyA9IDA7XHJcbiAgLy8gc2xpY2VzIHZpYSBSYXljYXN0IFRlc3RpbmdcclxuICB2YXIgUmF5Q2FzdFRlc3QgPSBmdW5jdGlvbiBSYXlDYXN0VGVzdChib2RpZXMpIHtcclxuICAgIGlmIChzdGFnZS5ibGFkZS5sYXN0TW90aW9uU3BlZWQgPiBzdGFnZS5ibGFkZS5taW5Nb3Rpb25TcGVlZCkge1xyXG4gICAgICB2YXIgcHBzID0gc3RhZ2UuYmxhZGUuYm9keS5wb2ludHM7XHJcblxyXG4gICAgICBpZiAocHBzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IE1hdGgubWluKHBwcy5sZW5ndGgsIDQpOyBpKyspIHtcclxuICAgICAgICAgIC8vIDQg0L/QvtGB0LvQtdC00L3QuNGFINGB0LXQs9C80LXQvdGC0LBcclxuXHJcbiAgICAgICAgICB2YXIgc3AgPSBwcHNbaSAtIDFdO1xyXG4gICAgICAgICAgdmFyIGVwID0gcHBzW2ldO1xyXG5cclxuICAgICAgICAgIHZhciBjb2xsaXNpb25zID0gTWF0dGVyLlF1ZXJ5LnJheShib2RpZXMsIHNwLCBlcCk7XHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbGxpc2lvbnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnNbal0uYm9keS5jYW5TbGljZSkge1xyXG4gICAgICAgICAgICAgIHZhciBzdiA9IHsgeTogZXAueSAtIHNwLnksIHg6IGVwLnggLSBzcC54IH07XHJcbiAgICAgICAgICAgICAgc3YgPSBfTVYubm9ybWFsaXNlKHN2KTtcclxuXHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUgPSBfTVYuYW5nbGUoc3AsIGVwKTtcclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VWZWN0b3IgPSBzdjtcclxuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm9keSBzbGljZSBhbmdsZTpcIiwgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUpO1xyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICBzbGljZXMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBmcmFtZXMgPSAwO1xyXG4gIHZhciBsYXN0U2hvdFggPSBudWxsO1xyXG5cclxuICAvLyB1cGRhdGUgdmlld1xyXG4gIHZhciBVcGRhdGUgPSBmdW5jdGlvbiBVcGRhdGUoKSB7XHJcbiAgICBzdGFnZS5fZGVidWdUZXh0LnRleHQgPVxyXG4gICAgICBcItCS0Ysg0LTQtdGA0LfQutC+INC30LDRgNC10LfQsNC70LggXCIgKyBzbGljZXMudG9TdHJpbmcoKSArIFwiINC60YDQvtC70LjQum/QsijQutCwKShcIjtcclxuXHJcbiAgICB2YXIgYm9kaWVzID0gX01DLmFsbEJvZGllcyhlbmdpbmUud29ybGQpO1xyXG5cclxuICAgIGZyYW1lcysrO1xyXG4gICAgaWYgKGZyYW1lcyA+PSAyMCAmJiBib2RpZXMubGVuZ3RoIDwgNSkge1xyXG4gICAgICBmcmFtZXMgPSAwO1xyXG4gICAgICB2YXIgcG9zID0ge1xyXG4gICAgICAgIHg6XHJcbiAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tUmFuZ2UoMCwgMTApKSAqXHJcbiAgICAgICAgICBNYXRoLmZsb29yKChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApIC8gMTApLFxyXG4gICAgICAgIHk6IGFwcC5yZW5kZXJlci5oZWlnaHQgKyAxMDBcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHdoaWxlIChsYXN0U2hvdFggIT09IG51bGwgJiYgTWF0aC5hYnMobGFzdFNob3RYIC0gcG9zLngpIDwgMjAwKSB7XHJcbiAgICAgICAgcG9zLnggPVxyXG4gICAgICAgICAgTWF0aC5yb3VuZChNYXRoLnJhbmRvbVJhbmdlKDAsIDEwKSkgKlxyXG4gICAgICAgICAgTWF0aC5mbG9vcigoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKSAvIDEwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGFzdFNob3RYID0gcG9zLng7XHJcblxyXG4gICAgICBwb3MueCAtPSAxMDA7IC8vb2Zmc2V0XHJcblxyXG4gICAgICAvLy8g0JLRi9C90LXRgdGC0Lgg0Y3RgtC+INCz0L7QstC90L4g0LrRg9C00LAt0L3QuNCx0YPQtNGMINCyINC00YDRg9Cz0L7QtSDQvNC10YHRgtC+XHJcblxyXG4gICAgICAvL2Jhbm55XHJcblx0ICAgIGxldCBiZGF0YSA9IF9MUmVzLmJ1bm55LnNwcml0ZXNoZWV0O1xyXG5cclxuXHRcdGxldCBkYXRhID0ge1xyXG5cdCAgICAgIFx0bm9ybWFsOiB7XHJcblx0ICAgICBcdCAgIHRleDogYmRhdGEudGV4dHVyZXMuYnVubnksXHJcblx0ICAgICBcdCAgIHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueS5waXZvdCxcclxuXHQgICAgIFx0ICAgZ3JvdXA6c2xpY2VEb3duR3JvdXBcclxuXHQgICAgICBcdH0sXHJcblx0ICAgICAgXHRwYXJ0czpbXHJcblx0XHQgICAgICBcdHtcclxuXHRcdCAgICAgICAgICB0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55X3RvcnNlLFxyXG5cdFx0ICAgICAgICAgIHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueV90b3JzZS5waXZvdCxcclxuXHRcdCAgICAgICAgICBncm91cDogc2xpY2VEb3duR3JvdXBcclxuXHRcdCAgICAgICAgfSxcclxuXHRcdCAgICAgICAge1xyXG5cdFx0ICAgICAgICBcdHRleDogYmRhdGEudGV4dHVyZXMuYnVubnlfaGVhZCxcclxuXHRcdCAgICAgICAgXHRwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnlfaGVhZC5waXZvdCxcclxuXHRcdCAgICAgICAgXHRncm91cDogc2xpY2VVcEdyb3VwXHJcblx0ICAgICAgICBcdH1cclxuXHQgICAgICAgIF1cclxuXHQgICAgfTtcclxuXHJcbiAgICAgIHZhciBvYmogPSBDcmVhdGVTbGljYWJsZU9iamVjdChwb3MsIGVuZ2luZSwgZGF0YSk7XHJcblxyXG4gICAgICBvYmouc2NhbGUuc2V0KDAuMiwgMC4yKTtcclxuICAgICAgb2JqLnBoQm9keS5jYW5TbGljZSA9IHRydWU7XHJcblxyXG4gICAgICB2YXIgX29meCA9IDAuNSAtIChwb3MueCArIDEwMCkgLyAoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKTtcclxuXHJcbiAgICAgIHZhciByYW5nZSA9IDAuODtcclxuICAgICAgdmFyIGltcCA9IHtcclxuICAgICAgICB4OiByYW5nZSAqIF9vZngsXHJcbiAgICAgICAgeTogLU1hdGgucmFuZG9tUmFuZ2UoMC40LCAwLjUpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBfTUIuYXBwbHlGb3JjZShvYmoucGhCb2R5LCBvYmoucGhCb2R5LnBvc2l0aW9uLCBpbXApO1xyXG4gICAgICBvYmoucGhCb2R5LnRvcnF1ZSA9IE1hdGgucmFuZG9tUmFuZ2UoLTEwLCAxMCk7XHJcblxyXG4gICAgICBzdGFnZS5hZGRDaGlsZChvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0aWNrZXIgPSBhcHAudGlja2VyO1xyXG4gICAgc3RhZ2UuYmxhZGUuVXBkYXRlKHRpY2tlcik7XHJcblxyXG4gICAgLy9DYXN0VGVzdFxyXG4gICAgUmF5Q2FzdFRlc3QoYm9kaWVzKTtcclxuXHJcbiAgICBfTUUudXBkYXRlKGVuZ2luZSk7XHJcbiAgICAvLyBpdGVyYXRlIG92ZXIgYm9kaWVzIGFuZCBmaXh0dXJlc1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBib2RpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgdmFyIGJvZHkgPSBib2RpZXNbaV07XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGJvZHkucGlPYmogIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAoYm9keS5wb3NpdGlvbi55ID4gYXBwLnJlbmRlcmVyLmhlaWdodCArIDEwMCAmJlxyXG4gICAgICAgICAgICBib2R5LnZlbG9jaXR5LnkgPiAwKSB8fFxyXG4gICAgICAgICAgYm9keS5zbGljZWRcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGJvZHkucGlPYmoua2lsbCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnggPSBib2R5LnBvc2l0aW9uLng7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnkgPSBib2R5LnBvc2l0aW9uLnk7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnJvdGF0aW9uID0gYm9keS5hbmdsZTtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coYm9keS5hbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgTWF0aC5yYW5kb21SYW5nZSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG4gIH07XHJcbiAgLy9ydW4gVXBkYXRlXHJcbiAgYXBwLnRpY2tlci5hZGQoVXBkYXRlLCB0aGlzKTtcclxuXHJcbiAgLy8vLyBSRVRVUk5cclxuICByZXR1cm4gc3RhZ2U7XHJcbn1cclxuXHJcbi8vZXhwb3J0IHtTbGljZUxheWVyIH07XHJcbi8vbW9kdWxlLmV4cG9ydHMgPSBTbGljZUxheWVyO1xyXG4vL3JldHVybiBTbGljZUxheWVyO1xyXG4iLCJpbXBvcnQgX1NsaWNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL1NsaWNlTGF5ZXJcIlxyXG5cclxudmFyIF9BcHAgPSBudWxsLFxyXG4gIF9MUmVzID0gbnVsbCxcclxuICBfUmVuZGVyZXIgPSBudWxsLFxyXG4gIF9JbnRNYW5hZ2VyID0gbnVsbCxcclxuICBfU2xpY2VkU3RhZ2UgPSBudWxsO1xyXG5cclxudmFyIEluaXQgPSBmdW5jdGlvbiBJbml0KCkge1xyXG4gIF9BcHAgPSBuZXcgUElYSS5BcHBsaWNhdGlvbih7XHJcbiAgICB3aWR0aDogMTI4MCxcclxuICAgIGhlaWdodDogNzIwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweGZmZmZmZlxyXG4gIH0pO1xyXG4gIC8v0KLQsNC6INC90LDQtNC+LCDRgdGC0LDQvdC00LDRgNGC0L3Ri9C1INC90LUg0LHRg9C00YPRgiDQvtGC0L7QsdGA0LDQttCw0YLRgdGPXHJcbiAgX0FwcC5zdGFnZSA9IG5ldyBQSVhJLmRpc3BsYXkuU3RhZ2UoKTtcclxuXHJcbiAgX0xSZXMgPSBfQXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcbiAgX0ludE1hbmFnZXIgPSBfQXBwLnJlbmRlcmVyLnBsdWdpbnMuaW50ZXJhY3Rpb247XHJcblxyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX0FwcC52aWV3KTtcclxuICBvblJlc2l6ZSgpO1xyXG4gIHdpbmRvdy5vbnJlc2l6ZSA9IG9uUmVzaXplO1xyXG5cclxuICBfQXBwLnRpY2tlci5hZGQob25VcGRhdGUsIHRoaXMpO1xyXG5cclxuICBfQXBwLnN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgdmFyIGxvYWRTdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cclxuICB2YXIgbG9hZEJ1dHRvbiA9IG5ldyBQSVhJLlRleHQoXCJUaGlzIGlzIGEgTG9hZCBCdXR0b25cIiwge1xyXG4gICAgZm9udEZhbWlseTogXCJBcmlhbFwiLFxyXG4gICAgZm9udFNpemU6IDc0LFxyXG4gICAgZmlsbDogMHhmZjEwMTAsXHJcbiAgICBhbGlnbjogXCJjZW50ZXJcIlxyXG4gIH0pO1xyXG5cclxuICBsb2FkQnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xyXG4gIGxvYWRCdXR0b24uYnV0dG9uTW9kZSA9IHRydWU7XHJcbiAgbG9hZEJ1dHRvbi5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIGxvYWRCdXR0b24ucG9zaXRpb24uc2V0KF9BcHAucmVuZGVyZXIud2lkdGggLyAyLCBfQXBwLnJlbmRlcmVyLmhlaWdodCAvIDIpO1xyXG5cclxuICBsb2FkQnV0dG9uLmNsaWNrID0gTG9hZEdhbWU7XHJcbiAgbG9hZFN0YWdlLmFkZENoaWxkKGxvYWRCdXR0b24pO1xyXG5cclxuICBfQXBwLkxvYWRTdGFnZSA9IGxvYWRTdGFnZTtcclxuICBfQXBwLnN0YWdlLmFkZENoaWxkKGxvYWRTdGFnZSk7XHJcbn07XHJcblxyXG4vLyB1cGRhdGUgZnVuY3Rpb24sIHBhc3MgV2luZG93IGFzIHNjb3BlICh0aGlzID0gX0FwcClcclxudmFyIG9uVXBkYXRlID0gZnVuY3Rpb24gb25VcGRhdGUoKSB7XHJcbiAgdmFyIGR0ID0gX0FwcC50aWNrZXIuZGVsdGFUaW1lO1xyXG59O1xyXG5cclxuLy9pbnZva2VkIGFmdGVyIGxvYWRpbmcgZ2FtZSByZXNvdXJjZXNcclxudmFyIEdhbWVMb2FkZWQgPSBmdW5jdGlvbiBHYW1lTG9hZGVkKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiR2FtZSBpcyBsb2FkZWRcIik7XHJcblxyXG4gIGNvbnNvbGUubG9nKF9TbGljZVN0YWdlQ3JlYXRlcik7XHJcbiAgX1NsaWNlZFN0YWdlID0gIF9TbGljZVN0YWdlQ3JlYXRlcihfQXBwKTsgLy9fTFJlcy5zbGljZV9qcy5mdW5jdGlvbihfQXBwKTtcclxuXHJcbiAgX0FwcC5zdGFnZS5hZGRDaGlsZChfU2xpY2VkU3RhZ2UpO1xyXG5cclxuICBfQXBwLkxvYWRTdGFnZS5kZXN0cm95KCk7XHJcbn07XHJcblxyXG52YXIgTG9hZEdhbWUgPSBmdW5jdGlvbiBMb2FkR2FtZSgpIHtcclxuICB2YXIgbG9hZGVyID0gX0FwcC5sb2FkZXI7XHJcblxyXG4gIGxvYWRlclxyXG4gICAgLmFkZChcImJsYWRlX3RleFwiLCBcIi4vc3JjL2ltYWdlcy9ibGFkZS5wbmdcIilcclxuICAgIC5hZGQoXCJidW5ueVwiLCBcIi4vc3JjL2ltYWdlcy9idW5ueV9zcy5qc29uXCIpXHJcbiAgICAubG9hZChmdW5jdGlvbihsLCByZXMpIHtcclxuXHJcbiAgICAgIEdhbWVMb2FkZWQoKTtcclxuICAgICAgXHJcbiAgICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0IGxvYWRcIik7XHJcbn07XHJcblxyXG4vLyByZXNpemVcclxudmFyIG9uUmVzaXplID0gZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcclxuICB2YXIgX3cgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gIHZhciBfaCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBpZiAoX3cgLyBfaCA8IDE2IC8gOSkge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX3cgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX3cgKiA5IC8gMTYgKyBcInB4XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF9oICogMTYgLyA5ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF9oICsgXCJweFwiO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG53aW5kb3cub25sb2FkID0gSW5pdDsiXX0=
