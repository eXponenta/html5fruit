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

var _ListLayer = require("./ListLayer");

var _ListLayer2 = _interopRequireDefault(_ListLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BaseLayer(App) {

  var _currentState = null;
  var _thisStage = {};
  var stages = {};

  // preload basss stage
  App.loader.add("base_stage", "./src/maps/base.json").load(function (l, res) {

    _thisStage = res.base_stage.stage;
    _thisStage.app = App;

    _thisStage.scale.set(App.renderer.width / _thisStage.layerWidth, App.renderer.height / _thisStage.layerHeight);

    App.stage.addChild(_thisStage);

    _thisStage.Init = Init;
    _thisStage.SetState = SetState;

    _thisStage.stages = stages;
    stages["Base"] = _thisStage;

    l.progress = 0;
    LoadNext();
  });

  var LoadNext = function LoadNext() {
    new _StartLayer2.default(_thisStage, App.loader, function (s) {
      stages["Start"] = s;
    });

    new _ListLayer2.default(_thisStage, App.loader, function (s) {
      stages["List"] = s;
    });

    App.loader.load(function (l, res) {
      Init();
    });

    App.loader.onProgress.add(function (l, res) {
      console.log("Progress:", l.progress);
    });
  };

  var Init = function Init() {

    var _S = SetState("Start");
    _S.Init();
  };

  var SetState = function SetState(name) {

    if (_currentState) {
      _thisStage.removeChild(_currentState.stage);
      _currentState.stage.parentGroup = null;
      if (_currentState.OnRemove) _currentState.OnRemove();
    }

    _currentState = stages[name];
    if (_currentState) {
      _currentState.stage.parentGroup = _thisStage.BASE_MIDDLE.group;
      _thisStage.addChild(_currentState.stage);
      if (_currentState.OnAdd) _currentState.OnAdd();
    }

    return _currentState;
  };

  // baseStage update;
  App.ticker.add(function () {});
}

},{"./ListLayer":6,"./StartLayer":10}],4:[function(require,module,exports){
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
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = DragonBoneLoader;
//import {Signal} from "signals";

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
		var _this = this;

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

		//depricated
		//res.onLoad = new Signal();

		var _data = res.data;

		// add TextureDataJson
		// add to curretn loader
		// callback can be changed to this.onComplete.once(func, this, 100000000);
		// curently they called after loading of texture
		var l = this; //new PIXI.loaders.Loader();
		l.add(res.name + "_tex", res.url.replace("ske.json", "tex.json"), { parentResource: res }).add(res.name + "_img", res.url.replace("ske.json", "tex.png"), { parentResource: res }, function () {

			// update after image loading
			var _res = _this.resources;

			var _factory = dragonBones.PixiFactory.factory;
			_factory.parseDragonBonesData(_data);
			_factory.parseTextureAtlasData(_res[res.name + "_tex"].data, _res[res.name + "_img"].texture);

			res.objects = {};

			var _loop = function _loop(i) {

				var name = _data.armature[i].name;

				res.objects[name] = {};
				if (global.DragonBoneLoaderConfig && global.DragonBoneLoaderConfig.create) {

					res.objects[name] = ConstructByName(_factory, name);
				}

				res.objects[name].create = function () {
					var _f = _factory,
					    _n = name;

					return ConstructByName(_f, _n);
				};

				res.objects[name].instance = global.DragonBoneLoaderConfig && global.DragonBoneLoaderConfig.create;
			};

			for (var i = 0; i < _data.armature.length; i++) {
				_loop(i);
			}
			//depricated
			//res.onLoad.dispatch(res.objects);
		});

		next();
	};
}

global.DragonBoneLoaderConfig = {
	create: false
};

PIXI.loaders.Loader.addPixiMiddleware(DragonBoneLoader);
PIXI.loader.use(DragonBoneLoader());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ListLayer;
function ListLayer(base, loader, callback) {
    var _this = this;

    this.stage = null;
    this.isInit = false;

    //var loader = new PIXI.loaders.Loader();

    loader.add("list_stage", "./src/maps/list.json", function () {

        _this.stage = loader.resources.list_stage.stage;

        if (typeof callback == "function") {
            callback(_this);
        }
    });

    this.OnRemove = function () {};
    this.OnAdd = function () {
        if (!this.isInit) {
            this.Init();
        }
    };

    this.Init = function () {
        var _s = this.stage;
        window.List = _s;
        _s.reParentAll();
        this.isInit = true;

        var _rules_btn = _s.getChildByName("rules_button");
        var _rules_dsk = _s.getChildByName("rules_desk");

        _rules_btn.on("pointertap", function () {
            _rules_dsk.visible = true;
        });
    };
}

},{}],7:[function(require,module,exports){
"use strict";

PIXI.Container.prototype.getChildByName = function getChildByName(name) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].name === name) {
            return this.children[i];
        }
    }

    return null;
};

PIXI.Container.prototype.reParentAll = function reParentAll() {
    for (var i = this.children.length - 1; i >= 0; i--) {
        var _c = this.children[i];
        if (_c.reParentTo) {
            var parent = this.getChildByName(_c.reParentTo);
            if (parent) {
                parent.toLocal(new PIXI.Point(0, 0), _c, _c.position);
                parent.addChild(_c);
            }
        }
    }
};

},{}],8:[function(require,module,exports){
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

},{"signals":2}],9:[function(require,module,exports){
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

},{"./Blade":4,"./SlicableObject":8,"@pixi/filter-drop-shadow":1}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = StartLayer;
function StartLayer(base, loader, callback) {
    var _this = this;

    this.stage = null;
    this.isInit = false;

    var _base = base;
    //var loader = new PIXI.loaders.Loader();

    loader.add("start_stage", "./src/maps/start.json", function () {

        _this.stage = loader.resources.start_stage.stage;

        if (typeof callback == "function") {
            callback(_this);
        }
    });

    this.OnAdd = function () {
        if (!this.isInit) this.Init();
    };

    this.OnRemove = function () {};

    this.Init = function () {

        var _start_button = this.stage.getChildByName("start_button:normal");
        var _start_button_hover = this.stage.getChildByName("start_button:hover");

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

            var _l = _base.SetState("List");
            //_l.Init();
            //window.LoadGame();
        });

        this.isInit = true;
    };
}

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ConstructorContainer;
function ConstructorContainer(obj) {
	var _o = obj;

	var _c = new PIXI.Container();
	_c.name = _o.name;
	_c.pivot.set(0, 1); // set down to anchor

	if (_c.width) spr.width = _o.width;

	if (_c.height) spr.height = _o.height;

	_c.rotation = (_o.rotation || 0) * Math.PI / 180;
	_c.x = _o.x;
	_c.y = _o.y;
	_c.visible = _o.visible == undefined ? true : _o.visible;

	_c.types = _o.type ? _o.type.split(":") : [];

	if (_c.properties) {
		_c.alpha = _o.properties.opacity || 1;
		Object.assign(_c, _o.properties);
	}

	return _c;
}

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./ColorParser":11}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.default = OGParser;

var _ConstructorText = require("./ConstructorText");

var _ConstructorText2 = _interopRequireDefault(_ConstructorText);

var _ConstructorSprite = require("./ConstructorSprite");

var _ConstructorSprite2 = _interopRequireDefault(_ConstructorSprite);

var _ConstructorContainer = require("./ConstructorContainer");

var _ConstructorContainer2 = _interopRequireDefault(_ConstructorContainer);

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

                                                        var _isContainer = !(_o.gid || _o.image) || _o.properties && _o.properties.container;
                                                        var _isText = _o.text != undefined;
                                                        var _isImage = _data.tilesets && _data.tilesets.length > 0 && !_isContainer && !_isText;
                                                        // image Loader
                                                        if (_isImage) {
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
                                                        if (_isText) {
                                                                _obj = (0, _ConstructorText2.default)(_o);
                                                        }
                                                        if (_isContainer) {
                                                                _obj = (0, _ConstructorContainer2.default)(_o);
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

},{"./ConstructorContainer":12,"./ConstructorSprite":13,"./ConstructorText":14}],16:[function(require,module,exports){
"use strict";

var _OGParser = require("./OGParser");

var _OGParser2 = _interopRequireDefault(_OGParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

PIXI.loaders.Loader.addPixiMiddleware(_OGParser2.default);
PIXI.loader.use((0, _OGParser2.default)());
// nothing to export

},{"./OGParser":15}],17:[function(require,module,exports){
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

  var container = document.querySelector("#game_container");
  container.appendChild(_App.view);
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

},{"./BaseLayer":3,"./DragonBoneLoader":5,"./PixiHelper":7,"./SliceLayer":9,"./TiledOGLoader/TiledObjGroupLoader":16}]},{},[17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsIm5vZGVfbW9kdWxlcy9zaWduYWxzL2Rpc3Qvc2lnbmFscy5qcyIsInNyY1xcc2NyaXB0c1xcQmFzZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxCbGFkZS5qcyIsInNyY1xcc2NyaXB0c1xcc3JjXFxzY3JpcHRzXFxEcmFnb25Cb25lTG9hZGVyLmpzIiwic3JjXFxzY3JpcHRzXFxMaXN0TGF5ZXIuanMiLCJzcmNcXHNjcmlwdHNcXFBpeGlIZWxwZXIuanMiLCJzcmNcXHNjcmlwdHNcXFNsaWNhYmxlT2JqZWN0LmpzIiwic3JjXFxzY3JpcHRzXFxTbGljZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxTdGFydExheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxDb2xvclBhcnNlci5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcQ29uc3RydWN0b3JDb250YWluZXIuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXENvbnN0cnVjdG9yU3ByaXRlLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxDb25zdHJ1Y3RvclRleHQuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXE9HUGFyc2VyLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxUaWxlZE9iakdyb3VwTG9hZGVyLmpzIiwic3JjXFxzY3JpcHRzXFxjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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b0I7QUFDakMsTUFBSSxTQUFTLEtBQUssTUFBbEI7O0FBRUEsU0FDRyxHQURILENBQ08sV0FEUCxFQUNvQix3QkFEcEIsRUFFRyxHQUZILENBRU8sT0FGUCxFQUVnQiw0QkFGaEIsRUFHRyxJQUhILENBR1EsVUFBUyxDQUFULEVBQVksR0FBWixFQUFpQjs7QUFFckI7QUFDRCxHQU5IOztBQVFBLFVBQVEsR0FBUixDQUFZLGlCQUFaO0FBQ0QsQ0FaRDs7QUFjQTtBQUNBLElBQUksV0FBVyxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDdEMsTUFBSSxLQUFLLFNBQVMsSUFBVCxDQUFjLFdBQXZCO0FBQ0EsTUFBSSxLQUFLLFNBQVMsSUFBVCxDQUFjLFlBQXZCOztBQUVBLE1BQUksS0FBSyxFQUFMLEdBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUNwQixTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLEtBQUssSUFBN0I7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLE1BQWhCLEdBQXlCLEtBQUssQ0FBTCxHQUFTLEVBQVQsR0FBYyxJQUF2QztBQUNELEdBSEQsTUFHTztBQUNMLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsS0FBSyxFQUFMLEdBQVUsQ0FBVixHQUFjLElBQXRDO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixNQUFoQixHQUF5QixLQUFLLElBQTlCO0FBQ0Q7QUFDRixDQVhEOztBQWFBLE9BQU8sUUFBUCxHQUFrQixRQUFsQjtBQUNBLE9BQU8sTUFBUCxHQUFnQixJQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIEBwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdyAtIHYyLjMuMVxuICogQ29tcGlsZWQgV2VkLCAyOSBOb3YgMjAxNyAxNjo0NToxOSBVVENcbiAqXG4gKiBwaXhpLWZpbHRlcnMgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICovXG4hZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9lKGV4cG9ydHMpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wiZXhwb3J0c1wiXSxlKTplKHQuX19maWx0ZXJfZHJvcF9zaGFkb3c9e30pfSh0aGlzLGZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBlPVwiYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB2ZWMzKGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKSkueHksIDAuMCwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLHI9XCJ2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjtcXG51bmlmb3JtIGZsb2F0IGFscGhhO1xcbnVuaWZvcm0gdmVjMyBjb2xvcjtcXG52b2lkIG1haW4odm9pZCl7XFxuICAgIHZlYzQgc2FtcGxlID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKTtcXG5cXG4gICAgLy8gVW4tcHJlbXVsdGlwbHkgYWxwaGEgYmVmb3JlIGFwcGx5aW5nIHRoZSBjb2xvclxcbiAgICBpZiAoc2FtcGxlLmEgPiAwLjApIHtcXG4gICAgICAgIHNhbXBsZS5yZ2IgLz0gc2FtcGxlLmE7XFxuICAgIH1cXG5cXG4gICAgLy8gUHJlbXVsdGlwbHkgYWxwaGEgYWdhaW5cXG4gICAgc2FtcGxlLnJnYiA9IGNvbG9yLnJnYiAqIHNhbXBsZS5hO1xcblxcbiAgICAvLyBhbHBoYSB1c2VyIGFscGhhXFxuICAgIHNhbXBsZSAqPSBhbHBoYTtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gc2FtcGxlO1xcbn1cIixpPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGkoaSxuLG8sYSxsKXt2b2lkIDA9PT1pJiYoaT00NSksdm9pZCAwPT09biYmKG49NSksdm9pZCAwPT09byYmKG89Miksdm9pZCAwPT09YSYmKGE9MCksdm9pZCAwPT09bCYmKGw9LjUpLHQuY2FsbCh0aGlzKSx0aGlzLnRpbnRGaWx0ZXI9bmV3IFBJWEkuRmlsdGVyKGUsciksdGhpcy5ibHVyRmlsdGVyPW5ldyBQSVhJLmZpbHRlcnMuQmx1ckZpbHRlcix0aGlzLmJsdXJGaWx0ZXIuYmx1cj1vLHRoaXMudGFyZ2V0VHJhbnNmb3JtPW5ldyBQSVhJLk1hdHJpeCx0aGlzLnJvdGF0aW9uPWksdGhpcy5wYWRkaW5nPW4sdGhpcy5kaXN0YW5jZT1uLHRoaXMuYWxwaGE9bCx0aGlzLmNvbG9yPWF9dCYmKGkuX19wcm90b19fPXQpLChpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQmJnQucHJvdG90eXBlKSkuY29uc3RydWN0b3I9aTt2YXIgbj17ZGlzdGFuY2U6e2NvbmZpZ3VyYWJsZTohMH0scm90YXRpb246e2NvbmZpZ3VyYWJsZTohMH0sYmx1cjp7Y29uZmlndXJhYmxlOiEwfSxhbHBoYTp7Y29uZmlndXJhYmxlOiEwfSxjb2xvcjp7Y29uZmlndXJhYmxlOiEwfX07cmV0dXJuIGkucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKHQsZSxyLGkpe3ZhciBuPXQuZ2V0UmVuZGVyVGFyZ2V0KCk7bi50cmFuc2Zvcm09dGhpcy50YXJnZXRUcmFuc2Zvcm0sdGhpcy50aW50RmlsdGVyLmFwcGx5KHQsZSxuLCEwKSx0aGlzLmJsdXJGaWx0ZXIuYXBwbHkodCxuLHIpLHQuYXBwbHlGaWx0ZXIodGhpcyxlLHIsaSksbi50cmFuc2Zvcm09bnVsbCx0LnJldHVyblJlbmRlclRhcmdldChuKX0saS5wcm90b3R5cGUuX3VwZGF0ZVBhZGRpbmc9ZnVuY3Rpb24oKXt0aGlzLnBhZGRpbmc9dGhpcy5kaXN0YW5jZSsyKnRoaXMuYmx1cn0saS5wcm90b3R5cGUuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybT1mdW5jdGlvbigpe3RoaXMudGFyZ2V0VHJhbnNmb3JtLnR4PXRoaXMuZGlzdGFuY2UqTWF0aC5jb3ModGhpcy5hbmdsZSksdGhpcy50YXJnZXRUcmFuc2Zvcm0udHk9dGhpcy5kaXN0YW5jZSpNYXRoLnNpbih0aGlzLmFuZ2xlKX0sbi5kaXN0YW5jZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZGlzdGFuY2V9LG4uZGlzdGFuY2Uuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuX2Rpc3RhbmNlPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpLHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLnJvdGF0aW9uLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFuZ2xlL1BJWEkuREVHX1RPX1JBRH0sbi5yb3RhdGlvbi5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5hbmdsZT10KlBJWEkuREVHX1RPX1JBRCx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5ibHVyLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsdXJGaWx0ZXIuYmx1cn0sbi5ibHVyLnNldD1mdW5jdGlvbih0KXt0aGlzLmJsdXJGaWx0ZXIuYmx1cj10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKX0sbi5hbHBoYS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhfSxuLmFscGhhLnNldD1mdW5jdGlvbih0KXt0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGE9dH0sbi5jb2xvci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gUElYSS51dGlscy5yZ2IyaGV4KHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LG4uY29sb3Iuc2V0PWZ1bmN0aW9uKHQpe1BJWEkudXRpbHMuaGV4MnJnYih0LHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5jb2xvcil9LE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGkucHJvdG90eXBlLG4pLGl9KFBJWEkuRmlsdGVyKTtQSVhJLmZpbHRlcnMuRHJvcFNoYWRvd0ZpbHRlcj1pLHQuRHJvcFNoYWRvd0ZpbHRlcj1pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXItZHJvcC1zaGFkb3cuanMubWFwXG4iLCIvKmpzbGludCBvbmV2YXI6dHJ1ZSwgdW5kZWY6dHJ1ZSwgbmV3Y2FwOnRydWUsIHJlZ2V4cDp0cnVlLCBiaXR3aXNlOnRydWUsIG1heGVycjo1MCwgaW5kZW50OjQsIHdoaXRlOmZhbHNlLCBub21lbjpmYWxzZSwgcGx1c3BsdXM6ZmFsc2UgKi9cbi8qZ2xvYmFsIGRlZmluZTpmYWxzZSwgcmVxdWlyZTpmYWxzZSwgZXhwb3J0czpmYWxzZSwgbW9kdWxlOmZhbHNlLCBzaWduYWxzOmZhbHNlICovXG5cbi8qKiBAbGljZW5zZVxuICogSlMgU2lnbmFscyA8aHR0cDovL21pbGxlcm1lZGVpcm9zLmdpdGh1Yi5jb20vanMtc2lnbmFscy8+XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIEF1dGhvcjogTWlsbGVyIE1lZGVpcm9zXG4gKiBWZXJzaW9uOiAxLjAuMCAtIEJ1aWxkOiAyNjggKDIwMTIvMTEvMjkgMDU6NDggUE0pXG4gKi9cblxuKGZ1bmN0aW9uKGdsb2JhbCl7XG5cbiAgICAvLyBTaWduYWxCaW5kaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8qKlxuICAgICAqIE9iamVjdCB0aGF0IHJlcHJlc2VudHMgYSBiaW5kaW5nIGJldHdlZW4gYSBTaWduYWwgYW5kIGEgbGlzdGVuZXIgZnVuY3Rpb24uXG4gICAgICogPGJyIC8+LSA8c3Ryb25nPlRoaXMgaXMgYW4gaW50ZXJuYWwgY29uc3RydWN0b3IgYW5kIHNob3VsZG4ndCBiZSBjYWxsZWQgYnkgcmVndWxhciB1c2Vycy48L3N0cm9uZz5cbiAgICAgKiA8YnIgLz4tIGluc3BpcmVkIGJ5IEpvYSBFYmVydCBBUzMgU2lnbmFsQmluZGluZyBhbmQgUm9iZXJ0IFBlbm5lcidzIFNsb3QgY2xhc3Nlcy5cbiAgICAgKiBAYXV0aG9yIE1pbGxlciBNZWRlaXJvc1xuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqIEBuYW1lIFNpZ25hbEJpbmRpbmdcbiAgICAgKiBAcGFyYW0ge1NpZ25hbH0gc2lnbmFsIFJlZmVyZW5jZSB0byBTaWduYWwgb2JqZWN0IHRoYXQgbGlzdGVuZXIgaXMgY3VycmVudGx5IGJvdW5kIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIEhhbmRsZXIgZnVuY3Rpb24gYm91bmQgdG8gdGhlIHNpZ25hbC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzT25jZSBJZiBiaW5kaW5nIHNob3VsZCBiZSBleGVjdXRlZCBqdXN0IG9uY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtsaXN0ZW5lckNvbnRleHRdIENvbnRleHQgb24gd2hpY2ggbGlzdGVuZXIgd2lsbCBiZSBleGVjdXRlZCAob2JqZWN0IHRoYXQgc2hvdWxkIHJlcHJlc2VudCB0aGUgYHRoaXNgIHZhcmlhYmxlIGluc2lkZSBsaXN0ZW5lciBmdW5jdGlvbikuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFtwcmlvcml0eV0gVGhlIHByaW9yaXR5IGxldmVsIG9mIHRoZSBldmVudCBsaXN0ZW5lci4gKGRlZmF1bHQgPSAwKS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTaWduYWxCaW5kaW5nKHNpZ25hbCwgbGlzdGVuZXIsIGlzT25jZSwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZ1bmN0aW9uIGJvdW5kIHRvIHRoZSBzaWduYWwuXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IGxpc3RlbmVyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBiaW5kaW5nIHNob3VsZCBiZSBleGVjdXRlZCBqdXN0IG9uY2UuXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzT25jZSA9IGlzT25jZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udGV4dCBvbiB3aGljaCBsaXN0ZW5lciB3aWxsIGJlIGV4ZWN1dGVkIChvYmplY3QgdGhhdCBzaG91bGQgcmVwcmVzZW50IHRoZSBgdGhpc2AgdmFyaWFibGUgaW5zaWRlIGxpc3RlbmVyIGZ1bmN0aW9uKS5cbiAgICAgICAgICogQG1lbWJlck9mIFNpZ25hbEJpbmRpbmcucHJvdG90eXBlXG4gICAgICAgICAqIEBuYW1lIGNvbnRleHRcbiAgICAgICAgICogQHR5cGUgT2JqZWN0fHVuZGVmaW5lZHxudWxsXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBsaXN0ZW5lckNvbnRleHQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZmVyZW5jZSB0byBTaWduYWwgb2JqZWN0IHRoYXQgbGlzdGVuZXIgaXMgY3VycmVudGx5IGJvdW5kIHRvLlxuICAgICAgICAgKiBAdHlwZSBTaWduYWxcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3NpZ25hbCA9IHNpZ25hbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTGlzdGVuZXIgcHJpb3JpdHlcbiAgICAgICAgICogQHR5cGUgTnVtYmVyXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG4gICAgfVxuXG4gICAgU2lnbmFsQmluZGluZy5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGJpbmRpbmcgaXMgYWN0aXZlIGFuZCBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICovXG4gICAgICAgIGFjdGl2ZSA6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgcGFyYW1ldGVycyBwYXNzZWQgdG8gbGlzdGVuZXIgZHVyaW5nIGBTaWduYWwuZGlzcGF0Y2hgIGFuZCBgU2lnbmFsQmluZGluZy5leGVjdXRlYC4gKGN1cnJpZWQgcGFyYW1ldGVycylcbiAgICAgICAgICogQHR5cGUgQXJyYXl8bnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgcGFyYW1zIDogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbCBsaXN0ZW5lciBwYXNzaW5nIGFyYml0cmFyeSBwYXJhbWV0ZXJzLlxuICAgICAgICAgKiA8cD5JZiBiaW5kaW5nIHdhcyBhZGRlZCB1c2luZyBgU2lnbmFsLmFkZE9uY2UoKWAgaXQgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgZnJvbSBzaWduYWwgZGlzcGF0Y2ggcXVldWUsIHRoaXMgbWV0aG9kIGlzIHVzZWQgaW50ZXJuYWxseSBmb3IgdGhlIHNpZ25hbCBkaXNwYXRjaC48L3A+XG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IFtwYXJhbXNBcnJdIEFycmF5IG9mIHBhcmFtZXRlcnMgdGhhdCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSBsaXN0ZW5lclxuICAgICAgICAgKiBAcmV0dXJuIHsqfSBWYWx1ZSByZXR1cm5lZCBieSB0aGUgbGlzdGVuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBleGVjdXRlIDogZnVuY3Rpb24gKHBhcmFtc0Fycikge1xuICAgICAgICAgICAgdmFyIGhhbmRsZXJSZXR1cm4sIHBhcmFtcztcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiAhIXRoaXMuX2xpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gdGhpcy5wYXJhbXM/IHRoaXMucGFyYW1zLmNvbmNhdChwYXJhbXNBcnIpIDogcGFyYW1zQXJyO1xuICAgICAgICAgICAgICAgIGhhbmRsZXJSZXR1cm4gPSB0aGlzLl9saXN0ZW5lci5hcHBseSh0aGlzLmNvbnRleHQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzT25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyUmV0dXJuO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRhY2ggYmluZGluZyBmcm9tIHNpZ25hbC5cbiAgICAgICAgICogLSBhbGlhcyB0bzogbXlTaWduYWwucmVtb3ZlKG15QmluZGluZy5nZXRMaXN0ZW5lcigpKTtcbiAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb258bnVsbH0gSGFuZGxlciBmdW5jdGlvbiBib3VuZCB0byB0aGUgc2lnbmFsIG9yIGBudWxsYCBpZiBiaW5kaW5nIHdhcyBwcmV2aW91c2x5IGRldGFjaGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZGV0YWNoIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNCb3VuZCgpPyB0aGlzLl9zaWduYWwucmVtb3ZlKHRoaXMuX2xpc3RlbmVyLCB0aGlzLmNvbnRleHQpIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGJpbmRpbmcgaXMgc3RpbGwgYm91bmQgdG8gdGhlIHNpZ25hbCBhbmQgaGF2ZSBhIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgaXNCb3VuZCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoISF0aGlzLl9zaWduYWwgJiYgISF0aGlzLl9saXN0ZW5lcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElmIFNpZ25hbEJpbmRpbmcgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uY2UuXG4gICAgICAgICAqL1xuICAgICAgICBpc09uY2UgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNPbmNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gSGFuZGxlciBmdW5jdGlvbiBib3VuZCB0byB0aGUgc2lnbmFsLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TGlzdGVuZXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge1NpZ25hbH0gU2lnbmFsIHRoYXQgbGlzdGVuZXIgaXMgY3VycmVudGx5IGJvdW5kIHRvLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2lnbmFsIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpZ25hbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlIGluc3RhbmNlIHByb3BlcnRpZXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9kZXN0cm95IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NpZ25hbDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcjtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICB0b1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnW1NpZ25hbEJpbmRpbmcgaXNPbmNlOicgKyB0aGlzLl9pc09uY2UgKycsIGlzQm91bmQ6JysgdGhpcy5pc0JvdW5kKCkgKycsIGFjdGl2ZTonICsgdGhpcy5hY3RpdmUgKyAnXSc7XG4gICAgICAgIH1cblxuICAgIH07XG5cblxuLypnbG9iYWwgU2lnbmFsQmluZGluZzpmYWxzZSovXG5cbiAgICAvLyBTaWduYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlTGlzdGVuZXIobGlzdGVuZXIsIGZuTmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdsaXN0ZW5lciBpcyBhIHJlcXVpcmVkIHBhcmFtIG9mIHtmbn0oKSBhbmQgc2hvdWxkIGJlIGEgRnVuY3Rpb24uJy5yZXBsYWNlKCd7Zm59JywgZm5OYW1lKSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3VzdG9tIGV2ZW50IGJyb2FkY2FzdGVyXG4gICAgICogPGJyIC8+LSBpbnNwaXJlZCBieSBSb2JlcnQgUGVubmVyJ3MgQVMzIFNpZ25hbHMuXG4gICAgICogQG5hbWUgU2lnbmFsXG4gICAgICogQGF1dGhvciBNaWxsZXIgTWVkZWlyb3NcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTaWduYWwoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSBBcnJheS48U2lnbmFsQmluZGluZz5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2JpbmRpbmdzID0gW107XG4gICAgICAgIHRoaXMuX3ByZXZQYXJhbXMgPSBudWxsO1xuXG4gICAgICAgIC8vIGVuZm9yY2UgZGlzcGF0Y2ggdG8gYXdheXMgd29yayBvbiBzYW1lIGNvbnRleHQgKCM0NylcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmRpc3BhdGNoID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFNpZ25hbC5wcm90b3R5cGUuZGlzcGF0Y2guYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBTaWduYWwucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaWduYWxzIFZlcnNpb24gTnVtYmVyXG4gICAgICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAgICAgKiBAY29uc3RcbiAgICAgICAgICovXG4gICAgICAgIFZFUlNJT04gOiAnMS4wLjAnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBTaWduYWwgc2hvdWxkIGtlZXAgcmVjb3JkIG9mIHByZXZpb3VzbHkgZGlzcGF0Y2hlZCBwYXJhbWV0ZXJzIGFuZFxuICAgICAgICAgKiBhdXRvbWF0aWNhbGx5IGV4ZWN1dGUgbGlzdGVuZXIgZHVyaW5nIGBhZGQoKWAvYGFkZE9uY2UoKWAgaWYgU2lnbmFsIHdhc1xuICAgICAgICAgKiBhbHJlYWR5IGRpc3BhdGNoZWQgYmVmb3JlLlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqL1xuICAgICAgICBtZW1vcml6ZSA6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfc2hvdWxkUHJvcGFnYXRlIDogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgU2lnbmFsIGlzIGFjdGl2ZSBhbmQgc2hvdWxkIGJyb2FkY2FzdCBldmVudHMuXG4gICAgICAgICAqIDxwPjxzdHJvbmc+SU1QT1JUQU5UOjwvc3Ryb25nPiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgZHVyaW5nIGEgZGlzcGF0Y2ggd2lsbCBvbmx5IGFmZmVjdCB0aGUgbmV4dCBkaXNwYXRjaCwgaWYgeW91IHdhbnQgdG8gc3RvcCB0aGUgcHJvcGFnYXRpb24gb2YgYSBzaWduYWwgdXNlIGBoYWx0KClgIGluc3RlYWQuPC9wPlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqL1xuICAgICAgICBhY3RpdmUgOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzT25jZVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2xpc3RlbmVyQ29udGV4dF1cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtwcmlvcml0eV1cbiAgICAgICAgICogQHJldHVybiB7U2lnbmFsQmluZGluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9yZWdpc3Rlckxpc3RlbmVyIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBpc09uY2UsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpIHtcblxuICAgICAgICAgICAgdmFyIHByZXZJbmRleCA9IHRoaXMuX2luZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lciwgbGlzdGVuZXJDb250ZXh0KSxcbiAgICAgICAgICAgICAgICBiaW5kaW5nO1xuXG4gICAgICAgICAgICBpZiAocHJldkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGJpbmRpbmcgPSB0aGlzLl9iaW5kaW5nc1twcmV2SW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nLmlzT25jZSgpICE9PSBpc09uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2Fubm90IGFkZCcrIChpc09uY2U/ICcnIDogJ09uY2UnKSArJygpIHRoZW4gYWRkJysgKCFpc09uY2U/ICcnIDogJ09uY2UnKSArJygpIHRoZSBzYW1lIGxpc3RlbmVyIHdpdGhvdXQgcmVtb3ZpbmcgdGhlIHJlbGF0aW9uc2hpcCBmaXJzdC4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJpbmRpbmcgPSBuZXcgU2lnbmFsQmluZGluZyh0aGlzLCBsaXN0ZW5lciwgaXNPbmNlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hZGRCaW5kaW5nKGJpbmRpbmcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLm1lbW9yaXplICYmIHRoaXMuX3ByZXZQYXJhbXMpe1xuICAgICAgICAgICAgICAgIGJpbmRpbmcuZXhlY3V0ZSh0aGlzLl9wcmV2UGFyYW1zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7U2lnbmFsQmluZGluZ30gYmluZGluZ1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2FkZEJpbmRpbmcgOiBmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICAgICAgLy9zaW1wbGlmaWVkIGluc2VydGlvbiBzb3J0XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuX2JpbmRpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgIGRvIHsgLS1uOyB9IHdoaWxlICh0aGlzLl9iaW5kaW5nc1tuXSAmJiBiaW5kaW5nLl9wcmlvcml0eSA8PSB0aGlzLl9iaW5kaW5nc1tuXS5fcHJpb3JpdHkpO1xuICAgICAgICAgICAgdGhpcy5fYmluZGluZ3Muc3BsaWNlKG4gKyAxLCAwLCBiaW5kaW5nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2luZGV4T2ZMaXN0ZW5lciA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgY29udGV4dCkge1xuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgY3VyO1xuICAgICAgICAgICAgd2hpbGUgKG4tLSkge1xuICAgICAgICAgICAgICAgIGN1ciA9IHRoaXMuX2JpbmRpbmdzW25dO1xuICAgICAgICAgICAgICAgIGlmIChjdXIuX2xpc3RlbmVyID09PSBsaXN0ZW5lciAmJiBjdXIuY29udGV4dCA9PT0gY29udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIGxpc3RlbmVyIHdhcyBhdHRhY2hlZCB0byBTaWduYWwuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF1cbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gaWYgU2lnbmFsIGhhcyB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgaGFzIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBjb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyLCBjb250ZXh0KSAhPT0gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBhIGxpc3RlbmVyIHRvIHRoZSBzaWduYWwuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIFNpZ25hbCBoYW5kbGVyIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2xpc3RlbmVyQ29udGV4dF0gQ29udGV4dCBvbiB3aGljaCBsaXN0ZW5lciB3aWxsIGJlIGV4ZWN1dGVkIChvYmplY3QgdGhhdCBzaG91bGQgcmVwcmVzZW50IHRoZSBgdGhpc2AgdmFyaWFibGUgaW5zaWRlIGxpc3RlbmVyIGZ1bmN0aW9uKS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtwcmlvcml0eV0gVGhlIHByaW9yaXR5IGxldmVsIG9mIHRoZSBldmVudCBsaXN0ZW5lci4gTGlzdGVuZXJzIHdpdGggaGlnaGVyIHByaW9yaXR5IHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIGxpc3RlbmVycyB3aXRoIGxvd2VyIHByaW9yaXR5LiBMaXN0ZW5lcnMgd2l0aCBzYW1lIHByaW9yaXR5IGxldmVsIHdpbGwgYmUgZXhlY3V0ZWQgYXQgdGhlIHNhbWUgb3JkZXIgYXMgdGhleSB3ZXJlIGFkZGVkLiAoZGVmYXVsdCA9IDApXG4gICAgICAgICAqIEByZXR1cm4ge1NpZ25hbEJpbmRpbmd9IEFuIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIGJpbmRpbmcgYmV0d2VlbiB0aGUgU2lnbmFsIGFuZCBsaXN0ZW5lci5cbiAgICAgICAgICovXG4gICAgICAgIGFkZCA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSkge1xuICAgICAgICAgICAgdmFsaWRhdGVMaXN0ZW5lcihsaXN0ZW5lciwgJ2FkZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyTGlzdGVuZXIobGlzdGVuZXIsIGZhbHNlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGxpc3RlbmVyIHRvIHRoZSBzaWduYWwgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBmaXJzdCBleGVjdXRpb24gKHdpbGwgYmUgZXhlY3V0ZWQgb25seSBvbmNlKS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgU2lnbmFsIGhhbmRsZXIgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbbGlzdGVuZXJDb250ZXh0XSBDb250ZXh0IG9uIHdoaWNoIGxpc3RlbmVyIHdpbGwgYmUgZXhlY3V0ZWQgKG9iamVjdCB0aGF0IHNob3VsZCByZXByZXNlbnQgdGhlIGB0aGlzYCB2YXJpYWJsZSBpbnNpZGUgbGlzdGVuZXIgZnVuY3Rpb24pLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ByaW9yaXR5XSBUaGUgcHJpb3JpdHkgbGV2ZWwgb2YgdGhlIGV2ZW50IGxpc3RlbmVyLiBMaXN0ZW5lcnMgd2l0aCBoaWdoZXIgcHJpb3JpdHkgd2lsbCBiZSBleGVjdXRlZCBiZWZvcmUgbGlzdGVuZXJzIHdpdGggbG93ZXIgcHJpb3JpdHkuIExpc3RlbmVycyB3aXRoIHNhbWUgcHJpb3JpdHkgbGV2ZWwgd2lsbCBiZSBleGVjdXRlZCBhdCB0aGUgc2FtZSBvcmRlciBhcyB0aGV5IHdlcmUgYWRkZWQuIChkZWZhdWx0ID0gMClcbiAgICAgICAgICogQHJldHVybiB7U2lnbmFsQmluZGluZ30gQW4gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgYmluZGluZyBiZXR3ZWVuIHRoZSBTaWduYWwgYW5kIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgYWRkT25jZSA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSkge1xuICAgICAgICAgICAgdmFsaWRhdGVMaXN0ZW5lcihsaXN0ZW5lciwgJ2FkZE9uY2UnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3Rlckxpc3RlbmVyKGxpc3RlbmVyLCB0cnVlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGEgc2luZ2xlIGxpc3RlbmVyIGZyb20gdGhlIGRpc3BhdGNoIHF1ZXVlLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBIYW5kbGVyIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gRXhlY3V0aW9uIGNvbnRleHQgKHNpbmNlIHlvdSBjYW4gYWRkIHRoZSBzYW1lIGhhbmRsZXIgbXVsdGlwbGUgdGltZXMgaWYgZXhlY3V0aW5nIGluIGEgZGlmZmVyZW50IGNvbnRleHQpLlxuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTGlzdGVuZXIgaGFuZGxlciBmdW5jdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZSA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgY29udGV4dCkge1xuICAgICAgICAgICAgdmFsaWRhdGVMaXN0ZW5lcihsaXN0ZW5lciwgJ3JlbW92ZScpO1xuXG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMuX2luZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lciwgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nc1tpXS5fZGVzdHJveSgpOyAvL25vIHJlYXNvbiB0byBhIFNpZ25hbEJpbmRpbmcgZXhpc3QgaWYgaXQgaXNuJ3QgYXR0YWNoZWQgdG8gYSBzaWduYWxcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5ncy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZyb20gdGhlIFNpZ25hbC5cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUFsbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKG4tLSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdzW25dLl9kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5ncy5sZW5ndGggPSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IE51bWJlciBvZiBsaXN0ZW5lcnMgYXR0YWNoZWQgdG8gdGhlIFNpZ25hbC5cbiAgICAgICAgICovXG4gICAgICAgIGdldE51bUxpc3RlbmVycyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0b3AgcHJvcGFnYXRpb24gb2YgdGhlIGV2ZW50LCBibG9ja2luZyB0aGUgZGlzcGF0Y2ggdG8gbmV4dCBsaXN0ZW5lcnMgb24gdGhlIHF1ZXVlLlxuICAgICAgICAgKiA8cD48c3Ryb25nPklNUE9SVEFOVDo8L3N0cm9uZz4gc2hvdWxkIGJlIGNhbGxlZCBvbmx5IGR1cmluZyBzaWduYWwgZGlzcGF0Y2gsIGNhbGxpbmcgaXQgYmVmb3JlL2FmdGVyIGRpc3BhdGNoIHdvbid0IGFmZmVjdCBzaWduYWwgYnJvYWRjYXN0LjwvcD5cbiAgICAgICAgICogQHNlZSBTaWduYWwucHJvdG90eXBlLmRpc2FibGVcbiAgICAgICAgICovXG4gICAgICAgIGhhbHQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9zaG91bGRQcm9wYWdhdGUgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2gvQnJvYWRjYXN0IFNpZ25hbCB0byBhbGwgbGlzdGVuZXJzIGFkZGVkIHRvIHRoZSBxdWV1ZS5cbiAgICAgICAgICogQHBhcmFtIHsuLi4qfSBbcGFyYW1zXSBQYXJhbWV0ZXJzIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCB0byBlYWNoIGhhbmRsZXIuXG4gICAgICAgICAqL1xuICAgICAgICBkaXNwYXRjaCA6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICghIHRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFyYW1zQXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgICAgICAgICAgICBuID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGJpbmRpbmdzO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tZW1vcml6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZQYXJhbXMgPSBwYXJhbXNBcnI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghIG4pIHtcbiAgICAgICAgICAgICAgICAvL3Nob3VsZCBjb21lIGFmdGVyIG1lbW9yaXplXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiaW5kaW5ncyA9IHRoaXMuX2JpbmRpbmdzLnNsaWNlKCk7IC8vY2xvbmUgYXJyYXkgaW4gY2FzZSBhZGQvcmVtb3ZlIGl0ZW1zIGR1cmluZyBkaXNwYXRjaFxuICAgICAgICAgICAgdGhpcy5fc2hvdWxkUHJvcGFnYXRlID0gdHJ1ZTsgLy9pbiBjYXNlIGBoYWx0YCB3YXMgY2FsbGVkIGJlZm9yZSBkaXNwYXRjaCBvciBkdXJpbmcgdGhlIHByZXZpb3VzIGRpc3BhdGNoLlxuXG4gICAgICAgICAgICAvL2V4ZWN1dGUgYWxsIGNhbGxiYWNrcyB1bnRpbCBlbmQgb2YgdGhlIGxpc3Qgb3IgdW50aWwgYSBjYWxsYmFjayByZXR1cm5zIGBmYWxzZWAgb3Igc3RvcHMgcHJvcGFnYXRpb25cbiAgICAgICAgICAgIC8vcmV2ZXJzZSBsb29wIHNpbmNlIGxpc3RlbmVycyB3aXRoIGhpZ2hlciBwcmlvcml0eSB3aWxsIGJlIGFkZGVkIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3RcbiAgICAgICAgICAgIGRvIHsgbi0tOyB9IHdoaWxlIChiaW5kaW5nc1tuXSAmJiB0aGlzLl9zaG91bGRQcm9wYWdhdGUgJiYgYmluZGluZ3Nbbl0uZXhlY3V0ZShwYXJhbXNBcnIpICE9PSBmYWxzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZvcmdldCBtZW1vcml6ZWQgYXJndW1lbnRzLlxuICAgICAgICAgKiBAc2VlIFNpZ25hbC5tZW1vcml6ZVxuICAgICAgICAgKi9cbiAgICAgICAgZm9yZ2V0IDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZQYXJhbXMgPSBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYWxsIGJpbmRpbmdzIGZyb20gc2lnbmFsIGFuZCBkZXN0cm95IGFueSByZWZlcmVuY2UgdG8gZXh0ZXJuYWwgb2JqZWN0cyAoZGVzdHJveSBTaWduYWwgb2JqZWN0KS5cbiAgICAgICAgICogPHA+PHN0cm9uZz5JTVBPUlRBTlQ6PC9zdHJvbmc+IGNhbGxpbmcgYW55IG1ldGhvZCBvbiB0aGUgc2lnbmFsIGluc3RhbmNlIGFmdGVyIGNhbGxpbmcgZGlzcG9zZSB3aWxsIHRocm93IGVycm9ycy48L3A+XG4gICAgICAgICAqL1xuICAgICAgICBkaXNwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9iaW5kaW5ncztcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcmV2UGFyYW1zO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdG9TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1tTaWduYWwgYWN0aXZlOicrIHRoaXMuYWN0aXZlICsnIG51bUxpc3RlbmVyczonKyB0aGlzLmdldE51bUxpc3RlbmVycygpICsnXSc7XG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIC8vIE5hbWVzcGFjZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLyoqXG4gICAgICogU2lnbmFscyBuYW1lc3BhY2VcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG5hbWUgc2lnbmFsc1xuICAgICAqL1xuICAgIHZhciBzaWduYWxzID0gU2lnbmFsO1xuXG4gICAgLyoqXG4gICAgICogQ3VzdG9tIGV2ZW50IGJyb2FkY2FzdGVyXG4gICAgICogQHNlZSBTaWduYWxcbiAgICAgKi9cbiAgICAvLyBhbGlhcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgKHNlZSAjZ2gtNDQpXG4gICAgc2lnbmFscy5TaWduYWwgPSBTaWduYWw7XG5cblxuXG4gICAgLy9leHBvcnRzIHRvIG11bHRpcGxlIGVudmlyb25tZW50c1xuICAgIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCl7IC8vQU1EXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBzaWduYWxzOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKXsgLy9ub2RlXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gc2lnbmFscztcbiAgICB9IGVsc2UgeyAvL2Jyb3dzZXJcbiAgICAgICAgLy91c2Ugc3RyaW5nIGJlY2F1c2Ugb2YgR29vZ2xlIGNsb3N1cmUgY29tcGlsZXIgQURWQU5DRURfTU9ERVxuICAgICAgICAvKmpzbGludCBzdWI6dHJ1ZSAqL1xuICAgICAgICBnbG9iYWxbJ3NpZ25hbHMnXSA9IHNpZ25hbHM7XG4gICAgfVxuXG59KHRoaXMpKTtcbiIsImltcG9ydCBfU3RhcnRTdGFnZUNyZWF0ZXIgZnJvbSBcIi4vU3RhcnRMYXllclwiXHJcbmltcG9ydCBfTGlzdFN0YWdlQ3JlYXRlciBmcm9tIFwiLi9MaXN0TGF5ZXJcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmFzZUxheWVyKEFwcCkge1xyXG5cclxuXHRsZXQgX2N1cnJlbnRTdGF0ZSA9IG51bGw7XHJcblx0bGV0IF90aGlzU3RhZ2UgPSB7fTtcclxuXHRsZXQgc3RhZ2VzID0ge307XHJcblxyXG5cdC8vIHByZWxvYWQgYmFzc3Mgc3RhZ2VcclxuXHRBcHAubG9hZGVyXHJcblx0XHQuYWRkKFwiYmFzZV9zdGFnZVwiLCBcIi4vc3JjL21hcHMvYmFzZS5qc29uXCIpXHJcblx0XHQubG9hZCgobCwgcmVzKSA9PiB7XHJcbiAgICBcdFxyXG4gICAgXHRfdGhpc1N0YWdlID0gcmVzLmJhc2Vfc3RhZ2Uuc3RhZ2U7XHJcbiAgICBcdF90aGlzU3RhZ2UuYXBwID0gQXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIF90aGlzU3RhZ2Uuc2NhbGUuc2V0KFxyXG4gICAgICAgICAgICBBcHAucmVuZGVyZXIud2lkdGggLyBfdGhpc1N0YWdlLmxheWVyV2lkdGgsXHJcbiAgICAgICAgICAgIEFwcC5yZW5kZXJlci5oZWlnaHQgLyBfdGhpc1N0YWdlLmxheWVySGVpZ2h0XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgQXBwLnN0YWdlLmFkZENoaWxkKF90aGlzU3RhZ2UpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIF90aGlzU3RhZ2UuSW5pdCA9IEluaXQ7XHJcbiAgICAgICAgX3RoaXNTdGFnZS5TZXRTdGF0ZSA9IFNldFN0YXRlO1xyXG5cclxuICAgICAgICBfdGhpc1N0YWdlLnN0YWdlcyA9IHN0YWdlcztcclxuICAgICAgICBzdGFnZXNbXCJCYXNlXCJdID0gX3RoaXNTdGFnZTtcclxuXHJcbiAgICAgICAgbC5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgTG9hZE5leHQoKTtcclxuICAgIH0pO1xyXG5cclxuXHRsZXQgTG9hZE5leHQgPSBmdW5jdGlvbigpe1xyXG4gICAgXHRuZXcgX1N0YXJ0U3RhZ2VDcmVhdGVyKF90aGlzU3RhZ2UsIEFwcC5sb2FkZXIsIHMgPT57XHJcbiAgICBcdFx0c3RhZ2VzW1wiU3RhcnRcIl0gPSBzO1xyXG4gICAgXHR9KTtcclxuXHJcbiAgICBcdG5ldyBfTGlzdFN0YWdlQ3JlYXRlcihfdGhpc1N0YWdlLCBBcHAubG9hZGVyLCBzID0+e1xyXG4gICAgXHRcdHN0YWdlc1tcIkxpc3RcIl0gPSBzO1xyXG4gICAgXHR9KTtcclxuXHJcbiAgICBcdEFwcC5sb2FkZXIubG9hZCgobCwgcmVzKSA9PiB7XHJcbiAgICBcdFx0SW5pdCgpO1xyXG4gICAgXHR9KTtcclxuXHJcbiAgICBcdEFwcC5sb2FkZXIub25Qcm9ncmVzcy5hZGQoIChsLCByZXMpID0+IHtcclxuICAgIFx0XHRjb25zb2xlLmxvZyhcIlByb2dyZXNzOlwiLCBsLnByb2dyZXNzKTtcclxuICAgIFx0fSk7XHJcblx0fVxyXG5cclxuXHRsZXQgSW5pdCA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuXHRcdGxldCBfUyA9IFNldFN0YXRlKFwiU3RhcnRcIik7XHJcblx0XHRfUy5Jbml0KCk7XHJcblx0fVxyXG5cclxuXHRsZXQgU2V0U3RhdGUgPSBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRcclxuXHRcdGlmKF9jdXJyZW50U3RhdGUpe1xyXG5cdFx0XHRfdGhpc1N0YWdlLnJlbW92ZUNoaWxkKF9jdXJyZW50U3RhdGUuc3RhZ2UpO1xyXG5cdFx0XHRfY3VycmVudFN0YXRlLnN0YWdlLnBhcmVudEdyb3VwID0gbnVsbDtcclxuXHRcdFx0aWYoX2N1cnJlbnRTdGF0ZS5PblJlbW92ZSlcclxuXHRcdFx0XHRfY3VycmVudFN0YXRlLk9uUmVtb3ZlKCk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdF9jdXJyZW50U3RhdGUgPSBzdGFnZXNbbmFtZV07XHJcblx0XHRpZihfY3VycmVudFN0YXRlKXtcclxuXHRcdFx0X2N1cnJlbnRTdGF0ZS5zdGFnZS5wYXJlbnRHcm91cCA9IF90aGlzU3RhZ2UuQkFTRV9NSURETEUuZ3JvdXA7XHJcblx0XHRcdF90aGlzU3RhZ2UuYWRkQ2hpbGQoX2N1cnJlbnRTdGF0ZS5zdGFnZSk7XHJcblx0XHRcdGlmKF9jdXJyZW50U3RhdGUuT25BZGQpXHJcblx0XHRcdFx0X2N1cnJlbnRTdGF0ZS5PbkFkZCgpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gX2N1cnJlbnRTdGF0ZTtcclxuXHR9XHJcblxyXG4gICAgLy8gYmFzZVN0YWdlIHVwZGF0ZTtcclxuICAgIEFwcC50aWNrZXIuYWRkKCgpID0+IHtcclxuXHJcbiAgICB9KTsgICBcclxufSIsIlxyXG4vL0JsYWRlIEpTIGNvbnN0cnVjdG9yXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGFkZSh0ZXh0dXJlKSB7XHJcbiAgdmFyIGNvdW50ID1cclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTA7XHJcbiAgdmFyIG1pbkRpc3QgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiA0MDtcclxuICB2YXIgbGl2ZVRpbWUgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAyMDtcclxuXHJcbiAgdmFyIHBvaW50cyA9IFtdO1xyXG4gIHRoaXMuY291bnQgPSBjb3VudDtcclxuICB0aGlzLm1pbkRpc3QgPSBtaW5EaXN0O1xyXG4gIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgdGhpcy5taW5Nb3Rpb25TcGVlZCA9IDQwMDAuMDtcclxuICB0aGlzLmxpdmVUaW1lID0gbGl2ZVRpbWU7XHJcbiAgdGhpcy5sYXN0TW90aW9uU3BlZWQgPSAwO1xyXG4gIHRoaXMudGFyZ2V0UG9zaXRpb24gPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHJcbiAgdGhpcy5ib2R5ID0gbmV3IFBJWEkubWVzaC5Sb3BlKHRleHR1cmUsIHBvaW50cyk7XHJcblxyXG4gIHZhciBsYXN0UG9zaXRpb24gPSBudWxsO1xyXG4gIHRoaXMuVXBkYXRlID0gZnVuY3Rpb24odGlja2VyKSB7XHJcbiAgICB2YXIgaXNEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBwb2ludHMgPSB0aGlzLmJvZHkucG9pbnRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgaWYgKHBvaW50c1tpXS5sYXN0VGltZSArIHRoaXMubGl2ZVRpbWUgPCB0aWNrZXIubGFzdFRpbWUpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBpc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB0ID0gbmV3IFBJWEkuUG9pbnQoXHJcbiAgICAgIHRoaXMudGFyZ2V0UG9zaXRpb24ueCAvIHRoaXMuYm9keS5zY2FsZS54LFxyXG4gICAgICB0aGlzLnRhcmdldFBvc2l0aW9uLnkgLyB0aGlzLmJvZHkuc2NhbGUueVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAobGFzdFBvc2l0aW9uID09IG51bGwpIGxhc3RQb3NpdGlvbiA9IHQ7XHJcblxyXG4gICAgdC5sYXN0VGltZSA9IHRpY2tlci5sYXN0VGltZTtcclxuXHJcbiAgICB2YXIgcCA9IGxhc3RQb3NpdGlvbjtcclxuXHJcbiAgICB2YXIgZHggPSB0LnggLSBwLng7XHJcbiAgICB2YXIgZHkgPSB0LnkgLSBwLnk7XHJcblxyXG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgIHRoaXMubGFzdE1vdGlvblNwZWVkID0gZGlzdCAqIDEwMDAgLyB0aWNrZXIuZWxhcHNlZE1TO1xyXG4gICAgaWYgKGRpc3QgPiBtaW5EaXN0KSB7XHJcbiAgICAgIGlmICh0aGlzLmxhc3RNb3Rpb25TcGVlZCA+IHRoaXMubWluTW90aW9uU3BlZWQpIHtcclxuICAgICAgICBwb2ludHMucHVzaCh0KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IHRoaXMuY291bnQpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaXNEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGFzdFBvc2l0aW9uID0gdDtcclxuICAgIGlmIChpc0RpcnR5KSB7XHJcbiAgICAgIHRoaXMuYm9keS5yZWZyZXNoKHRydWUpO1xyXG4gICAgICB0aGlzLmJvZHkucmVuZGVyYWJsZSA9IHBvaW50cy5sZW5ndGggPiAxO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuUmVhZENhbGxiYWNrcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRhcmdldC5tb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHNlbGYudGFyZ2V0UG9zaXRpb24gPSBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQubW91c2VvdmVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAvL1x0c2VsZi50YXJnZXRQb3NpdGlvbiA9ICBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgICAvL1x0Y29uc29sZS5sb2coXCJvdmVyXCIpO1xyXG4gICAgICAvLyAgc2VsZi5Nb3ZlQWxsKGUuZGF0YS5nbG9iYWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQudG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIG1vdmVcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5kYXRhKTtcclxuICAgICAgc2VsZi50YXJnZXRQb3NpdGlvbiA9IGUuZGF0YS5nbG9iYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaHN0YXJ0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIHN0YXJ0XCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUuZGF0YSk7XHJcbiAgICAgIC8vICBzZWxmLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJUb3VjaCBzdGFydFwiKTtcclxuICAgICAgLy8gX0JsYWRlLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG4gICAgLy8g0LAg0YLQviDQu9Cw0L/RiNCwINC60LDQutCw0Y8t0YLQvlxyXG4gIH07XHJcbn07XHJcblxyXG4vL3JldHVybiBCbGFkZTtcclxuXHJcbiIsIi8vaW1wb3J0IHtTaWduYWx9IGZyb20gXCJzaWduYWxzXCI7XHJcblxyXG5sZXQgQ29uc3RydWN0QnlOYW1lID0gZnVuY3Rpb24oZmFjdG9yeSwgbmFtZSkge1xyXG5cclxuXHRsZXQgb2JqID0gZmFjdG9yeS5idWlsZEFybWF0dXJlRGlzcGxheShuYW1lKTtcclxuXHRcdFx0XHRcclxuXHRvYmoubmFtZSA9IG5hbWU7XHJcblx0b2JqLmZhY3RvcnkgPSBmYWN0b3J5O1xyXG5cdG9iai5vcmlnTmFtZSA9IG5hbWU7XHJcblxyXG5cdFxyXG5cdG9iai5fX3Byb3RvX18ubGlnaHRDb3B5ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdGxldCBfbmFtZSA9IG5hbWU7XHJcblx0XHRsZXQgX2Nsb25lID0gQ29uc3RydWN0QnlOYW1lKHRoaXMuZmFjdG9yeSwgdGhpcy5vcmlnTmFtZSk7XHJcblx0XHRcclxuXHRcdF9jbG9uZS5wb3NpdGlvbi5zZXQodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpO1xyXG5cdFx0XHJcblx0XHRfY2xvbmUuYWxwaGEgPSB0aGlzLmFscGhhO1xyXG5cdFx0X2Nsb25lLnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbjtcclxuXHRcdF9jbG9uZS5waXZvdC5jb3B5KHRoaXMucGl2b3QpO1xyXG5cdFx0X2Nsb25lLmFuY2hvci5jb3B5KHRoaXMuYW5jaG9yKTtcclxuXHRcdF9jbG9uZS5zY2FsZS5jb3B5KHRoaXMuc2NhbGUpO1xyXG5cdFx0X2Nsb25lLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcblx0XHRfY2xvbmUucGFyZW50R3JvdXAgPSB0aGlzLnBhcmVudEdyb3VwO1xyXG5cdFx0X2Nsb25lLmNsb25lSUQgPSB0aGlzLmNsb25lSUQ/ICh0aGlzLmNsb25lSUQgKyAxKSA6IDA7XHJcblx0XHRfY2xvbmUubmFtZSA9IHRoaXMubmFtZSArIFwiX2Nsb25lX1wiICsgX2Nsb25lLmNsb25lSUQ7XHJcblx0XHRcclxuXHRcdHJldHVybiBfY2xvbmU7XHJcblx0XHQvL1xyXG5cdH1cclxuXHRcclxuXHJcblx0XHJcblx0Ly9vYmouaW1wb3J0V2lkdGggPSBfZGF0YS5hcm1hdHVyZVtpXS5hYWJiLndpZHRoO1xyXG5cdC8vb2JqLmltcG9ydEhlaWdodCA9IF9kYXRhLmFybWF0dXJlW2ldLmFhYmIuaGVpZ2h0O1xyXG5cdFxyXG5cdHJldHVybiBvYmo7XHJcbn0gXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmFnb25Cb25lTG9hZGVyKCkge1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24ocmVzLCBuZXh0KSB7XHJcblxyXG5cdFx0aWYocmVzLnVybC5pbmRleE9mKFwiLmRiYmluXCIpID4gLTEpe1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coXCJDYW4ndCBzdXBwb3J0IHRoaXMgZm9ybWF0IGluIERyYWdvbkJvbmUgUElYSSBGYWN0b3J5IVwiKTtcclxuXHRcdFx0bmV4dCgpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIShyZXMudXJsLmluZGV4T2YoXCIuanNvblwiKSA+IC0xICYmIHJlcy5kYXRhICYmIHJlcy5kYXRhLmFybWF0dXJlICYmIHJlcy5kYXRhLmZyYW1lUmF0ZSkpXHJcblx0XHR7XHJcblx0XHRcdG5leHQoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCEoZHJhZ29uQm9uZXMgJiYgZHJhZ29uQm9uZXMuUGl4aUZhY3RvcnkpKXtcclxuXHRcdFx0bmV4dCgpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJEcmFnb25Cb25lIFBJWEkgUHJlTG9hZGVyIFxcbiBlWHBvbmVudGEge3JvbmRvLmRldmlsW2FdZ21haWwuY29tfVwiKTtcclxuXHJcblx0XHQvL2RlcHJpY2F0ZWRcclxuXHRcdC8vcmVzLm9uTG9hZCA9IG5ldyBTaWduYWwoKTtcclxuXHJcblx0XHRsZXQgX2RhdGEgPSByZXMuZGF0YTtcclxuXHRcdFxyXG5cdFx0Ly8gYWRkIFRleHR1cmVEYXRhSnNvblxyXG5cdFx0Ly8gYWRkIHRvIGN1cnJldG4gbG9hZGVyXHJcblx0XHQvLyBjYWxsYmFjayBjYW4gYmUgY2hhbmdlZCB0byB0aGlzLm9uQ29tcGxldGUub25jZShmdW5jLCB0aGlzLCAxMDAwMDAwMDApO1xyXG5cdFx0Ly8gY3VyZW50bHkgdGhleSBjYWxsZWQgYWZ0ZXIgbG9hZGluZyBvZiB0ZXh0dXJlXHJcblx0XHRsZXQgbCA9IHRoaXM7Ly9uZXcgUElYSS5sb2FkZXJzLkxvYWRlcigpO1xyXG5cdFx0bC5hZGQocmVzLm5hbWUgKyBcIl90ZXhcIiwgcmVzLnVybC5yZXBsYWNlKFwic2tlLmpzb25cIixcInRleC5qc29uXCIpLCB7cGFyZW50UmVzb3VyY2U6IHJlc30pXHJcblx0XHQgLmFkZChyZXMubmFtZSArIFwiX2ltZ1wiLCByZXMudXJsLnJlcGxhY2UoXCJza2UuanNvblwiLFwidGV4LnBuZ1wiKSwge3BhcmVudFJlc291cmNlOiByZXN9LCAoKSA9PiB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyB1cGRhdGUgYWZ0ZXIgaW1hZ2UgbG9hZGluZ1xyXG5cdFx0XHRsZXQgX3JlcyA9IHRoaXMucmVzb3VyY2VzO1xyXG5cclxuXHRcdFx0bGV0IF9mYWN0b3J5ID0gZHJhZ29uQm9uZXMuUGl4aUZhY3RvcnkuZmFjdG9yeTtcclxuXHRcdFx0X2ZhY3RvcnkucGFyc2VEcmFnb25Cb25lc0RhdGEoX2RhdGEpO1xyXG5cdFx0XHRfZmFjdG9yeS5wYXJzZVRleHR1cmVBdGxhc0RhdGEoX3Jlc1tyZXMubmFtZSArIFwiX3RleFwiXS5kYXRhLF9yZXNbcmVzLm5hbWUgKyBcIl9pbWdcIl0udGV4dHVyZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXMub2JqZWN0cyA9IHt9O1xyXG5cdFx0XHRmb3IgKGxldCBpPSAwOyBpIDwgX2RhdGEuYXJtYXR1cmUubGVuZ3RoOyBpKyspIFxyXG5cdFx0XHR7XHJcblxyXG5cdFx0XHRcdGxldCBuYW1lID0gX2RhdGEuYXJtYXR1cmVbaV0ubmFtZTtcclxuXHJcblx0XHRcdFx0cmVzLm9iamVjdHNbbmFtZV0gPSAge307XHJcblx0XHRcdFx0aWYoZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcgJiYgZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcuY3JlYXRlKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdHJlcy5vYmplY3RzW25hbWVdID0gQ29uc3RydWN0QnlOYW1lKF9mYWN0b3J5LCBuYW1lKTtcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXMub2JqZWN0c1tuYW1lXS5jcmVhdGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0bGV0IF9mID0gX2ZhY3RvcnksXHJcblx0XHRcdFx0XHRcdF9uID0gbmFtZTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gQ29uc3RydWN0QnlOYW1lKF9mLCBfbik7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0cmVzLm9iamVjdHNbbmFtZV0uaW5zdGFuY2UgPSAoZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcgJiYgZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcuY3JlYXRlKTtcclxuXHJcblx0XHRcdH1cclxuXHRcdFx0Ly9kZXByaWNhdGVkXHJcblx0XHRcdC8vcmVzLm9uTG9hZC5kaXNwYXRjaChyZXMub2JqZWN0cyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRuZXh0KCk7XHJcblx0fTtcclxufVxyXG5cclxuZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcgPSB7XHJcblx0Y3JlYXRlIDogZmFsc2VcclxufVxyXG5cclxuUElYSS5sb2FkZXJzLkxvYWRlci5hZGRQaXhpTWlkZGxld2FyZShEcmFnb25Cb25lTG9hZGVyKTtcclxuUElYSS5sb2FkZXIudXNlKERyYWdvbkJvbmVMb2FkZXIoKSk7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGlzdExheWVyKGJhc2UsIGxvYWRlciwgY2FsbGJhY2spIHtcclxuXHR0aGlzLnN0YWdlID0gbnVsbDtcclxuICAgIHRoaXMuaXNJbml0ID0gZmFsc2U7XHJcblxyXG5cdC8vdmFyIGxvYWRlciA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XHJcblxyXG4gICAgbG9hZGVyLmFkZChcImxpc3Rfc3RhZ2VcIixcIi4vc3JjL21hcHMvbGlzdC5qc29uXCIsICgpID0+e1xyXG4gICAgXHRcclxuICAgIFx0dGhpcy5zdGFnZSA9IGxvYWRlci5yZXNvdXJjZXMubGlzdF9zdGFnZS5zdGFnZTtcclxuICAgIFx0XHJcbiAgICBcdGlmKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpe1xyXG4gICAgXHRcdGNhbGxiYWNrKHRoaXMpO1xyXG4gICAgXHR9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5PblJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH1cclxuICAgIHRoaXMuT25BZGQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKCF0aGlzLmlzSW5pdCl7XHJcbiAgICAgICAgICAgIHRoaXMuSW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgdGhpcy5Jbml0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBsZXQgX3MgPSB0aGlzLnN0YWdlO1xyXG4gICAgICAgIHdpbmRvdy5MaXN0ID0gX3M7XHJcbiAgICAgICAgX3MucmVQYXJlbnRBbGwoKTtcclxuICAgICAgICB0aGlzLmlzSW5pdCA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBfcnVsZXNfYnRuID0gX3MuZ2V0Q2hpbGRCeU5hbWUoXCJydWxlc19idXR0b25cIik7XHJcbiAgICAgICAgbGV0IF9ydWxlc19kc2sgPSBfcy5nZXRDaGlsZEJ5TmFtZShcInJ1bGVzX2Rlc2tcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX3J1bGVzX2J0bi5vbihcInBvaW50ZXJ0YXBcIiwgKCkgPT57XHJcbiAgICAgICAgICAgIF9ydWxlc19kc2sudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59IiwiXHJcblBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5nZXRDaGlsZEJ5TmFtZSA9IGZ1bmN0aW9uIGdldENoaWxkQnlOYW1lKG5hbWUpXHJcbntcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXS5uYW1lID09PSBuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG5cclxuUElYSS5Db250YWluZXIucHJvdG90eXBlLnJlUGFyZW50QWxsID0gZnVuY3Rpb24gcmVQYXJlbnRBbGwoKVxyXG57XHJcblx0Zm9yIChsZXQgaSA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXHJcblx0eyAgICBcclxuICAgICAgICBsZXQgX2MgPSB0aGlzLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmKF9jLnJlUGFyZW50VG8pe1xyXG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5nZXRDaGlsZEJ5TmFtZShfYy5yZVBhcmVudFRvKTtcclxuICAgICAgICAgICAgaWYocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQudG9Mb2NhbChuZXcgUElYSS5Qb2ludCgwLDApLCBfYywgX2MucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKF9jKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbn0iLCJpbXBvcnQgU2lnbmFsIGZyb20gXCJzaWduYWxzXCJcclxuXHJcbnZhciBfTUUgPSBNYXR0ZXIuRW5naW5lLFxyXG4gICAgX01XID0gTWF0dGVyLldvcmxkLFxyXG4gICAgX01CcyA9IE1hdHRlci5Cb2RpZXMsXHJcbiAgICBfTUIgPSBNYXR0ZXIuQm9keSxcclxuICAgIF9NQyA9IE1hdHRlci5Db21wb3NpdGUsXHJcbiAgICBfTUV2ID0gTWF0dGVyLkV2ZW50cyxcclxuICAgIF9NViA9IE1hdHRlci5WZWN0b3I7XHJcblxyXG5sZXQgQ3JlYXRlU3ViQm9keSA9IGZ1bmN0aW9uKHBhcmVudCwgdGV4RGF0YSl7XHJcblxyXG4gIGxldCBvYmogPSBDcmVhdGVTbGljYWJsZU9iamVjdChwYXJlbnQucG9zaXRpb24sIHBhcmVudC5lbmdpbmUsIHRleERhdGEpO1xyXG4gIFxyXG4gIG9iai5zY2FsZS5zZXQoMC4yLCAwLjIpO1xyXG4gIG9iai5wYXJlbnRHcm91cCA9IHRleERhdGEuZ3JvdXA7XHJcblxyXG4gIF9NQi5zZXRNYXNzKG9iai5waEJvZHksIHBhcmVudC5waEJvZHkubWFzcyAqIDAuNSk7XHJcbiAgX01CLnNldFZlbG9jaXR5KG9iai5waEJvZHksIHBhcmVudC5waEJvZHkudmVsb2NpdHkpO1xyXG4gIF9NQi5zZXRBbmdsZShvYmoucGhCb2R5LCBwYXJlbnQucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG5cclxuICBsZXQgYW5jaG9yZWRfZGlyID0gX01WLm5vcm1hbGlzZSh7eDpvYmouYW5jaG9yLnggLSAwLjUsIHk6IDAuNSAtIG9iai5hbmNob3IueSB9KTtcclxuICBhbmNob3JlZF9kaXIgPSBfTVYucm90YXRlKGFuY2hvcmVkX2RpciwgcGFyZW50LnBoQm9keS5zbGljZUFuZ2xlKTtcclxuXHJcbiAgX01CLmFwcGx5Rm9yY2Uob2JqLnBoQm9keSwgb2JqLnBoQm9keS5wb3NpdGlvbiwge1xyXG4gICAgeDogIGFuY2hvcmVkX2Rpci54ICogMC4wMixcclxuICAgIHk6ICBhbmNob3JlZF9kaXIueSAqIDAuMDJcclxuICB9KTtcclxuXHJcbiAgLy9kb3duUGFydC5waEJvZHkudG9ycXVlID0gdGhpcy5waEJvZHkudG9ycXVlICogMTA7XHJcblxyXG4gIHBhcmVudC5wYXJlbnQuYWRkQ2hpbGQob2JqKTtcclxuXHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ3JlYXRlU2xpY2FibGVPYmplY3QocG9zLCBlbmdpbmUsIGRhdGEpIHtcclxuICBcclxuICB2YXIgb2JqID0gbnVsbDtcclxuXHJcbiAgaWYgKGRhdGEgJiYgZGF0YS5ub3JtYWwpIHtcclxuICAgIG9iaiA9IG5ldyBQSVhJLlNwcml0ZShkYXRhLm5vcm1hbC50ZXgpO1xyXG5cclxuICAgIGlmIChkYXRhLm5vcm1hbC5waXZvdCkge1xyXG4gICAgICBvYmouYW5jaG9yLnNldChkYXRhLm5vcm1hbC5waXZvdC54LCBkYXRhLm5vcm1hbC5waXZvdC55KTtcclxuICAgIH1cclxuXHJcbiAgfSBlbHNlIHtcclxuICBcclxuICAgIG9iaiA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XHJcbiAgICBvYmouYmVnaW5GaWxsKDB4OTk2NmYgKiBNYXRoLnJhbmRvbSgpKTtcclxuICAgIG9iai5kcmF3Q2lyY2xlKDAsIDAsIDUwKTtcclxuICAgIG9iai5lbmRGaWxsKCk7XHJcbiAgfVxyXG5cclxuICBvYmouc3ByaXRlRGF0YSA9IGRhdGE7XHJcbiAgb2JqLmVuZ2luZSA9IGVuZ2luZTtcclxuICBvYmoueCA9IHBvcy54O1xyXG4gIG9iai55ID0gcG9zLnk7XHJcbiAgb2JqLnBhcmVudEdyb3VwID0gZGF0YS5ub3JtYWwuZ3JvdXA7XHJcbiAgXHJcbiAgb2JqLm9uc2xpY2UgPSBuZXcgU2lnbmFsKCk7XHJcblxyXG4gIG9iai5raWxsID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5waEJvZHkuc2xpY2VkICYmIHRoaXMub25zbGljZSkge1xyXG4gICAgICBcclxuICAgICAgdGhpcy5vbnNsaWNlLmRpc3BhdGNoKHRoaXMpO1xyXG4gICAgICBcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG9iai5zcHJpdGVEYXRhLnBhcnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBDcmVhdGVTdWJCb2R5KG9iaiwge25vcm1hbDogb2JqLnNwcml0ZURhdGEucGFydHNbaV19KTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3koeyBjaGlsZHJlbjogdHJ1ZSB9KTtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5waEJvZHkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgX01DLnJlbW92ZShlbmdpbmUud29ybGQsIHRoaXMucGhCb2R5KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBvYmoub25zbGljZS5hZGQoKCkgPT57IGNvbnNvbGUubG9nKFwiTGlzdGVuIFNpZ25hbFwiKTt9KTtcclxuXHJcbiAgdmFyIHBoQm9keSA9IF9NQnMuY2lyY2xlKHBvcy54LCBwb3MueSwgNTApO1xyXG4gIHBoQm9keS5jb2xsaXNpb25GaWx0ZXIubWFzayAmPSB+cGhCb2R5LmNvbGxpc2lvbkZpbHRlci5jYXRlZ29yeTtcclxuICBfTVcuYWRkKGVuZ2luZS53b3JsZCwgcGhCb2R5KTtcclxuXHJcbiAgcGhCb2R5LnBpT2JqID0gb2JqO1xyXG4gIG9iai5waEJvZHkgPSBwaEJvZHk7XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn1cclxuIiwiaW1wb3J0IHtEcm9wU2hhZG93RmlsdGVyfSBmcm9tICdAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cnXHJcbmltcG9ydCBDcmVhdGVTbGljYWJsZU9iamVjdCBmcm9tICcuL1NsaWNhYmxlT2JqZWN0J1xyXG5pbXBvcnQgQmxhZGUgZnJvbSAnLi9CbGFkZSdcclxuXHJcbi8vIGZ1bmN0aW9uLCB3aG8gY3JlYXRlIGFuZCBpbnN0YW5jZSBTbGljZWRMYXlvdXRcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2xpY2VMYXllciAoYXBwKSB7XHJcbiAgdmFyIF9NRSA9IE1hdHRlci5FbmdpbmUsXHJcbiAgICBfTVcgPSBNYXR0ZXIuV29ybGQsXHJcbiAgICBfTUJzID0gTWF0dGVyLkJvZGllcyxcclxuICAgIF9NQiA9IE1hdHRlci5Cb2R5LFxyXG4gICAgX01DID0gTWF0dGVyLkNvbXBvc2l0ZSxcclxuICAgIF9NRXYgPSBNYXR0ZXIuRXZlbnRzLFxyXG4gICAgX01WID0gTWF0dGVyLlZlY3RvcixcclxuICAgIF9MUmVzID0gYXBwLmxvYWRlci5yZXNvdXJjZXM7XHJcblxyXG4gIHZhciBlbmdpbmUgPSBfTUUuY3JlYXRlKCk7XHJcbiAgZW5naW5lLndvcmxkLnNjYWxlID0gMC4wMDAxO1xyXG4gIGVuZ2luZS53b3JsZC5ncmF2aXR5LnkgPSAwLjM1O1xyXG5cclxuICBfTUUucnVuKGVuZ2luZSk7XHJcblxyXG4gIHZhciBzdGFnZSA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cclxuICB2YXIgX2xyZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIHNsaWNlVXBHcm91cCA9IG5ldyBQSVhJLmRpc3BsYXkuR3JvdXAoMSwgZmFsc2UpO1xyXG4gIHZhciBzbGljZU1pZGRsZUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgwLCBmYWxzZSk7XHJcbiAgdmFyIHNsaWNlRG93bkdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgtMSwgZmFsc2UpO1xyXG4gIHZhciB1aUdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgxMCwgZmFsc2UpO1xyXG4gIFxyXG4gLy8gc3RhZ2UuZmlsdGVycyA9IFtuZXcgRHJvcFNoYWRvd0ZpbHRlcigpXTtcclxuXHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzbGljZVVwR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlRG93bkdyb3VwKSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcihzbGljZU1pZGRsZUdyb3VwKSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuZGlzcGxheS5MYXllcih1aUdyb3VwKSk7XHJcblxyXG4gIC8vc3RhZ2UuZ3JvdXAuZW5hYmxlU29ydCA9IHRydWU7XHJcbiAgc3RhZ2UuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG5cclxuICBzdGFnZS5fZGVidWdUZXh0ID0gbmV3IFBJWEkuVGV4dChcIkJvZHkgY291bnQ6IDBcIiwge1xyXG4gICAgZm9udEZhbWlseTogXCJBcmlhbFwiLFxyXG4gICAgZm9udFNpemU6IDMyLFxyXG4gICAgZmlsbDogMHhmZjEwMTAsXHJcbiAgICBzdHJva2U6IDB4MDBjYzEwLFxyXG4gICAgYWxpZ246IFwibGVmdFwiXHJcbiAgfSk7XHJcblxyXG4gIHN0YWdlLl9kZWJ1Z1RleHQucG9zaXRpb24uc2V0KDEwLCA0Mik7XHJcbiAvLyBjb25zb2xlLmxvZyhcInByZVwiKTtcclxuICBzdGFnZS5ibGFkZSA9IG5ldyBCbGFkZShcclxuICAgIF9scmVzLmJsYWRlX3RleC50ZXh0dXJlLFxyXG4gICAgMzAsXHJcbiAgICAxMCxcclxuICAgIDEwMFxyXG4gICk7XHJcbiAgc3RhZ2UuYmxhZGUubWluTW92YWJsZVNwZWVkID0gMTAwMDtcclxuICBzdGFnZS5ibGFkZS5ib2R5LnBhcmVudEdyb3VwID0gc2xpY2VNaWRkbGVHcm91cDtcclxuICBzdGFnZS5ibGFkZS5SZWFkQ2FsbGJhY2tzKHN0YWdlKTtcclxuXHJcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhZ2UuYmxhZGUuYm9keSk7XHJcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhZ2UuX2RlYnVnVGV4dCk7XHJcblxyXG4gIHZhciBzbGljZXMgPSAwO1xyXG4gIC8vIHNsaWNlcyB2aWEgUmF5Y2FzdCBUZXN0aW5nXHJcbiAgdmFyIFJheUNhc3RUZXN0ID0gZnVuY3Rpb24gUmF5Q2FzdFRlc3QoYm9kaWVzKSB7XHJcbiAgICBpZiAoc3RhZ2UuYmxhZGUubGFzdE1vdGlvblNwZWVkID4gc3RhZ2UuYmxhZGUubWluTW90aW9uU3BlZWQpIHtcclxuICAgICAgdmFyIHBwcyA9IHN0YWdlLmJsYWRlLmJvZHkucG9pbnRzO1xyXG5cclxuICAgICAgaWYgKHBwcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBNYXRoLm1pbihwcHMubGVuZ3RoLCA0KTsgaSsrKSB7XHJcbiAgICAgICAgICAvLyA0INC/0L7RgdC70LXQtNC90LjRhSDRgdC10LPQvNC10L3RgtCwXHJcblxyXG4gICAgICAgICAgdmFyIHNwID0gcHBzW2kgLSAxXTtcclxuICAgICAgICAgIHZhciBlcCA9IHBwc1tpXTtcclxuXHJcbiAgICAgICAgICB2YXIgY29sbGlzaW9ucyA9IE1hdHRlci5RdWVyeS5yYXkoYm9kaWVzLCBzcCwgZXApO1xyXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xsaXNpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChjb2xsaXNpb25zW2pdLmJvZHkuY2FuU2xpY2UpIHtcclxuICAgICAgICAgICAgICB2YXIgc3YgPSB7IHk6IGVwLnkgLSBzcC55LCB4OiBlcC54IC0gc3AueCB9O1xyXG4gICAgICAgICAgICAgIHN2ID0gX01WLm5vcm1hbGlzZShzdik7XHJcblxyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZUFuZ2xlID0gX01WLmFuZ2xlKHNwLCBlcCk7XHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlVmVjdG9yID0gc3Y7XHJcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImJvZHkgc2xpY2UgYW5nbGU6XCIsIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZUFuZ2xlKTtcclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgc2xpY2VzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgZnJhbWVzID0gMDtcclxuICB2YXIgbGFzdFNob3RYID0gbnVsbDtcclxuXHJcbiAgLy8gdXBkYXRlIHZpZXdcclxuICB2YXIgVXBkYXRlID0gZnVuY3Rpb24gVXBkYXRlKCkge1xyXG5cclxuICBcdC8vc3RhZ2UudXBkYXRlU3RhZ2UoKTtcclxuICAgIHN0YWdlLl9kZWJ1Z1RleHQudGV4dCA9XHJcbiAgICAgIFwi0JLRiyDQtNC10YDQt9C60L4g0LfQsNGA0LXQt9Cw0LvQuCBcIiArIHNsaWNlcy50b1N0cmluZygpICsgXCIg0LrRgNC+0LvQuNC6b9CyKNC60LApKFwiO1xyXG5cclxuICAgIHZhciBib2RpZXMgPSBfTUMuYWxsQm9kaWVzKGVuZ2luZS53b3JsZCk7XHJcblxyXG4gICAgZnJhbWVzKys7XHJcbiAgICBpZiAoZnJhbWVzID49IDIwICYmIGJvZGllcy5sZW5ndGggPCA1KSB7XHJcbiAgICAgIGZyYW1lcyA9IDA7XHJcbiAgICAgIHZhciBwb3MgPSB7XHJcbiAgICAgICAgeDpcclxuICAgICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb21SYW5nZSgwLCAxMCkpICpcclxuICAgICAgICAgIE1hdGguZmxvb3IoKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCkgLyAxMCksXHJcbiAgICAgICAgeTogYXBwLnJlbmRlcmVyLmhlaWdodCArIDEwMFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgd2hpbGUgKGxhc3RTaG90WCAhPT0gbnVsbCAmJiBNYXRoLmFicyhsYXN0U2hvdFggLSBwb3MueCkgPCAyMDApIHtcclxuICAgICAgICBwb3MueCA9XHJcbiAgICAgICAgICBNYXRoLnJvdW5kKE1hdGgucmFuZG9tUmFuZ2UoMCwgMTApKSAqXHJcbiAgICAgICAgICBNYXRoLmZsb29yKChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApIC8gMTApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsYXN0U2hvdFggPSBwb3MueDtcclxuXHJcbiAgICAgIHBvcy54IC09IDEwMDsgLy9vZmZzZXRcclxuXHJcbiAgICAgIC8vLyDQktGL0L3QtdGB0YLQuCDRjdGC0L4g0LPQvtCy0L3QviDQutGD0LTQsC3QvdC40LHRg9C00Ywg0LIg0LTRgNGD0LPQvtC1INC80LXRgdGC0L5cclxuXHJcbiAgICAgIC8vYmFubnlcclxuXHQgICAgbGV0IGJkYXRhID0gX0xSZXMuYnVubnkuc3ByaXRlc2hlZXQ7XHJcblxyXG5cdFx0bGV0IGRhdGEgPSB7XHJcblx0ICAgICAgXHRub3JtYWw6IHtcclxuXHQgICAgIFx0ICAgdGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueSxcclxuXHQgICAgIFx0ICAgcGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55LnBpdm90LFxyXG5cdCAgICAgXHQgICBncm91cDpzbGljZURvd25Hcm91cFxyXG5cdCAgICAgIFx0fSxcclxuXHQgICAgICBcdHBhcnRzOltcclxuXHRcdCAgICAgIFx0e1xyXG5cdFx0ICAgICAgICAgIHRleDogYmRhdGEudGV4dHVyZXMuYnVubnlfdG9yc2UsXHJcblx0XHQgICAgICAgICAgcGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55X3RvcnNlLnBpdm90LFxyXG5cdFx0ICAgICAgICAgIGdyb3VwOiBzbGljZURvd25Hcm91cFxyXG5cdFx0ICAgICAgICB9LFxyXG5cdFx0ICAgICAgICB7XHJcblx0XHQgICAgICAgIFx0dGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueV9oZWFkLFxyXG5cdFx0ICAgICAgICBcdHBpdm90OiBiZGF0YS5kYXRhLmZyYW1lcy5idW5ueV9oZWFkLnBpdm90LFxyXG5cdFx0ICAgICAgICBcdGdyb3VwOiBzbGljZVVwR3JvdXBcclxuXHQgICAgICAgIFx0fVxyXG5cdCAgICAgICAgXVxyXG5cdCAgICB9O1xyXG5cclxuICAgICAgdmFyIG9iaiA9IENyZWF0ZVNsaWNhYmxlT2JqZWN0KHBvcywgZW5naW5lLCBkYXRhKTtcclxuXHJcbiAgICAgIG9iai5zY2FsZS5zZXQoMC4yLCAwLjIpO1xyXG4gICAgICBvYmoucGhCb2R5LmNhblNsaWNlID0gdHJ1ZTtcclxuXHJcbiAgICAgIHZhciBfb2Z4ID0gMC41IC0gKHBvcy54ICsgMTAwKSAvIChhcHAucmVuZGVyZXIud2lkdGggKyAyMDApO1xyXG5cclxuICAgICAgdmFyIHJhbmdlID0gMC44O1xyXG4gICAgICB2YXIgaW1wID0ge1xyXG4gICAgICAgIHg6IHJhbmdlICogX29meCxcclxuICAgICAgICB5OiAtTWF0aC5yYW5kb21SYW5nZSgwLjQsIDAuNSlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIF9NQi5hcHBseUZvcmNlKG9iai5waEJvZHksIG9iai5waEJvZHkucG9zaXRpb24sIGltcCk7XHJcbiAgICAgIG9iai5waEJvZHkudG9ycXVlID0gTWF0aC5yYW5kb21SYW5nZSgtMTAsIDEwKTtcclxuXHJcbiAgICAgIHN0YWdlLmFkZENoaWxkKG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHRpY2tlciA9IGFwcC50aWNrZXI7XHJcbiAgICBzdGFnZS5ibGFkZS5VcGRhdGUodGlja2VyKTtcclxuXHJcbiAgICAvL0Nhc3RUZXN0XHJcbiAgICBSYXlDYXN0VGVzdChib2RpZXMpO1xyXG5cclxuICAgIF9NRS51cGRhdGUoZW5naW5lKTtcclxuICAgIC8vIGl0ZXJhdGUgb3ZlciBib2RpZXMgYW5kIGZpeHR1cmVzXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IGJvZGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICB2YXIgYm9keSA9IGJvZGllc1tpXTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgYm9keS5waU9iaiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIChib2R5LnBvc2l0aW9uLnkgPiBhcHAucmVuZGVyZXIuaGVpZ2h0ICsgMTAwICYmXHJcbiAgICAgICAgICAgIGJvZHkudmVsb2NpdHkueSA+IDApIHx8XHJcbiAgICAgICAgICBib2R5LnNsaWNlZFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgYm9keS5waU9iai5raWxsKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJvZHkucGlPYmoueCA9IGJvZHkucG9zaXRpb24ueDtcclxuICAgICAgICAgIGJvZHkucGlPYmoueSA9IGJvZHkucG9zaXRpb24ueTtcclxuICAgICAgICAgIGJvZHkucGlPYmoucm90YXRpb24gPSBib2R5LmFuZ2xlO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhib2R5LmFuZ2xlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBNYXRoLnJhbmRvbVJhbmdlID0gZnVuY3Rpb24obWluLCBtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcbiAgfTtcclxuICAvL3J1biBVcGRhdGVcclxuICBhcHAudGlja2VyLmFkZChVcGRhdGUsIHRoaXMpO1xyXG5cclxuICAvLy8vIFJFVFVSTlxyXG4gIHJldHVybiBzdGFnZTtcclxufVxyXG5cclxuLy9leHBvcnQge1NsaWNlTGF5ZXIgfTtcclxuLy9tb2R1bGUuZXhwb3J0cyA9IFNsaWNlTGF5ZXI7XHJcbi8vcmV0dXJuIFNsaWNlTGF5ZXI7XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFN0YXJ0TGF5ZXIoYmFzZSwgbG9hZGVyLCBjYWxsYmFjaykge1xyXG5cdHRoaXMuc3RhZ2UgPSBudWxsO1xyXG5cdHRoaXMuaXNJbml0ID0gZmFsc2U7XHJcblx0XHJcblx0bGV0IF9iYXNlID0gYmFzZTtcclxuXHQvL3ZhciBsb2FkZXIgPSBuZXcgUElYSS5sb2FkZXJzLkxvYWRlcigpO1xyXG5cclxuICAgIGxvYWRlci5hZGQoXCJzdGFydF9zdGFnZVwiLFwiLi9zcmMvbWFwcy9zdGFydC5qc29uXCIsICgpID0+e1xyXG4gICAgXHRcclxuICAgIFx0dGhpcy5zdGFnZSA9IGxvYWRlci5yZXNvdXJjZXMuc3RhcnRfc3RhZ2Uuc3RhZ2U7XHJcbiAgICBcdFxyXG4gICAgXHRpZih0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKXtcclxuICAgIFx0XHRjYWxsYmFjayh0aGlzKTtcclxuICAgIFx0fVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5PbkFkZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXHRpZighdGhpcy5pc0luaXQpXHJcbiAgICBcdFx0dGhpcy5Jbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5PblJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLkluaXQgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgIFx0bGV0IF9zdGFydF9idXR0b24gPSB0aGlzLnN0YWdlLmdldENoaWxkQnlOYW1lKFwic3RhcnRfYnV0dG9uOm5vcm1hbFwiKTtcclxuICAgIFx0bGV0IF9zdGFydF9idXR0b25faG92ZXIgPSB0aGlzLnN0YWdlLmdldENoaWxkQnlOYW1lKFwic3RhcnRfYnV0dG9uOmhvdmVyXCIpO1xyXG5cclxuICAgIFx0bGV0IF9zdGFydF9idXR0b25fbm9ybWFsX3RleCA9IF9zdGFydF9idXR0b24udGV4dHVyZTtcclxuICAgIFx0bGV0IF9zdGFydF9idXR0b25faG92ZXJfdGV4ID0gX3N0YXJ0X2J1dHRvbl9ob3Zlci50ZXh0dXJlO1xyXG4gICAgXHRcclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICBcdF9zdGFydF9idXR0b24uYnV0dG9uTW9kZSA9IHRydWU7XHJcblxyXG4gICAgXHRfc3RhcnRfYnV0dG9uLm9uKFwicG9pbnRlcm92ZXJcIiwgKCkgPT4ge1xyXG4gICAgXHRcdF9zdGFydF9idXR0b24udGV4dHVyZSA9IF9zdGFydF9idXR0b25faG92ZXJfdGV4O1xyXG4gICAgXHR9KTtcclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5vbihcInBvaW50ZXJvdXRcIiwgKCkgPT57XHJcbiAgICBcdFx0X3N0YXJ0X2J1dHRvbi50ZXh0dXJlID0gX3N0YXJ0X2J1dHRvbl9ub3JtYWxfdGV4O1xyXG4gICAgXHR9KTtcclxuXHJcbiAgICBcdF9zdGFydF9idXR0b24ub24oXCJwb2ludGVydGFwXCIsICgpID0+e1xyXG4gICAgXHRcdFxyXG4gICAgXHRcdGxldCBfbCA9IF9iYXNlLlNldFN0YXRlKFwiTGlzdFwiKTtcclxuICAgIFx0XHQvL19sLkluaXQoKTtcclxuICAgIFx0XHQvL3dpbmRvdy5Mb2FkR2FtZSgpO1xyXG4gICAgXHR9KVxyXG5cclxuICAgIFx0dGhpcy5pc0luaXQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5sZXQgUGFyc2VDb2xvciA9IGZ1bmN0aW9uKHZhbHVlKXtcclxuXHRcclxuXHRpZighdmFsdWUpXHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuXHRpZih0eXBlb2YgdmFsdWUgPT0gXCJzdHJpbmdcIilcclxuXHR7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIjXCIsXCJcIik7XHJcblx0XHRpZih2YWx1ZS5sZW5ndGggPiA2KVxyXG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygyKTtcclxuXHJcblx0XHRsZXQgcGFyc2UgPSBwYXJzZUludCh2YWx1ZSwgMTYpO1xyXG5cdFx0cmV0dXJuIHBhcnNlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5sZXQgUGFyc2VBbHBoYSA9IGZ1bmN0aW9uKHZhbHVlKXtcclxuXHRcclxuXHRpZighdmFsdWUpXHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuXHRpZih0eXBlb2YgdmFsdWUgPT0gXCJzdHJpbmdcIilcclxuXHR7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoXCIjXCIsXCJcIik7XHJcblx0XHRpZih2YWx1ZS5sZW5ndGggPiA2KVxyXG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLDIpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHJcblx0XHRsZXQgcGFyc2UgPSBwYXJzZUludCh2YWx1ZSwgMTYpO1xyXG5cdFx0cmV0dXJuIHBhcnNlIC8gMjU2O1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQge1xyXG5cdFBhcnNlQ29sb3IsXHJcblx0UGFyc2VBbHBoYVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnN0cnVjdG9yQ29udGFpbmVyIChvYmopIHtcclxuXHRsZXQgX28gPSBvYmo7XHJcblxyXG5cdGxldCBfYyA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cdF9jLm5hbWUgPSBfby5uYW1lO1xyXG5cdF9jLnBpdm90LnNldCgwLCAxKTsgLy8gc2V0IGRvd24gdG8gYW5jaG9yXHJcblx0XHJcblx0aWYoX2Mud2lkdGgpXHJcblx0XHRzcHIud2lkdGggPSBfby53aWR0aDtcclxuXHRcclxuXHRpZihfYy5oZWlnaHQpXHJcblx0XHRzcHIuaGVpZ2h0ID0gX28uaGVpZ2h0O1xyXG5cdFxyXG5cdF9jLnJvdGF0aW9uID0gKF9vLnJvdGF0aW9uIHx8IDApICAqIE1hdGguUEkgLyAxODA7XHJcblx0X2MueCA9IF9vLng7XHJcblx0X2MueSA9IF9vLnk7XHJcblx0X2MudmlzaWJsZSA9IF9vLnZpc2libGUgPT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vLnZpc2libGU7XHJcblx0XHJcblx0X2MudHlwZXMgPSBfby50eXBlID8gX28udHlwZS5zcGxpdChcIjpcIik6IFtdO1xyXG5cclxuXHRpZihfYy5wcm9wZXJ0aWVzKVxyXG5cdHtcclxuXHRcdF9jLmFscGhhID0gX28ucHJvcGVydGllcy5vcGFjaXR5IHx8IDE7XHJcblx0XHRPYmplY3QuYXNzaWduKF9jLCBfby5wcm9wZXJ0aWVzKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBfYzsgXHJcbn0iLCJcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uc3RydWN0b3JTcHJpdHIob2JqKSB7XHJcblx0bGV0IF9vID0gb2JqOyBcclxuXHRcclxuXHRsZXQgc3ByID0gbmV3IFBJWEkuU3ByaXRlLmZyb21JbWFnZShfby51cmwpO1xyXG5cdHNwci5uYW1lID0gX28ubmFtZTtcclxuXHRzcHIuYW5jaG9yLnNldCgwLCAxKTsgLy8gc2V0IGRvd24gdG8gYW5jaG9yXHJcblx0XHJcblx0aWYoX28ud2lkdGgpXHJcblx0XHRzcHIud2lkdGggPSBfby53aWR0aDtcclxuXHRcclxuXHRpZihfby5oZWlnaHQpXHJcblx0XHRzcHIuaGVpZ2h0ID0gX28uaGVpZ2h0O1xyXG5cdFxyXG5cdHNwci5yb3RhdGlvbiA9IChfby5yb3RhdGlvbiB8fCAwKSAgKiBNYXRoLlBJIC8gMTgwO1xyXG5cdHNwci54ID0gX28ueDtcclxuXHRzcHIueSA9IF9vLnk7XHJcblx0c3ByLnZpc2libGUgPSBfby52aXNpYmxlID09IHVuZGVmaW5lZCA/IHRydWUgOiBfby52aXNpYmxlO1xyXG5cdFxyXG5cdHNwci50eXBlcyA9IF9vLnR5cGUgPyBfby50eXBlLnNwbGl0KFwiOlwiKTogW107XHJcblxyXG5cdGlmKF9vLnByb3BlcnRpZXMpXHJcblx0e1xyXG5cdFx0c3ByLmFscGhhID0gX28ucHJvcGVydGllcy5vcGFjaXR5IHx8IDE7XHJcblx0XHRPYmplY3QuYXNzaWduKHNwciwgX28ucHJvcGVydGllcyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc3ByO1xyXG59IiwiaW1wb3J0IHtQYXJzZUNvbG9yLFBhcnNlQWxwaGEgfSBmcm9tIFwiLi9Db2xvclBhcnNlclwiXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uc3RydWN0b3JUZXh0KG9iaiwgKSB7XHJcblxyXG5cdGxldCBfbyA9IG9iajtcclxuXHRsZXQgX2NvbnQgPSBuZXcgUElYSS5Db250YWluZXIoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHJcblx0bGV0IF90ZXh0ID0gbmV3IFBJWEkuVGV4dCgpO1xyXG5cdF90ZXh0Lm5hbWUgPSBfby5uYW1lICsgXCJfVGV4dFwiO1xyXG5cclxuXHRfY29udC5uYW1lID0gX28ubmFtZTtcclxuXHRfY29udC50eXBlcyA9IF9vLnR5cGUgPyBfby50eXBlLnNwbGl0KFwiOlwiKTogW107XHJcblxyXG5cclxuXHRfY29udC53aWR0aCA9IF9vLndpZHRoO1xyXG5cdF9jb250LmhlaWdodCA9IF9vLmhlaWdodDtcclxuXHJcblx0Ly9fY29udC5saW5lU3R5bGUoMiwgMHhGRjAwRkYsIDEpO1xyXG5cdC8vX2NvbnQuYmVnaW5GaWxsKDB4RkYwMEJCLCAwLjI1KTtcclxuXHQvL19jb250LmRyYXdSb3VuZGVkUmVjdCgwLCAwLCBfby53aWR0aCwgX28uaGVpZ2h0KTtcclxuXHQvL19jb250LmVuZEZpbGwoKTtcclxuXHJcblx0X2NvbnQucGl2b3Quc2V0KDAsMCk7XHJcblxyXG5cdF9jb250LnJvdGF0aW9uID0gX28ucm90YXRpb24gKiBNYXRoLlBJIC8gMTgwO1xyXG5cdF9jb250LmFscGhhID0gUGFyc2VBbHBoYShfby50ZXh0LmNvbG9yKSB8fCAxO1xyXG5cdF90ZXh0LnRleHQgPSBfby50ZXh0LnRleHQ7XHJcblxyXG5cdHN3aXRjaCAoX28udGV4dC5oYWxpZ2gpIHtcclxuXHRcdGNhc2UgXCJyaWdodFwiOlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci54ID0gMTtcclxuXHRcdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnggPSBfY29udC53aWR0aDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBcImNlbnRlclwiOlxyXG5cdFx0XHRcdHtcclxuXHJcblx0XHRcdFx0XHRfdGV4dC5hbmNob3IueCA9IDAuNTtcclxuXHRcdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnggPSBfY29udC53aWR0aCAqIDAuNTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0e1xyXG5cdFx0XHRcdF90ZXh0LmFuY2hvci54ID0gMDtcclxuXHRcdFx0XHRfdGV4dC5wb3NpdGlvbi54ID0gMDtcdFxyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblx0c3dpdGNoIChfby50ZXh0LnZhbGlnbikge1xyXG5cdFx0Y2FzZSBcImJvdHRvbVwiOlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci55ID0gMTtcclxuXHRcdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnkgPSBfY29udC5oZWlnaHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgXCJjZW50ZXJcIjpcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRfdGV4dC5hbmNob3IueSA9IDAuNTtcclxuXHRcdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnkgPSBfY29udC5oZWlnaHQgKiAwLjU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdGRlZmF1bHQ6XHJcblx0XHRcdHtcclxuXHJcblx0XHRcdFx0X3RleHQuYW5jaG9yLnkgPSAwO1xyXG5cdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnkgPSAwO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdH1cclxuXHJcblxyXG5cdF9jb250LnBvc2l0aW9uLnNldChfby54LCBfby55KTtcclxuXHRfdGV4dC5zdHlsZSA9IHtcclxuXHRcdHdvcmRXcmFwOiBfby50ZXh0LndyYXAsXHJcblx0XHRmaWxsOiBQYXJzZUNvbG9yKF9vLnRleHQuY29sb3IpIHx8IDB4MDAwMDAwLFxyXG5cdFx0YWxpZ246IF9vLnRleHQudmFsaWduIHx8IFwiY2VudGVyXCIsXHJcblx0XHRmb250U2l6ZTogX28udGV4dC5waXhlbHNpemUgfHwgMjQsXHJcblx0XHRmb250RmFtaWx5OiBfby50ZXh0LmZvbnRmYW1pbHkgfHwgXCJBcmlhbFwiLFxyXG5cdFx0Zm9udFdlaWdodDogX28udGV4dC5ib2xkID8gXCJib2xkXCI6IFwibm9ybWFsXCIsXHJcblx0XHRmb250U3R5bGU6IF9vLnRleHQuaXRhbGljID8gXCJpdGFsaWNcIiA6IFwibm9ybWFsXCJcclxuXHRcdH07XHJcblxyXG5cdGlmKF9vLnByb3BlcnRpZXMpXHJcblx0e1xyXG5cdFx0X3RleHQuc3R5bGUuc3Ryb2tlID0gIFBhcnNlQ29sb3IoX28ucHJvcGVydGllcy5zdHJva2VDb2xvcikgfHwgMDtcclxuXHRcdF90ZXh0LnN0eWxlLnN0cm9rZVRoaWNrbmVzcyA9ICBfby5wcm9wZXJ0aWVzLnN0cm9rZVRoaWNrbmVzcyB8fCAwO1xyXG5cdFx0XHJcblx0XHRPYmplY3QuYXNzaWduKF9jb250LCBfby5wcm9wZXJ0aWVzKTtcclxuXHR9XHJcblxyXG5cdC8vX2NvbnQucGFyZW50R3JvdXAgPSBfbGF5ZXIuZ3JvdXA7XHJcblx0X2NvbnQuYWRkQ2hpbGQoX3RleHQpO1xyXG5cdC8vX3N0YWdlLmFkZENoaWxkKF9jb250KTtcclxuXHRyZXR1cm4gX2NvbnQ7XHJcbn0iLCJpbXBvcnQgQ1RleHQgZnJvbSBcIi4vQ29uc3RydWN0b3JUZXh0XCJcclxuaW1wb3J0IENTcHJpdGUgZnJvbSBcIi4vQ29uc3RydWN0b3JTcHJpdGVcIlxyXG5pbXBvcnQgQ0NvbnRhaW5lciBmcm9tIFwiLi9Db25zdHJ1Y3RvckNvbnRhaW5lclwiXHJcblxyXG5sZXQgTGF5ZXIgPSBQSVhJLmRpc3BsYXkuTGF5ZXI7XHJcbmxldCBHcm91cCA9IFBJWEkuZGlzcGxheS5Hcm91cDtcclxubGV0IFN0YWdlID0gUElYSS5kaXNwbGF5LlN0YWdlO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE9HUGFyc2VyKCl7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIChyZXNvdXJjZSwgbmV4dCkge1xyXG5cdFx0Ly9mYWxsYmFjayBcclxuXHRcdFxyXG4gICAgICAgIGlmICghcmVzb3VyY2UuZGF0YSB8fCAhKHJlc291cmNlLmRhdGEudHlwZSAhPT0gdW5kZWZpbmVkICYmIHJlc291cmNlLmRhdGEudHlwZSA9PSAnbWFwJykpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRpbGVkIE9HIGltcG9ydGVyIVxcbiBlWHBvbmVudGEge3JvbmRvLmRldmlsW2FdZ21haWwuY29tfVwiKTtcclxuICAgICAgICBsZXQgX2RhdGEgPSByZXNvdXJjZS5kYXRhOyBcclxuICAgICAgICBsZXQgX3N0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgIF9zdGFnZS5sYXllckhlaWdodCA9IF9kYXRhLmhlaWdodDtcclxuICAgICAgICBfc3RhZ2UubGF5ZXJXaWR0aCA9IF9kYXRhLndpZHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGJhc2VVcmwgPSByZXNvdXJjZS51cmwucmVwbGFjZSh0aGlzLmJhc2VVcmwsXCJcIik7XHJcbiAgICAgICAgbGV0IGxhc3RJbmRleE9mID0gYmFzZVVybC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYobGFzdEluZGV4T2YgPT0gLTEpXHJcbiAgICAgICAgXHRsYXN0SW5kZXhPZiA9IGJhc2VVcmwubGFzdEluZGV4T2YoXCJcXFxcXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGxhc3RJbmRleE9mID09IC0xIClcclxuICAgIFx0e1xyXG4gICAgXHRcdGNvbnNvbGUubG9nKFwiQ2FuJ3QgcGFyc2U6XCIgKyBiYXNlVXJsKTtcclxuICAgIFx0XHRuZXh0KCk7XHJcbiAgICBcdFx0cmV0dXJuO1xyXG4gICAgXHR9XHJcblxyXG4gICAgICAgIGJhc2VVcmwgPSBiYXNlVXJsLnN1YnN0cmluZygwLCBsYXN0SW5kZXhPZik7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZyhcIkRpciB1cmw6XCIgKyBiYXNlVXJsKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGxvYWRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogcmVzb3VyY2UuY3Jvc3NPcmlnaW4sXHJcbiAgICAgICAgICAgIGxvYWRUeXBlOiBQSVhJLmxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLFxyXG4gICAgICAgICAgICBwYXJlbnRSZXNvdXJjZTogcmVzb3VyY2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0NoZWNrIFRpbGVyIE1hcCB0eXBlXHJcbiAgICAgICAvLyBpZihfZGF0YS50eXBlICE9PSB1bmRlZmluZWQgJiYgX2RhdGEudHlwZSA9PSAnbWFwJylcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIFx0aWYoX2RhdGEubGF5ZXJzKSBcclxuICAgICAgICBcdHtcclxuICAgICAgICBcdFx0Zm9yKGxldCBpID0gMDsgaSA8IF9kYXRhLmxheWVycy5sZW5ndGg7IGkrKylcclxuICAgICAgICBcdFx0e1xyXG4gICAgICAgIFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdGxldCBfbCA9IF9kYXRhLmxheWVyc1tpXTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRpZihfbC50eXBlICE9PSBcIm9iamVjdGdyb3VwXCIgJiYgX2wudHlwZSAhPT0gXCJpbWFnZWxheWVyXCIpXHJcbiAgICAgICAgXHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiT0dQYXJzZXIgc3VwcG9ydCBvbmx5IE9CSkVDVCBvciBJTUFHRSBsYXllcyEhXCIpO1xyXG4gICAgICAgIFx0XHRcdFx0Ly9uZXh0KCk7XHJcbiAgICAgICAgXHRcdFx0XHQvL3JldHVybjtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0aWYoX2wucHJvcGVydGllcyAmJiAoX2wucHJvcGVydGllcy5pZ25vcmUgfHwgX2wucHJvcGVydGllcy5pZ25vcmVMb2FkKSl7XHJcblxyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coXCJPR1BhcnNlcjogaWdub3JlIGxvYWRpbmcgbGF5ZXI6XCIgKyBfbC5uYW1lKTtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0XHJcbiAgICAgICAgXHRcdFx0bGV0IF9ncm91cCA9IG5ldyBHcm91cCggX2wucHJvcGVydGllcyA/IChfbC5wcm9wZXJ0aWVzLnpPcmRlciB8fCBpKSA6IGksIHRydWUpO1xyXG4gICAgICAgIFx0XHRcdGxldCBfbGF5ZXIgPSBuZXcgTGF5ZXIoX2dyb3VwKTtcclxuICAgICAgICBcdFx0XHRfbGF5ZXIubmFtZSA9IF9sLm5hbWU7XHJcbiAgICAgICAgXHRcdFx0X3N0YWdlW19sLm5hbWVdID0gX2xheWVyO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci52aXNpYmxlID0gX2wudmlzaWJsZTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRfbGF5ZXIucG9zaXRpb24uc2V0KF9sLngsIF9sLnkpO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci5hbHBoYSA9IF9sLm9wYWNpdHkgfHwgMTtcclxuXHJcbiAgICAgICAgXHRcdFx0X3N0YWdlLmFkZENoaWxkKF9sYXllcik7XHJcbiAgICAgICAgXHRcdFx0aWYoX2wudHlwZSA9PSBcImltYWdlbGF5ZXJcIil7XHJcblx0ICAgICAgICBcdFx0XHRfbC5vYmplY3RzID0gW1xyXG5cdCAgICAgICAgXHRcdFx0XHR7XHJcblx0ICAgICAgICBcdFx0XHRcdFx0aW1hZ2U6IF9sLmltYWdlLFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdG5hbWU6IF9sLm5hbWUsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eDogX2wueCAsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eTogX2wueSArIF9zdGFnZS5sYXllckhlaWdodCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL3dpZHRoOiBfbC53aWR0aCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL2hlaWdodDogX2wuaGVpZ2h0LFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdHByb3BlcnRpZXM6IF9sLnByb3BlcnRpZXMsXHJcblx0ICAgICAgICBcdFx0XHRcdH1cclxuXHQgICAgICAgIFx0XHRcdF07XHJcbiAgICAgICAgXHRcdFx0fVxyXG5cclxuICAgICAgICBcdFx0XHRpZihfbC5vYmplY3RzKSBcclxuICAgICAgICBcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IF9sLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgXHRcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX28gPSBfbC5vYmplY3RzW2pdO1xyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX29iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgXHRcdFx0XHRcdGlmKCFfby5uYW1lIHx8IF9vLm5hbWUgPT0gXCJcIilcclxuICAgICAgICBcdFx0XHRcdFx0XHRfby5uYW1lID0gXCJvYmpfXCIgKyBqO1xyXG4gICAgICAgIFx0XHRcdFx0XHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfaXNDb250YWluZXIgPSAhKF9vLmdpZCB8fCBfby5pbWFnZSkgfHwgKF9vLnByb3BlcnRpZXMgJiYgX28ucHJvcGVydGllcy5jb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9pc1RleHQgPSBfby50ZXh0ICE9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfaXNJbWFnZSA9IChfZGF0YS50aWxlc2V0cyAmJiBfZGF0YS50aWxlc2V0cy5sZW5ndGggPiAwKSAmJiAhX2lzQ29udGFpbmVyICYmICFfaXNUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW1hZ2UgTG9hZGVyXHJcblx0XHRcdFx0XHRcdFx0aWYoX2lzSW1hZ2UpXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIV9vLmltYWdlKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIF90cyA9IHVuZGVmaW5lZDsgLy9fZGF0YS50aWxlc2V0c1swXTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IF9kYXRhLnRpbGVzZXRzLmxlbmd0aDsgaSArKyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYoX2RhdGEudGlsZXNldHNbaV0uZmlyc3RnaWQgPD0gX28uZ2lkKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdF90cyA9IF9kYXRhLnRpbGVzZXRzW2ldO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYoIV90cyl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJJbWFnZSB3aXRoIGdpZDpcIiArIF9vLmdpZCArIFwiIG5vdCBmb3VuZCFcIik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udGludWU7O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgX3JlYWxHaWQgPSBfby5naWQgLSBfdHMuZmlyc3RnaWQ7XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRsZXQgX2ltZyA9IF90cy50aWxlc1tcIlwiICsgX3JlYWxHaWRdO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRfby51cmwgPSAgYmFzZVVybCArIFwiL1wiICsgX2ltZy5pbWFnZTtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdFxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0aWYoIV9pbWcpe1xyXG5cclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdFx0Y29uc29sZS5sb2coXCJMb2FkIHJlcyBNSVNTRUQgZ2lkOlwiICsgX3JlYWxHaWQgKyBcIiB1cmw6XCIgKyB1cmwpO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdH1cclxuXHRcdFx0XHRcdCAgICAgICAgXHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdF9vLnVybCA9ICBiYXNlVXJsICsgXCIvXCIgKyBfby5pbWFnZTtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdCBcclxuXHRcdFx0XHRcdCAgICAgICAgXHR9XHJcblx0XHRcdFx0XHQgICAgICAgIFx0XHJcblx0XHRcdFx0XHQgICAgICAgIFx0Ly9TcHJpdGUgTG9hZGVyXHJcblx0XHRcdFx0XHQgICAgICAgIFx0X29iaiA9IENTcHJpdGUoX28pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gVGV4dExvYWRlclxyXG5cdFx0XHRcdFx0XHRcdGlmKF9pc1RleHQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdF9vYmogPSBDVGV4dChfbyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoX2lzQ29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfb2JqID0gQ0NvbnRhaW5lcihfbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0XHRcdFx0aWYoX29iail7XHJcblx0XHRcdFx0XHRcdFx0XHRfb2JqLnBhcmVudEdyb3VwID0gX2xheWVyLmdyb3VwO1xyXG5cdFx0XHRcdFx0XHRcdFx0X3N0YWdlLmFkZENoaWxkKF9vYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvdXJjZS5zdGFnZSA9IF9zdGFnZTtcclxuXHJcblx0XHQvLyBjYWxsIG5leHQgbG9hZGVyXHJcblx0XHRuZXh0KCk7XHJcblxyXG5cdH07XHJcbn1cclxuIiwiaW1wb3J0IE9HUGFyc2VyIGZyb20gXCIuL09HUGFyc2VyXCJcclxuXHJcblBJWEkubG9hZGVycy5Mb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoT0dQYXJzZXIpO1xyXG5QSVhJLmxvYWRlci51c2UoT0dQYXJzZXIoKSk7XHJcbi8vIG5vdGhpbmcgdG8gZXhwb3J0XHJcbiIsImltcG9ydCBcIi4vUGl4aUhlbHBlclwiO1xyXG5cclxuaW1wb3J0IF9CYXNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL0Jhc2VMYXllclwiXHJcbmltcG9ydCBfU2xpY2VTdGFnZUNyZWF0ZXIgZnJvbSBcIi4vU2xpY2VMYXllclwiXHJcblxyXG5pbXBvcnQgXCIuL1RpbGVkT0dMb2FkZXIvVGlsZWRPYmpHcm91cExvYWRlclwiXHJcbmltcG9ydCBcIi4vRHJhZ29uQm9uZUxvYWRlclwiO1xyXG5cclxuXHJcbnZhciBfQXBwID0gbnVsbCxcclxuICBfTFJlcyA9IG51bGwsXHJcbiAgLy9fUmVuZGVyZXIgPSBudWxsLFxyXG4gIC8vX0ludE1hbmFnZXIgPSBudWxsLFxyXG4gIF9TbGljZWRTdGFnZSA9IG51bGw7XHJcblxyXG52YXIgSW5pdCA9IGZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgX0FwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHtcclxuICAgIHdpZHRoOiAxOTIwLFxyXG4gICAgaGVpZ2h0OiAxMDgwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweGZmZmZmZlxyXG4gIH0pO1xyXG5cclxuICAvL9Ci0LDQuiDQvdCw0LTQviwg0YHRgtCw0L3QtNCw0YDRgtC90YvQtSDQvdC1INCx0YPQtNGD0YIg0L7RgtC+0LHRgNCw0LbQsNGC0YHRj1xyXG4gIF9BcHAuc3RhZ2UgPSBuZXcgUElYSS5kaXNwbGF5LlN0YWdlKCk7XHJcblxyXG4gIF9MUmVzID0gX0FwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG4gIHdpbmRvdy5fTFJlcyA9IF9MUmVzO1xyXG5cclxuLy8gIF9JbnRNYW5hZ2VyID0gX0FwcC5yZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uO1xyXG4gIFxyXG4gIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dhbWVfY29udGFpbmVyXCIpO1xyXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChfQXBwLnZpZXcpO1xyXG4gIG9uUmVzaXplKCk7XHJcbiAgd2luZG93Lm9ucmVzaXplID0gb25SZXNpemU7XHJcblxyXG4gIF9CYXNlU3RhZ2VDcmVhdGVyKF9BcHApO1xyXG4vLyAgX0FwcC5zdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICBcclxufTtcclxuXHJcbi8vaW52b2tlZCBhZnRlciBsb2FkaW5nIGdhbWUgcmVzb3VyY2VzXHJcbnZhciBHYW1lTG9hZGVkID0gZnVuY3Rpb24gR2FtZUxvYWRlZCgpIHtcclxuICBjb25zb2xlLmxvZyhcIkdhbWUgaXMgbG9hZGVkXCIpO1xyXG5cclxuICBfU2xpY2VkU3RhZ2UgPSAgX1NsaWNlU3RhZ2VDcmVhdGVyKF9BcHApOyAvL19MUmVzLnNsaWNlX2pzLmZ1bmN0aW9uKF9BcHApO1xyXG5cclxuICBfQXBwLnN0YWdlLmFkZENoaWxkKF9TbGljZWRTdGFnZSk7XHJcblxyXG4gIF9BcHAuTG9hZFN0YWdlLmRlc3Ryb3koKTtcclxufTtcclxuXHJcbnZhciBMb2FkR2FtZSA9IGZ1bmN0aW9uIExvYWRHYW1lKCkge1xyXG4gIHZhciBsb2FkZXIgPSBfQXBwLmxvYWRlcjtcclxuXHJcbiAgbG9hZGVyXHJcbiAgICAuYWRkKFwiYmxhZGVfdGV4XCIsIFwiLi9zcmMvaW1hZ2VzL2JsYWRlLnBuZ1wiKVxyXG4gICAgLmFkZChcImJ1bm55XCIsIFwiLi9zcmMvaW1hZ2VzL2J1bm55X3NzLmpzb25cIilcclxuICAgIC5sb2FkKGZ1bmN0aW9uKGwsIHJlcykge1xyXG5cclxuICAgICAgR2FtZUxvYWRlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gIGNvbnNvbGUubG9nKFwiR2FtZSBzdGFydCBsb2FkXCIpO1xyXG59O1xyXG5cclxuLy8gcmVzaXplXHJcbnZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uIG9uUmVzaXplKGV2ZW50KSB7XHJcbiAgdmFyIF93ID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuICB2YXIgX2ggPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcclxuXHJcbiAgaWYgKF93IC8gX2ggPCAxNiAvIDkpIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF93ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF93ICogOSAvIDE2ICsgXCJweFwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUud2lkdGggPSBfaCAqIDE2IC8gOSArIFwicHhcIjtcclxuICAgIF9BcHAudmlldy5zdHlsZS5oZWlnaHQgPSBfaCArIFwicHhcIjtcclxuICB9XHJcbn07XHJcblxyXG53aW5kb3cuTG9hZEdhbWUgPSBMb2FkR2FtZTtcclxud2luZG93Lm9ubG9hZCA9IEluaXQ7Il19
