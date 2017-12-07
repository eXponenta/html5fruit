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
exports.default = SliceLayer;

var _filterDropShadow = require("@pixi/filter-drop-shadow");

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

  // TODO : SlicableObject.js
  var AddSlicableObject = function AddSlicableObject(pos) {
    var texSH = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

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
    //	phBody.isSensor = true;
    //	phBody.inertia = 0.0001;
    phBody.collisionFilter.mask &= ~phBody.collisionFilter.category;
    //_MB.setMass(phBody, 10);
    _MW.add(engine.world, phBody);

    phBody.piObj = obj;
    obj.phBody = phBody;

    return obj;
  };

  // -- SlicableObject.js

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
  stage.blade = new _lres.blade_js.function(_lres.blade_tex.texture, 30, 10, 100);
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
      var obj = AddSlicableObject(pos, {
        tex: bdata.textures.bunny,
        pivot: bdata.data.frames.bunny.pivot
      });

      obj.scale.set(0.2, 0.2);
      obj.parentGroup = sliceDownGroup;
      obj.phBody.canSlice = true;
      //длиннннный калбек
      obj.onslice = function () {
        var downPart = AddSlicableObject(this.position, {
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

        var upPart = AddSlicableObject(this.position, {
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

},{"@pixi/filter-drop-shadow":1}],3:[function(require,module,exports){
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

  loader.add("blade_js", "./src/scripts/Blade_new.js")
  //.add("slice_js", "./src/scripts/SliceLayer.js")
  .add("blade_tex", "./src/images/blade.png").add("bunny", "./src/images/bunny_ss.json").load(function (l, res) {

    res.blade_js.function = new Function(res.blade_js.data)();
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

},{"./SliceLayer":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsInNyY1xcc2NyaXB0c1xcU2xpY2VMYXllci5qcyIsInNyY1xcc2NyaXB0c1xcY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O2tCQ053QixVOztBQUh4Qjs7QUFFQTtBQUNlLFNBQVMsVUFBVCxDQUFxQixHQUFyQixFQUEwQjtBQUN2QyxNQUFJLE1BQU0sT0FBTyxNQUFqQjtBQUFBLE1BQ0UsTUFBTSxPQUFPLEtBRGY7QUFBQSxNQUVFLE9BQU8sT0FBTyxNQUZoQjtBQUFBLE1BR0UsTUFBTSxPQUFPLElBSGY7QUFBQSxNQUlFLE1BQU0sT0FBTyxTQUpmO0FBQUEsTUFLRSxPQUFPLE9BQU8sTUFMaEI7QUFBQSxNQU1FLE1BQU0sT0FBTyxNQU5mO0FBQUEsTUFPRSxRQUFRLElBQUksTUFBSixDQUFXLFNBUHJCOztBQVNBLE1BQUksU0FBUyxJQUFJLE1BQUosRUFBYjtBQUNBLFNBQU8sS0FBUCxDQUFhLEtBQWIsR0FBcUIsTUFBckI7QUFDQSxTQUFPLEtBQVAsQ0FBYSxPQUFiLENBQXFCLENBQXJCLEdBQXlCLElBQXpCOztBQUVBLE1BQUksR0FBSixDQUFRLE1BQVI7O0FBRUE7QUFDQSxNQUFJLG9CQUFvQixTQUFTLGlCQUFULENBQTJCLEdBQTNCLEVBQWdDO0FBQ3RELFFBQUksUUFDRixVQUFVLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0IsVUFBVSxDQUFWLE1BQWlCLFNBQXpDLEdBQXFELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxJQUR0RTs7QUFHQSxRQUFJLE1BQU0s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UUFBVCxHQUFvQjtBQUNqQyxNQUFJLFNBQVMsS0FBSyxNQUFsQjs7QUFFQSxTQUNHLEdBREgsQ0FDTyxVQURQLEVBQ21CLDRCQURuQjtBQUVFO0FBRkYsR0FHRyxHQUhILENBR08sV0FIUCxFQUdvQix3QkFIcEIsRUFJRyxHQUpILENBSU8sT0FKUCxFQUlnQiw0QkFKaEIsRUFLRyxJQUxILENBS1EsVUFBUyxDQUFULEVBQVksR0FBWixFQUFpQjs7QUFFckIsUUFBSSxRQUFKLENBQWEsUUFBYixHQUF5QixJQUFJLFFBQUosQ0FBYSxJQUFJLFFBQUosQ0FBYSxJQUExQixDQUFELEVBQXhCO0FBQ0Y7O0FBRUU7QUFDRCxHQVhIOztBQWFBLFVBQVEsR0FBUixDQUFZLGlCQUFaO0FBQ0QsQ0FqQkQ7O0FBbUJBO0FBQ0EsSUFBSSxXQUFXLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QjtBQUN0QyxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsV0FBdkI7QUFDQSxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsWUFBdkI7O0FBRUEsTUFBSSxLQUFLLEVBQUwsR0FBVSxLQUFLLENBQW5CLEVBQXNCO0FBQ3BCLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsS0FBSyxJQUE3QjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsS0FBSyxDQUFMLEdBQVMsRUFBVCxHQUFjLElBQXZDO0FBQ0QsR0FIRCxNQUdPO0FBQ0wsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixLQUFoQixHQUF3QixLQUFLLEVBQUwsR0FBVSxDQUFWLEdBQWMsSUFBdEM7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLE1BQWhCLEdBQXlCLEtBQUssSUFBOUI7QUFDRDtBQUNGLENBWEQ7O0FBY0EsT0FBTyxNQUFQLEdBQWdCLElBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IC0gdjIuMy4xXG4gKiBDb21waWxlZCBXZWQsIDI5IE5vdiAyMDE3IDE2OjQ1OjE5IFVUQ1xuICpcbiAqIHBpeGktZmlsdGVycyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUodC5fX2ZpbHRlcl9kcm9wX3NoYWRvdz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSB2ZWMzIGNvbG9yO1xcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBVbi1wcmVtdWx0aXBseSBhbHBoYSBiZWZvcmUgYXBwbHlpbmcgdGhlIGNvbG9yXFxuICAgIGlmIChzYW1wbGUuYSA+IDAuMCkge1xcbiAgICAgICAgc2FtcGxlLnJnYiAvPSBzYW1wbGUuYTtcXG4gICAgfVxcblxcbiAgICAvLyBQcmVtdWx0aXBseSBhbHBoYSBhZ2FpblxcbiAgICBzYW1wbGUucmdiID0gY29sb3IucmdiICogc2FtcGxlLmE7XFxuXFxuICAgIC8vIGFscGhhIHVzZXIgYWxwaGFcXG4gICAgc2FtcGxlICo9IGFscGhhO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBzYW1wbGU7XFxufVwiLGk9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaShpLG4sbyxhLGwpe3ZvaWQgMD09PWkmJihpPTQ1KSx2b2lkIDA9PT1uJiYobj01KSx2b2lkIDA9PT1vJiYobz0yKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1sJiYobD0uNSksdC5jYWxsKHRoaXMpLHRoaXMudGludEZpbHRlcj1uZXcgUElYSS5GaWx0ZXIoZSxyKSx0aGlzLmJsdXJGaWx0ZXI9bmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyLHRoaXMuYmx1ckZpbHRlci5ibHVyPW8sdGhpcy50YXJnZXRUcmFuc2Zvcm09bmV3IFBJWEkuTWF0cml4LHRoaXMucm90YXRpb249aSx0aGlzLnBhZGRpbmc9bix0aGlzLmRpc3RhbmNlPW4sdGhpcy5hbHBoYT1sLHRoaXMuY29sb3I9YX10JiYoaS5fX3Byb3RvX189dCksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciBuPXtkaXN0YW5jZTp7Y29uZmlndXJhYmxlOiEwfSxyb3RhdGlvbjp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9LGFscGhhOntjb25maWd1cmFibGU6ITB9LGNvbG9yOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxlLHIsaSl7dmFyIG49dC5nZXRSZW5kZXJUYXJnZXQoKTtuLnRyYW5zZm9ybT10aGlzLnRhcmdldFRyYW5zZm9ybSx0aGlzLnRpbnRGaWx0ZXIuYXBwbHkodCxlLG4sITApLHRoaXMuYmx1ckZpbHRlci5hcHBseSh0LG4sciksdC5hcHBseUZpbHRlcih0aGlzLGUscixpKSxuLnRyYW5zZm9ybT1udWxsLHQucmV0dXJuUmVuZGVyVGFyZ2V0KG4pfSxpLnByb3RvdHlwZS5fdXBkYXRlUGFkZGluZz1mdW5jdGlvbigpe3RoaXMucGFkZGluZz10aGlzLmRpc3RhbmNlKzIqdGhpcy5ibHVyfSxpLnByb3RvdHlwZS5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy50YXJnZXRUcmFuc2Zvcm0udHg9dGhpcy5kaXN0YW5jZSpNYXRoLmNvcyh0aGlzLmFuZ2xlKSx0aGlzLnRhcmdldFRyYW5zZm9ybS50eT10aGlzLmRpc3RhbmNlKk1hdGguc2luKHRoaXMuYW5nbGUpfSxuLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kaXN0YW5jZX0sbi5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5fZGlzdGFuY2U9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCksdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4ucm90YXRpb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYW5nbGUvUElYSS5ERUdfVE9fUkFEfSxuLnJvdGF0aW9uLnNldD1mdW5jdGlvbih0KXt0aGlzLmFuZ2xlPXQqUElYSS5ERUdfVE9fUkFELHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1ckZpbHRlci5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1ckZpbHRlci5ibHVyPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpfSxuLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGF9LG4uYWxwaGEuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYT10fSxuLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiBQSVhJLnV0aWxzLnJnYjJoZXgodGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sbi5jb2xvci5zZXQ9ZnVuY3Rpb24odCl7UElYSS51dGlscy5oZXgycmdiKHQsdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsbiksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Ecm9wU2hhZG93RmlsdGVyPWksdC5Ecm9wU2hhZG93RmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1kcm9wLXNoYWRvdy5qcy5tYXBcbiIsImltcG9ydCB7RHJvcFNoYWRvd0ZpbHRlcn0gZnJvbSAnQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93J1xyXG5cclxuLy8gZnVuY3Rpb24sIHdobyBjcmVhdGUgYW5kIGluc3RhbmNlIFNsaWNlZExheW91dFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTbGljZUxheWVyIChhcHApIHtcclxuICB2YXIgX01FID0gTWF0dGVyLkVuZ2luZSxcclxuICAgIF9NVyA9IE1hdHRlci5Xb3JsZCxcclxuICAgIF9NQnMgPSBNYXR0ZXIuQm9kaWVzLFxyXG4gICAgX01CID0gTWF0dGVyLkJvZHksXHJcbiAgICBfTUMgPSBNYXR0ZXIuQ29tcG9zaXRlLFxyXG4gICAgX01FdiA9IE1hdHRlci5FdmVudHMsXHJcbiAgICBfTVYgPSBNYXR0ZXIuVmVjdG9yLFxyXG4gICAgX0xSZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIGVuZ2luZSA9IF9NRS5jcmVhdGUoKTtcclxuICBlbmdpbmUud29ybGQuc2NhbGUgPSAwLjAwMDE7XHJcbiAgZW5naW5lLndvcmxkLmdyYXZpdHkueSA9IDAuMzU7XHJcblxyXG4gIF9NRS5ydW4oZW5naW5lKTtcclxuXHJcbiAgLy8gVE9ETyA6IFNsaWNhYmxlT2JqZWN0LmpzXHJcbiAgdmFyIEFkZFNsaWNhYmxlT2JqZWN0ID0gZnVuY3Rpb24gQWRkU2xpY2FibGVPYmplY3QocG9zKSB7XHJcbiAgICB2YXIgdGV4U0ggPVxyXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XHJcblxyXG4gICAgdmFyIG9iaiA9IG51bGw7XHJcblxyXG4gICAgaWYgKHRleFNIKSB7XHJcbiAgICAgIG9iaiA9IG5ldyBQSVhJLlNwcml0ZSh0ZXhTSC50ZXgpO1xyXG5cclxuICAgICAgaWYgKHRleFNILnBpdm90KSB7XHJcbiAgICAgICAgb2JqLmFuY2hvci5zZXQodGV4U0gucGl2b3QueCwgdGV4U0gucGl2b3QueSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0ZXhTSC5waXZvdCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9iaiA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcbiAgICAgIG9iai5iZWdpbkZpbGwoMHg5OTY2ZiAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICBvYmouZHJhd0NpcmNsZSgwLCAwLCA1MCk7XHJcbiAgICAgIG9iai5lbmRGaWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb2JqLnggPSBwb3MueDtcclxuICAgIG9iai55ID0gcG9zLnk7XHJcbiAgICBvYmoub25zbGljZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCBZRVRcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIG9iai5raWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLnBoQm9keS5zbGljZWQgJiYgdGhpcy5vbnNsaWNlKSB7XHJcbiAgICAgICAgdGhpcy5vbnNsaWNlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGVzdHJveSh7IGNoaWxkcmVuOiB0cnVlIH0pO1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXMucGhCb2R5ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgX01DLnJlbW92ZShlbmdpbmUud29ybGQsIHRoaXMucGhCb2R5KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcGhCb2R5ID0gX01Ccy5jaXJjbGUocG9zLngsIHBvcy55LCA1MCk7XHJcbiAgICAvL1x0cGhCb2R5LmlzU2Vuc29yID0gdHJ1ZTtcclxuICAgIC8vXHRwaEJvZHkuaW5lcnRpYSA9IDAuMDAwMTtcclxuICAgIHBoQm9keS5jb2xsaXNpb25GaWx0ZXIubWFzayAmPSB+cGhCb2R5LmNvbGxpc2lvbkZpbHRlci5jYXRlZ29yeTtcclxuICAgIC8vX01CLnNldE1hc3MocGhCb2R5LCAxMCk7XHJcbiAgICBfTVcuYWRkKGVuZ2luZS53b3JsZCwgcGhCb2R5KTtcclxuXHJcbiAgICBwaEJvZHkucGlPYmogPSBvYmo7XHJcbiAgICBvYmoucGhCb2R5ID0gcGhCb2R5O1xyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbiAgfTtcclxuXHJcbiAgLy8gLS0gU2xpY2FibGVPYmplY3QuanNcclxuXHJcbiAgdmFyIHN0YWdlID0gbmV3IFBJWEkuZGlzcGxheS5TdGFnZSgpO1xyXG5cclxuICB2YXIgX2xyZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIHNsaWNlVXBHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMSwgZmFsc2UpO1xyXG4gIHZhciBzbGljZU1pZGRsZUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgwLCBmYWxzZSk7XHJcbiAgdmFyIHNsaWNlRG93bkdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgtMSwgZmFsc2UpO1xyXG4gIHZhciB1aUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgxMCwgZmFsc2UpO1xyXG4gIFxyXG4gIGNvbnNvbGUubG9nKERyb3BTaGFkb3dGaWx0ZXIpO1xyXG4gIGNvbnNvbGUubG9nKFBJWEkuZmlsdGVycy5Ecm9wU2hhZG93RmlsdGVyKVxyXG4gIHN0YWdlLmZpbHRlcnMgPSBbbmV3IERyb3BTaGFkb3dGaWx0ZXIoKV07XHJcblxyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VVcEdyb3VwKSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzbGljZURvd25Hcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VNaWRkbGVHcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIodWlHcm91cCkpO1xyXG5cclxuICAvL3N0YWdlLmdyb3VwLmVuYWJsZVNvcnQgPSB0cnVlO1xyXG4gIHN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgc3RhZ2UuX2RlYnVnVGV4dCA9IG5ldyBQSVhJLlRleHQoXCJCb2R5IGNvdW50OiAwXCIsIHtcclxuICAgIGZvbnRGYW1pbHk6IFwiQXJpYWxcIixcclxuICAgIGZvbnRTaXplOiAzMixcclxuICAgIGZpbGw6IDB4ZmYxMDEwLFxyXG4gICAgc3Ryb2tlOiAweDAwY2MxMCxcclxuICAgIGFsaWduOiBcImxlZnRcIlxyXG4gIH0pO1xyXG5cclxuICBzdGFnZS5fZGVidWdUZXh0LnBvc2l0aW9uLnNldCgxMCwgNDIpO1xyXG4gLy8gY29uc29sZS5sb2coXCJwcmVcIik7XHJcbiAgc3RhZ2UuYmxhZGUgPSBuZXcgX2xyZXMuYmxhZGVfanMuZnVuY3Rpb24oXHJcbiAgICBfbHJlcy5ibGFkZV90ZXgudGV4dHVyZSxcclxuICAgIDMwLFxyXG4gICAgMTAsXHJcbiAgICAxMDBcclxuICApO1xyXG4gIHN0YWdlLmJsYWRlLm1pbk1vdmFibGVTcGVlZCA9IDEwMDA7XHJcbiAgc3RhZ2UuYmxhZGUuYm9keS5wYXJlbnRHcm91cCA9IHNsaWNlTWlkZGxlR3JvdXA7XHJcbiAgc3RhZ2UuYmxhZGUuUmVhZENhbGxiYWNrcyhzdGFnZSk7XHJcblxyXG4gIHN0YWdlLmFkZENoaWxkKHN0YWdlLmJsYWRlLmJvZHkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKHN0YWdlLl9kZWJ1Z1RleHQpO1xyXG5cclxuICB2YXIgc2xpY2VzID0gMDtcclxuICAvLyBzbGljZXMgdmlhIFJheWNhc3QgVGVzdGluZ1xyXG4gIHZhciBSYXlDYXN0VGVzdCA9IGZ1bmN0aW9uIFJheUNhc3RUZXN0KGJvZGllcykge1xyXG4gICAgaWYgKHN0YWdlLmJsYWRlLmxhc3RNb3Rpb25TcGVlZCA+IHN0YWdlLmJsYWRlLm1pbk1vdGlvblNwZWVkKSB7XHJcbiAgICAgIHZhciBwcHMgPSBzdGFnZS5ibGFkZS5ib2R5LnBvaW50cztcclxuXHJcbiAgICAgIGlmIChwcHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgTWF0aC5taW4ocHBzLmxlbmd0aCwgNCk7IGkrKykge1xyXG4gICAgICAgICAgLy8gNCDQv9C+0YHQu9C10LTQvdC40YUg0YHQtdCz0LzQtdC90YLQsFxyXG5cclxuICAgICAgICAgIHZhciBzcCA9IHBwc1tpIC0gMV07XHJcbiAgICAgICAgICB2YXIgZXAgPSBwcHNbaV07XHJcblxyXG4gICAgICAgICAgdmFyIGNvbGxpc2lvbnMgPSBNYXR0ZXIuUXVlcnkucmF5KGJvZGllcywgc3AsIGVwKTtcclxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sbGlzaW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoY29sbGlzaW9uc1tqXS5ib2R5LmNhblNsaWNlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHN2ID0geyB5OiBlcC55IC0gc3AueSwgeDogZXAueCAtIHNwLnggfTtcclxuICAgICAgICAgICAgICBzdiA9IF9NVi5ub3JtYWxpc2Uoc3YpO1xyXG5cclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VBbmdsZSA9IF9NVi5hbmdsZShzcCwgZXApO1xyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZVZlY3RvciA9IHN2O1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJib2R5IHNsaWNlIGFuZ2xlOlwiLCBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VBbmdsZSk7XHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgIHNsaWNlcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIGZyYW1lcyA9IDA7XHJcbiAgdmFyIGxhc3RTaG90WCA9IG51bGw7XHJcblxyXG4gIC8vIHVwZGF0ZSB2aWV3XHJcbiAgdmFyIFVwZGF0ZSA9IGZ1bmN0aW9uIFVwZGF0ZSgpIHtcclxuICAgIHN0YWdlLl9kZWJ1Z1RleHQudGV4dCA9XHJcbiAgICAgIFwi0JLRiyDQtNC10YDQt9C60L4g0LfQsNGA0LXQt9Cw0LvQuCBcIiArIHNsaWNlcy50b1N0cmluZygpICsgXCIg0LrRgNC+0LvQuNC6b9CyKNC60LApKFwiO1xyXG5cclxuICAgIHZhciBib2RpZXMgPSBfTUMuYWxsQm9kaWVzKGVuZ2luZS53b3JsZCk7XHJcblxyXG4gICAgZnJhbWVzKys7XHJcbiAgICBpZiAoZnJhbWVzID49IDIwICYmIGJvZGllcy5sZW5ndGggPCA1KSB7XHJcbiAgICAgIGZyYW1lcyA9IDA7XHJcbiAgICAgIHZhciBwb3MgPSB7XHJcbiAgICAgICAgeDpcclxuICAgICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb21SYW5nZSgwLCAxMCkpICpcclxuICAgICAgICAgIE1hdGguZmxvb3IoKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCkgLyAxMCksXHJcbiAgICAgICAgeTogYXBwLnJlbmRlcmVyLmhlaWdodCArIDEwMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgd2hpbGUgKGxhc3RTaG90WCAhPT0gbnVsbCAmJiBNYXRoLmFicyhsYXN0U2hvdFggLSBwb3MueCkgPCAyMDApIHtcclxuICAgICAgICBwb3MueCA9XHJcbiAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tUmFuZ2UoMCwgMTApKSAqXHJcbiAgICAgICAgICBNYXRoLmZsb29yKChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApIC8gMTApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsYXN0U2hvdFggPSBwb3MueDtcclxuXHJcbiAgICAgIHBvcy54IC09IDEwMDsgLy9vZmZzZXRcclxuXHJcbiAgICAgIC8vLyDQktGL0L3QtdGB0YLQuCDRjdGC0L4g0LPQvtCy0L3QviDQutGD0LTQsC3QvdC40LHRg9C00Ywg0LIg0LTRgNGD0LPQvtC1INC80LXRgdGC0L5cclxuXHJcbiAgICAgIC8vYmFubnlcclxuICAgICAgdmFyIGJkYXRhID0gX0xSZXMuYnVubnkuc3ByaXRlc2hlZXQ7XHJcbiAgICAgIHZhciBvYmogPSBBZGRTbGljYWJsZU9iamVjdChwb3MsIHtcclxuICAgICAgICB0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55LFxyXG4gICAgICAgIHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueS5waXZvdFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIG9iai5zY2FsZS5zZXQoMC4yLCAwLjIpO1xyXG4gICAgICBvYmoucGFyZW50R3JvdXAgPSBzbGljZURvd25Hcm91cDtcclxuICAgICAgb2JqLnBoQm9keS5jYW5TbGljZSA9IHRydWU7XHJcbiAgICAgIC8v0LTQu9C40L3QvdC90L3QvdGL0Lkg0LrQsNC70LHQtdC6XHJcbiAgICAgIG9iai5vbnNsaWNlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGRvd25QYXJ0ID0gQWRkU2xpY2FibGVPYmplY3QodGhpcy5wb3NpdGlvbiwge1xyXG4gICAgICAgICAgdGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueV90b3JzZSxcclxuICAgICAgICAgIHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueV90b3JzZS5waXZvdFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb3duUGFydC5zY2FsZS5zZXQoMC4yLCAwLjIpO1xyXG4gICAgICAgIGRvd25QYXJ0LnBhcmVudEdyb3VwID0gc2xpY2VEb3duR3JvdXA7XHJcblxyXG4gICAgICAgIF9NQi5zZXRNYXNzKGRvd25QYXJ0LnBoQm9keSwgdGhpcy5waEJvZHkubWFzcyAqIDAuNSk7XHJcbiAgICAgICAgX01CLnNldFZlbG9jaXR5KGRvd25QYXJ0LnBoQm9keSwgdGhpcy5waEJvZHkudmVsb2NpdHkpO1xyXG4gICAgICAgIF9NQi5zZXRBbmdsZShkb3duUGFydC5waEJvZHksIHRoaXMucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG5cclxuICAgICAgICBfTUIuYXBwbHlGb3JjZShkb3duUGFydC5waEJvZHksIGRvd25QYXJ0LnBoQm9keS5wb3NpdGlvbiwge1xyXG4gICAgICAgICAgeDogdGhpcy5waEJvZHkuc2xpY2VWZWN0b3IueSAqIDAuMDIsXHJcbiAgICAgICAgICB5OiB0aGlzLnBoQm9keS5zbGljZVZlY3Rvci54ICogMC4wMlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL2Rvd25QYXJ0LnBoQm9keS50b3JxdWUgPSB0aGlzLnBoQm9keS50b3JxdWUgKiAxMDtcclxuXHJcbiAgICAgICAgc3RhZ2UuYWRkQ2hpbGQoZG93blBhcnQpO1xyXG5cclxuICAgICAgICB2YXIgdXBQYXJ0ID0gQWRkU2xpY2FibGVPYmplY3QodGhpcy5wb3NpdGlvbiwge1xyXG4gICAgICAgICAgdGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueV9oZWFkLFxyXG4gICAgICAgICAgcGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55X2hlYWQucGl2b3RcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdXBQYXJ0LnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgICAgICAgdXBQYXJ0LnBhcmVudEdyb3VwID0gc2xpY2VEb3duR3JvdXA7XHJcblxyXG4gICAgICAgIF9NQi5zZXRNYXNzKHVwUGFydC5waEJvZHksIHRoaXMucGhCb2R5Lm1hc3MgKiAwLjUpO1xyXG4gICAgICAgIF9NQi5zZXRWZWxvY2l0eSh1cFBhcnQucGhCb2R5LCB0aGlzLnBoQm9keS52ZWxvY2l0eSk7XHJcbiAgICAgICAgX01CLnNldEFuZ2xlKHVwUGFydC5waEJvZHksIHRoaXMucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG4gICAgICAgIF9NQi5hcHBseUZvcmNlKHVwUGFydC5waEJvZHksIHVwUGFydC5waEJvZHkucG9zaXRpb24sIHtcclxuICAgICAgICAgIHg6IHRoaXMucGhCb2R5LnNsaWNlVmVjdG9yLnkgKiAwLjAyLFxyXG4gICAgICAgICAgeTogLXRoaXMucGhCb2R5LnNsaWNlVmVjdG9yLnggKiAwLjAyXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy91cFBhcnQucGhCb2R5LnRvcnF1ZSA9IHRoaXMucGhCb2R5LnRvcnF1ZSAqIDEwO1xyXG5cclxuICAgICAgICBzdGFnZS5hZGRDaGlsZCh1cFBhcnQpO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyAtLS0g0LTQviDRgdGO0LTQtNCwXHJcblxyXG4gICAgICB2YXIgX29meCA9IDAuNSAtIChwb3MueCArIDEwMCkgLyAoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKTtcclxuXHJcbiAgICAgIHZhciByYW5nZSA9IDAuODtcclxuICAgICAgdmFyIGltcCA9IHtcclxuICAgICAgICB4OiByYW5nZSAqIF9vZngsXHJcbiAgICAgICAgeTogLU1hdGgucmFuZG9tUmFuZ2UoMC40LCAwLjUpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBfTUIuYXBwbHlGb3JjZShvYmoucGhCb2R5LCBvYmoucGhCb2R5LnBvc2l0aW9uLCBpbXApO1xyXG4gICAgICBvYmoucGhCb2R5LnRvcnF1ZSA9IE1hdGgucmFuZG9tUmFuZ2UoLTEwLCAxMCk7XHJcblxyXG4gICAgICBzdGFnZS5hZGRDaGlsZChvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0aWNrZXIgPSBhcHAudGlja2VyO1xyXG4gICAgc3RhZ2UuYmxhZGUuVXBkYXRlKHRpY2tlcik7XHJcblxyXG4gICAgLy9DYXN0VGVzdFxyXG4gICAgUmF5Q2FzdFRlc3QoYm9kaWVzKTtcclxuXHJcbiAgICBfTUUudXBkYXRlKGVuZ2luZSk7XHJcbiAgICAvLyBpdGVyYXRlIG92ZXIgYm9kaWVzIGFuZCBmaXh0dXJlc1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBib2RpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgdmFyIGJvZHkgPSBib2RpZXNbaV07XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGJvZHkucGlPYmogIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAoYm9keS5wb3NpdGlvbi55ID4gYXBwLnJlbmRlcmVyLmhlaWdodCArIDEwMCAmJlxyXG4gICAgICAgICAgICBib2R5LnZlbG9jaXR5LnkgPiAwKSB8fFxyXG4gICAgICAgICAgYm9keS5zbGljZWRcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGJvZHkucGlPYmoua2lsbCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnggPSBib2R5LnBvc2l0aW9uLng7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnkgPSBib2R5LnBvc2l0aW9uLnk7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLnJvdGF0aW9uID0gYm9keS5hbmdsZTtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2coYm9keS5hbmdsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgTWF0aC5yYW5kb21SYW5nZSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG4gIH07XHJcbiAgLy9ydW4gVXBkYXRlXHJcbiAgYXBwLnRpY2tlci5hZGQoVXBkYXRlLCB0aGlzKTtcclxuXHJcbiAgLy8vLyBSRVRVUk5cclxuICByZXR1cm4gc3RhZ2U7XHJcbn1cclxuXHJcbi8vZXhwb3J0IHtTbGljZUxheWVyIH07XHJcbi8vbW9kdWxlLmV4cG9ydHMgPSBTbGljZUxheWVyO1xyXG4vL3JldHVybiBTbGljZUxheWVyO1xyXG4iLCJpbXBvcnQgX1NsaWNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL1NsaWNlTGF5ZXJcIlxyXG5cclxudmFyIF9BcHAgPSBudWxsLFxyXG4gIF9MUmVzID0gbnVsbCxcclxuICBfUmVuZGVyZXIgPSBudWxsLFxyXG4gIF9JbnRNYW5hZ2VyID0gbnVsbCxcclxuICBfU2xpY2VkU3RhZ2UgPSBudWxsO1xyXG5cclxudmFyIEluaXQgPSBmdW5jdGlvbiBJbml0KCkge1xyXG4gIF9BcHAgPSBuZXcgUElYSS5BcHBsaWNhdGlvbih7XHJcbiAgICB3aWR0aDogMTI4MCxcclxuICAgIGhlaWdodDogNzIwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweGZmZmZmZlxyXG4gIH0pO1xyXG4gIC8v0KLQsNC6INC90LDQtNC+LCDRgdGC0LDQvdC00LDRgNGC0L3Ri9C1INC90LUg0LHRg9C00YPRgiDQvtGC0L7QsdGA0LDQttCw0YLRgdGPXHJcbiAgX0FwcC5zdGFnZSA9IG5ldyBQSVhJLmRpc3BsYXkuU3RhZ2UoKTtcclxuXHJcbiAgX0xSZXMgPSBfQXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcbiAgX0ludE1hbmFnZXIgPSBfQXBwLnJlbmRlcmVyLnBsdWdpbnMuaW50ZXJhY3Rpb247XHJcblxyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoX0FwcC52aWV3KTtcclxuICBvblJlc2l6ZSgpO1xyXG4gIHdpbmRvdy5vbnJlc2l6ZSA9IG9uUmVzaXplO1xyXG5cclxuICBfQXBwLnRpY2tlci5hZGQob25VcGRhdGUsIHRoaXMpO1xyXG5cclxuICBfQXBwLnN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgdmFyIGxvYWRTdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cclxuICB2YXIgbG9hZEJ1dHRvbiA9IG5ldyBQSVhJLlRleHQoXCJUaGlzIGlzIGEgTG9hZCBCdXR0b25cIiwge1xyXG4gICAgZm9udEZhbWlseTogXCJBcmlhbFwiLFxyXG4gICAgZm9udFNpemU6IDc0LFxyXG4gICAgZmlsbDogMHhmZjEwMTAsXHJcbiAgICBhbGlnbjogXCJjZW50ZXJcIlxyXG4gIH0pO1xyXG5cclxuICBsb2FkQnV0dG9uLmFuY2hvci5zZXQoMC41LCAwLjUpO1xyXG4gIGxvYWRCdXR0b24uYnV0dG9uTW9kZSA9IHRydWU7XHJcbiAgbG9hZEJ1dHRvbi5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIGxvYWRCdXR0b24ucG9zaXRpb24uc2V0KF9BcHAucmVuZGVyZXIud2lkdGggLyAyLCBfQXBwLnJlbmRlcmVyLmhlaWdodCAvIDIpO1xyXG5cclxuICBsb2FkQnV0dG9uLmNsaWNrID0gTG9hZEdhbWU7XHJcbiAgbG9hZFN0YWdlLmFkZENoaWxkKGxvYWRCdXR0b24pO1xyXG5cclxuICBfQXBwLkxvYWRTdGFnZSA9IGxvYWRTdGFnZTtcclxuICBfQXBwLnN0YWdlLmFkZENoaWxkKGxvYWRTdGFnZSk7XHJcbn07XHJcblxyXG4vLyB1cGRhdGUgZnVuY3Rpb24sIHBhc3MgV2luZG93IGFzIHNjb3BlICh0aGlzID0gX0FwcClcclxudmFyIG9uVXBkYXRlID0gZnVuY3Rpb24gb25VcGRhdGUoKSB7XHJcbiAgdmFyIGR0ID0gX0FwcC50aWNrZXIuZGVsdGFUaW1lO1xyXG59O1xyXG5cclxuLy9pbnZva2VkIGFmdGVyIGxvYWRpbmcgZ2FtZSByZXNvdXJjZXNcclxudmFyIEdhbWVMb2FkZWQgPSBmdW5jdGlvbiBHYW1lTG9hZGVkKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiR2FtZSBpcyBsb2FkZWRcIik7XHJcblxyXG4gIGNvbnNvbGUubG9nKF9TbGljZVN0YWdlQ3JlYXRlcik7XHJcbiAgX1NsaWNlZFN0YWdlID0gIF9TbGljZVN0YWdlQ3JlYXRlcihfQXBwKTsgLy9fTFJlcy5zbGljZV9qcy5mdW5jdGlvbihfQXBwKTtcclxuXHJcbiAgX0FwcC5zdGFnZS5hZGRDaGlsZChfU2xpY2VkU3RhZ2UpO1xyXG5cclxuICBfQXBwLkxvYWRTdGFnZS5kZXN0cm95KCk7XHJcbn07XHJcblxyXG52YXIgTG9hZEdhbWUgPSBmdW5jdGlvbiBMb2FkR2FtZSgpIHtcclxuICB2YXIgbG9hZGVyID0gX0FwcC5sb2FkZXI7XHJcblxyXG4gIGxvYWRlclxyXG4gICAgLmFkZChcImJsYWRlX2pzXCIsIFwiLi9zcmMvc2NyaXB0cy9CbGFkZV9uZXcuanNcIilcclxuICAgIC8vLmFkZChcInNsaWNlX2pzXCIsIFwiLi9zcmMvc2NyaXB0cy9TbGljZUxheWVyLmpzXCIpXHJcbiAgICAuYWRkKFwiYmxhZGVfdGV4XCIsIFwiLi9zcmMvaW1hZ2VzL2JsYWRlLnBuZ1wiKVxyXG4gICAgLmFkZChcImJ1bm55XCIsIFwiLi9zcmMvaW1hZ2VzL2J1bm55X3NzLmpzb25cIilcclxuICAgIC5sb2FkKGZ1bmN0aW9uKGwsIHJlcykge1xyXG5cclxuICAgICAgcmVzLmJsYWRlX2pzLmZ1bmN0aW9uID0gKG5ldyBGdW5jdGlvbihyZXMuYmxhZGVfanMuZGF0YSkpKCk7XHJcbiAgICAvLyAgcmVzLnNsaWNlX2pzLmZ1bmN0aW9uID0gKG5ldyBGdW5jdGlvbihyZXMuc2xpY2VfanMuZGF0YSkpKCk7XHJcblxyXG4gICAgICBHYW1lTG9hZGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0IGxvYWRcIik7XHJcbn07XHJcblxyXG4vLyByZXNpemVcclxudmFyIG9uUmVzaXplID0gZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcclxuICB2YXIgX3cgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gIHZhciBfaCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBpZiAoX3cgLyBfaCA8IDE2IC8gOSkge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX3cgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX3cgKiA5IC8gMTYgKyBcInB4XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF9oICogMTYgLyA5ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF9oICsgXCJweFwiO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG53aW5kb3cub25sb2FkID0gSW5pdDsiXX0=
