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
  obj.parentGroup = data.normal.group;

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

var ParseColor = function ParseColor(value) {

	if (!value) return undefined;

	if (typeof value == "string") {
		value = value.replace("#", "");
		if (value.length > 6) value = value.substring(2);

		var parse = parseInt(value, 16);
		return parse;
	}

	return value;
};

var ParseAlpha = function ParseAlpha(value) {

	if (!value) return undefined;

	if (typeof value == "string") {
		value = value.replace("#", "");
		if (value.length > 6) value = value.substring(0, 2);else return 1;

		var parse = parseInt(value, 16);
		return parse / 256;
	}

	return value;
};

exports.ParseColor = ParseColor;
exports.ParseAlpha = ParseAlpha;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ConstructorSpritr;
function ConstructorSpritr(obj) {
	var _o = obj;

	var spr = new PIXI.Sprite.fromImage(_o.url);
	spr.name = _o.name;
	spr.anchor.set(0, 1); // set down to anchor

	if (_o.width) spr.width = _o.width;

	if (_o.height) spr.height = _o.height;

	spr.rotation = (_o.rotation || 0) * Math.PI / 180;
	spr.x = _o.x;
	spr.y = _o.y;
	spr.visible = _o.visible || true;

	if (_o.properties) {
		spr.alpha = _o.properties.opacity || 1;
		Object.assign(spr, _o.properties);
	}

	return spr;
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ConstructorText;

var _ColorParser = require("./ColorParser");

function ConstructorText(obj) {

	var _o = obj;
	var _cont = new PIXI.Container();

	var _text = new PIXI.Text();
	_text.name = _o.name + "_Text";

	_cont.name = _o.name;
	_cont.tag_type = _o.type;

	_cont.width = _o.width;
	_cont.height = _o.height;

	//_cont.lineStyle(2, 0xFF00FF, 1);
	//_cont.beginFill(0xFF00BB, 0.25);
	//_cont.drawRoundedRect(0, 0, _o.width, _o.height);
	//_cont.endFill();

	_cont.pivot.set(0, 0);

	_cont.rotation = _o.rotation * Math.PI / 180;
	_cont.alpha = (0, _ColorParser.ParseAlpha)(_o.text.color) || 1;
	_text.text = _o.text.text;

	switch (_o.text.haligh) {
		case "right":
			{
				_text.anchor.x = 1;
				_text.position.x = _cont.width;
			}
			break;
		case "center":
			{

				_text.anchor.x = 0.5;
				_text.position.x = _cont.width * 0.5;
			}
			break;
		default:
			{
				_text.anchor.x = 0;
				_text.position.x = 0;
			}
			break;
	}

	switch (_o.text.valign) {
		case "bottom":
			{
				_text.anchor.y = 1;
				_text.position.y = _cont.height;
			}
			break;
		case "center":
			{
				_text.anchor.y = 0.5;
				_text.position.y = _cont.height * 0.5;
			}
			break;
		default:
			{

				_text.anchor.y = 0;
				_text.position.y = 0;
			}
			break;
	}

	_cont.position.set(_o.x, _o.y);
	_text.style = {
		wordWrap: _o.text.wrap,
		fill: (0, _ColorParser.ParseColor)(_o.text.color) || 0x000000,
		align: _o.text.valign || "center",
		fontSize: _o.text.pixelsize || 24,
		fontFamily: _o.text.fontfamily || "Arial",
		fontWeight: _o.text.bold ? "bold" : "normal",
		fontStyle: _o.text.italic ? "italic" : "normal"
	};

	if (_o.properties) {
		_text.style.stroke = (0, _ColorParser.ParseColor)(_o.properties.strokeColor) || 0;
		_text.style.strokeThickness = _o.properties.strokeThickness || 0;

		Object.assign(_cont, _o.properties);
	}

	//_cont.parentGroup = _layer.group;
	_cont.addChild(_text);
	//_stage.addChild(_cont);
	return _cont;
}

},{"./ColorParser":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.default = OGParser;

var _ConstructorText = require("./ConstructorText");

var _ConstructorText2 = _interopRequireDefault(_ConstructorText);

var _ConstructorSprite = require("./ConstructorSprite");

var _ConstructorSprite2 = _interopRequireDefault(_ConstructorSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
                //    console.log("Dir url:" + baseUrl);


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

                                        if (_l.type !== "objectgroup" && _l.type !== "imagelayer") {
                                                console.warn("OGParser support only OBJECT or IMAGE layes!!");
                                                //next();
                                                //return;
                                                continue;
                                        }

                                        if (_l.properties && (_l.properties.ignore || _l.properties.ignoreLoad)) {

                                                console.log("OGParser: ignore loading layer:" + _l.name);
                                                continue;
                                        }

                                        var _group = new Group(_l.properties ? _l.properties.zOrder || i : i, true);
                                        var _layer = new Layer(_group);
                                        _layer.name = _l.name;
                                        _stage[_l.name] = _layer;
                                        _layer.visible = _l.visible;

                                        _layer.position.set(_l.x, _l.y);
                                        _layer.alpha = _l.opacity || 1;

                                        _stage.addChild(_layer);
                                        if (_l.type == "imagelayer") {
                                                _l.objects = [{
                                                        image: _l.image,
                                                        name: _l.name,
                                                        x: _l.x,
                                                        y: _l.y + _stage.layerHeight,
                                                        //width: _l.width,
                                                        //height: _l.height,
                                                        properties: _l.properties
                                                }];
                                        }

                                        if (_l.objects) {
                                                for (var j = 0; j < _l.objects.length; j++) {

                                                        var _o = _l.objects[j];
                                                        var _obj = undefined;

                                                        if (!_o.name || _o.name == "") _o.name = "obj_" + j;
                                                        // image Loader
                                                        if (_data.tilesets && _data.tilesets.length > 0 && _o.gid || _o.image) {
                                                                if (!_o.image) {
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

                                                                        _o.url = baseUrl + "/" + _img.image;

                                                                        if (!_img) {

                                                                                console.log("Load res MISSED gid:" + _realGid + " url:" + url);
                                                                                continue;
                                                                        }
                                                                } else {

                                                                        _o.url = baseUrl + "/" + _o.image;
                                                                }

                                                                //Sprite Loader
                                                                _obj = (0, _ConstructorSprite2.default)(_o);
                                                        }

                                                        // TextLoader
                                                        if (_o.text) {
                                                                _obj = (0, _ConstructorText2.default)(_o);
                                                        }
                                                        if (_obj) {
                                                                _obj.parentGroup = _layer.group;
                                                                _stage.addChild(_obj);
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

},{"./ConstructorSprite":6,"./ConstructorText":7}],9:[function(require,module,exports){
"use strict";

var _OGParser = require("./OGParser");

var _OGParser2 = _interopRequireDefault(_OGParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

PIXI.loaders.Loader.addPixiMiddleware(_OGParser2.default);
PIXI.loader.use((0, _OGParser2.default)());
// nothing to export

},{"./OGParser":8}],10:[function(require,module,exports){
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

  _App.loader.add("base_stage", "./src/maps/base.json").load(function (l, res) {

    res.base_stage.stage.scale.set(_App.renderer.width / res.base_stage.stage.layerWidth, _App.renderer.height / res.base_stage.stage.layerHeight);

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

},{"./SliceLayer":4,"./TiledOGLoader/TiledObjGroupLoader.js":9}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsInNyY1xcc2NyaXB0c1xcQmxhZGUuanMiLCJzcmNcXHNjcmlwdHNcXFNsaWNhYmxlT2JqZWN0LmpzIiwic3JjXFxzY3JpcHRzXFxTbGljZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxDb2xvclBhcnNlci5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcQ29uc3RydWN0b3JTcHJpdGUuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXENvbnN0cnVjdG9yVGV4dC5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcT0dQYXJzZXIuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXFRpbGVkT2JqR3JvdXBMb2FkZXIuanMiLCJzcmNcXHNjcmlwdHNcXGNvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztrQkNOd0IsSzs7QUFGeEI7O0FBRWUsU0FBUyxLQUFULENBQWUsT0FBZixFQUF3QjtBQUNyQyxNQUFJLFFBQ0YsVUFBVSxNQUFWLEdBQW1CLENBQW5CLElBQXdCLFVBQVUsQ0FBVixNQUFpQixTQUF6QyxHQUFxRCxVQUFVLENBQVYsQ0FBckQsR0FBb0UsRUFEdEU7QUFFQSxNQUFJLFVBQ0YsVUFBVSxNQUFWLEdBQW1CLENBQW5CLElBQXdCLFVBQVUsQ0FBVixNQUFpQixTQUF6QyxHQUFxRCxVQUFVLENBQVYsQ0FBckQsR0FBb0UsRUFEdEU7QUFFQSxNQUFJLFdBQ0YsVUFBVSxNQUFWLEdBQW1C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aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdyAtIHYyLjMuMVxuICogQ29tcGlsZWQgV2VkLCAyOSBOb3YgMjAxNyAxNjo0NToxOSBVVENcbiAqXG4gKiBwaXhpLWZpbHRlcnMgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKHQuX19maWx0ZXJfZHJvcF9zaGFkb3c9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gdmVjMyBjb2xvcjtcXG52b2lkIG1haW4odm9pZCl7XFxuICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gVW4tcHJlbXVsdGlwbHkgYWxwaGEgYmVmb3JlIGFwcGx5aW5nIHRoZSBjb2xvclxcbiAgICBpZiAoc2FtcGxlLmEgPiAwLjApIHtcXG4gICAgICAgIHNhbXBsZS5yZ2IgLz0gc2FtcGxlLmE7XFxuICAgIH1cXG5cXG4gICAgLy8gUHJlbXVsdGlwbHkgYWxwaGEgYWdhaW5cXG4gICAgc2FtcGxlLnJnYiA9IGNvbG9yLnJnYiAqIHNhbXBsZS5hO1xcblxcbiAgICAvLyBhbHBoYSB1c2VyIGFscGhhXFxuICAgIHNhbXBsZSAqPSBhbHBoYTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gc2FtcGxlO1xcbn1cIixpPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoaSxuLG8sYSxsKXt2b2lkIDA9PT1pJiYoaT00NSksdm9pZCAwPT09biYmKG49NSksdm9pZCAwPT09byYmKG89Miksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09bCYmKGw9LjUpLHQuY2FsbCh0aGlzKSx0aGlzLnRpbnRGaWx0ZXI9bmV3IFBJWEkuRmlsdGVyKGUsciksdGhpcy5ibHVyRmlsdGVyPW5ldyBQSVhJLmZpbHRlcnMuQmx1ckZpbHRlcix0aGlzLmJsdXJGaWx0ZXIuYmx1cj1vLHRoaXMudGFyZ2V0VHJhbnNmb3JtPW5ldyBQSVhJLk1hdHJpeCx0aGlzLnJvdGF0aW9uPWksdGhpcy5wYWRkaW5nPW4sdGhpcy5kaXN0YW5jZT1uLHRoaXMuYWxwaGE9bCx0aGlzLmNvbG9yPWF9dCYmKGkuX19wcm90b19fPXQpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgbj17ZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0scm90YXRpb246e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQsZSxyLGkpe3ZhciBuPXQuZ2V0UmVuZGVyVGFyZ2V0KCk7bi50cmFuc2Zvcm09dGhpcy50YXJnZXRUcmFuc2Zvcm0sdGhpcy50aW50RmlsdGVyLmFwcGx5KHQsZSxuLCEwKSx0aGlzLmJsdXJGaWx0ZXIuYXBwbHkodCxuLHIpLHQuYXBwbHlGaWx0ZXIodGhpcyxlLHIsaSksbi50cmFuc2Zvcm09bnVsbCx0LnJldHVyblJlbmRlclRhcmdldChuKX0saS5wcm90b3R5cGUuX3VwZGF0ZVBhZGRpbmc9ZnVuY3Rpb24oKXt0aGlzLnBhZGRpbmc9dGhpcy5kaXN0YW5jZSsyKnRoaXMuYmx1cn0saS5wcm90b3R5cGUuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMudGFyZ2V0VHJhbnNmb3JtLnR4PXRoaXMuZGlzdGFuY2UqTWF0aC5jb3ModGhpcy5hbmdsZSksdGhpcy50YXJnZXRUcmFuc2Zvcm0udHk9dGhpcy5kaXN0YW5jZSpNYXRoLnNpbih0aGlzLmFuZ2xlKX0sbi5kaXN0YW5jZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGlzdGFuY2V9LG4uZGlzdGFuY2Uuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuX2Rpc3RhbmNlPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpLHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLnJvdGF0aW9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFuZ2xlL1BJWEkuREVHX1RPX1JBRH0sbi5yb3RhdGlvbi5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5hbmdsZT10KlBJWEkuREVHX1RPX1JBRCx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJGaWx0ZXIuYmx1cn0sbi5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJGaWx0ZXIuYmx1cj10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKX0sbi5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhfSxuLmFscGhhLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGE9dH0sbi5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LG4uY29sb3Iuc2V0PWZ1bmN0aW9uKHQpe1BJWEkudXRpbHMuaGV4MnJnYih0LHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLG4pLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRHJvcFNoYWRvd0ZpbHRlcj1pLHQuRHJvcFNoYWRvd0ZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZHJvcC1zaGFkb3cuanMubWFwXG4iLCJcclxuLy9CbGFkZSBKUyBjb25zdHJ1Y3RvclxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxhZGUodGV4dHVyZSkge1xyXG4gIHZhciBjb3VudCA9XHJcbiAgICBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDEwO1xyXG4gIHZhciBtaW5EaXN0ID1cclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogNDA7XHJcbiAgdmFyIGxpdmVUaW1lID1cclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogMjA7XHJcblxyXG4gIHZhciBwb2ludHMgPSBbXTtcclxuICB0aGlzLmNvdW50ID0gY291bnQ7XHJcbiAgdGhpcy5taW5EaXN0ID0gbWluRGlzdDtcclxuICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gIHRoaXMubWluTW90aW9uU3BlZWQgPSA0MDAwLjA7XHJcbiAgdGhpcy5saXZlVGltZSA9IGxpdmVUaW1lO1xyXG4gIHRoaXMubGFzdE1vdGlvblNwZWVkID0gMDtcclxuICB0aGlzLnRhcmdldFBvc2l0aW9uID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XHJcblxyXG4gIHRoaXMuYm9keSA9IG5ldyBQSVhJLm1lc2guUm9wZSh0ZXh0dXJlLCBwb2ludHMpO1xyXG5cclxuICB2YXIgbGFzdFBvc2l0aW9uID0gbnVsbDtcclxuICB0aGlzLlVwZGF0ZSA9IGZ1bmN0aW9uKHRpY2tlcikge1xyXG4gICAgdmFyIGlzRGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5ib2R5LnBvaW50cztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gcG9pbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIGlmIChwb2ludHNbaV0ubGFzdFRpbWUgKyB0aGlzLmxpdmVUaW1lIDwgdGlja2VyLmxhc3RUaW1lKSB7XHJcbiAgICAgICAgcG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgaXNEaXJ0eSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgdCA9IG5ldyBQSVhJLlBvaW50KFxyXG4gICAgICB0aGlzLnRhcmdldFBvc2l0aW9uLnggLyB0aGlzLmJvZHkuc2NhbGUueCxcclxuICAgICAgdGhpcy50YXJnZXRQb3NpdGlvbi55IC8gdGhpcy5ib2R5LnNjYWxlLnlcclxuICAgICk7XHJcblxyXG4gICAgaWYgKGxhc3RQb3NpdGlvbiA9PSBudWxsKSBsYXN0UG9zaXRpb24gPSB0O1xyXG5cclxuICAgIHQubGFzdFRpbWUgPSB0aWNrZXIubGFzdFRpbWU7XHJcblxyXG4gICAgdmFyIHAgPSBsYXN0UG9zaXRpb247XHJcblxyXG4gICAgdmFyIGR4ID0gdC54IC0gcC54O1xyXG4gICAgdmFyIGR5ID0gdC55IC0gcC55O1xyXG5cclxuICAgIHZhciBkaXN0ID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcbiAgICB0aGlzLmxhc3RNb3Rpb25TcGVlZCA9IGRpc3QgKiAxMDAwIC8gdGlja2VyLmVsYXBzZWRNUztcclxuICAgIGlmIChkaXN0ID4gbWluRGlzdCkge1xyXG4gICAgICBpZiAodGhpcy5sYXN0TW90aW9uU3BlZWQgPiB0aGlzLm1pbk1vdGlvblNwZWVkKSB7XHJcbiAgICAgICAgcG9pbnRzLnB1c2godCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHBvaW50cy5sZW5ndGggPiB0aGlzLmNvdW50KSB7XHJcbiAgICAgICAgcG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlzRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGxhc3RQb3NpdGlvbiA9IHQ7XHJcbiAgICBpZiAoaXNEaXJ0eSkge1xyXG4gICAgICB0aGlzLmJvZHkucmVmcmVzaCh0cnVlKTtcclxuICAgICAgdGhpcy5ib2R5LnJlbmRlcmFibGUgPSBwb2ludHMubGVuZ3RoID4gMTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB0aGlzLlJlYWRDYWxsYmFja3MgPSBmdW5jdGlvbih0YXJnZXQpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0YXJnZXQubW91c2Vtb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBzZWxmLnRhcmdldFBvc2l0aW9uID0gZS5kYXRhLmdsb2JhbDtcclxuICAgIH07XHJcblxyXG4gICAgdGFyZ2V0Lm1vdXNlb3ZlciA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgLy9cdHNlbGYudGFyZ2V0UG9zaXRpb24gPSAgZS5kYXRhLmdsb2JhbDtcclxuICAgICAgLy9cdGNvbnNvbGUubG9nKFwib3ZlclwiKTtcclxuICAgICAgLy8gIHNlbGYuTW92ZUFsbChlLmRhdGEuZ2xvYmFsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGFyZ2V0LnRvdWNobW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJUb3VjaCBtb3ZlXCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUuZGF0YSk7XHJcbiAgICAgIHNlbGYudGFyZ2V0UG9zaXRpb24gPSBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQudG91Y2hzdGFydCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJUb3VjaCBzdGFydFwiKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhlLmRhdGEpO1xyXG4gICAgICAvLyAgc2VsZi5Nb3ZlQWxsKGUuZGF0YS5nbG9iYWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQudG91Y2hlbmQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG91Y2ggc3RhcnRcIik7XHJcbiAgICAgIC8vIF9CbGFkZS5Nb3ZlQWxsKGUuZGF0YS5nbG9iYWwpO1xyXG4gICAgfTtcclxuICAgIC8vINCwINGC0L4g0LvQsNC/0YjQsCDQutCw0LrQsNGPLdGC0L5cclxuICB9O1xyXG59O1xyXG5cclxuLy9yZXR1cm4gQmxhZGU7XHJcblxyXG4iLCJcclxudmFyIF9NRSA9IE1hdHRlci5FbmdpbmUsXHJcbiAgICBfTVcgPSBNYXR0ZXIuV29ybGQsXHJcbiAgICBfTUJzID0gTWF0dGVyLkJvZGllcyxcclxuICAgIF9NQiA9IE1hdHRlci5Cb2R5LFxyXG4gICAgX01DID0gTWF0dGVyLkNvbXBvc2l0ZSxcclxuICAgIF9NRXYgPSBNYXR0ZXIuRXZlbnRzLFxyXG4gICAgX01WID0gTWF0dGVyLlZlY3RvcjtcclxuXHJcbmxldCBDcmVhdGVTdWJCb2R5ID0gZnVuY3Rpb24ocGFyZW50LCB0ZXhEYXRhKXtcclxuXHJcbiAgbGV0IG9iaiA9IENyZWF0ZVNsaWNhYmxlT2JqZWN0KHBhcmVudC5wb3NpdGlvbiwgcGFyZW50LmVuZ2luZSwgdGV4RGF0YSk7XHJcbiAgXHJcbiAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgb2JqLnBhcmVudEdyb3VwID0gdGV4RGF0YS5ncm91cDtcclxuXHJcbiAgX01CLnNldE1hc3Mob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS5tYXNzICogMC41KTtcclxuICBfTUIuc2V0VmVsb2NpdHkob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS52ZWxvY2l0eSk7XHJcbiAgX01CLnNldEFuZ2xlKG9iai5waEJvZHksIHBhcmVudC5waEJvZHkuc2xpY2VBbmdsZSk7XHJcblxyXG4gIGxldCBhbmNob3JlZF9kaXIgPSBfTVYubm9ybWFsaXNlKHt4Om9iai5hbmNob3IueCAtIDAuNSwgeTogMC41IC0gb2JqLmFuY2hvci55IH0pO1xyXG4gIGFuY2hvcmVkX2RpciA9IF9NVi5yb3RhdGUoYW5jaG9yZWRfZGlyLCBwYXJlbnQucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG5cclxuICBfTUIuYXBwbHlGb3JjZShvYmoucGhCb2R5LCBvYmoucGhCb2R5LnBvc2l0aW9uLCB7XHJcbiAgICB4OiAgYW5jaG9yZWRfZGlyLnggKiAwLjAyLFxyXG4gICAgeTogIGFuY2hvcmVkX2Rpci55ICogMC4wMlxyXG4gIH0pO1xyXG5cclxuICAvL2Rvd25QYXJ0LnBoQm9keS50b3JxdWUgPSB0aGlzLnBoQm9keS50b3JxdWUgKiAxMDtcclxuXHJcbiAgcGFyZW50LnBhcmVudC5hZGRDaGlsZChvYmopO1xyXG5cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDcmVhdGVTbGljYWJsZU9iamVjdChwb3MsIGVuZ2luZSwgZGF0YSkge1xyXG4gIFxyXG4gIHZhciBvYmogPSBudWxsO1xyXG5cclxuICBpZiAoZGF0YSAmJiBkYXRhLm5vcm1hbCkge1xyXG4gICAgb2JqID0gbmV3IFBJWEkuU3ByaXRlKGRhdGEubm9ybWFsLnRleCk7XHJcblxyXG4gICAgaWYgKGRhdGEubm9ybWFsLnBpdm90KSB7XHJcbiAgICAgIG9iai5hbmNob3Iuc2V0KGRhdGEubm9ybWFsLnBpdm90LngsIGRhdGEubm9ybWFsLnBpdm90LnkpO1xyXG4gICAgfVxyXG5cclxuICB9IGVsc2Uge1xyXG4gIFxyXG4gICAgb2JqID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuICAgIG9iai5iZWdpbkZpbGwoMHg5OTY2ZiAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgb2JqLmRyYXdDaXJjbGUoMCwgMCwgNTApO1xyXG4gICAgb2JqLmVuZEZpbGwoKTtcclxuICB9XHJcblxyXG4gIG9iai5zcHJpdGVEYXRhID0gZGF0YTtcclxuICBvYmouZW5naW5lID0gZW5naW5lO1xyXG4gIG9iai54ID0gcG9zLng7XHJcbiAgb2JqLnkgPSBwb3MueTtcclxuICBvYmoucGFyZW50R3JvdXAgPSBkYXRhLm5vcm1hbC5ncm91cDtcclxuICBcclxuICBvYmoub25zbGljZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBvYmouc3ByaXRlRGF0YS5wYXJ0cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIENyZWF0ZVN1YkJvZHkob2JqLCB7bm9ybWFsOiBvYmouc3ByaXRlRGF0YS5wYXJ0c1tpXX0pO1xyXG4gICAgfVxyXG5cclxuICB9O1xyXG5cclxuICBvYmoua2lsbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMucGhCb2R5LnNsaWNlZCAmJiB0aGlzLm9uc2xpY2UpIHtcclxuICAgICAgdGhpcy5vbnNsaWNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5kZXN0cm95KHsgY2hpbGRyZW46IHRydWUgfSk7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMucGhCb2R5ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIF9NQy5yZW1vdmUoZW5naW5lLndvcmxkLCB0aGlzLnBoQm9keSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIHBoQm9keSA9IF9NQnMuY2lyY2xlKHBvcy54LCBwb3MueSwgNTApO1xyXG4gIHBoQm9keS5jb2xsaXNpb25GaWx0ZXIubWFzayAmPSB+cGhCb2R5LmNvbGxpc2lvbkZpbHRlci5jYXRlZ29yeTtcclxuICBfTVcuYWRkKGVuZ2luZS53b3JsZCwgcGhCb2R5KTtcclxuXHJcbiAgcGhCb2R5LnBpT2JqID0gb2JqO1xyXG4gIG9iai5waEJvZHkgPSBwaEJvZHk7XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn1cclxuIiwiaW1wb3J0IHtEcm9wU2hhZG93RmlsdGVyfSBmcm9tICdAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cnXHJcbmltcG9ydCBDcmVhdGVTbGljYWJsZU9iamVjdCBmcm9tICcuL1NsaWNhYmxlT2JqZWN0J1xyXG5pbXBvcnQgQmxhZGUgZnJvbSAnLi9CbGFkZSdcclxuXHJcbi8vIGZ1bmN0aW9uLCB3aG8gY3JlYXRlIGFuZCBpbnN0YW5jZSBTbGljZWRMYXlvdXRcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2xpY2VMYXllciAoYXBwKSB7XHJcbiAgdmFyIF9NRSA9IE1hdHRlci5FbmdpbmUsXHJcbiAgICBfTVcgPSBNYXR0ZXIuV29ybGQsXHJcbiAgICBfTUJzID0gTWF0dGVyLkJvZGllcyxcclxuICAgIF9NQiA9IE1hdHRlci5Cb2R5LFxyXG4gICAgX01DID0gTWF0dGVyLkNvbXBvc2l0ZSxcclxuICAgIF9NRXYgPSBNYXR0ZXIuRXZlbnRzLFxyXG4gICAgX01WID0gTWF0dGVyLlZlY3RvcixcclxuICAgIF9MUmVzID0gYXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcblxyXG4gIHZhciBlbmdpbmUgPSBfTUUuY3JlYXRlKCk7XHJcbiAgZW5naW5lLndvcmxkLnNjYWxlID0gMC4wMDAxO1xyXG4gIGVuZ2luZS53b3JsZC5ncmF2aXR5LnkgPSAwLjM1O1xyXG5cclxuICBfTUUucnVuKGVuZ2luZSk7XHJcblxyXG4gIHZhciBzdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cclxuICB2YXIgX2xyZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIHNsaWNlVXBHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMSwgZmFsc2UpO1xyXG4gIHZhciBzbGljZU1pZGRsZUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgwLCBmYWxzZSk7XHJcbiAgdmFyIHNsaWNlRG93bkdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgtMSwgZmFsc2UpO1xyXG4gIHZhciB1aUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgxMCwgZmFsc2UpO1xyXG4gIFxyXG4gLy8gc3RhZ2UuZmlsdGVycyA9IFtuZXcgRHJvcFNoYWRvd0ZpbHRlcigpXTtcclxuXHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzbGljZVVwR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlRG93bkdyb3VwKSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzbGljZU1pZGRsZUdyb3VwKSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcih1aUdyb3VwKSk7XHJcblxyXG4gIC8vc3RhZ2UuZ3JvdXAuZW5hYmxlU29ydCA9IHRydWU7XHJcbiAgc3RhZ2UuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG5cclxuICBzdGFnZS5fZGVidWdUZXh0ID0gbmV3IFBJWEkuVGV4dChcIkJvZHkgY291bnQ6IDBcIiwge1xyXG4gICAgZm9udEZhbWlseTogXCJBcmlhbFwiLFxyXG4gICAgZm9udFNpemU6IDMyLFxyXG4gICAgZmlsbDogMHhmZjEwMTAsXHJcbiAgICBzdHJva2U6IDB4MDBjYzEwLFxyXG4gICAgYWxpZ246IFwibGVmdFwiXHJcbiAgfSk7XHJcblxyXG4gIHN0YWdlLl9kZWJ1Z1RleHQucG9zaXRpb24uc2V0KDEwLCA0Mik7XHJcbiAvLyBjb25zb2xlLmxvZyhcInByZVwiKTtcclxuICBzdGFnZS5ibGFkZSA9IG5ldyBCbGFkZShcclxuICAgIF9scmVzLmJsYWRlX3RleC50ZXh0dXJlLFxyXG4gICAgMzAsXHJcbiAgICAxMCxcclxuICAgIDEwMFxyXG4gICk7XHJcbiAgc3RhZ2UuYmxhZGUubWluTW92YWJsZVNwZWVkID0gMTAwMDtcclxuICBzdGFnZS5ibGFkZS5ib2R5LnBhcmVudEdyb3VwID0gc2xpY2VNaWRkbGVHcm91cDtcclxuICBzdGFnZS5ibGFkZS5SZWFkQ2FsbGJhY2tzKHN0YWdlKTtcclxuXHJcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhZ2UuYmxhZGUuYm9keSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhZ2UuX2RlYnVnVGV4dCk7XHJcblxyXG4gIHZhciBzbGljZXMgPSAwO1xyXG4gIC8vIHNsaWNlcyB2aWEgUmF5Y2FzdCBUZXN0aW5nXHJcbiAgdmFyIFJheUNhc3RUZXN0ID0gZnVuY3Rpb24gUmF5Q2FzdFRlc3QoYm9kaWVzKSB7XHJcbiAgICBpZiAoc3RhZ2UuYmxhZGUubGFzdE1vdGlvblNwZWVkID4gc3RhZ2UuYmxhZGUubWluTW90aW9uU3BlZWQpIHtcclxuICAgICAgdmFyIHBwcyA9IHN0YWdlLmJsYWRlLmJvZHkucG9pbnRzO1xyXG5cclxuICAgICAgaWYgKHBwcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBNYXRoLm1pbihwcHMubGVuZ3RoLCA0KTsgaSsrKSB7XHJcbiAgICAgICAgICAvLyA0INC/0L7RgdC70LXQtNC90LjRhSDRgdC10LPQvNC10L3RgtCwXHJcblxyXG4gICAgICAgICAgdmFyIHNwID0gcHBzW2kgLSAxXTtcclxuICAgICAgICAgIHZhciBlcCA9IHBwc1tpXTtcclxuXHJcbiAgICAgICAgICB2YXIgY29sbGlzaW9ucyA9IE1hdHRlci5RdWVyeS5yYXkoYm9kaWVzLCBzcCwgZXApO1xyXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xsaXNpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChjb2xsaXNpb25zW2pdLmJvZHkuY2FuU2xpY2UpIHtcclxuICAgICAgICAgICAgICB2YXIgc3YgPSB7IHk6IGVwLnkgLSBzcC55LCB4OiBlcC54IC0gc3AueCB9O1xyXG4gICAgICAgICAgICAgIHN2ID0gX01WLm5vcm1hbGlzZShzdik7XHJcblxyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZUFuZ2xlID0gX01WLmFuZ2xlKHNwLCBlcCk7XHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlVmVjdG9yID0gc3Y7XHJcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImJvZHkgc2xpY2UgYW5nbGU6XCIsIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZUFuZ2xlKTtcclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgc2xpY2VzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgZnJhbWVzID0gMDtcclxuICB2YXIgbGFzdFNob3RYID0gbnVsbDtcclxuXHJcbiAgLy8gdXBkYXRlIHZpZXdcclxuICB2YXIgVXBkYXRlID0gZnVuY3Rpb24gVXBkYXRlKCkge1xyXG5cclxuICBcdC8vc3RhZ2UudXBkYXRlU3RhZ2UoKTtcclxuICAgIHN0YWdlLl9kZWJ1Z1RleHQudGV4dCA9XHJcbiAgICAgIFwi0JLRiyDQtNC10YDQt9C60L4g0LfQsNGA0LXQt9Cw0LvQuCBcIiArIHNsaWNlcy50b1N0cmluZygpICsgXCIg0LrRgNC+0LvQuNC6b9CyKNC60LApKFwiO1xyXG5cclxuICAgIHZhciBib2RpZXMgPSBfTUMuYWxsQm9kaWVzKGVuZ2luZS53b3JsZCk7XHJcblxyXG4gICAgZnJhbWVzKys7XHJcbiAgICBpZiAoZnJhbWVzID49IDIwICYmIGJvZGllcy5sZW5ndGggPCA1KSB7XHJcbiAgICAgIGZyYW1lcyA9IDA7XHJcbiAgICAgIHZhciBwb3MgPSB7XHJcbiAgICAgICAgeDpcclxuICAgICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb21SYW5nZSgwLCAxMCkpICpcclxuICAgICAgICAgIE1hdGguZmxvb3IoKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCkgLyAxMCksXHJcbiAgICAgICAgeTogYXBwLnJlbmRlcmVyLmhlaWdodCArIDEwMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgd2hpbGUgKGxhc3RTaG90WCAhPT0gbnVsbCAmJiBNYXRoLmFicyhsYXN0U2hvdFggLSBwb3MueCkgPCAyMDApIHtcclxuICAgICAgICBwb3MueCA9XHJcbiAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tUmFuZ2UoMCwgMTApKSAqXHJcbiAgICAgICAgICBNYXRoLmZsb29yKChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApIC8gMTApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsYXN0U2hvdFggPSBwb3MueDtcclxuXHJcbiAgICAgIHBvcy54IC09IDEwMDsgLy9vZmZzZXRcclxuXHJcbiAgICAgIC8vLyDQktGL0L3QtdGB0YLQuCDRjdGC0L4g0LPQvtCy0L3QviDQutGD0LTQsC3QvdC40LHRg9C00Ywg0LIg0LTRgNGD0LPQvtC1INC80LXRgdGC0L5cclxuXHJcbiAgICAgIC8vYmFubnlcclxuXHQgICAgbGV0IGJkYXRhID0gX0xSZXMuYnVubnkuc3ByaXRlc2hlZXQ7XHJcblxyXG5cdFx0bGV0IGRhdGEgPSB7XHJcblx0ICAgICAgXHRub3JtYWw6IHtcclxuXHQgICAgIFx0ICAgdGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueSxcclxuXHQgICAgIFx0ICAgcGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55LnBpdm90LFxyXG5cdCAgICAgXHQgICBncm91cDpzbGljZURvd25Hcm91cFxyXG5cdCAgICAgIFx0fSxcclxuXHQgICAgICBcdHBhcnRzOltcclxuXHRcdCAgICAgIFx0e1xyXG5cdFx0ICAgICAgICAgIHRleDogYmRhdGEudGV4dHVyZXMuYnVubnlfdG9yc2UsXHJcblx0XHQgICAgICAgICAgcGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55X3RvcnNlLnBpdm90LFxyXG5cdFx0ICAgICAgICAgIGdyb3VwOiBzbGljZURvd25Hcm91cFxyXG5cdFx0ICAgICAgICB9LFxyXG5cdFx0ICAgICAgICB7XHJcblx0XHQgICAgICAgIFx0dGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueV9oZWFkLFxyXG5cdFx0ICAgICAgICBcdHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueV9oZWFkLnBpdm90LFxyXG5cdFx0ICAgICAgICBcdGdyb3VwOiBzbGljZVVwR3JvdXBcclxuXHQgICAgICAgIFx0fVxyXG5cdCAgICAgICAgXVxyXG5cdCAgICB9O1xyXG5cclxuICAgICAgdmFyIG9iaiA9IENyZWF0ZVNsaWNhYmxlT2JqZWN0KHBvcywgZW5naW5lLCBkYXRhKTtcclxuXHJcbiAgICAgIG9iai5zY2FsZS5zZXQoMC4yLCAwLjIpO1xyXG4gICAgICBvYmoucGhCb2R5LmNhblNsaWNlID0gdHJ1ZTtcclxuXHJcbiAgICAgIHZhciBfb2Z4ID0gMC41IC0gKHBvcy54ICsgMTAwKSAvIChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApO1xyXG5cclxuICAgICAgdmFyIHJhbmdlID0gMC44O1xyXG4gICAgICB2YXIgaW1wID0ge1xyXG4gICAgICAgIHg6IHJhbmdlICogX29meCxcclxuICAgICAgICB5OiAtTWF0aC5yYW5kb21SYW5nZSgwLjQsIDAuNSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIF9NQi5hcHBseUZvcmNlKG9iai5waEJvZHksIG9iai5waEJvZHkucG9zaXRpb24sIGltcCk7XHJcbiAgICAgIG9iai5waEJvZHkudG9ycXVlID0gTWF0aC5yYW5kb21SYW5nZSgtMTAsIDEwKTtcclxuXHJcbiAgICAgIHN0YWdlLmFkZENoaWxkKG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHRpY2tlciA9IGFwcC50aWNrZXI7XHJcbiAgICBzdGFnZS5ibGFkZS5VcGRhdGUodGlja2VyKTtcclxuXHJcbiAgICAvL0Nhc3RUZXN0XHJcbiAgICBSYXlDYXN0VGVzdChib2RpZXMpO1xyXG5cclxuICAgIF9NRS51cGRhdGUoZW5naW5lKTtcclxuICAgIC8vIGl0ZXJhdGUgb3ZlciBib2RpZXMgYW5kIGZpeHR1cmVzXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGJvZGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICB2YXIgYm9keSA9IGJvZGllc1tpXTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgYm9keS5waU9iaiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIChib2R5LnBvc2l0aW9uLnkgPiBhcHAucmVuZGVyZXIuaGVpZ2h0ICsgMTAwICYmXHJcbiAgICAgICAgICAgIGJvZHkudmVsb2NpdHkueSA+IDApIHx8XHJcbiAgICAgICAgICBib2R5LnNsaWNlZFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgYm9keS5waU9iai5raWxsKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJvZHkucGlPYmoueCA9IGJvZHkucG9zaXRpb24ueDtcclxuICAgICAgICAgIGJvZHkucGlPYmoueSA9IGJvZHkucG9zaXRpb24ueTtcclxuICAgICAgICAgIGJvZHkucGlPYmoucm90YXRpb24gPSBib2R5LmFuZ2xlO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhib2R5LmFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBNYXRoLnJhbmRvbVJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcbiAgfTtcclxuICAvL3J1biBVcGRhdGVcclxuICBhcHAudGlja2VyLmFkZChVcGRhdGUsIHRoaXMpO1xyXG5cclxuICAvLy8vIFJFVFVSTlxyXG4gIHJldHVybiBzdGFnZTtcclxufVxyXG5cclxuLy9leHBvcnQge1NsaWNlTGF5ZXIgfTtcclxuLy9tb2R1bGUuZXhwb3J0cyA9IFNsaWNlTGF5ZXI7XHJcbi8vcmV0dXJuIFNsaWNlTGF5ZXI7XHJcbiIsIlxyXG5sZXQgUGFyc2VDb2xvciA9IGZ1bmN0aW9uKHZhbHVlKXtcclxuXHRcclxuXHRpZighdmFsdWUpXHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuXHRpZih0eXBlb2YgdmFsdWUgPT0gXCJzdHJpbmdcIilcclxuXHR7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIjXCIsXCJcIik7XHJcblx0XHRpZih2YWx1ZS5sZW5ndGggPiA2KVxyXG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygyKTtcclxuXHJcblx0XHRsZXQgcGFyc2UgPSBwYXJzZUludCh2YWx1ZSwgMTYpO1xyXG5cdFx0cmV0dXJuIHBhcnNlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5sZXQgUGFyc2VBbHBoYSA9IGZ1bmN0aW9uKHZhbHVlKXtcclxuXHRcclxuXHRpZighdmFsdWUpXHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuXHRpZih0eXBlb2YgdmFsdWUgPT0gXCJzdHJpbmdcIilcclxuXHR7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIjXCIsXCJcIik7XHJcblx0XHRpZih2YWx1ZS5sZW5ndGggPiA2KVxyXG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLDIpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHJcblx0XHRsZXQgcGFyc2UgPSBwYXJzZUludCh2YWx1ZSwgMTYpO1xyXG5cdFx0cmV0dXJuIHBhcnNlIC8gMjU2O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG5cdFBhcnNlQ29sb3IsXHJcblx0UGFyc2VBbHBoYVxyXG59XHJcbiIsIlxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25zdHJ1Y3RvclNwcml0cihvYmopIHtcclxuXHRsZXQgX28gPSBvYmo7IFxyXG5cclxuXHRsZXQgc3ByID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShfby51cmwpO1xyXG5cdHNwci5uYW1lID0gX28ubmFtZTtcclxuXHRzcHIuYW5jaG9yLnNldCgwLCAxKTsgLy8gc2V0IGRvd24gdG8gYW5jaG9yXHJcblx0XHJcblx0aWYoX28ud2lkdGgpXHJcblx0XHRzcHIud2lkdGggPSBfby53aWR0aDtcclxuXHRcclxuXHRpZihfby5oZWlnaHQpXHJcblx0XHRzcHIuaGVpZ2h0ID0gX28uaGVpZ2h0O1xyXG5cdFxyXG5cdHNwci5yb3RhdGlvbiA9IChfby5yb3RhdGlvbiB8fCAwKSAgKiBNYXRoLlBJIC8gMTgwO1xyXG5cdHNwci54ID0gX28ueDtcclxuXHRzcHIueSA9IF9vLnk7XHJcblx0c3ByLnZpc2libGUgPSBfby52aXNpYmxlIHx8IHRydWU7XHJcblxyXG5cdGlmKF9vLnByb3BlcnRpZXMpXHJcblx0e1xyXG5cdFx0c3ByLmFscGhhID0gX28ucHJvcGVydGllcy5vcGFjaXR5IHx8IDE7XHJcblx0XHRPYmplY3QuYXNzaWduKHNwciwgX28ucHJvcGVydGllcyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc3ByO1xyXG59IiwiaW1wb3J0IHtQYXJzZUNvbG9yLFBhcnNlQWxwaGEgfSBmcm9tIFwiLi9Db2xvclBhcnNlclwiXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uc3RydWN0b3JUZXh0KG9iaiwgKSB7XHJcblxyXG5cdGxldCBfbyA9IG9iajtcclxuXHRsZXQgX2NvbnQgPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHJcblx0bGV0IF90ZXh0ID0gbmV3IFBJWEkuVGV4dCgpO1xyXG5cdF90ZXh0Lm5hbWUgPSBfby5uYW1lICsgXCJfVGV4dFwiO1xyXG5cclxuXHRfY29udC5uYW1lID0gX28ubmFtZTtcclxuXHRfY29udC50YWdfdHlwZSA9IF9vLnR5cGU7XHJcblxyXG5cdF9jb250LndpZHRoID0gX28ud2lkdGg7XHJcblx0X2NvbnQuaGVpZ2h0ID0gX28uaGVpZ2h0O1xyXG5cclxuXHQvL19jb250LmxpbmVTdHlsZSgyLCAweEZGMDBGRiwgMSk7XHJcblx0Ly9fY29udC5iZWdpbkZpbGwoMHhGRjAwQkIsIDAuMjUpO1xyXG5cdC8vX2NvbnQuZHJhd1JvdW5kZWRSZWN0KDAsIDAsIF9vLndpZHRoLCBfby5oZWlnaHQpO1xyXG5cdC8vX2NvbnQuZW5kRmlsbCgpO1xyXG5cclxuXHRfY29udC5waXZvdC5zZXQoMCwwKTtcclxuXHJcblx0X2NvbnQucm90YXRpb24gPSBfby5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XHJcblx0X2NvbnQuYWxwaGEgPSBQYXJzZUFscGhhKF9vLnRleHQuY29sb3IpIHx8IDE7XHJcblx0X3RleHQudGV4dCA9IF9vLnRleHQudGV4dDtcclxuXHJcblx0c3dpdGNoIChfby50ZXh0LmhhbGlnaCkge1xyXG5cdFx0Y2FzZSBcInJpZ2h0XCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiY2VudGVyXCI6XHJcblx0XHRcdFx0e1xyXG5cclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci54ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoICogMC41O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAwO1xyXG5cdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnggPSAwO1x0XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHRzd2l0Y2ggKF9vLnRleHQudmFsaWduKSB7XHJcblx0XHRjYXNlIFwiYm90dG9tXCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnkgPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBcImNlbnRlclwiOlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci55ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodCAqIDAuNTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0e1xyXG5cclxuXHRcdFx0XHRfdGV4dC5hbmNob3IueSA9IDA7XHJcblx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHJcblx0X2NvbnQucG9zaXRpb24uc2V0KF9vLngsIF9vLnkpO1xyXG5cdF90ZXh0LnN0eWxlID0ge1xyXG5cdFx0d29yZFdyYXA6IF9vLnRleHQud3JhcCxcclxuXHRcdGZpbGw6IFBhcnNlQ29sb3IoX28udGV4dC5jb2xvcikgfHwgMHgwMDAwMDAsXHJcblx0XHRhbGlnbjogX28udGV4dC52YWxpZ24gfHwgXCJjZW50ZXJcIixcclxuXHRcdGZvbnRTaXplOiBfby50ZXh0LnBpeGVsc2l6ZSB8fCAyNCxcclxuXHRcdGZvbnRGYW1pbHk6IF9vLnRleHQuZm9udGZhbWlseSB8fCBcIkFyaWFsXCIsXHJcblx0XHRmb250V2VpZ2h0OiBfby50ZXh0LmJvbGQgPyBcImJvbGRcIjogXCJub3JtYWxcIixcclxuXHRcdGZvbnRTdHlsZTogX28udGV4dC5pdGFsaWMgPyBcIml0YWxpY1wiIDogXCJub3JtYWxcIlxyXG5cdFx0fTtcclxuXHJcblx0aWYoX28ucHJvcGVydGllcylcclxuXHR7XHJcblx0XHRfdGV4dC5zdHlsZS5zdHJva2UgPSAgUGFyc2VDb2xvcihfby5wcm9wZXJ0aWVzLnN0cm9rZUNvbG9yKSB8fCAwO1xyXG5cdFx0X3RleHQuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzID0gIF9vLnByb3BlcnRpZXMuc3Ryb2tlVGhpY2tuZXNzIHx8IDA7XHJcblx0XHRcclxuXHRcdE9iamVjdC5hc3NpZ24oX2NvbnQsIF9vLnByb3BlcnRpZXMpO1xyXG5cdH1cclxuXHJcblx0Ly9fY29udC5wYXJlbnRHcm91cCA9IF9sYXllci5ncm91cDtcclxuXHRfY29udC5hZGRDaGlsZChfdGV4dCk7XHJcblx0Ly9fc3RhZ2UuYWRkQ2hpbGQoX2NvbnQpO1xyXG5cdHJldHVybiBfY29udDtcclxufSIsImltcG9ydCBDVGV4dCBmcm9tIFwiLi9Db25zdHJ1Y3RvclRleHRcIlxyXG5pbXBvcnQgQ1Nwcml0ZSBmcm9tIFwiLi9Db25zdHJ1Y3RvclNwcml0ZVwiXHJcblxyXG5sZXQgTGF5ZXIgPSBQSVhJLmRpc3BsYXkuTGF5ZXI7XHJcbmxldCBHcm91cCA9IFBJWEkuZGlzcGxheS5Hcm91cDtcclxubGV0IFN0YWdlID0gUElYSS5kaXNwbGF5LlN0YWdlO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE9HUGFyc2VyKCl7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIChyZXNvdXJjZSwgbmV4dCkge1xyXG5cdFx0Ly9mYWxsYmFjayBcclxuXHRcdCBpZiAoIXJlc291cmNlLmRhdGEgfHwgIShyZXNvdXJjZS5kYXRhLnR5cGUgIT09IHVuZGVmaW5lZCAmJiByZXNvdXJjZS5kYXRhLnR5cGUgPT0gJ21hcCcpKSB7XHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW4gVGlsZGUgT0cgaW1wb3J0ZXJcIik7XHJcbiAgICAgICAgbGV0IF9kYXRhID0gcmVzb3VyY2UuZGF0YTsgXHJcbiAgICAgICAgbGV0IF9zdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cclxuICAgICAgICBfc3RhZ2UubGF5ZXJIZWlnaHQgPSBfZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgX3N0YWdlLmxheWVyV2lkdGggPSBfZGF0YS53aWR0aDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGxldCBiYXNlVXJsID0gcmVzb3VyY2UudXJsLnJlcGxhY2UodGhpcy5iYXNlVXJsLFwiXCIpO1xyXG4gICAgICAgIGxldCBsYXN0SW5kZXhPZiA9IGJhc2VVcmwubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGxhc3RJbmRleE9mID09IC0xKVxyXG4gICAgICAgIFx0bGFzdEluZGV4T2YgPSBiYXNlVXJsLmxhc3RJbmRleE9mKFwiXFxcXFwiKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihsYXN0SW5kZXhPZiA9PSAtMSApXHJcbiAgICBcdHtcclxuICAgIFx0XHRjb25zb2xlLmxvZyhcIkNhbid0IHBhcnNlOlwiICsgYmFzZVVybCk7XHJcbiAgICBcdFx0bmV4dCgpO1xyXG4gICAgXHRcdHJldHVybjtcclxuICAgIFx0fVxyXG5cclxuICAgICAgICBiYXNlVXJsID0gYmFzZVVybC5zdWJzdHJpbmcoMCwgbGFzdEluZGV4T2YpO1xyXG4gICAgLy8gICAgY29uc29sZS5sb2coXCJEaXIgdXJsOlwiICsgYmFzZVVybCk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGxldCBsb2FkT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHJlc291cmNlLmNyb3NzT3JpZ2luLFxyXG4gICAgICAgICAgICBsb2FkVHlwZTogUElYSS5sb2FkZXJzLlJlc291cmNlLkxPQURfVFlQRS5JTUFHRSxcclxuICAgICAgICAgICAgcGFyZW50UmVzb3VyY2U6IHJlc291cmNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9DaGVjayBUaWxlciBNYXAgdHlwZVxyXG4gICAgICAgLy8gaWYoX2RhdGEudHlwZSAhPT0gdW5kZWZpbmVkICYmIF9kYXRhLnR5cGUgPT0gJ21hcCcpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICBcdGlmKF9kYXRhLmxheWVycykgXHJcbiAgICAgICAgXHR7XHJcbiAgICAgICAgXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBfZGF0YS5sYXllcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgXHRcdHtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRsZXQgX2wgPSBfZGF0YS5sYXllcnNbaV07XHJcbiAgICAgICAgXHRcdFx0XHJcbiAgICAgICAgXHRcdFx0aWYoX2wudHlwZSAhPT0gXCJvYmplY3Rncm91cFwiICYmIF9sLnR5cGUgIT09IFwiaW1hZ2VsYXllclwiKVxyXG4gICAgICAgIFx0XHRcdHtcclxuICAgICAgICBcdFx0XHRcdGNvbnNvbGUud2FybihcIk9HUGFyc2VyIHN1cHBvcnQgb25seSBPQkpFQ1Qgb3IgSU1BR0UgbGF5ZXMhIVwiKTtcclxuICAgICAgICBcdFx0XHRcdC8vbmV4dCgpO1xyXG4gICAgICAgIFx0XHRcdFx0Ly9yZXR1cm47XHJcbiAgICAgICAgXHRcdFx0XHRjb250aW51ZTtcclxuICAgICAgICBcdFx0XHR9XHJcblxyXG4gICAgICAgIFx0XHRcdGlmKF9sLnByb3BlcnRpZXMgJiYgKF9sLnByb3BlcnRpZXMuaWdub3JlIHx8IF9sLnByb3BlcnRpZXMuaWdub3JlTG9hZCkpe1xyXG5cclxuICAgICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKFwiT0dQYXJzZXI6IGlnbm9yZSBsb2FkaW5nIGxheWVyOlwiICsgX2wubmFtZSk7XHJcbiAgICAgICAgXHRcdFx0XHRjb250aW51ZTtcclxuICAgICAgICBcdFx0XHR9XHJcblxyXG4gICAgICAgIFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdGxldCBfZ3JvdXAgPSBuZXcgR3JvdXAoIF9sLnByb3BlcnRpZXMgPyAoX2wucHJvcGVydGllcy56T3JkZXIgfHwgaSkgOiBpLCB0cnVlKTtcclxuICAgICAgICBcdFx0XHRsZXQgX2xheWVyID0gbmV3IExheWVyKF9ncm91cCk7XHJcbiAgICAgICAgXHRcdFx0X2xheWVyLm5hbWUgPSBfbC5uYW1lO1xyXG4gICAgICAgIFx0XHRcdF9zdGFnZVtfbC5uYW1lXSA9IF9sYXllcjtcclxuICAgICAgICBcdFx0XHRfbGF5ZXIudmlzaWJsZSA9IF9sLnZpc2libGU7XHJcbiAgICAgICAgXHRcdFx0XHJcbiAgICAgICAgXHRcdFx0X2xheWVyLnBvc2l0aW9uLnNldChfbC54LCBfbC55KTtcclxuICAgICAgICBcdFx0XHRfbGF5ZXIuYWxwaGEgPSBfbC5vcGFjaXR5IHx8IDE7XHJcblxyXG4gICAgICAgIFx0XHRcdF9zdGFnZS5hZGRDaGlsZChfbGF5ZXIpO1xyXG4gICAgICAgIFx0XHRcdGlmKF9sLnR5cGUgPT0gXCJpbWFnZWxheWVyXCIpe1xyXG5cdCAgICAgICAgXHRcdFx0X2wub2JqZWN0cyA9IFtcclxuXHQgICAgICAgIFx0XHRcdFx0e1xyXG5cdCAgICAgICAgXHRcdFx0XHRcdGltYWdlOiBfbC5pbWFnZSxcclxuXHQgICAgICAgIFx0XHRcdFx0XHRuYW1lOiBfbC5uYW1lLFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdHg6IF9sLnggLFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdHk6IF9sLnkgKyBfc3RhZ2UubGF5ZXJIZWlnaHQsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0Ly93aWR0aDogX2wud2lkdGgsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0Ly9oZWlnaHQ6IF9sLmhlaWdodCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHRwcm9wZXJ0aWVzOiBfbC5wcm9wZXJ0aWVzLFxyXG5cdCAgICAgICAgXHRcdFx0XHR9XHJcblx0ICAgICAgICBcdFx0XHRdO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0aWYoX2wub2JqZWN0cykgXHJcbiAgICAgICAgXHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBfbC5vYmplY3RzLmxlbmd0aDsgaisrKVxyXG4gICAgICAgIFx0XHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0XHRcclxuICAgICAgICBcdFx0XHRcdFx0bGV0IF9vID0gX2wub2JqZWN0c1tqXTtcclxuICAgICAgICBcdFx0XHRcdFx0bGV0IF9vYmogPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIFx0XHRcdFx0XHRpZighX28ubmFtZSB8fCBfby5uYW1lID09IFwiXCIpXHJcbiAgICAgICAgXHRcdFx0XHRcdFx0X28ubmFtZSA9IFwib2JqX1wiICsgajtcclxuICAgICAgICBcdFx0XHRcdFx0Ly8gaW1hZ2UgTG9hZGVyXHJcblx0XHRcdFx0XHRcdFx0aWYoX2RhdGEudGlsZXNldHMgJiYgX2RhdGEudGlsZXNldHMubGVuZ3RoID4gMCAmJiBfby5naWQgfHwgX28uaW1hZ2UpXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIV9vLmltYWdlKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIF90cyA9IHVuZGVmaW5lZDsgLy9fZGF0YS50aWxlc2V0c1swXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IF9kYXRhLnRpbGVzZXRzLmxlbmd0aDsgaSArKyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoX2RhdGEudGlsZXNldHNbaV0uZmlyc3RnaWQgPD0gX28uZ2lkKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdF90cyA9IF9kYXRhLnRpbGVzZXRzW2ldO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIV90cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJJbWFnZSB3aXRoIGdpZDpcIiArIF9vLmdpZCArIFwiIG5vdCBmb3VuZCFcIik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGludWU7O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgX3JlYWxHaWQgPSBfby5naWQgLSBfdHMuZmlyc3RnaWQ7XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRsZXQgX2ltZyA9IF90cy50aWxlc1tcIlwiICsgX3JlYWxHaWRdO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRfby51cmwgPSAgYmFzZVVybCArIFwiL1wiICsgX2ltZy5pbWFnZTtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdFxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0aWYoIV9pbWcpe1xyXG5cclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdFx0Y29uc29sZS5sb2coXCJMb2FkIHJlcyBNSVNTRUQgZ2lkOlwiICsgX3JlYWxHaWQgKyBcIiB1cmw6XCIgKyB1cmwpO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdH1cclxuXHRcdFx0XHRcdCAgICAgICAgXHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdF9vLnVybCA9ICBiYXNlVXJsICsgXCIvXCIgKyBfby5pbWFnZTtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdCBcclxuXHRcdFx0XHRcdCAgICAgICAgXHR9XHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHJcblx0XHRcdFx0XHQgICAgICAgIFx0Ly9TcHJpdGUgTG9hZGVyXHJcblx0XHRcdFx0XHQgICAgICAgIFx0X29iaiA9IENTcHJpdGUoX28pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gVGV4dExvYWRlclxyXG5cdFx0XHRcdFx0XHRcdGlmKF9vLnRleHQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdF9vYmogPSBDVGV4dChfbyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKF9vYmope1xyXG5cdFx0XHRcdFx0XHRcdFx0X29iai5wYXJlbnRHcm91cCA9IF9sYXllci5ncm91cDtcclxuXHRcdFx0XHRcdFx0XHRcdF9zdGFnZS5hZGRDaGlsZChfb2JqKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcbiAgICAgICAgXHRcdFx0XHR9XHJcbiAgICAgICAgXHRcdFx0fVxyXG4gICAgICAgIFx0XHR9XHJcbiAgICAgICAgXHR9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb3VyY2Uuc3RhZ2UgPSBfc3RhZ2U7XHJcblxyXG5cdFx0Ly8gY2FsbCBuZXh0IGxvYWRlclxyXG5cdFx0bmV4dCgpO1xyXG5cclxuXHR9O1xyXG59XHJcbiIsImltcG9ydCBPR1BhcnNlciBmcm9tIFwiLi9PR1BhcnNlclwiXHJcblxyXG5QSVhJLmxvYWRlcnMuTG9hZGVyLmFkZFBpeGlNaWRkbGV3YXJlKE9HUGFyc2VyKTtcclxuUElYSS5sb2FkZXIudXNlKE9HUGFyc2VyKCkpO1xyXG4vLyBub3RoaW5nIHRvIGV4cG9ydFxyXG4iLCJpbXBvcnQgX1NsaWNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL1NsaWNlTGF5ZXJcIlxyXG5pbXBvcnQgXCIuL1RpbGVkT0dMb2FkZXIvVGlsZWRPYmpHcm91cExvYWRlci5qc1wiXHJcblxyXG52YXIgX0FwcCA9IG51bGwsXHJcbiAgX0xSZXMgPSBudWxsLFxyXG4gIF9SZW5kZXJlciA9IG51bGwsXHJcbiAgX0ludE1hbmFnZXIgPSBudWxsLFxyXG4gIF9TbGljZWRTdGFnZSA9IG51bGw7XHJcblxyXG52YXIgSW5pdCA9IGZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgX0FwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHtcclxuICAgIHdpZHRoOiAxMjgwLFxyXG4gICAgaGVpZ2h0OiA3MjAsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IDB4ZmZmZmZmXHJcbiAgfSk7XHJcblxyXG4gIC8v0KLQsNC6INC90LDQtNC+LCDRgdGC0LDQvdC00LDRgNGC0L3Ri9C1INC90LUg0LHRg9C00YPRgiDQvtGC0L7QsdGA0LDQttCw0YLRgdGPXHJcbiAgX0FwcC5zdGFnZSA9IG5ldyBQSVhJLmRpc3BsYXkuU3RhZ2UoKTtcclxuXHJcbiAgX0xSZXMgPSBfQXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcbiAgd2luZG93Ll9MUmVzID0gX0xSZXM7XHJcblxyXG4gIF9JbnRNYW5hZ2VyID0gX0FwcC5yZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9BcHAudmlldyk7XHJcbiAgb25SZXNpemUoKTtcclxuICB3aW5kb3cub25yZXNpemUgPSBvblJlc2l6ZTtcclxuXHJcbiAgX0FwcC50aWNrZXIuYWRkKG9uVXBkYXRlLCB0aGlzKTtcclxuXHJcbiAgX0FwcC5zdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIF9BcHAubG9hZGVyXHJcbiAgICAgICAgLmFkZChcImJhc2Vfc3RhZ2VcIiwgXCIuL3NyYy9tYXBzL2Jhc2UuanNvblwiKVxyXG4gICAgICAgIC5sb2FkKChsLCByZXMpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHJlcy5iYXNlX3N0YWdlLnN0YWdlLnNjYWxlLnNldChcclxuICAgICAgICAgICAgICAgIF9BcHAucmVuZGVyZXIud2lkdGggLyByZXMuYmFzZV9zdGFnZS5zdGFnZS5sYXllcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgX0FwcC5yZW5kZXJlci5oZWlnaHQgLyByZXMuYmFzZV9zdGFnZS5zdGFnZS5sYXllckhlaWdodFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgX0FwcC5zdGFnZS5hZGRDaGlsZChyZXMuYmFzZV9zdGFnZS5zdGFnZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgXHJcbn07XHJcblxyXG4vLyB1cGRhdGUgZnVuY3Rpb24sIHBhc3MgV2luZG93IGFzIHNjb3BlICh0aGlzID0gX0FwcClcclxudmFyIG9uVXBkYXRlID0gZnVuY3Rpb24gb25VcGRhdGUoKSB7XHJcbiAgdmFyIGR0ID0gX0FwcC50aWNrZXIuZGVsdGFUaW1lO1xyXG59O1xyXG5cclxuLy9pbnZva2VkIGFmdGVyIGxvYWRpbmcgZ2FtZSByZXNvdXJjZXNcclxudmFyIEdhbWVMb2FkZWQgPSBmdW5jdGlvbiBHYW1lTG9hZGVkKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiR2FtZSBpcyBsb2FkZWRcIik7XHJcblxyXG4gIF9TbGljZWRTdGFnZSA9ICBfU2xpY2VTdGFnZUNyZWF0ZXIoX0FwcCk7IC8vX0xSZXMuc2xpY2VfanMuZnVuY3Rpb24oX0FwcCk7XHJcblxyXG4gIF9BcHAuc3RhZ2UuYWRkQ2hpbGQoX1NsaWNlZFN0YWdlKTtcclxuXHJcbiAgX0FwcC5Mb2FkU3RhZ2UuZGVzdHJveSgpO1xyXG59O1xyXG5cclxudmFyIExvYWRHYW1lID0gZnVuY3Rpb24gTG9hZEdhbWUoKSB7XHJcbiAgdmFyIGxvYWRlciA9IF9BcHAubG9hZGVyO1xyXG5cclxuICBsb2FkZXJcclxuICAgIC5hZGQoXCJibGFkZV90ZXhcIiwgXCIuL3NyYy9pbWFnZXMvYmxhZGUucG5nXCIpXHJcbiAgICAuYWRkKFwiYnVubnlcIiwgXCIuL3NyYy9pbWFnZXMvYnVubnlfc3MuanNvblwiKVxyXG4gICAgLmxvYWQoZnVuY3Rpb24obCwgcmVzKSB7XHJcblxyXG4gICAgICBHYW1lTG9hZGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0IGxvYWRcIik7XHJcbn07XHJcblxyXG4vLyByZXNpemVcclxudmFyIG9uUmVzaXplID0gZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcclxuICB2YXIgX3cgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gIHZhciBfaCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBpZiAoX3cgLyBfaCA8IDE2IC8gOSkge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX3cgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX3cgKiA5IC8gMTYgKyBcInB4XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF9oICogMTYgLyA5ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF9oICsgXCJweFwiO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5Mb2FkR2FtZSA9IExvYWRHYW1lO1xyXG53aW5kb3cub25sb2FkID0gSW5pdDsiXX0=
