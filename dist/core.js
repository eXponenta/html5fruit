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
/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
/*global define:false, require:false, exports:false, module:false, signals:false */

/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
 */

(function(global){

    // SignalBinding -------------------------------------------------
    //================================================================

    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name SignalBinding
     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

        /**
         * Handler function bound to the signal.
         * @type Function
         * @private
         */
        this._listener = listener;

        /**
         * If binding should be executed just once.
         * @type boolean
         * @private
         */
        this._isOnce = isOnce;

        /**
         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @memberOf SignalBinding.prototype
         * @name context
         * @type Object|undefined|null
         */
        this.context = listenerContext;

        /**
         * Reference to Signal object that listener is currently bound to.
         * @type Signal
         * @private
         */
        this._signal = signal;

        /**
         * Listener priority
         * @type Number
         * @private
         */
        this._priority = priority || 0;
    }

    SignalBinding.prototype = {

        /**
         * If binding is active and should be executed.
         * @type boolean
         */
        active : true,

        /**
         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
         * @type Array|null
         */
        params : null,

        /**
         * Call listener passing arbitrary parameters.
         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
         * @return {*} Value returned by the listener.
         */
        execute : function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },

        /**
         * Detach binding from signal.
         * - alias to: mySignal.remove(myBinding.getListener());
         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
         */
        detach : function () {
            return this.isBound()? this._signal.remove(this._listener, this.context) : null;
        },

        /**
         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
         */
        isBound : function () {
            return (!!this._signal && !!this._listener);
        },

        /**
         * @return {boolean} If SignalBinding will only be executed once.
         */
        isOnce : function () {
            return this._isOnce;
        },

        /**
         * @return {Function} Handler function bound to the signal.
         */
        getListener : function () {
            return this._listener;
        },

        /**
         * @return {Signal} Signal that listener is currently bound to.
         */
        getSignal : function () {
            return this._signal;
        },

        /**
         * Delete instance properties
         * @private
         */
        _destroy : function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
        }

    };


/*global SignalBinding:false*/

    // Signal --------------------------------------------------------
    //================================================================

    function validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
        }
    }

    /**
     * Custom event broadcaster
     * <br />- inspired by Robert Penner's AS3 Signals.
     * @name Signal
     * @author Miller Medeiros
     * @constructor
     */
    function Signal() {
        /**
         * @type Array.<SignalBinding>
         * @private
         */
        this._bindings = [];
        this._prevParams = null;

        // enforce dispatch to aways work on same context (#47)
        var self = this;
        this.dispatch = function(){
            Signal.prototype.dispatch.apply(self, arguments);
        };
    }

    Signal.prototype = {

        /**
         * Signals Version Number
         * @type String
         * @const
         */
        VERSION : '1.0.0',

        /**
         * If Signal should keep record of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        memorize : false,

        /**
         * @type boolean
         * @private
         */
        _shouldPropagate : true,

        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        active : true,

        /**
         * @param {Function} listener
         * @param {boolean} isOnce
         * @param {Object} [listenerContext]
         * @param {Number} [priority]
         * @return {SignalBinding}
         * @private
         */
        _registerListener : function (listener, isOnce, listenerContext, priority) {

            var prevIndex = this._indexOfListener(listener, listenerContext),
                binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }

            if(this.memorize && this._prevParams){
                binding.execute(this._prevParams);
            }

            return binding;
        },

        /**
         * @param {SignalBinding} binding
         * @private
         */
        _addBinding : function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },

        /**
         * @param {Function} listener
         * @return {number}
         * @private
         */
        _indexOfListener : function (listener, context) {
            var n = this._bindings.length,
                cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        },

        /**
         * Check if listener was attached to Signal.
         * @param {Function} listener
         * @param {Object} [context]
         * @return {boolean} if Signal has the specified listener.
         */
        has : function (listener, context) {
            return this._indexOfListener(listener, context) !== -1;
        },

        /**
         * Add a listener to the signal.
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        add : function (listener, listenerContext, priority) {
            validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        },

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        addOnce : function (listener, listenerContext, priority) {
            validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        },

        /**
         * Remove a single listener from the dispatch queue.
         * @param {Function} listener Handler function that should be removed.
         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
         * @return {Function} Listener handler function.
         */
        remove : function (listener, context) {
            validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }
            return listener;
        },

        /**
         * Remove all listeners from the Signal.
         */
        removeAll : function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },

        /**
         * @return {number} Number of listeners attached to the Signal.
         */
        getNumListeners : function () {
            return this._bindings.length;
        },

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
         * @see Signal.prototype.disable
         */
        halt : function () {
            this._shouldPropagate = false;
        },

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         * @param {...*} [params] Parameters that should be passed to each handler.
         */
        dispatch : function (params) {
            if (! this.active) {
                return;
            }

            var paramsArr = Array.prototype.slice.call(arguments),
                n = this._bindings.length,
                bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (! n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },

        /**
         * Forget memorized arguments.
         * @see Signal.memorize
         */
        forget : function(){
            this._prevParams = null;
        },

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
         */
        dispose : function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
        }

    };


    // Namespace -----------------------------------------------------
    //================================================================

    /**
     * Signals namespace
     * @namespace
     * @name signals
     */
    var signals = Signal;

    /**
     * Custom event broadcaster
     * @see Signal
     */
    // alias for backwards compatibility (see #gh-44)
    signals.Signal = Signal;



    //exports to multiple environments
    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return signals; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = signals;
    } else { //browser
        //use string because of Google closure compiler ADVANCED_MODE
        /*jslint sub:true */
        global['signals'] = signals;
    }

}(this));

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = BaseLayer;

var _StartLayer = require("./StartLayer");

var _StartLayer2 = _interopRequireDefault(_StartLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BaseLayer(App) {

	var _baseStage = void 0;

	App.loader.add("base_stage", "./src/maps/base.json").load(function (l, res) {

		_baseStage = res.base_stage.stage;
		_baseStage.app = App;

		_baseStage.scale.set(App.renderer.width / _baseStage.layerWidth, App.renderer.height / _baseStage.layerHeight);

		App.stage.addChild(_baseStage);

		(0, _StartLayer2.default)(_baseStage, function (s) {
			s.parentGroup = _baseStage.BASE_MIDDLE.group;
			_baseStage.addChild(s);
		});

		Init();
	});

	var Init = function Init() {

		App.loader.add("flag_ske", "./src/anims/flag/flag_ske.json").load(function (l, res) {

			if (res.flag_ske.onCreate) {

				res.flag_ske.onCreate.add(function (x) {

					x.Flag.parentGroup = _baseStage.BASE_UI.group;
					x.Flag.scale.set(2, 2);
					x.Flag.position.set(x.Flag.getLocalBounds().width * 2, -90);
					x.Flag.parentGroup = _baseStage.BASE_UI.group;
					x.Flag.animation.play(x.Flag.animation.animationNames[0]);

					var clone = x.Flag.lightCopy();
					clone.position.x += 100;

					clone.animation.gotoAndPlayByProgress(clone.animation.animationNames[0], Math.random());
					_baseStage.addChild(clone);
					_baseStage.addChild(x.Flag);
				});
			}
		});
	};
	// baseStage update;
	App.ticker.add(function () {});
}

},{"./StartLayer":9}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = DragonBoneLoader;

var _signals = require("signals");

var ConstructByName = function ConstructByName(factory, name) {

	var obj = factory.buildArmatureDisplay(name);

	obj.name = name;
	obj.factory = factory;
	obj.origName = name;

	obj.__proto__.lightCopy = function () {

		var _name = name;
		var _clone = ConstructByName(this.factory, this.origName);

		_clone.position.set(this.position.x, this.position.y);

		_clone.alpha = this.alpha;
		_clone.rotation = this.rotation;
		_clone.pivot.copy(this.pivot);
		_clone.anchor.copy(this.anchor);
		_clone.scale.copy(this.scale);
		_clone.visible = this.visible;
		_clone.parentGroup = this.parentGroup;
		_clone.cloneID = this.cloneID ? this.cloneID + 1 : 0;
		_clone.name = this.name + "_clone_" + _clone.cloneID;

		return _clone;
		//
	};

	//obj.importWidth = _data.armature[i].aabb.width;
	//obj.importHeight = _data.armature[i].aabb.height;

	return obj;
};

function DragonBoneLoader() {

	return function (res, next) {

		if (res.url.indexOf(".dbbin") > -1) {

			console.log("Can't support this format in DragonBone PIXI Factory!");
			next();
			return;
		}

		if (!(res.url.indexOf(".json") > -1 && res.data && res.data.armature && res.data.frameRate)) {
			next();
			return;
		}

		if (!(dragonBones && dragonBones.PixiFactory)) {
			next();
			return;
		}

		console.log("DragonBone PIXI PreLoader \n eXponenta {rondo.devil[a]gmail.com}");

		res.onCreate = new _signals.Signal();

		var _data = res.data;

		// add TextureDataJson
		//run new Loader
		var l = new PIXI.loaders.Loader();
		l.add(res.name + "_tex", res.url.replace("ske.json", "tex.json")).add(res.name + "_img", res.url.replace("ske.json", "tex.png")).load(function (_l, _res) {

			var _factory = dragonBones.PixiFactory.factory;
			_factory.parseDragonBonesData(_data);
			_factory.parseTextureAtlasData(_res[res.name + "_tex"].data, _res[res.name + "_img"].texture);

			res.objects = {};
			for (var i = 0; i < _data.armature.length; i++) {

				var name = _data.armature[i].name;

				res.objects[name] = ConstructByName(_factory, name);

				res.onCreate.dispatch(res.objects);
			}
		});

		next();
	};
}

PIXI.loaders.Loader.addPixiMiddleware(DragonBoneLoader);
PIXI.loader.use(DragonBoneLoader());

},{"signals":2}],6:[function(require,module,exports){
"use strict";

PIXI.Container.prototype.getChildByName = function getChildByName(name) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].name === name) {
            return this.children[i];
        }
    }

    return null;
};

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CreateSlicableObject;

var _signals = require("signals");

var _signals2 = _interopRequireDefault(_signals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  obj.onslice = new _signals2.default();

  obj.kill = function () {
    if (this.phBody.sliced && this.onslice) {

      this.onslice.dispatch(this);

      for (var i = 0; i < obj.spriteData.parts.length; i++) {
        CreateSubBody(obj, { normal: obj.spriteData.parts[i] });
      }
    }

    this.destroy({ children: true });
    if (typeof this.phBody !== "undefined") {
      _MC.remove(engine.world, this.phBody);
    }
  };

  obj.onslice.add(function () {
    console.log("Listen Signal");
  });

  var phBody = _MBs.circle(pos.x, pos.y, 50);
  phBody.collisionFilter.mask &= ~phBody.collisionFilter.category;
  _MW.add(engine.world, phBody);

  phBody.piObj = obj;
  obj.phBody = phBody;

  return obj;
}

},{"signals":2}],8:[function(require,module,exports){
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

},{"./Blade":4,"./SlicableObject":7,"@pixi/filter-drop-shadow":1}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = StartLayer;
function StartLayer(base, callback) {
    var _startLayer = void 0;

    var loader = new PIXI.loaders.Loader();

    loader.add("start_stage", "./src/maps/start.json").load(function (l, res) {

        _startLayer = res.start_stage.stage;

        if (typeof callback == "function") {
            callback(_startLayer);
        }

        Init();
    });

    var Init = function Init() {

        var _start_button = _startLayer.getChildByName("start_button:normal");
        var _start_button_hover = _startLayer.getChildByName("start_button:hover");

        var _start_button_normal_tex = _start_button.texture;
        var _start_button_hover_tex = _start_button_hover.texture;

        _start_button.interactive = true;
        _start_button.buttonMode = true;

        _start_button.on("pointerover", function () {
            _start_button.texture = _start_button_hover_tex;
        });
        _start_button.on("pointerout", function () {
            _start_button.texture = _start_button_normal_tex;
        });

        _start_button.on("pointertap", function () {

            _startLayer.visible = false;
            window.LoadGame();
        });
    };
}

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
	spr.visible = _o.visible == undefined ? true : _o.visible;

	spr.types = _o.type ? _o.type.split(":") : [];

	if (_o.properties) {
		spr.alpha = _o.properties.opacity || 1;
		Object.assign(spr, _o.properties);
	}

	return spr;
}

},{}],12:[function(require,module,exports){
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
	_cont.types = _o.type ? _o.type.split(":") : [];

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

},{"./ColorParser":10}],13:[function(require,module,exports){
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

                console.log("Tiled OG importer!\n eXponenta {rondo.devil[a]gmail.com}");
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

},{"./ConstructorSprite":11,"./ConstructorText":12}],14:[function(require,module,exports){
"use strict";

var _OGParser = require("./OGParser");

var _OGParser2 = _interopRequireDefault(_OGParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

PIXI.loaders.Loader.addPixiMiddleware(_OGParser2.default);
PIXI.loader.use((0, _OGParser2.default)());
// nothing to export

},{"./OGParser":13}],15:[function(require,module,exports){
"use strict";

require("./PixiHelper");

var _BaseLayer = require("./BaseLayer");

var _BaseLayer2 = _interopRequireDefault(_BaseLayer);

var _SliceLayer = require("./SliceLayer");

var _SliceLayer2 = _interopRequireDefault(_SliceLayer);

require("./TiledOGLoader/TiledObjGroupLoader");

require("./DragonBoneLoader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  document.body.appendChild(_App.view);
  onResize();
  window.onresize = onResize;

  (0, _BaseLayer2.default)(_App);
  //  _App.stage.interactive = true;
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

},{"./BaseLayer":3,"./DragonBoneLoader":5,"./PixiHelper":6,"./SliceLayer":8,"./TiledOGLoader/TiledObjGroupLoader":14}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsIm5vZGVfbW9kdWxlcy9zaWduYWxzL2Rpc3Qvc2lnbmFscy5qcyIsInNyY1xcc2NyaXB0c1xcQmFzZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxCbGFkZS5qcyIsInNyY1xcc2NyaXB0c1xcRHJhZ29uQm9uZUxvYWRlci5qcyIsInNyY1xcc2NyaXB0c1xcUGl4aUhlbHBlci5qcyIsInNyY1xcc2NyaXB0c1xcU2xpY2FibGVPYmplY3QuanMiLCJzcmNcXHNjcmlwdHNcXFNsaWNlTGF5ZXIuanMiLCJzcmNcXHNjcmlwdHNcXFN0YXJ0TGF5ZXIuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXENvbG9yUGFyc2VyLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxDb25zdHJ1Y3RvclNwcml0ZS5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcQ29uc3RydWN0b3JUZXh0LmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxPR1BhcnNlci5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcVGlsZWRPYmpHcm91cExvYWRlci5qcyIsInNyY1xcc2NyaXB0c1xcY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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dEMsTUFBSSxLQUFLLFNBQVMsSUFBVCxDQUFjLFdBQXZCO0FBQ0EsTUFBSSxLQUFLLFNBQVMsSUFBVCxDQUFjLFlBQXZCOztBQUVBLE1BQUksS0FBSyxFQUFMLEdBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUNwQixTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLEtBQUssSUFBN0I7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLE1BQWhCLEdBQXlCLEtBQUssQ0FBTCxHQUFTLEVBQVQsR0FBYyxJQUF2QztBQUNELEdBSEQsTUFHTztBQUNMLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsS0FBSyxFQUFMLEdBQVUsQ0FBVixHQUFjLElBQXRDO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixNQUFoQixHQUF5QixLQUFLLElBQTlCO0FBQ0Q7QUFDRixDQVhEOztBQWFBLE9BQU8sUUFBUCxHQUFrQixRQUFsQjtBQUNBLE9BQU8sTUFBUCxHQUFnQixJQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdyAtIHYyLjMuMVxuICogQ29tcGlsZWQgV2VkLCAyOSBOb3YgMjAxNyAxNjo0NToxOSBVVENcbiAqXG4gKiBwaXhpLWZpbHRlcnMgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKHQuX19maWx0ZXJfZHJvcF9zaGFkb3c9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gdmVjMyBjb2xvcjtcXG52b2lkIG1haW4odm9pZCl7XFxuICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gVW4tcHJlbXVsdGlwbHkgYWxwaGEgYmVmb3JlIGFwcGx5aW5nIHRoZSBjb2xvclxcbiAgICBpZiAoc2FtcGxlLmEgPiAwLjApIHtcXG4gICAgICAgIHNhbXBsZS5yZ2IgLz0gc2FtcGxlLmE7XFxuICAgIH1cXG5cXG4gICAgLy8gUHJlbXVsdGlwbHkgYWxwaGEgYWdhaW5cXG4gICAgc2FtcGxlLnJnYiA9IGNvbG9yLnJnYiAqIHNhbXBsZS5hO1xcblxcbiAgICAvLyBhbHBoYSB1c2VyIGFscGhhXFxuICAgIHNhbXBsZSAqPSBhbHBoYTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gc2FtcGxlO1xcbn1cIixpPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoaSxuLG8sYSxsKXt2b2lkIDA9PT1pJiYoaT00NSksdm9pZCAwPT09biYmKG49NSksdm9pZCAwPT09byYmKG89Miksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09bCYmKGw9LjUpLHQuY2FsbCh0aGlzKSx0aGlzLnRpbnRGaWx0ZXI9bmV3IFBJWEkuRmlsdGVyKGUsciksdGhpcy5ibHVyRmlsdGVyPW5ldyBQSVhJLmZpbHRlcnMuQmx1ckZpbHRlcix0aGlzLmJsdXJGaWx0ZXIuYmx1cj1vLHRoaXMudGFyZ2V0VHJhbnNmb3JtPW5ldyBQSVhJLk1hdHJpeCx0aGlzLnJvdGF0aW9uPWksdGhpcy5wYWRkaW5nPW4sdGhpcy5kaXN0YW5jZT1uLHRoaXMuYWxwaGE9bCx0aGlzLmNvbG9yPWF9dCYmKGkuX19wcm90b19fPXQpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgbj17ZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0scm90YXRpb246e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQsZSxyLGkpe3ZhciBuPXQuZ2V0UmVuZGVyVGFyZ2V0KCk7bi50cmFuc2Zvcm09dGhpcy50YXJnZXRUcmFuc2Zvcm0sdGhpcy50aW50RmlsdGVyLmFwcGx5KHQsZSxuLCEwKSx0aGlzLmJsdXJGaWx0ZXIuYXBwbHkodCxuLHIpLHQuYXBwbHlGaWx0ZXIodGhpcyxlLHIsaSksbi50cmFuc2Zvcm09bnVsbCx0LnJldHVyblJlbmRlclRhcmdldChuKX0saS5wcm90b3R5cGUuX3VwZGF0ZVBhZGRpbmc9ZnVuY3Rpb24oKXt0aGlzLnBhZGRpbmc9dGhpcy5kaXN0YW5jZSsyKnRoaXMuYmx1cn0saS5wcm90b3R5cGUuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMudGFyZ2V0VHJhbnNmb3JtLnR4PXRoaXMuZGlzdGFuY2UqTWF0aC5jb3ModGhpcy5hbmdsZSksdGhpcy50YXJnZXRUcmFuc2Zvcm0udHk9dGhpcy5kaXN0YW5jZSpNYXRoLnNpbih0aGlzLmFuZ2xlKX0sbi5kaXN0YW5jZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGlzdGFuY2V9LG4uZGlzdGFuY2Uuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuX2Rpc3RhbmNlPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpLHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLnJvdGF0aW9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFuZ2xlL1BJWEkuREVHX1RPX1JBRH0sbi5yb3RhdGlvbi5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5hbmdsZT10KlBJWEkuREVHX1RPX1JBRCx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJGaWx0ZXIuYmx1cn0sbi5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJGaWx0ZXIuYmx1cj10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKX0sbi5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhfSxuLmFscGhhLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGE9dH0sbi5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LG4uY29sb3Iuc2V0PWZ1bmN0aW9uKHQpe1BJWEkudXRpbHMuaGV4MnJnYih0LHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLG4pLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRHJvcFNoYWRvd0ZpbHRlcj1pLHQuRHJvcFNoYWRvd0ZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZHJvcC1zaGFkb3cuanMubWFwXG4iLCIvKmpzbGludCBvbmV2YXI6dHJ1ZSwgdW5kZWY6dHJ1ZSwgbmV3Y2FwOnRydWUsIHJlZ2V4cDp0cnVlLCBiaXR3aXNlOnRydWUsIG1heGVycjo1MCwgaW5kZW50OjQsIHdoaXRlOmZhbHNlLCBub21lbjpmYWxzZSwgcGx1c3BsdXM6ZmFsc2UgKi9cbi8qZ2xvYmFsIGRlZmluZTpmYWxzZSwgcmVxdWlyZTpmYWxzZSwgZXhwb3J0czpmYWxzZSwgbW9kdWxlOmZhbHNlLCBzaWduYWxzOmZhbHNlICovXG5cbi8qKiBAbGljZW5zZVxuICogSlMgU2lnbmFscyA8aHR0cDovL21pbGxlcm1lZGVpcm9zLmdpdGh1Yi5jb20vanMtc2lnbmFscy8+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIEF1dGhvcjogTWlsbGVyIE1lZGVpcm9zXG4gKiBWZXJzaW9uOiAxLjAuMCAtIEJ1aWxkOiAyNjggKDIwMTIvMTEvMjkgMDU6NDggUE0pXG4gKi9cblxuKGZ1bmN0aW9uKGdsb2JhbCl7XG5cbiAgICAvLyBTaWduYWxCaW5kaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8qKlxuICAgICAqIE9iamVjdCB0aGF0IHJlcHJlc2VudHMgYSBiaW5kaW5nIGJldHdlZW4gYSBTaWduYWwgYW5kIGEgbGlzdGVuZXIgZnVuY3Rpb24uXG4gICAgICogPGJyIC8+LSA8c3Ryb25nPlRoaXMgaXMgYW4gaW50ZXJuYWwgY29uc3RydWN0b3IgYW5kIHNob3VsZG4ndCBiZSBjYWxsZWQgYnkgcmVndWxhciB1c2Vycy48L3N0cm9uZz5cbiAgICAgKiA8YnIgLz4tIGluc3BpcmVkIGJ5IEpvYSBFYmVydCBBUzMgU2lnbmFsQmluZGluZyBhbmQgUm9iZXJ0IFBlbm5lcidzIFNsb3QgY2xhc3Nlcy5cbiAgICAgKiBAYXV0aG9yIE1pbGxlciBNZWRlaXJvc1xuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqIEBuYW1lIFNpZ25hbEJpbmRpbmdcbiAgICAgKiBAcGFyYW0ge1NpZ25hbH0gc2lnbmFsIFJlZmVyZW5jZSB0byBTaWduYWwgb2JqZWN0IHRoYXQgbGlzdGVuZXIgaXMgY3VycmVudGx5IGJvdW5kIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIEhhbmRsZXIgZnVuY3Rpb24gYm91bmQgdG8gdGhlIHNpZ25hbC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzT25jZSBJZiBiaW5kaW5nIHNob3VsZCBiZSBleGVjdXRlZCBqdXN0IG9uY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtsaXN0ZW5lckNvbnRleHRdIENvbnRleHQgb24gd2hpY2ggbGlzdGVuZXIgd2lsbCBiZSBleGVjdXRlZCAob2JqZWN0IHRoYXQgc2hvdWxkIHJlcHJlc2VudCB0aGUgYHRoaXNgIHZhcmlhYmxlIGluc2lkZSBsaXN0ZW5lciBmdW5jdGlvbikuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtwcmlvcml0eV0gVGhlIHByaW9yaXR5IGxldmVsIG9mIHRoZSBldmVudCBsaXN0ZW5lci4gKGRlZmF1bHQgPSAwKS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTaWduYWxCaW5kaW5nKHNpZ25hbCwgbGlzdGVuZXIsIGlzT25jZSwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZ1bmN0aW9uIGJvdW5kIHRvIHRoZSBzaWduYWwuXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IGxpc3RlbmVyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBiaW5kaW5nIHNob3VsZCBiZSBleGVjdXRlZCBqdXN0IG9uY2UuXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzT25jZSA9IGlzT25jZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udGV4dCBvbiB3aGljaCBsaXN0ZW5lciB3aWxsIGJlIGV4ZWN1dGVkIChvYmplY3QgdGhhdCBzaG91bGQgcmVwcmVzZW50IHRoZSBgdGhpc2AgdmFyaWFibGUgaW5zaWRlIGxpc3RlbmVyIGZ1bmN0aW9uKS5cbiAgICAgICAgICogQG1lbWJlck9mIFNpZ25hbEJpbmRpbmcucHJvdG90eXBlXG4gICAgICAgICAqIEBuYW1lIGNvbnRleHRcbiAgICAgICAgICogQHR5cGUgT2JqZWN0fHVuZGVmaW5lZHxudWxsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBsaXN0ZW5lckNvbnRleHQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZmVyZW5jZSB0byBTaWduYWwgb2JqZWN0IHRoYXQgbGlzdGVuZXIgaXMgY3VycmVudGx5IGJvdW5kIHRvLlxuICAgICAgICAgKiBAdHlwZSBTaWduYWxcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3NpZ25hbCA9IHNpZ25hbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTGlzdGVuZXIgcHJpb3JpdHlcbiAgICAgICAgICogQHR5cGUgTnVtYmVyXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG4gICAgfVxuXG4gICAgU2lnbmFsQmluZGluZy5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGJpbmRpbmcgaXMgYWN0aXZlIGFuZCBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICovXG4gICAgICAgIGFjdGl2ZSA6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgcGFyYW1ldGVycyBwYXNzZWQgdG8gbGlzdGVuZXIgZHVyaW5nIGBTaWduYWwuZGlzcGF0Y2hgIGFuZCBgU2lnbmFsQmluZGluZy5leGVjdXRlYC4gKGN1cnJpZWQgcGFyYW1ldGVycylcbiAgICAgICAgICogQHR5cGUgQXJyYXl8bnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgcGFyYW1zIDogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbCBsaXN0ZW5lciBwYXNzaW5nIGFyYml0cmFyeSBwYXJhbWV0ZXJzLlxuICAgICAgICAgKiA8cD5JZiBiaW5kaW5nIHdhcyBhZGRlZCB1c2luZyBgU2lnbmFsLmFkZE9uY2UoKWAgaXQgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZnJvbSBzaWduYWwgZGlzcGF0Y2ggcXVldWUsIHRoaXMgbWV0aG9kIGlzIHVzZWQgaW50ZXJuYWxseSBmb3IgdGhlIHNpZ25hbCBkaXNwYXRjaC48L3A+XG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IFtwYXJhbXNBcnJdIEFycmF5IG9mIHBhcmFtZXRlcnMgdGhhdCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBsaXN0ZW5lclxuICAgICAgICAgKiBAcmV0dXJuIHsqfSBWYWx1ZSByZXR1cm5lZCBieSB0aGUgbGlzdGVuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBleGVjdXRlIDogZnVuY3Rpb24gKHBhcmFtc0Fycikge1xuICAgICAgICAgICAgdmFyIGhhbmRsZXJSZXR1cm4sIHBhcmFtcztcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiAhIXRoaXMuX2xpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJhbXM/IHRoaXMucGFyYW1zLmNvbmNhdChwYXJhbXNBcnIpIDogcGFyYW1zQXJyO1xuICAgICAgICAgICAgICAgIGhhbmRsZXJSZXR1cm4gPSB0aGlzLl9saXN0ZW5lci5hcHBseSh0aGlzLmNvbnRleHQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzT25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyUmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRhY2ggYmluZGluZyBmcm9tIHNpZ25hbC5cbiAgICAgICAgICogLSBhbGlhcyB0bzogbXlTaWduYWwucmVtb3ZlKG15QmluZGluZy5nZXRMaXN0ZW5lcigpKTtcbiAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb258bnVsbH0gSGFuZGxlciBmdW5jdGlvbiBib3VuZCB0byB0aGUgc2lnbmFsIG9yIGBudWxsYCBpZiBiaW5kaW5nIHdhcyBwcmV2aW91c2x5IGRldGFjaGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZGV0YWNoIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNCb3VuZCgpPyB0aGlzLl9zaWduYWwucmVtb3ZlKHRoaXMuX2xpc3RlbmVyLCB0aGlzLmNvbnRleHQpIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGJpbmRpbmcgaXMgc3RpbGwgYm91bmQgdG8gdGhlIHNpZ25hbCBhbmQgaGF2ZSBhIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgaXNCb3VuZCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoISF0aGlzLl9zaWduYWwgJiYgISF0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElmIFNpZ25hbEJpbmRpbmcgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uY2UuXG4gICAgICAgICAqL1xuICAgICAgICBpc09uY2UgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNPbmNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gSGFuZGxlciBmdW5jdGlvbiBib3VuZCB0byB0aGUgc2lnbmFsLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TGlzdGVuZXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge1NpZ25hbH0gU2lnbmFsIHRoYXQgbGlzdGVuZXIgaXMgY3VycmVudGx5IGJvdW5kIHRvLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2lnbmFsIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpZ25hbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlIGluc3RhbmNlIHByb3BlcnRpZXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9kZXN0cm95IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NpZ25hbDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcjtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICB0b1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnW1NpZ25hbEJpbmRpbmcgaXNPbmNlOicgKyB0aGlzLl9pc09uY2UgKycsIGlzQm91bmQ6JysgdGhpcy5pc0JvdW5kKCkgKycsIGFjdGl2ZTonICsgdGhpcy5hY3RpdmUgKyAnXSc7XG4gICAgICAgIH1cblxuICAgIH07XG5cblxuLypnbG9iYWwgU2lnbmFsQmluZGluZzpmYWxzZSovXG5cbiAgICAvLyBTaWduYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlTGlzdGVuZXIobGlzdGVuZXIsIGZuTmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdsaXN0ZW5lciBpcyBhIHJlcXVpcmVkIHBhcmFtIG9mIHtmbn0oKSBhbmQgc2hvdWxkIGJlIGEgRnVuY3Rpb24uJy5yZXBsYWNlKCd7Zm59JywgZm5OYW1lKSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3VzdG9tIGV2ZW50IGJyb2FkY2FzdGVyXG4gICAgICogPGJyIC8+LSBpbnNwaXJlZCBieSBSb2JlcnQgUGVubmVyJ3MgQVMzIFNpZ25hbHMuXG4gICAgICogQG5hbWUgU2lnbmFsXG4gICAgICogQGF1dGhvciBNaWxsZXIgTWVkZWlyb3NcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTaWduYWwoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSBBcnJheS48U2lnbmFsQmluZGluZz5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2JpbmRpbmdzID0gW107XG4gICAgICAgIHRoaXMuX3ByZXZQYXJhbXMgPSBudWxsO1xuXG4gICAgICAgIC8vIGVuZm9yY2UgZGlzcGF0Y2ggdG8gYXdheXMgd29yayBvbiBzYW1lIGNvbnRleHQgKCM0NylcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRpc3BhdGNoID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFNpZ25hbC5wcm90b3R5cGUuZGlzcGF0Y2guYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBTaWduYWwucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaWduYWxzIFZlcnNpb24gTnVtYmVyXG4gICAgICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAgICAgKiBAY29uc3RcbiAgICAgICAgICovXG4gICAgICAgIFZFUlNJT04gOiAnMS4wLjAnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBTaWduYWwgc2hvdWxkIGtlZXAgcmVjb3JkIG9mIHByZXZpb3VzbHkgZGlzcGF0Y2hlZCBwYXJhbWV0ZXJzIGFuZFxuICAgICAgICAgKiBhdXRvbWF0aWNhbGx5IGV4ZWN1dGUgbGlzdGVuZXIgZHVyaW5nIGBhZGQoKWAvYGFkZE9uY2UoKWAgaWYgU2lnbmFsIHdhc1xuICAgICAgICAgKiBhbHJlYWR5IGRpc3BhdGNoZWQgYmVmb3JlLlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqL1xuICAgICAgICBtZW1vcml6ZSA6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfc2hvdWxkUHJvcGFnYXRlIDogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgU2lnbmFsIGlzIGFjdGl2ZSBhbmQgc2hvdWxkIGJyb2FkY2FzdCBldmVudHMuXG4gICAgICAgICAqIDxwPjxzdHJvbmc+SU1QT1JUQU5UOjwvc3Ryb25nPiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgZHVyaW5nIGEgZGlzcGF0Y2ggd2lsbCBvbmx5IGFmZmVjdCB0aGUgbmV4dCBkaXNwYXRjaCwgaWYgeW91IHdhbnQgdG8gc3RvcCB0aGUgcHJvcGFnYXRpb24gb2YgYSBzaWduYWwgdXNlIGBoYWx0KClgIGluc3RlYWQuPC9wPlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqL1xuICAgICAgICBhY3RpdmUgOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzT25jZVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2xpc3RlbmVyQ29udGV4dF1cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtwcmlvcml0eV1cbiAgICAgICAgICogQHJldHVybiB7U2lnbmFsQmluZGluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9yZWdpc3Rlckxpc3RlbmVyIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBpc09uY2UsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpIHtcblxuICAgICAgICAgICAgdmFyIHByZXZJbmRleCA9IHRoaXMuX2luZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lciwgbGlzdGVuZXJDb250ZXh0KSxcbiAgICAgICAgICAgICAgICBiaW5kaW5nO1xuXG4gICAgICAgICAgICBpZiAocHJldkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGJpbmRpbmcgPSB0aGlzLl9iaW5kaW5nc1twcmV2SW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nLmlzT25jZSgpICE9PSBpc09uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2Fubm90IGFkZCcrIChpc09uY2U/ICcnIDogJ09uY2UnKSArJygpIHRoZW4gYWRkJysgKCFpc09uY2U/ICcnIDogJ09uY2UnKSArJygpIHRoZSBzYW1lIGxpc3RlbmVyIHdpdGhvdXQgcmVtb3ZpbmcgdGhlIHJlbGF0aW9uc2hpcCBmaXJzdC4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJpbmRpbmcgPSBuZXcgU2lnbmFsQmluZGluZyh0aGlzLCBsaXN0ZW5lciwgaXNPbmNlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hZGRCaW5kaW5nKGJpbmRpbmcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLm1lbW9yaXplICYmIHRoaXMuX3ByZXZQYXJhbXMpe1xuICAgICAgICAgICAgICAgIGJpbmRpbmcuZXhlY3V0ZSh0aGlzLl9wcmV2UGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U2lnbmFsQmluZGluZ30gYmluZGluZ1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2FkZEJpbmRpbmcgOiBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICAgICAgLy9zaW1wbGlmaWVkIGluc2VydGlvbiBzb3J0XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuX2JpbmRpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgIGRvIHsgLS1uOyB9IHdoaWxlICh0aGlzLl9iaW5kaW5nc1tuXSAmJiBiaW5kaW5nLl9wcmlvcml0eSA8PSB0aGlzLl9iaW5kaW5nc1tuXS5fcHJpb3JpdHkpO1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ3Muc3BsaWNlKG4gKyAxLCAwLCBiaW5kaW5nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2luZGV4T2ZMaXN0ZW5lciA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgY29udGV4dCkge1xuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgY3VyO1xuICAgICAgICAgICAgd2hpbGUgKG4tLSkge1xuICAgICAgICAgICAgICAgIGN1ciA9IHRoaXMuX2JpbmRpbmdzW25dO1xuICAgICAgICAgICAgICAgIGlmIChjdXIuX2xpc3RlbmVyID09PSBsaXN0ZW5lciAmJiBjdXIuY29udGV4dCA9PT0gY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIGxpc3RlbmVyIHdhcyBhdHRhY2hlZCB0byBTaWduYWwuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF1cbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gaWYgU2lnbmFsIGhhcyB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgaGFzIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyLCBjb250ZXh0KSAhPT0gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBhIGxpc3RlbmVyIHRvIHRoZSBzaWduYWwuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIFNpZ25hbCBoYW5kbGVyIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2xpc3RlbmVyQ29udGV4dF0gQ29udGV4dCBvbiB3aGljaCBsaXN0ZW5lciB3aWxsIGJlIGV4ZWN1dGVkIChvYmplY3QgdGhhdCBzaG91bGQgcmVwcmVzZW50IHRoZSBgdGhpc2AgdmFyaWFibGUgaW5zaWRlIGxpc3RlbmVyIGZ1bmN0aW9uKS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtwcmlvcml0eV0gVGhlIHByaW9yaXR5IGxldmVsIG9mIHRoZSBldmVudCBsaXN0ZW5lci4gTGlzdGVuZXJzIHdpdGggaGlnaGVyIHByaW9yaXR5IHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIGxpc3RlbmVycyB3aXRoIGxvd2VyIHByaW9yaXR5LiBMaXN0ZW5lcnMgd2l0aCBzYW1lIHByaW9yaXR5IGxldmVsIHdpbGwgYmUgZXhlY3V0ZWQgYXQgdGhlIHNhbWUgb3JkZXIgYXMgdGhleSB3ZXJlIGFkZGVkLiAoZGVmYXVsdCA9IDApXG4gICAgICAgICAqIEByZXR1cm4ge1NpZ25hbEJpbmRpbmd9IEFuIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIGJpbmRpbmcgYmV0d2VlbiB0aGUgU2lnbmFsIGFuZCBsaXN0ZW5lci5cbiAgICAgICAgICovXG4gICAgICAgIGFkZCA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSkge1xuICAgICAgICAgICAgdmFsaWRhdGVMaXN0ZW5lcihsaXN0ZW5lciwgJ2FkZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyTGlzdGVuZXIobGlzdGVuZXIsIGZhbHNlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGxpc3RlbmVyIHRvIHRoZSBzaWduYWwgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBmaXJzdCBleGVjdXRpb24gKHdpbGwgYmUgZXhlY3V0ZWQgb25seSBvbmNlKS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgU2lnbmFsIGhhbmRsZXIgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbbGlzdGVuZXJDb250ZXh0XSBDb250ZXh0IG9uIHdoaWNoIGxpc3RlbmVyIHdpbGwgYmUgZXhlY3V0ZWQgKG9iamVjdCB0aGF0IHNob3VsZCByZXByZXNlbnQgdGhlIGB0aGlzYCB2YXJpYWJsZSBpbnNpZGUgbGlzdGVuZXIgZnVuY3Rpb24pLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ByaW9yaXR5XSBUaGUgcHJpb3JpdHkgbGV2ZWwgb2YgdGhlIGV2ZW50IGxpc3RlbmVyLiBMaXN0ZW5lcnMgd2l0aCBoaWdoZXIgcHJpb3JpdHkgd2lsbCBiZSBleGVjdXRlZCBiZWZvcmUgbGlzdGVuZXJzIHdpdGggbG93ZXIgcHJpb3JpdHkuIExpc3RlbmVycyB3aXRoIHNhbWUgcHJpb3JpdHkgbGV2ZWwgd2lsbCBiZSBleGVjdXRlZCBhdCB0aGUgc2FtZSBvcmRlciBhcyB0aGV5IHdlcmUgYWRkZWQuIChkZWZhdWx0ID0gMClcbiAgICAgICAgICogQHJldHVybiB7U2lnbmFsQmluZGluZ30gQW4gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgYmluZGluZyBiZXR3ZWVuIHRoZSBTaWduYWwgYW5kIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgYWRkT25jZSA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSkge1xuICAgICAgICAgICAgdmFsaWRhdGVMaXN0ZW5lcihsaXN0ZW5lciwgJ2FkZE9uY2UnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3Rlckxpc3RlbmVyKGxpc3RlbmVyLCB0cnVlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGEgc2luZ2xlIGxpc3RlbmVyIGZyb20gdGhlIGRpc3BhdGNoIHF1ZXVlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBIYW5kbGVyIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gRXhlY3V0aW9uIGNvbnRleHQgKHNpbmNlIHlvdSBjYW4gYWRkIHRoZSBzYW1lIGhhbmRsZXIgbXVsdGlwbGUgdGltZXMgaWYgZXhlY3V0aW5nIGluIGEgZGlmZmVyZW50IGNvbnRleHQpLlxuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTGlzdGVuZXIgaGFuZGxlciBmdW5jdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZSA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgY29udGV4dCkge1xuICAgICAgICAgICAgdmFsaWRhdGVMaXN0ZW5lcihsaXN0ZW5lciwgJ3JlbW92ZScpO1xuXG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMuX2luZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lciwgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nc1tpXS5fZGVzdHJveSgpOyAvL25vIHJlYXNvbiB0byBhIFNpZ25hbEJpbmRpbmcgZXhpc3QgaWYgaXQgaXNuJ3QgYXR0YWNoZWQgdG8gYSBzaWduYWxcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5ncy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZyb20gdGhlIFNpZ25hbC5cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUFsbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKG4tLSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdzW25dLl9kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5ncy5sZW5ndGggPSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IE51bWJlciBvZiBsaXN0ZW5lcnMgYXR0YWNoZWQgdG8gdGhlIFNpZ25hbC5cbiAgICAgICAgICovXG4gICAgICAgIGdldE51bUxpc3RlbmVycyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0b3AgcHJvcGFnYXRpb24gb2YgdGhlIGV2ZW50LCBibG9ja2luZyB0aGUgZGlzcGF0Y2ggdG8gbmV4dCBsaXN0ZW5lcnMgb24gdGhlIHF1ZXVlLlxuICAgICAgICAgKiA8cD48c3Ryb25nPklNUE9SVEFOVDo8L3N0cm9uZz4gc2hvdWxkIGJlIGNhbGxlZCBvbmx5IGR1cmluZyBzaWduYWwgZGlzcGF0Y2gsIGNhbGxpbmcgaXQgYmVmb3JlL2FmdGVyIGRpc3BhdGNoIHdvbid0IGFmZmVjdCBzaWduYWwgYnJvYWRjYXN0LjwvcD5cbiAgICAgICAgICogQHNlZSBTaWduYWwucHJvdG90eXBlLmRpc2FibGVcbiAgICAgICAgICovXG4gICAgICAgIGhhbHQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9zaG91bGRQcm9wYWdhdGUgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2gvQnJvYWRjYXN0IFNpZ25hbCB0byBhbGwgbGlzdGVuZXJzIGFkZGVkIHRvIHRoZSBxdWV1ZS5cbiAgICAgICAgICogQHBhcmFtIHsuLi4qfSBbcGFyYW1zXSBQYXJhbWV0ZXJzIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCB0byBlYWNoIGhhbmRsZXIuXG4gICAgICAgICAqL1xuICAgICAgICBkaXNwYXRjaCA6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICghIHRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFyYW1zQXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgICAgICAgICAgICBuID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGJpbmRpbmdzO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tZW1vcml6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZQYXJhbXMgPSBwYXJhbXNBcnI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghIG4pIHtcbiAgICAgICAgICAgICAgICAvL3Nob3VsZCBjb21lIGFmdGVyIG1lbW9yaXplXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiaW5kaW5ncyA9IHRoaXMuX2JpbmRpbmdzLnNsaWNlKCk7IC8vY2xvbmUgYXJyYXkgaW4gY2FzZSBhZGQvcmVtb3ZlIGl0ZW1zIGR1cmluZyBkaXNwYXRjaFxuICAgICAgICAgICAgdGhpcy5fc2hvdWxkUHJvcGFnYXRlID0gdHJ1ZTsgLy9pbiBjYXNlIGBoYWx0YCB3YXMgY2FsbGVkIGJlZm9yZSBkaXNwYXRjaCBvciBkdXJpbmcgdGhlIHByZXZpb3VzIGRpc3BhdGNoLlxuXG4gICAgICAgICAgICAvL2V4ZWN1dGUgYWxsIGNhbGxiYWNrcyB1bnRpbCBlbmQgb2YgdGhlIGxpc3Qgb3IgdW50aWwgYSBjYWxsYmFjayByZXR1cm5zIGBmYWxzZWAgb3Igc3RvcHMgcHJvcGFnYXRpb25cbiAgICAgICAgICAgIC8vcmV2ZXJzZSBsb29wIHNpbmNlIGxpc3RlbmVycyB3aXRoIGhpZ2hlciBwcmlvcml0eSB3aWxsIGJlIGFkZGVkIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3RcbiAgICAgICAgICAgIGRvIHsgbi0tOyB9IHdoaWxlIChiaW5kaW5nc1tuXSAmJiB0aGlzLl9zaG91bGRQcm9wYWdhdGUgJiYgYmluZGluZ3Nbbl0uZXhlY3V0ZShwYXJhbXNBcnIpICE9PSBmYWxzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZvcmdldCBtZW1vcml6ZWQgYXJndW1lbnRzLlxuICAgICAgICAgKiBAc2VlIFNpZ25hbC5tZW1vcml6ZVxuICAgICAgICAgKi9cbiAgICAgICAgZm9yZ2V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZQYXJhbXMgPSBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYWxsIGJpbmRpbmdzIGZyb20gc2lnbmFsIGFuZCBkZXN0cm95IGFueSByZWZlcmVuY2UgdG8gZXh0ZXJuYWwgb2JqZWN0cyAoZGVzdHJveSBTaWduYWwgb2JqZWN0KS5cbiAgICAgICAgICogPHA+PHN0cm9uZz5JTVBPUlRBTlQ6PC9zdHJvbmc+IGNhbGxpbmcgYW55IG1ldGhvZCBvbiB0aGUgc2lnbmFsIGluc3RhbmNlIGFmdGVyIGNhbGxpbmcgZGlzcG9zZSB3aWxsIHRocm93IGVycm9ycy48L3A+XG4gICAgICAgICAqL1xuICAgICAgICBkaXNwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9iaW5kaW5ncztcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcmV2UGFyYW1zO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdG9TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1tTaWduYWwgYWN0aXZlOicrIHRoaXMuYWN0aXZlICsnIG51bUxpc3RlbmVyczonKyB0aGlzLmdldE51bUxpc3RlbmVycygpICsnXSc7XG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIC8vIE5hbWVzcGFjZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLyoqXG4gICAgICogU2lnbmFscyBuYW1lc3BhY2VcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG5hbWUgc2lnbmFsc1xuICAgICAqL1xuICAgIHZhciBzaWduYWxzID0gU2lnbmFsO1xuXG4gICAgLyoqXG4gICAgICogQ3VzdG9tIGV2ZW50IGJyb2FkY2FzdGVyXG4gICAgICogQHNlZSBTaWduYWxcbiAgICAgKi9cbiAgICAvLyBhbGlhcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgKHNlZSAjZ2gtNDQpXG4gICAgc2lnbmFscy5TaWduYWwgPSBTaWduYWw7XG5cblxuXG4gICAgLy9leHBvcnRzIHRvIG11bHRpcGxlIGVudmlyb25tZW50c1xuICAgIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCl7IC8vQU1EXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBzaWduYWxzOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXsgLy9ub2RlXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gc2lnbmFscztcbiAgICB9IGVsc2UgeyAvL2Jyb3dzZXJcbiAgICAgICAgLy91c2Ugc3RyaW5nIGJlY2F1c2Ugb2YgR29vZ2xlIGNsb3N1cmUgY29tcGlsZXIgQURWQU5DRURfTU9ERVxuICAgICAgICAvKmpzbGludCBzdWI6dHJ1ZSAqL1xuICAgICAgICBnbG9iYWxbJ3NpZ25hbHMnXSA9IHNpZ25hbHM7XG4gICAgfVxuXG59KHRoaXMpKTtcbiIsImltcG9ydCBfU3RhcnRTdGFnZUNyZWF0ZXIgZnJvbSBcIi4vU3RhcnRMYXllclwiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCYXNlTGF5ZXIoQXBwKSB7XHJcblxyXG5cdGxldCBfYmFzZVN0YWdlO1xyXG5cclxuXHRBcHAubG9hZGVyXHJcblx0XHQuYWRkKFwiYmFzZV9zdGFnZVwiLCBcIi4vc3JjL21hcHMvYmFzZS5qc29uXCIpXHJcblx0XHQubG9hZCgobCwgcmVzKSA9PiB7XHJcbiAgICBcdFxyXG4gICAgXHRfYmFzZVN0YWdlID0gcmVzLmJhc2Vfc3RhZ2Uuc3RhZ2U7XHJcbiAgICBcdF9iYXNlU3RhZ2UuYXBwID0gQXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIF9iYXNlU3RhZ2Uuc2NhbGUuc2V0KFxyXG4gICAgICAgICAgICBBcHAucmVuZGVyZXIud2lkdGggLyBfYmFzZVN0YWdlLmxheWVyV2lkdGgsXHJcbiAgICAgICAgICAgIEFwcC5yZW5kZXJlci5oZWlnaHQgLyBfYmFzZVN0YWdlLmxheWVySGVpZ2h0XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgQXBwLnN0YWdlLmFkZENoaWxkKF9iYXNlU3RhZ2UpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIF9TdGFydFN0YWdlQ3JlYXRlcihfYmFzZVN0YWdlLCBzID0+e1xyXG4gICAgICAgIFx0cy5wYXJlbnRHcm91cCA9IF9iYXNlU3RhZ2UuQkFTRV9NSURETEUuZ3JvdXA7XHJcbiAgICAgICAgXHRfYmFzZVN0YWdlLmFkZENoaWxkKHMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBJbml0KCk7XHJcbiAgICB9KTtcclxuXHJcblx0bGV0IEluaXQgPSBmdW5jdGlvbigpe1xyXG5cclxuXHRcdEFwcC5sb2FkZXJcclxuXHRcdC5hZGQoXCJmbGFnX3NrZVwiLCBcIi4vc3JjL2FuaW1zL2ZsYWcvZmxhZ19za2UuanNvblwiKVxyXG5cdFx0LmxvYWQoKGwsIHJlcykgPT4ge1xyXG5cclxuXHRcdFx0aWYocmVzLmZsYWdfc2tlLm9uQ3JlYXRlKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXMuZmxhZ19za2Uub25DcmVhdGUuYWRkKCB4ID0+IHtcclxuXHJcblx0XHRcdFx0XHR4LkZsYWcucGFyZW50R3JvdXAgPSBfYmFzZVN0YWdlLkJBU0VfVUkuZ3JvdXA7XHJcblx0XHRcdFx0XHR4LkZsYWcuc2NhbGUuc2V0KDIsMik7XHJcblx0XHRcdFx0XHR4LkZsYWcucG9zaXRpb24uc2V0KHguRmxhZy5nZXRMb2NhbEJvdW5kcygpLndpZHRoICogMiwgLTkwKTtcclxuXHRcdFx0XHRcdHguRmxhZy5wYXJlbnRHcm91cCA9IF9iYXNlU3RhZ2UuQkFTRV9VSS5ncm91cDtcclxuXHRcdFx0XHRcdHguRmxhZy5hbmltYXRpb24ucGxheSh4LkZsYWcuYW5pbWF0aW9uLmFuaW1hdGlvbk5hbWVzWzBdKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgY2xvbmUgPSB4LkZsYWcubGlnaHRDb3B5KCk7XHJcblx0XHRcdFx0XHRjbG9uZS5wb3NpdGlvbi54ICs9IDEwMDtcclxuXHJcblx0XHRcdFx0XHRjbG9uZS5hbmltYXRpb24uZ290b0FuZFBsYXlCeVByb2dyZXNzKGNsb25lLmFuaW1hdGlvbi5hbmltYXRpb25OYW1lc1swXSwgTWF0aC5yYW5kb20oKSk7XHJcblx0XHRcdFx0XHRfYmFzZVN0YWdlLmFkZENoaWxkKGNsb25lKTtcclxuXHRcdFx0XHRcdF9iYXNlU3RhZ2UuYWRkQ2hpbGQoeC5GbGFnKTtcclxuXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcbiAgICAvLyBiYXNlU3RhZ2UgdXBkYXRlO1xyXG4gICAgQXBwLnRpY2tlci5hZGQoKCkgPT4ge1xyXG5cclxuICAgIH0pOyAgIFxyXG59IiwiXHJcbi8vQmxhZGUgSlMgY29uc3RydWN0b3JcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJsYWRlKHRleHR1cmUpIHtcclxuICB2YXIgY291bnQgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAxMDtcclxuICB2YXIgbWluRGlzdCA9XHJcbiAgICBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDQwO1xyXG4gIHZhciBsaXZlVGltZSA9XHJcbiAgICBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDIwO1xyXG5cclxuICB2YXIgcG9pbnRzID0gW107XHJcbiAgdGhpcy5jb3VudCA9IGNvdW50O1xyXG4gIHRoaXMubWluRGlzdCA9IG1pbkRpc3Q7XHJcbiAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcclxuICB0aGlzLm1pbk1vdGlvblNwZWVkID0gNDAwMC4wO1xyXG4gIHRoaXMubGl2ZVRpbWUgPSBsaXZlVGltZTtcclxuICB0aGlzLmxhc3RNb3Rpb25TcGVlZCA9IDA7XHJcbiAgdGhpcy50YXJnZXRQb3NpdGlvbiA9IG5ldyBQSVhJLlBvaW50KDAsIDApO1xyXG5cclxuICB0aGlzLmJvZHkgPSBuZXcgUElYSS5tZXNoLlJvcGUodGV4dHVyZSwgcG9pbnRzKTtcclxuXHJcbiAgdmFyIGxhc3RQb3NpdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5VcGRhdGUgPSBmdW5jdGlvbih0aWNrZXIpIHtcclxuICAgIHZhciBpc0RpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgdmFyIHBvaW50cyA9IHRoaXMuYm9keS5wb2ludHM7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IHBvaW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICBpZiAocG9pbnRzW2ldLmxhc3RUaW1lICsgdGhpcy5saXZlVGltZSA8IHRpY2tlci5sYXN0VGltZSkge1xyXG4gICAgICAgIHBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIGlzRGlydHkgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHQgPSBuZXcgUElYSS5Qb2ludChcclxuICAgICAgdGhpcy50YXJnZXRQb3NpdGlvbi54IC8gdGhpcy5ib2R5LnNjYWxlLngsXHJcbiAgICAgIHRoaXMudGFyZ2V0UG9zaXRpb24ueSAvIHRoaXMuYm9keS5zY2FsZS55XHJcbiAgICApO1xyXG5cclxuICAgIGlmIChsYXN0UG9zaXRpb24gPT0gbnVsbCkgbGFzdFBvc2l0aW9uID0gdDtcclxuXHJcbiAgICB0Lmxhc3RUaW1lID0gdGlja2VyLmxhc3RUaW1lO1xyXG5cclxuICAgIHZhciBwID0gbGFzdFBvc2l0aW9uO1xyXG5cclxuICAgIHZhciBkeCA9IHQueCAtIHAueDtcclxuICAgIHZhciBkeSA9IHQueSAtIHAueTtcclxuXHJcbiAgICB2YXIgZGlzdCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG4gICAgdGhpcy5sYXN0TW90aW9uU3BlZWQgPSBkaXN0ICogMTAwMCAvIHRpY2tlci5lbGFwc2VkTVM7XHJcbiAgICBpZiAoZGlzdCA+IG1pbkRpc3QpIHtcclxuICAgICAgaWYgKHRoaXMubGFzdE1vdGlvblNwZWVkID4gdGhpcy5taW5Nb3Rpb25TcGVlZCkge1xyXG4gICAgICAgIHBvaW50cy5wdXNoKHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChwb2ludHMubGVuZ3RoID4gdGhpcy5jb3VudCkge1xyXG4gICAgICAgIHBvaW50cy5zaGlmdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpc0RpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBsYXN0UG9zaXRpb24gPSB0O1xyXG4gICAgaWYgKGlzRGlydHkpIHtcclxuICAgICAgdGhpcy5ib2R5LnJlZnJlc2godHJ1ZSk7XHJcbiAgICAgIHRoaXMuYm9keS5yZW5kZXJhYmxlID0gcG9pbnRzLmxlbmd0aCA+IDE7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5SZWFkQ2FsbGJhY2tzID0gZnVuY3Rpb24odGFyZ2V0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGFyZ2V0Lm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgc2VsZi50YXJnZXRQb3NpdGlvbiA9IGUuZGF0YS5nbG9iYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC5tb3VzZW92ZXIgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIC8vXHRzZWxmLnRhcmdldFBvc2l0aW9uID0gIGUuZGF0YS5nbG9iYWw7XHJcbiAgICAgIC8vXHRjb25zb2xlLmxvZyhcIm92ZXJcIik7XHJcbiAgICAgIC8vICBzZWxmLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaG1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG91Y2ggbW92ZVwiKTtcclxuICAgICAgLy9jb25zb2xlLmxvZyhlLmRhdGEpO1xyXG4gICAgICBzZWxmLnRhcmdldFBvc2l0aW9uID0gZS5kYXRhLmdsb2JhbDtcclxuICAgIH07XHJcblxyXG4gICAgdGFyZ2V0LnRvdWNoc3RhcnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG91Y2ggc3RhcnRcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5kYXRhKTtcclxuICAgICAgLy8gIHNlbGYuTW92ZUFsbChlLmRhdGEuZ2xvYmFsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGFyZ2V0LnRvdWNoZW5kID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIHN0YXJ0XCIpO1xyXG4gICAgICAvLyBfQmxhZGUuTW92ZUFsbChlLmRhdGEuZ2xvYmFsKTtcclxuICAgIH07XHJcbiAgICAvLyDQsCDRgtC+INC70LDQv9GI0LAg0LrQsNC60LDRjy3RgtC+XHJcbiAgfTtcclxufTtcclxuXHJcbi8vcmV0dXJuIEJsYWRlO1xyXG5cclxuIiwiaW1wb3J0IHtTaWduYWx9IGZyb20gXCJzaWduYWxzXCI7XHJcblxyXG5sZXQgQ29uc3RydWN0QnlOYW1lID0gZnVuY3Rpb24oZmFjdG9yeSwgbmFtZSkge1xyXG5cclxuXHRsZXQgb2JqID0gZmFjdG9yeS5idWlsZEFybWF0dXJlRGlzcGxheShuYW1lKTtcclxuXHRcdFx0XHRcclxuXHRvYmoubmFtZSA9IG5hbWU7XHJcblx0b2JqLmZhY3RvcnkgPSBmYWN0b3J5O1xyXG5cdG9iai5vcmlnTmFtZSA9IG5hbWU7XHJcblxyXG5cdFxyXG5cdG9iai5fX3Byb3RvX18ubGlnaHRDb3B5ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdGxldCBfbmFtZSA9IG5hbWU7XHJcblx0XHRsZXQgX2Nsb25lID0gQ29uc3RydWN0QnlOYW1lKHRoaXMuZmFjdG9yeSwgdGhpcy5vcmlnTmFtZSk7XHJcblx0XHRcclxuXHRcdF9jbG9uZS5wb3NpdGlvbi5zZXQodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpO1xyXG5cdFx0XHJcblx0XHRfY2xvbmUuYWxwaGEgPSB0aGlzLmFscGhhO1xyXG5cdFx0X2Nsb25lLnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbjtcclxuXHRcdF9jbG9uZS5waXZvdC5jb3B5KHRoaXMucGl2b3QpO1xyXG5cdFx0X2Nsb25lLmFuY2hvci5jb3B5KHRoaXMuYW5jaG9yKTtcclxuXHRcdF9jbG9uZS5zY2FsZS5jb3B5KHRoaXMuc2NhbGUpO1xyXG5cdFx0X2Nsb25lLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcblx0XHRfY2xvbmUucGFyZW50R3JvdXAgPSB0aGlzLnBhcmVudEdyb3VwO1xyXG5cdFx0X2Nsb25lLmNsb25lSUQgPSB0aGlzLmNsb25lSUQ/ICh0aGlzLmNsb25lSUQgKyAxKSA6IDA7XHJcblx0XHRfY2xvbmUubmFtZSA9IHRoaXMubmFtZSArIFwiX2Nsb25lX1wiICsgX2Nsb25lLmNsb25lSUQ7XHJcblx0XHRcclxuXHRcdHJldHVybiBfY2xvbmU7XHJcblx0XHQvL1xyXG5cdH1cclxuXHRcclxuXHJcblx0XHJcblx0Ly9vYmouaW1wb3J0V2lkdGggPSBfZGF0YS5hcm1hdHVyZVtpXS5hYWJiLndpZHRoO1xyXG5cdC8vb2JqLmltcG9ydEhlaWdodCA9IF9kYXRhLmFybWF0dXJlW2ldLmFhYmIuaGVpZ2h0O1xyXG5cdFxyXG5cdHJldHVybiBvYmo7XHJcbn0gXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmFnb25Cb25lTG9hZGVyKCkge1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24ocmVzLCBuZXh0KSB7XHJcblxyXG5cdFx0aWYocmVzLnVybC5pbmRleE9mKFwiLmRiYmluXCIpID4gLTEpe1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coXCJDYW4ndCBzdXBwb3J0IHRoaXMgZm9ybWF0IGluIERyYWdvbkJvbmUgUElYSSBGYWN0b3J5IVwiKTtcclxuXHRcdFx0bmV4dCgpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIShyZXMudXJsLmluZGV4T2YoXCIuanNvblwiKSA+IC0xICYmIHJlcy5kYXRhICYmIHJlcy5kYXRhLmFybWF0dXJlICYmIHJlcy5kYXRhLmZyYW1lUmF0ZSkpXHJcblx0XHR7XHJcblx0XHRcdG5leHQoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCEoZHJhZ29uQm9uZXMgJiYgZHJhZ29uQm9uZXMuUGl4aUZhY3RvcnkpKXtcclxuXHRcdFx0bmV4dCgpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJEcmFnb25Cb25lIFBJWEkgUHJlTG9hZGVyIFxcbiBlWHBvbmVudGEge3JvbmRvLmRldmlsW2FdZ21haWwuY29tfVwiKTtcclxuXHJcblxyXG5cdFx0cmVzLm9uQ3JlYXRlID0gbmV3IFNpZ25hbCgpO1xyXG5cclxuXHRcdGxldCBfZGF0YSA9IHJlcy5kYXRhO1xyXG5cdFx0XHJcblx0XHQvLyBhZGQgVGV4dHVyZURhdGFKc29uXHJcblx0XHQvL3J1biBuZXcgTG9hZGVyXHJcblx0XHRsZXQgbCA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XHJcblx0XHRsLmFkZChyZXMubmFtZSArIFwiX3RleFwiLCByZXMudXJsLnJlcGxhY2UoXCJza2UuanNvblwiLFwidGV4Lmpzb25cIikpXHJcblx0XHQuYWRkKHJlcy5uYW1lICsgXCJfaW1nXCIsIHJlcy51cmwucmVwbGFjZShcInNrZS5qc29uXCIsXCJ0ZXgucG5nXCIpKVxyXG5cdFx0LmxvYWQoIChfbCwgX3JlcykgPT4ge1xyXG5cclxuXHRcdFx0bGV0IF9mYWN0b3J5ID0gZHJhZ29uQm9uZXMuUGl4aUZhY3RvcnkuZmFjdG9yeTtcclxuXHRcdFx0X2ZhY3RvcnkucGFyc2VEcmFnb25Cb25lc0RhdGEoX2RhdGEpO1xyXG5cdFx0XHRfZmFjdG9yeS5wYXJzZVRleHR1cmVBdGxhc0RhdGEoX3Jlc1tyZXMubmFtZSArIFwiX3RleFwiXS5kYXRhLF9yZXNbcmVzLm5hbWUgKyBcIl9pbWdcIl0udGV4dHVyZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXMub2JqZWN0cyA9IHt9O1xyXG5cdFx0XHRmb3IgKGxldCBpPSAwOyBpIDwgX2RhdGEuYXJtYXR1cmUubGVuZ3RoOyBpKyspIFxyXG5cdFx0XHR7XHJcblxyXG5cdFx0XHRcdGxldCBuYW1lID0gX2RhdGEuYXJtYXR1cmVbaV0ubmFtZTtcclxuXHJcblx0XHRcdFx0cmVzLm9iamVjdHNbbmFtZV0gPSBDb25zdHJ1Y3RCeU5hbWUoX2ZhY3RvcnksIG5hbWUpO1xyXG5cclxuXHRcdFx0XHRyZXMub25DcmVhdGUuZGlzcGF0Y2gocmVzLm9iamVjdHMpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRuZXh0KCk7XHJcblx0fTtcclxufVxyXG5cclxuUElYSS5sb2FkZXJzLkxvYWRlci5hZGRQaXhpTWlkZGxld2FyZShEcmFnb25Cb25lTG9hZGVyKTtcclxuUElYSS5sb2FkZXIudXNlKERyYWdvbkJvbmVMb2FkZXIoKSk7IiwiXHJcblBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5nZXRDaGlsZEJ5TmFtZSA9IGZ1bmN0aW9uIGdldENoaWxkQnlOYW1lKG5hbWUpXHJcbntcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXS5uYW1lID09PSBuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59OyIsImltcG9ydCBTaWduYWwgZnJvbSBcInNpZ25hbHNcIlxyXG5cclxudmFyIF9NRSA9IE1hdHRlci5FbmdpbmUsXHJcbiAgICBfTVcgPSBNYXR0ZXIuV29ybGQsXHJcbiAgICBfTUJzID0gTWF0dGVyLkJvZGllcyxcclxuICAgIF9NQiA9IE1hdHRlci5Cb2R5LFxyXG4gICAgX01DID0gTWF0dGVyLkNvbXBvc2l0ZSxcclxuICAgIF9NRXYgPSBNYXR0ZXIuRXZlbnRzLFxyXG4gICAgX01WID0gTWF0dGVyLlZlY3RvcjtcclxuXHJcbmxldCBDcmVhdGVTdWJCb2R5ID0gZnVuY3Rpb24ocGFyZW50LCB0ZXhEYXRhKXtcclxuXHJcbiAgbGV0IG9iaiA9IENyZWF0ZVNsaWNhYmxlT2JqZWN0KHBhcmVudC5wb3NpdGlvbiwgcGFyZW50LmVuZ2luZSwgdGV4RGF0YSk7XHJcbiAgXHJcbiAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgb2JqLnBhcmVudEdyb3VwID0gdGV4RGF0YS5ncm91cDtcclxuXHJcbiAgX01CLnNldE1hc3Mob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS5tYXNzICogMC41KTtcclxuICBfTUIuc2V0VmVsb2NpdHkob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS52ZWxvY2l0eSk7XHJcbiAgX01CLnNldEFuZ2xlKG9iai5waEJvZHksIHBhcmVudC5waEJvZHkuc2xpY2VBbmdsZSk7XHJcblxyXG4gIGxldCBhbmNob3JlZF9kaXIgPSBfTVYubm9ybWFsaXNlKHt4Om9iai5hbmNob3IueCAtIDAuNSwgeTogMC41IC0gb2JqLmFuY2hvci55IH0pO1xyXG4gIGFuY2hvcmVkX2RpciA9IF9NVi5yb3RhdGUoYW5jaG9yZWRfZGlyLCBwYXJlbnQucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG5cclxuICBfTUIuYXBwbHlGb3JjZShvYmoucGhCb2R5LCBvYmoucGhCb2R5LnBvc2l0aW9uLCB7XHJcbiAgICB4OiAgYW5jaG9yZWRfZGlyLnggKiAwLjAyLFxyXG4gICAgeTogIGFuY2hvcmVkX2Rpci55ICogMC4wMlxyXG4gIH0pO1xyXG5cclxuICAvL2Rvd25QYXJ0LnBoQm9keS50b3JxdWUgPSB0aGlzLnBoQm9keS50b3JxdWUgKiAxMDtcclxuXHJcbiAgcGFyZW50LnBhcmVudC5hZGRDaGlsZChvYmopO1xyXG5cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDcmVhdGVTbGljYWJsZU9iamVjdChwb3MsIGVuZ2luZSwgZGF0YSkge1xyXG4gIFxyXG4gIHZhciBvYmogPSBudWxsO1xyXG5cclxuICBpZiAoZGF0YSAmJiBkYXRhLm5vcm1hbCkge1xyXG4gICAgb2JqID0gbmV3IFBJWEkuU3ByaXRlKGRhdGEubm9ybWFsLnRleCk7XHJcblxyXG4gICAgaWYgKGRhdGEubm9ybWFsLnBpdm90KSB7XHJcbiAgICAgIG9iai5hbmNob3Iuc2V0KGRhdGEubm9ybWFsLnBpdm90LngsIGRhdGEubm9ybWFsLnBpdm90LnkpO1xyXG4gICAgfVxyXG5cclxuICB9IGVsc2Uge1xyXG4gIFxyXG4gICAgb2JqID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuICAgIG9iai5iZWdpbkZpbGwoMHg5OTY2ZiAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgb2JqLmRyYXdDaXJjbGUoMCwgMCwgNTApO1xyXG4gICAgb2JqLmVuZEZpbGwoKTtcclxuICB9XHJcblxyXG4gIG9iai5zcHJpdGVEYXRhID0gZGF0YTtcclxuICBvYmouZW5naW5lID0gZW5naW5lO1xyXG4gIG9iai54ID0gcG9zLng7XHJcbiAgb2JqLnkgPSBwb3MueTtcclxuICBvYmoucGFyZW50R3JvdXAgPSBkYXRhLm5vcm1hbC5ncm91cDtcclxuICBcclxuICBvYmoub25zbGljZSA9IG5ldyBTaWduYWwoKTtcclxuXHJcbiAgb2JqLmtpbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLnBoQm9keS5zbGljZWQgJiYgdGhpcy5vbnNsaWNlKSB7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLm9uc2xpY2UuZGlzcGF0Y2godGhpcyk7XHJcbiAgICAgIFxyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgb2JqLnNwcml0ZURhdGEucGFydHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIENyZWF0ZVN1YkJvZHkob2JqLCB7bm9ybWFsOiBvYmouc3ByaXRlRGF0YS5wYXJ0c1tpXX0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSh7IGNoaWxkcmVuOiB0cnVlIH0pO1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBoQm9keSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBfTUMucmVtb3ZlKGVuZ2luZS53b3JsZCwgdGhpcy5waEJvZHkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG9iai5vbnNsaWNlLmFkZCgoKSA9PnsgY29uc29sZS5sb2coXCJMaXN0ZW4gU2lnbmFsXCIpO30pO1xyXG5cclxuICB2YXIgcGhCb2R5ID0gX01Ccy5jaXJjbGUocG9zLngsIHBvcy55LCA1MCk7XHJcbiAgcGhCb2R5LmNvbGxpc2lvbkZpbHRlci5tYXNrICY9IH5waEJvZHkuY29sbGlzaW9uRmlsdGVyLmNhdGVnb3J5O1xyXG4gIF9NVy5hZGQoZW5naW5lLndvcmxkLCBwaEJvZHkpO1xyXG5cclxuICBwaEJvZHkucGlPYmogPSBvYmo7XHJcbiAgb2JqLnBoQm9keSA9IHBoQm9keTtcclxuXHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG4iLCJpbXBvcnQge0Ryb3BTaGFkb3dGaWx0ZXJ9IGZyb20gJ0BwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdydcclxuaW1wb3J0IENyZWF0ZVNsaWNhYmxlT2JqZWN0IGZyb20gJy4vU2xpY2FibGVPYmplY3QnXHJcbmltcG9ydCBCbGFkZSBmcm9tICcuL0JsYWRlJ1xyXG5cclxuLy8gZnVuY3Rpb24sIHdobyBjcmVhdGUgYW5kIGluc3RhbmNlIFNsaWNlZExheW91dFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTbGljZUxheWVyIChhcHApIHtcclxuICB2YXIgX01FID0gTWF0dGVyLkVuZ2luZSxcclxuICAgIF9NVyA9IE1hdHRlci5Xb3JsZCxcclxuICAgIF9NQnMgPSBNYXR0ZXIuQm9kaWVzLFxyXG4gICAgX01CID0gTWF0dGVyLkJvZHksXHJcbiAgICBfTUMgPSBNYXR0ZXIuQ29tcG9zaXRlLFxyXG4gICAgX01FdiA9IE1hdHRlci5FdmVudHMsXHJcbiAgICBfTVYgPSBNYXR0ZXIuVmVjdG9yLFxyXG4gICAgX0xSZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIGVuZ2luZSA9IF9NRS5jcmVhdGUoKTtcclxuICBlbmdpbmUud29ybGQuc2NhbGUgPSAwLjAwMDE7XHJcbiAgZW5naW5lLndvcmxkLmdyYXZpdHkueSA9IDAuMzU7XHJcblxyXG4gIF9NRS5ydW4oZW5naW5lKTtcclxuXHJcbiAgdmFyIHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gIHZhciBfbHJlcyA9IGFwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG5cclxuICB2YXIgc2xpY2VVcEdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgxLCBmYWxzZSk7XHJcbiAgdmFyIHNsaWNlTWlkZGxlR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDAsIGZhbHNlKTtcclxuICB2YXIgc2xpY2VEb3duR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKC0xLCBmYWxzZSk7XHJcbiAgdmFyIHVpR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDEwLCBmYWxzZSk7XHJcbiAgXHJcbiAvLyBzdGFnZS5maWx0ZXJzID0gW25ldyBEcm9wU2hhZG93RmlsdGVyKCldO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlVXBHcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VEb3duR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlTWlkZGxlR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHVpR3JvdXApKTtcclxuXHJcbiAgLy9zdGFnZS5ncm91cC5lbmFibGVTb3J0ID0gdHJ1ZTtcclxuICBzdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIHN0YWdlLl9kZWJ1Z1RleHQgPSBuZXcgUElYSS5UZXh0KFwiQm9keSBjb3VudDogMFwiLCB7XHJcbiAgICBmb250RmFtaWx5OiBcIkFyaWFsXCIsXHJcbiAgICBmb250U2l6ZTogMzIsXHJcbiAgICBmaWxsOiAweGZmMTAxMCxcclxuICAgIHN0cm9rZTogMHgwMGNjMTAsXHJcbiAgICBhbGlnbjogXCJsZWZ0XCJcclxuICB9KTtcclxuXHJcbiAgc3RhZ2UuX2RlYnVnVGV4dC5wb3NpdGlvbi5zZXQoMTAsIDQyKTtcclxuIC8vIGNvbnNvbGUubG9nKFwicHJlXCIpO1xyXG4gIHN0YWdlLmJsYWRlID0gbmV3IEJsYWRlKFxyXG4gICAgX2xyZXMuYmxhZGVfdGV4LnRleHR1cmUsXHJcbiAgICAzMCxcclxuICAgIDEwLFxyXG4gICAgMTAwXHJcbiAgKTtcclxuICBzdGFnZS5ibGFkZS5taW5Nb3ZhYmxlU3BlZWQgPSAxMDAwO1xyXG4gIHN0YWdlLmJsYWRlLmJvZHkucGFyZW50R3JvdXAgPSBzbGljZU1pZGRsZUdyb3VwO1xyXG4gIHN0YWdlLmJsYWRlLlJlYWRDYWxsYmFja3Moc3RhZ2UpO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5ibGFkZS5ib2R5KTtcclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5fZGVidWdUZXh0KTtcclxuXHJcbiAgdmFyIHNsaWNlcyA9IDA7XHJcbiAgLy8gc2xpY2VzIHZpYSBSYXljYXN0IFRlc3RpbmdcclxuICB2YXIgUmF5Q2FzdFRlc3QgPSBmdW5jdGlvbiBSYXlDYXN0VGVzdChib2RpZXMpIHtcclxuICAgIGlmIChzdGFnZS5ibGFkZS5sYXN0TW90aW9uU3BlZWQgPiBzdGFnZS5ibGFkZS5taW5Nb3Rpb25TcGVlZCkge1xyXG4gICAgICB2YXIgcHBzID0gc3RhZ2UuYmxhZGUuYm9keS5wb2ludHM7XHJcblxyXG4gICAgICBpZiAocHBzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IE1hdGgubWluKHBwcy5sZW5ndGgsIDQpOyBpKyspIHtcclxuICAgICAgICAgIC8vIDQg0L/QvtGB0LvQtdC00L3QuNGFINGB0LXQs9C80LXQvdGC0LBcclxuXHJcbiAgICAgICAgICB2YXIgc3AgPSBwcHNbaSAtIDFdO1xyXG4gICAgICAgICAgdmFyIGVwID0gcHBzW2ldO1xyXG5cclxuICAgICAgICAgIHZhciBjb2xsaXNpb25zID0gTWF0dGVyLlF1ZXJ5LnJheShib2RpZXMsIHNwLCBlcCk7XHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbGxpc2lvbnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnNbal0uYm9keS5jYW5TbGljZSkge1xyXG4gICAgICAgICAgICAgIHZhciBzdiA9IHsgeTogZXAueSAtIHNwLnksIHg6IGVwLnggLSBzcC54IH07XHJcbiAgICAgICAgICAgICAgc3YgPSBfTVYubm9ybWFsaXNlKHN2KTtcclxuXHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUgPSBfTVYuYW5nbGUoc3AsIGVwKTtcclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VWZWN0b3IgPSBzdjtcclxuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm9keSBzbGljZSBhbmdsZTpcIiwgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUpO1xyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICBzbGljZXMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBmcmFtZXMgPSAwO1xyXG4gIHZhciBsYXN0U2hvdFggPSBudWxsO1xyXG5cclxuICAvLyB1cGRhdGUgdmlld1xyXG4gIHZhciBVcGRhdGUgPSBmdW5jdGlvbiBVcGRhdGUoKSB7XHJcblxyXG4gIFx0Ly9zdGFnZS51cGRhdGVTdGFnZSgpO1xyXG4gICAgc3RhZ2UuX2RlYnVnVGV4dC50ZXh0ID1cclxuICAgICAgXCLQktGLINC00LXRgNC30LrQviDQt9Cw0YDQtdC30LDQu9C4IFwiICsgc2xpY2VzLnRvU3RyaW5nKCkgKyBcIiDQutGA0L7Qu9C40Lpv0LIo0LrQsCkoXCI7XHJcblxyXG4gICAgdmFyIGJvZGllcyA9IF9NQy5hbGxCb2RpZXMoZW5naW5lLndvcmxkKTtcclxuXHJcbiAgICBmcmFtZXMrKztcclxuICAgIGlmIChmcmFtZXMgPj0gMjAgJiYgYm9kaWVzLmxlbmd0aCA8IDUpIHtcclxuICAgICAgZnJhbWVzID0gMDtcclxuICAgICAgdmFyIHBvcyA9IHtcclxuICAgICAgICB4OlxyXG4gICAgICAgICAgTWF0aC5yb3VuZChNYXRoLnJhbmRvbVJhbmdlKDAsIDEwKSkgKlxyXG4gICAgICAgICAgTWF0aC5mbG9vcigoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKSAvIDEwKSxcclxuICAgICAgICB5OiBhcHAucmVuZGVyZXIuaGVpZ2h0ICsgMTAwXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB3aGlsZSAobGFzdFNob3RYICE9PSBudWxsICYmIE1hdGguYWJzKGxhc3RTaG90WCAtIHBvcy54KSA8IDIwMCkge1xyXG4gICAgICAgIHBvcy54ID1cclxuICAgICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb21SYW5nZSgwLCAxMCkpICpcclxuICAgICAgICAgIE1hdGguZmxvb3IoKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCkgLyAxMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxhc3RTaG90WCA9IHBvcy54O1xyXG5cclxuICAgICAgcG9zLnggLT0gMTAwOyAvL29mZnNldFxyXG5cclxuICAgICAgLy8vINCS0YvQvdC10YHRgtC4INGN0YLQviDQs9C+0LLQvdC+INC60YPQtNCwLdC90LjQsdGD0LTRjCDQsiDQtNGA0YPQs9C+0LUg0LzQtdGB0YLQvlxyXG5cclxuICAgICAgLy9iYW5ueVxyXG5cdCAgICBsZXQgYmRhdGEgPSBfTFJlcy5idW5ueS5zcHJpdGVzaGVldDtcclxuXHJcblx0XHRsZXQgZGF0YSA9IHtcclxuXHQgICAgICBcdG5vcm1hbDoge1xyXG5cdCAgICAgXHQgICB0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55LFxyXG5cdCAgICAgXHQgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnkucGl2b3QsXHJcblx0ICAgICBcdCAgIGdyb3VwOnNsaWNlRG93bkdyb3VwXHJcblx0ICAgICAgXHR9LFxyXG5cdCAgICAgIFx0cGFydHM6W1xyXG5cdFx0ICAgICAgXHR7XHJcblx0XHQgICAgICAgICAgdGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueV90b3JzZSxcclxuXHRcdCAgICAgICAgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnlfdG9yc2UucGl2b3QsXHJcblx0XHQgICAgICAgICAgZ3JvdXA6IHNsaWNlRG93bkdyb3VwXHJcblx0XHQgICAgICAgIH0sXHJcblx0XHQgICAgICAgIHtcclxuXHRcdCAgICAgICAgXHR0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55X2hlYWQsXHJcblx0XHQgICAgICAgIFx0cGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55X2hlYWQucGl2b3QsXHJcblx0XHQgICAgICAgIFx0Z3JvdXA6IHNsaWNlVXBHcm91cFxyXG5cdCAgICAgICAgXHR9XHJcblx0ICAgICAgICBdXHJcblx0ICAgIH07XHJcblxyXG4gICAgICB2YXIgb2JqID0gQ3JlYXRlU2xpY2FibGVPYmplY3QocG9zLCBlbmdpbmUsIGRhdGEpO1xyXG5cclxuICAgICAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgICAgIG9iai5waEJvZHkuY2FuU2xpY2UgPSB0cnVlO1xyXG5cclxuICAgICAgdmFyIF9vZnggPSAwLjUgLSAocG9zLnggKyAxMDApIC8gKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCk7XHJcblxyXG4gICAgICB2YXIgcmFuZ2UgPSAwLjg7XHJcbiAgICAgIHZhciBpbXAgPSB7XHJcbiAgICAgICAgeDogcmFuZ2UgKiBfb2Z4LFxyXG4gICAgICAgIHk6IC1NYXRoLnJhbmRvbVJhbmdlKDAuNCwgMC41KVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgX01CLmFwcGx5Rm9yY2Uob2JqLnBoQm9keSwgb2JqLnBoQm9keS5wb3NpdGlvbiwgaW1wKTtcclxuICAgICAgb2JqLnBoQm9keS50b3JxdWUgPSBNYXRoLnJhbmRvbVJhbmdlKC0xMCwgMTApO1xyXG5cclxuICAgICAgc3RhZ2UuYWRkQ2hpbGQob2JqKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGlja2VyID0gYXBwLnRpY2tlcjtcclxuICAgIHN0YWdlLmJsYWRlLlVwZGF0ZSh0aWNrZXIpO1xyXG5cclxuICAgIC8vQ2FzdFRlc3RcclxuICAgIFJheUNhc3RUZXN0KGJvZGllcyk7XHJcblxyXG4gICAgX01FLnVwZGF0ZShlbmdpbmUpO1xyXG4gICAgLy8gaXRlcmF0ZSBvdmVyIGJvZGllcyBhbmQgZml4dHVyZXNcclxuXHJcbiAgICBmb3IgKHZhciBpID0gYm9kaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIHZhciBib2R5ID0gYm9kaWVzW2ldO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBib2R5LnBpT2JqICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgKGJvZHkucG9zaXRpb24ueSA+IGFwcC5yZW5kZXJlci5oZWlnaHQgKyAxMDAgJiZcclxuICAgICAgICAgICAgYm9keS52ZWxvY2l0eS55ID4gMCkgfHxcclxuICAgICAgICAgIGJvZHkuc2xpY2VkXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLmtpbGwoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYm9keS5waU9iai54ID0gYm9keS5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgYm9keS5waU9iai55ID0gYm9keS5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgYm9keS5waU9iai5yb3RhdGlvbiA9IGJvZHkuYW5nbGU7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGJvZHkuYW5nbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIE1hdGgucmFuZG9tUmFuZ2UgPSBmdW5jdGlvbihtaW4sIG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuICB9O1xyXG4gIC8vcnVuIFVwZGF0ZVxyXG4gIGFwcC50aWNrZXIuYWRkKFVwZGF0ZSwgdGhpcyk7XHJcblxyXG4gIC8vLy8gUkVUVVJOXHJcbiAgcmV0dXJuIHN0YWdlO1xyXG59XHJcblxyXG4vL2V4cG9ydCB7U2xpY2VMYXllciB9O1xyXG4vL21vZHVsZS5leHBvcnRzID0gU2xpY2VMYXllcjtcclxuLy9yZXR1cm4gU2xpY2VMYXllcjtcclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhcnRMYXllcihiYXNlLCBjYWxsYmFjaykge1xyXG5cdGxldCBfc3RhcnRMYXllcjtcclxuXHJcblx0dmFyIGxvYWRlciA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XHJcblxyXG4gICAgbG9hZGVyLmFkZChcInN0YXJ0X3N0YWdlXCIsXCIuL3NyYy9tYXBzL3N0YXJ0Lmpzb25cIikubG9hZCggKGwsIHJlcykgPT57XHJcbiAgICBcdFxyXG4gICAgXHRfc3RhcnRMYXllciA9IHJlcy5zdGFydF9zdGFnZS5zdGFnZTtcclxuICAgIFx0XHJcbiAgICBcdGlmKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpe1xyXG4gICAgXHRcdGNhbGxiYWNrKF9zdGFydExheWVyKTtcclxuICAgIFx0fVxyXG5cclxuICAgIFx0SW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IEluaXQgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgIFx0bGV0IF9zdGFydF9idXR0b24gPSBfc3RhcnRMYXllci5nZXRDaGlsZEJ5TmFtZShcInN0YXJ0X2J1dHRvbjpub3JtYWxcIik7XHJcbiAgICBcdGxldCBfc3RhcnRfYnV0dG9uX2hvdmVyID0gX3N0YXJ0TGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJzdGFydF9idXR0b246aG92ZXJcIik7XHJcblxyXG4gICAgXHRsZXQgX3N0YXJ0X2J1dHRvbl9ub3JtYWxfdGV4ID0gX3N0YXJ0X2J1dHRvbi50ZXh0dXJlO1xyXG4gICAgXHRsZXQgX3N0YXJ0X2J1dHRvbl9ob3Zlcl90ZXggPSBfc3RhcnRfYnV0dG9uX2hvdmVyLnRleHR1cmU7XHJcbiAgICBcdFxyXG4gICAgXHRfc3RhcnRfYnV0dG9uLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5idXR0b25Nb2RlID0gdHJ1ZTtcclxuXHJcbiAgICBcdF9zdGFydF9idXR0b24ub24oXCJwb2ludGVyb3ZlclwiLCAoKSA9PiB7XHJcbiAgICBcdFx0X3N0YXJ0X2J1dHRvbi50ZXh0dXJlID0gX3N0YXJ0X2J1dHRvbl9ob3Zlcl90ZXg7XHJcbiAgICBcdH0pO1xyXG4gICAgXHRfc3RhcnRfYnV0dG9uLm9uKFwicG9pbnRlcm91dFwiLCAoKSA9PntcclxuICAgIFx0XHRfc3RhcnRfYnV0dG9uLnRleHR1cmUgPSBfc3RhcnRfYnV0dG9uX25vcm1hbF90ZXg7XHJcbiAgICBcdH0pO1xyXG5cclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5vbihcInBvaW50ZXJ0YXBcIiwgKCkgPT57XHJcbiAgICBcdFx0XHJcbiAgICBcdFx0X3N0YXJ0TGF5ZXIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgXHRcdHdpbmRvdy5Mb2FkR2FtZSgpO1xyXG4gICAgXHR9KVxyXG4gICAgfVxyXG59IiwiXHJcbmxldCBQYXJzZUNvbG9yID0gZnVuY3Rpb24odmFsdWUpe1xyXG5cdFxyXG5cdGlmKCF2YWx1ZSlcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG5cdGlmKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKVxyXG5cdHtcclxuXHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiNcIixcIlwiKTtcclxuXHRcdGlmKHZhbHVlLmxlbmd0aCA+IDYpXHJcblx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDIpO1xyXG5cclxuXHRcdGxldCBwYXJzZSA9IHBhcnNlSW50KHZhbHVlLCAxNik7XHJcblx0XHRyZXR1cm4gcGFyc2U7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmxldCBQYXJzZUFscGhhID0gZnVuY3Rpb24odmFsdWUpe1xyXG5cdFxyXG5cdGlmKCF2YWx1ZSlcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG5cdGlmKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKVxyXG5cdHtcclxuXHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiNcIixcIlwiKTtcclxuXHRcdGlmKHZhbHVlLmxlbmd0aCA+IDYpXHJcblx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsMik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiAxO1xyXG5cclxuXHRcdGxldCBwYXJzZSA9IHBhcnNlSW50KHZhbHVlLCAxNik7XHJcblx0XHRyZXR1cm4gcGFyc2UgLyAyNTY7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcblx0UGFyc2VDb2xvcixcclxuXHRQYXJzZUFscGhhXHJcbn1cclxuIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnN0cnVjdG9yU3ByaXRyKG9iaikge1xyXG5cdGxldCBfbyA9IG9iajsgXHJcblxyXG5cdGxldCBzcHIgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKF9vLnVybCk7XHJcblx0c3ByLm5hbWUgPSBfby5uYW1lO1xyXG5cdHNwci5hbmNob3Iuc2V0KDAsIDEpOyAvLyBzZXQgZG93biB0byBhbmNob3JcclxuXHRcclxuXHRpZihfby53aWR0aClcclxuXHRcdHNwci53aWR0aCA9IF9vLndpZHRoO1xyXG5cdFxyXG5cdGlmKF9vLmhlaWdodClcclxuXHRcdHNwci5oZWlnaHQgPSBfby5oZWlnaHQ7XHJcblx0XHJcblx0c3ByLnJvdGF0aW9uID0gKF9vLnJvdGF0aW9uIHx8IDApICAqIE1hdGguUEkgLyAxODA7XHJcblx0c3ByLnggPSBfby54O1xyXG5cdHNwci55ID0gX28ueTtcclxuXHRzcHIudmlzaWJsZSA9IF9vLnZpc2libGUgPT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vLnZpc2libGU7XHJcblx0XHJcblx0c3ByLnR5cGVzID0gX28udHlwZSA/IF9vLnR5cGUuc3BsaXQoXCI6XCIpOiBbXTtcclxuXHJcblx0aWYoX28ucHJvcGVydGllcylcclxuXHR7XHJcblx0XHRzcHIuYWxwaGEgPSBfby5wcm9wZXJ0aWVzLm9wYWNpdHkgfHwgMTtcclxuXHRcdE9iamVjdC5hc3NpZ24oc3ByLCBfby5wcm9wZXJ0aWVzKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzcHI7XHJcbn0iLCJpbXBvcnQge1BhcnNlQ29sb3IsUGFyc2VBbHBoYSB9IGZyb20gXCIuL0NvbG9yUGFyc2VyXCJcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25zdHJ1Y3RvclRleHQob2JqLCApIHtcclxuXHJcblx0bGV0IF9vID0gb2JqO1xyXG5cdGxldCBfY29udCA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRsZXQgX3RleHQgPSBuZXcgUElYSS5UZXh0KCk7XHJcblx0X3RleHQubmFtZSA9IF9vLm5hbWUgKyBcIl9UZXh0XCI7XHJcblxyXG5cdF9jb250Lm5hbWUgPSBfby5uYW1lO1xyXG5cdF9jb250LnR5cGVzID0gX28udHlwZSA/IF9vLnR5cGUuc3BsaXQoXCI6XCIpOiBbXTtcclxuXHJcblxyXG5cdF9jb250LndpZHRoID0gX28ud2lkdGg7XHJcblx0X2NvbnQuaGVpZ2h0ID0gX28uaGVpZ2h0O1xyXG5cclxuXHQvL19jb250LmxpbmVTdHlsZSgyLCAweEZGMDBGRiwgMSk7XHJcblx0Ly9fY29udC5iZWdpbkZpbGwoMHhGRjAwQkIsIDAuMjUpO1xyXG5cdC8vX2NvbnQuZHJhd1JvdW5kZWRSZWN0KDAsIDAsIF9vLndpZHRoLCBfby5oZWlnaHQpO1xyXG5cdC8vX2NvbnQuZW5kRmlsbCgpO1xyXG5cclxuXHRfY29udC5waXZvdC5zZXQoMCwwKTtcclxuXHJcblx0X2NvbnQucm90YXRpb24gPSBfby5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XHJcblx0X2NvbnQuYWxwaGEgPSBQYXJzZUFscGhhKF9vLnRleHQuY29sb3IpIHx8IDE7XHJcblx0X3RleHQudGV4dCA9IF9vLnRleHQudGV4dDtcclxuXHJcblx0c3dpdGNoIChfby50ZXh0LmhhbGlnaCkge1xyXG5cdFx0Y2FzZSBcInJpZ2h0XCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiY2VudGVyXCI6XHJcblx0XHRcdFx0e1xyXG5cclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci54ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoICogMC41O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAwO1xyXG5cdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnggPSAwO1x0XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHRzd2l0Y2ggKF9vLnRleHQudmFsaWduKSB7XHJcblx0XHRjYXNlIFwiYm90dG9tXCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnkgPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBcImNlbnRlclwiOlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci55ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodCAqIDAuNTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0e1xyXG5cclxuXHRcdFx0XHRfdGV4dC5hbmNob3IueSA9IDA7XHJcblx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHJcblx0X2NvbnQucG9zaXRpb24uc2V0KF9vLngsIF9vLnkpO1xyXG5cdF90ZXh0LnN0eWxlID0ge1xyXG5cdFx0d29yZFdyYXA6IF9vLnRleHQud3JhcCxcclxuXHRcdGZpbGw6IFBhcnNlQ29sb3IoX28udGV4dC5jb2xvcikgfHwgMHgwMDAwMDAsXHJcblx0XHRhbGlnbjogX28udGV4dC52YWxpZ24gfHwgXCJjZW50ZXJcIixcclxuXHRcdGZvbnRTaXplOiBfby50ZXh0LnBpeGVsc2l6ZSB8fCAyNCxcclxuXHRcdGZvbnRGYW1pbHk6IF9vLnRleHQuZm9udGZhbWlseSB8fCBcIkFyaWFsXCIsXHJcblx0XHRmb250V2VpZ2h0OiBfby50ZXh0LmJvbGQgPyBcImJvbGRcIjogXCJub3JtYWxcIixcclxuXHRcdGZvbnRTdHlsZTogX28udGV4dC5pdGFsaWMgPyBcIml0YWxpY1wiIDogXCJub3JtYWxcIlxyXG5cdFx0fTtcclxuXHJcblx0aWYoX28ucHJvcGVydGllcylcclxuXHR7XHJcblx0XHRfdGV4dC5zdHlsZS5zdHJva2UgPSAgUGFyc2VDb2xvcihfby5wcm9wZXJ0aWVzLnN0cm9rZUNvbG9yKSB8fCAwO1xyXG5cdFx0X3RleHQuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzID0gIF9vLnByb3BlcnRpZXMuc3Ryb2tlVGhpY2tuZXNzIHx8IDA7XHJcblx0XHRcclxuXHRcdE9iamVjdC5hc3NpZ24oX2NvbnQsIF9vLnByb3BlcnRpZXMpO1xyXG5cdH1cclxuXHJcblx0Ly9fY29udC5wYXJlbnRHcm91cCA9IF9sYXllci5ncm91cDtcclxuXHRfY29udC5hZGRDaGlsZChfdGV4dCk7XHJcblx0Ly9fc3RhZ2UuYWRkQ2hpbGQoX2NvbnQpO1xyXG5cdHJldHVybiBfY29udDtcclxufSIsImltcG9ydCBDVGV4dCBmcm9tIFwiLi9Db25zdHJ1Y3RvclRleHRcIlxyXG5pbXBvcnQgQ1Nwcml0ZSBmcm9tIFwiLi9Db25zdHJ1Y3RvclNwcml0ZVwiXHJcblxyXG5sZXQgTGF5ZXIgPSBQSVhJLmRpc3BsYXkuTGF5ZXI7XHJcbmxldCBHcm91cCA9IFBJWEkuZGlzcGxheS5Hcm91cDtcclxubGV0IFN0YWdlID0gUElYSS5kaXNwbGF5LlN0YWdlO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE9HUGFyc2VyKCl7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIChyZXNvdXJjZSwgbmV4dCkge1xyXG5cdFx0Ly9mYWxsYmFjayBcclxuXHRcdFxyXG4gICAgICAgIGlmICghcmVzb3VyY2UuZGF0YSB8fCAhKHJlc291cmNlLmRhdGEudHlwZSAhPT0gdW5kZWZpbmVkICYmIHJlc291cmNlLmRhdGEudHlwZSA9PSAnbWFwJykpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRpbGVkIE9HIGltcG9ydGVyIVxcbiBlWHBvbmVudGEge3JvbmRvLmRldmlsW2FdZ21haWwuY29tfVwiKTtcclxuICAgICAgICBsZXQgX2RhdGEgPSByZXNvdXJjZS5kYXRhOyBcclxuICAgICAgICBsZXQgX3N0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgIF9zdGFnZS5sYXllckhlaWdodCA9IF9kYXRhLmhlaWdodDtcclxuICAgICAgICBfc3RhZ2UubGF5ZXJXaWR0aCA9IF9kYXRhLndpZHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGJhc2VVcmwgPSByZXNvdXJjZS51cmwucmVwbGFjZSh0aGlzLmJhc2VVcmwsXCJcIik7XHJcbiAgICAgICAgbGV0IGxhc3RJbmRleE9mID0gYmFzZVVybC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYobGFzdEluZGV4T2YgPT0gLTEpXHJcbiAgICAgICAgXHRsYXN0SW5kZXhPZiA9IGJhc2VVcmwubGFzdEluZGV4T2YoXCJcXFxcXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGxhc3RJbmRleE9mID09IC0xIClcclxuICAgIFx0e1xyXG4gICAgXHRcdGNvbnNvbGUubG9nKFwiQ2FuJ3QgcGFyc2U6XCIgKyBiYXNlVXJsKTtcclxuICAgIFx0XHRuZXh0KCk7XHJcbiAgICBcdFx0cmV0dXJuO1xyXG4gICAgXHR9XHJcblxyXG4gICAgICAgIGJhc2VVcmwgPSBiYXNlVXJsLnN1YnN0cmluZygwLCBsYXN0SW5kZXhPZik7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZyhcIkRpciB1cmw6XCIgKyBiYXNlVXJsKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGxvYWRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogcmVzb3VyY2UuY3Jvc3NPcmlnaW4sXHJcbiAgICAgICAgICAgIGxvYWRUeXBlOiBQSVhJLmxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLFxyXG4gICAgICAgICAgICBwYXJlbnRSZXNvdXJjZTogcmVzb3VyY2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0NoZWNrIFRpbGVyIE1hcCB0eXBlXHJcbiAgICAgICAvLyBpZihfZGF0YS50eXBlICE9PSB1bmRlZmluZWQgJiYgX2RhdGEudHlwZSA9PSAnbWFwJylcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIFx0aWYoX2RhdGEubGF5ZXJzKSBcclxuICAgICAgICBcdHtcclxuICAgICAgICBcdFx0Zm9yKGxldCBpID0gMDsgaSA8IF9kYXRhLmxheWVycy5sZW5ndGg7IGkrKylcclxuICAgICAgICBcdFx0e1xyXG4gICAgICAgIFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdGxldCBfbCA9IF9kYXRhLmxheWVyc1tpXTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRpZihfbC50eXBlICE9PSBcIm9iamVjdGdyb3VwXCIgJiYgX2wudHlwZSAhPT0gXCJpbWFnZWxheWVyXCIpXHJcbiAgICAgICAgXHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiT0dQYXJzZXIgc3VwcG9ydCBvbmx5IE9CSkVDVCBvciBJTUFHRSBsYXllcyEhXCIpO1xyXG4gICAgICAgIFx0XHRcdFx0Ly9uZXh0KCk7XHJcbiAgICAgICAgXHRcdFx0XHQvL3JldHVybjtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0aWYoX2wucHJvcGVydGllcyAmJiAoX2wucHJvcGVydGllcy5pZ25vcmUgfHwgX2wucHJvcGVydGllcy5pZ25vcmVMb2FkKSl7XHJcblxyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coXCJPR1BhcnNlcjogaWdub3JlIGxvYWRpbmcgbGF5ZXI6XCIgKyBfbC5uYW1lKTtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0XHJcbiAgICAgICAgXHRcdFx0bGV0IF9ncm91cCA9IG5ldyBHcm91cCggX2wucHJvcGVydGllcyA/IChfbC5wcm9wZXJ0aWVzLnpPcmRlciB8fCBpKSA6IGksIHRydWUpO1xyXG4gICAgICAgIFx0XHRcdGxldCBfbGF5ZXIgPSBuZXcgTGF5ZXIoX2dyb3VwKTtcclxuICAgICAgICBcdFx0XHRfbGF5ZXIubmFtZSA9IF9sLm5hbWU7XHJcbiAgICAgICAgXHRcdFx0X3N0YWdlW19sLm5hbWVdID0gX2xheWVyO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci52aXNpYmxlID0gX2wudmlzaWJsZTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRfbGF5ZXIucG9zaXRpb24uc2V0KF9sLngsIF9sLnkpO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci5hbHBoYSA9IF9sLm9wYWNpdHkgfHwgMTtcclxuXHJcbiAgICAgICAgXHRcdFx0X3N0YWdlLmFkZENoaWxkKF9sYXllcik7XHJcbiAgICAgICAgXHRcdFx0aWYoX2wudHlwZSA9PSBcImltYWdlbGF5ZXJcIil7XHJcblx0ICAgICAgICBcdFx0XHRfbC5vYmplY3RzID0gW1xyXG5cdCAgICAgICAgXHRcdFx0XHR7XHJcblx0ICAgICAgICBcdFx0XHRcdFx0aW1hZ2U6IF9sLmltYWdlLFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdG5hbWU6IF9sLm5hbWUsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eDogX2wueCAsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eTogX2wueSArIF9zdGFnZS5sYXllckhlaWdodCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL3dpZHRoOiBfbC53aWR0aCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL2hlaWdodDogX2wuaGVpZ2h0LFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdHByb3BlcnRpZXM6IF9sLnByb3BlcnRpZXMsXHJcblx0ICAgICAgICBcdFx0XHRcdH1cclxuXHQgICAgICAgIFx0XHRcdF07XHJcbiAgICAgICAgXHRcdFx0fVxyXG5cclxuICAgICAgICBcdFx0XHRpZihfbC5vYmplY3RzKSBcclxuICAgICAgICBcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IF9sLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgXHRcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX28gPSBfbC5vYmplY3RzW2pdO1xyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX29iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgXHRcdFx0XHRcdGlmKCFfby5uYW1lIHx8IF9vLm5hbWUgPT0gXCJcIilcclxuICAgICAgICBcdFx0XHRcdFx0XHRfby5uYW1lID0gXCJvYmpfXCIgKyBqO1xyXG4gICAgICAgIFx0XHRcdFx0XHQvLyBpbWFnZSBMb2FkZXJcclxuXHRcdFx0XHRcdFx0XHRpZihfZGF0YS50aWxlc2V0cyAmJiBfZGF0YS50aWxlc2V0cy5sZW5ndGggPiAwICYmIF9vLmdpZCB8fCBfby5pbWFnZSlcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRpZighX28uaW1hZ2Upe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgX3RzID0gdW5kZWZpbmVkOyAvL19kYXRhLnRpbGVzZXRzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgX2RhdGEudGlsZXNldHMubGVuZ3RoOyBpICsrKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihfZGF0YS50aWxlc2V0c1tpXS5maXJzdGdpZCA8PSBfby5naWQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0X3RzID0gX2RhdGEudGlsZXNldHNbaV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZighX3RzKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkltYWdlIHdpdGggZ2lkOlwiICsgX28uZ2lkICsgXCIgbm90IGZvdW5kIVwiKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBfcmVhbEdpZCA9IF9vLmdpZCAtIF90cy5maXJzdGdpZDtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdGxldCBfaW1nID0gX3RzLnRpbGVzW1wiXCIgKyBfcmVhbEdpZF07XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdF9vLnVybCA9ICBiYXNlVXJsICsgXCIvXCIgKyBfaW1nLmltYWdlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRpZighX2ltZyl7XHJcblxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHRjb25zb2xlLmxvZyhcIkxvYWQgcmVzIE1JU1NFRCBnaWQ6XCIgKyBfcmVhbEdpZCArIFwiIHVybDpcIiArIHVybCk7XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0fVxyXG5cdFx0XHRcdFx0ICAgICAgICBcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0X28udXJsID0gIGJhc2VVcmwgKyBcIi9cIiArIF9vLmltYWdlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0IFxyXG5cdFx0XHRcdFx0ICAgICAgICBcdH1cclxuXHRcdFx0XHRcdCAgICAgICAgXHRcclxuXHRcdFx0XHRcdCAgICAgICAgXHQvL1Nwcml0ZSBMb2FkZXJcclxuXHRcdFx0XHRcdCAgICAgICAgXHRfb2JqID0gQ1Nwcml0ZShfbyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBUZXh0TG9hZGVyXHJcblx0XHRcdFx0XHRcdFx0aWYoX28udGV4dCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0X29iaiA9IENUZXh0KF9vKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYoX29iail7XHJcblx0XHRcdFx0XHRcdFx0XHRfb2JqLnBhcmVudEdyb3VwID0gX2xheWVyLmdyb3VwO1xyXG5cdFx0XHRcdFx0XHRcdFx0X3N0YWdlLmFkZENoaWxkKF9vYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvdXJjZS5zdGFnZSA9IF9zdGFnZTtcclxuXHJcblx0XHQvLyBjYWxsIG5leHQgbG9hZGVyXHJcblx0XHRuZXh0KCk7XHJcblxyXG5cdH07XHJcbn1cclxuIiwiaW1wb3J0IE9HUGFyc2VyIGZyb20gXCIuL09HUGFyc2VyXCJcclxuXHJcblBJWEkubG9hZGVycy5Mb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoT0dQYXJzZXIpO1xyXG5QSVhJLmxvYWRlci51c2UoT0dQYXJzZXIoKSk7XHJcbi8vIG5vdGhpbmcgdG8gZXhwb3J0XHJcbiIsImltcG9ydCBcIi4vUGl4aUhlbHBlclwiO1xyXG5cclxuaW1wb3J0IF9CYXNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL0Jhc2VMYXllclwiXHJcbmltcG9ydCBfU2xpY2VTdGFnZUNyZWF0ZXIgZnJvbSBcIi4vU2xpY2VMYXllclwiXHJcblxyXG5pbXBvcnQgXCIuL1RpbGVkT0dMb2FkZXIvVGlsZWRPYmpHcm91cExvYWRlclwiXHJcbmltcG9ydCBcIi4vRHJhZ29uQm9uZUxvYWRlclwiO1xyXG5cclxuXHJcbnZhciBfQXBwID0gbnVsbCxcclxuICBfTFJlcyA9IG51bGwsXHJcbiAgLy9fUmVuZGVyZXIgPSBudWxsLFxyXG4gIC8vX0ludE1hbmFnZXIgPSBudWxsLFxyXG4gIF9TbGljZWRTdGFnZSA9IG51bGw7XHJcblxyXG52YXIgSW5pdCA9IGZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgX0FwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHtcclxuICAgIHdpZHRoOiAxOTIwLFxyXG4gICAgaGVpZ2h0OiAxMDgwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweGZmZmZmZlxyXG4gIH0pO1xyXG5cclxuICAvL9Ci0LDQuiDQvdCw0LTQviwg0YHRgtCw0L3QtNCw0YDRgtC90YvQtSDQvdC1INCx0YPQtNGD0YIg0L7RgtC+0LHRgNCw0LbQsNGC0YHRj1xyXG4gIF9BcHAuc3RhZ2UgPSBuZXcgUElYSS5kaXNwbGF5LlN0YWdlKCk7XHJcblxyXG4gIF9MUmVzID0gX0FwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG4gIHdpbmRvdy5fTFJlcyA9IF9MUmVzO1xyXG5cclxuLy8gIF9JbnRNYW5hZ2VyID0gX0FwcC5yZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9BcHAudmlldyk7XHJcbiAgb25SZXNpemUoKTtcclxuICB3aW5kb3cub25yZXNpemUgPSBvblJlc2l6ZTtcclxuXHJcbiAgX0Jhc2VTdGFnZUNyZWF0ZXIoX0FwcCk7XHJcbi8vICBfQXBwLnN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIFxyXG59O1xyXG5cclxuLy9pbnZva2VkIGFmdGVyIGxvYWRpbmcgZ2FtZSByZXNvdXJjZXNcclxudmFyIEdhbWVMb2FkZWQgPSBmdW5jdGlvbiBHYW1lTG9hZGVkKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiR2FtZSBpcyBsb2FkZWRcIik7XHJcblxyXG4gIF9TbGljZWRTdGFnZSA9ICBfU2xpY2VTdGFnZUNyZWF0ZXIoX0FwcCk7IC8vX0xSZXMuc2xpY2VfanMuZnVuY3Rpb24oX0FwcCk7XHJcblxyXG4gIF9BcHAuc3RhZ2UuYWRkQ2hpbGQoX1NsaWNlZFN0YWdlKTtcclxuXHJcbiAgX0FwcC5Mb2FkU3RhZ2UuZGVzdHJveSgpO1xyXG59O1xyXG5cclxudmFyIExvYWRHYW1lID0gZnVuY3Rpb24gTG9hZEdhbWUoKSB7XHJcbiAgdmFyIGxvYWRlciA9IF9BcHAubG9hZGVyO1xyXG5cclxuICBsb2FkZXJcclxuICAgIC5hZGQoXCJibGFkZV90ZXhcIiwgXCIuL3NyYy9pbWFnZXMvYmxhZGUucG5nXCIpXHJcbiAgICAuYWRkKFwiYnVubnlcIiwgXCIuL3NyYy9pbWFnZXMvYnVubnlfc3MuanNvblwiKVxyXG4gICAgLmxvYWQoZnVuY3Rpb24obCwgcmVzKSB7XHJcblxyXG4gICAgICBHYW1lTG9hZGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0IGxvYWRcIik7XHJcbn07XHJcblxyXG4vLyByZXNpemVcclxudmFyIG9uUmVzaXplID0gZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcclxuICB2YXIgX3cgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gIHZhciBfaCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBpZiAoX3cgLyBfaCA8IDE2IC8gOSkge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX3cgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX3cgKiA5IC8gMTYgKyBcInB4XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF9oICogMTYgLyA5ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF9oICsgXCJweFwiO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5Mb2FkR2FtZSA9IExvYWRHYW1lO1xyXG53aW5kb3cub25sb2FkID0gSW5pdDsiXX0=
