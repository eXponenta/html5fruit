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

		App.loader.add("flag_ske", "./src/anims/flag/flag_ske.json").add("obj_ske", "./src/anims/obj/objAnims_ske.json").load(function (l, res) {

			//res.obj_ske.onLoad.add( x => {

			var x = {};
			x.orange = res.obj_ske.objects.orange.create();
			_baseStage.addChild(x.orange);
			x.orange.position.set(100, 100);
			x.orange.animation.play("idle");
			x.orange.interactive = true;

			var _state_show = null;
			x.orange.on("pointerover", function () {
				_state_show = x.orange.animation.fadeIn("show", 0.2, 1);
			});

			x.orange.on("pointerout", function () {
				x.orange.animation.fadeIn("idle", 0.2, 1);
			});
			//});

			//if(res.flag_ske.onLoad){

			//res.flag_ske.onLoad.add( x => {

			if (!x.instance) {
				x.Flag = res.flag_ske.objects.Flag.create();
			}
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

			//	});
			//}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsIm5vZGVfbW9kdWxlcy9zaWduYWxzL2Rpc3Qvc2lnbmFscy5qcyIsInNyY1xcc2NyaXB0c1xcQmFzZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxCbGFkZS5qcyIsInNyY1xcc2NyaXB0c1xcc3JjXFxzY3JpcHRzXFxEcmFnb25Cb25lTG9hZGVyLmpzIiwic3JjXFxzY3JpcHRzXFxQaXhpSGVscGVyLmpzIiwic3JjXFxzY3JpcHRzXFxTbGljYWJsZU9iamVjdC5qcyIsInNyY1xcc2NyaXB0c1xcU2xpY2VMYXllci5qcyIsInNyY1xcc2NyaXB0c1xcU3RhcnRMYXllci5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcQ29sb3JQYXJzZXIuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXENvbnN0cnVjdG9yU3ByaXRlLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxDb25zdHJ1Y3RvclRleHQuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXE9HUGFyc2VyLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxUaWxlZE9iakdyb3VwTG9hZGVyLmpzIiwic3JjXFxzY3JpcHRzXFxjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LEdBRkgsQ0FFTyxPQUZQLEVBRWdCLDRCQUZoQixFQUdHLElBSEgsQ0FHUSxVQUFTLENBQVQsRUFBWSxHQUFaLEVBQWlCOztBQUVyQjtBQUNELEdBTkg7O0FBUUEsVUFBUSxHQUFSLENBQVksaUJBQVo7QUFDRCxDQVpEOztBQWNBO0FBQ0EsSUFBSSxXQUFXLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QjtBQUN0QyxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsV0FBdkI7QUFDQSxNQUFJLEtBQUssU0FBUyxJQUFULENBQWMsWUFBdkI7O0FBRUEsTUFBSSxLQUFLLEVBQUwsR0FBVSxLQUFLLENBQW5CLEVBQXNCO0FBQ3BCLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsS0FBaEIsR0FBd0IsS0FBSyxJQUE3QjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsS0FBSyxDQUFMLEdBQVMsRUFBVCxHQUFjLElBQXZDO0FBQ0QsR0FIRCxNQUdPO0FBQ0wsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixLQUFoQixHQUF3QixLQUFLLEVBQUwsR0FBVSxDQUFWLEdBQWMsSUFBdEM7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLE1BQWhCLEdBQXlCLEtBQUssSUFBOUI7QUFDRDtBQUNGLENBWEQ7O0FBYUEsT0FBTyxRQUFQLEdBQWtCLFFBQWxCO0FBQ0EsT0FBTyxNQUFQLEdBQWdCLElBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQHBpeGkvZmlsdGVyLWRyb3Atc2hhZG93IC0gdjIuMy4xXG4gKiBDb21waWxlZCBXZWQsIDI5IE5vdiAyMDE3IDE2OjQ1OjE5IFVUQ1xuICpcbiAqIHBpeGktZmlsdGVycyBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXG4gKi9cbiFmdW5jdGlvbih0LGUpe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP2UoZXhwb3J0cyk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJleHBvcnRzXCJdLGUpOmUodC5fX2ZpbHRlcl9kcm9wX3NoYWRvdz17fSl9KHRoaXMsZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9XCJhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIscj1cInZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgYWxwaGE7XFxudW5pZm9ybSB2ZWMzIGNvbG9yO1xcbnZvaWQgbWFpbih2b2lkKXtcXG4gICAgdmVjNCBzYW1wbGUgPSB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpO1xcblxcbiAgICAvLyBVbi1wcmVtdWx0aXBseSBhbHBoYSBiZWZvcmUgYXBwbHlpbmcgdGhlIGNvbG9yXFxuICAgIGlmIChzYW1wbGUuYSA+IDAuMCkge1xcbiAgICAgICAgc2FtcGxlLnJnYiAvPSBzYW1wbGUuYTtcXG4gICAgfVxcblxcbiAgICAvLyBQcmVtdWx0aXBseSBhbHBoYSBhZ2FpblxcbiAgICBzYW1wbGUucmdiID0gY29sb3IucmdiICogc2FtcGxlLmE7XFxuXFxuICAgIC8vIGFscGhhIHVzZXIgYWxwaGFcXG4gICAgc2FtcGxlICo9IGFscGhhO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSBzYW1wbGU7XFxufVwiLGk9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gaShpLG4sbyxhLGwpe3ZvaWQgMD09PWkmJihpPTQ1KSx2b2lkIDA9PT1uJiYobj01KSx2b2lkIDA9PT1vJiYobz0yKSx2b2lkIDA9PT1hJiYoYT0wKSx2b2lkIDA9PT1sJiYobD0uNSksdC5jYWxsKHRoaXMpLHRoaXMudGludEZpbHRlcj1uZXcgUElYSS5GaWx0ZXIoZSxyKSx0aGlzLmJsdXJGaWx0ZXI9bmV3IFBJWEkuZmlsdGVycy5CbHVyRmlsdGVyLHRoaXMuYmx1ckZpbHRlci5ibHVyPW8sdGhpcy50YXJnZXRUcmFuc2Zvcm09bmV3IFBJWEkuTWF0cml4LHRoaXMucm90YXRpb249aSx0aGlzLnBhZGRpbmc9bix0aGlzLmRpc3RhbmNlPW4sdGhpcy5hbHBoYT1sLHRoaXMuY29sb3I9YX10JiYoaS5fX3Byb3RvX189dCksKGkucHJvdG90eXBlPU9iamVjdC5jcmVhdGUodCYmdC5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1pO3ZhciBuPXtkaXN0YW5jZTp7Y29uZmlndXJhYmxlOiEwfSxyb3RhdGlvbjp7Y29uZmlndXJhYmxlOiEwfSxibHVyOntjb25maWd1cmFibGU6ITB9LGFscGhhOntjb25maWd1cmFibGU6ITB9LGNvbG9yOntjb25maWd1cmFibGU6ITB9fTtyZXR1cm4gaS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24odCxlLHIsaSl7dmFyIG49dC5nZXRSZW5kZXJUYXJnZXQoKTtuLnRyYW5zZm9ybT10aGlzLnRhcmdldFRyYW5zZm9ybSx0aGlzLnRpbnRGaWx0ZXIuYXBwbHkodCxlLG4sITApLHRoaXMuYmx1ckZpbHRlci5hcHBseSh0LG4sciksdC5hcHBseUZpbHRlcih0aGlzLGUscixpKSxuLnRyYW5zZm9ybT1udWxsLHQucmV0dXJuUmVuZGVyVGFyZ2V0KG4pfSxpLnByb3RvdHlwZS5fdXBkYXRlUGFkZGluZz1mdW5jdGlvbigpe3RoaXMucGFkZGluZz10aGlzLmRpc3RhbmNlKzIqdGhpcy5ibHVyfSxpLnByb3RvdHlwZS5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtPWZ1bmN0aW9uKCl7dGhpcy50YXJnZXRUcmFuc2Zvcm0udHg9dGhpcy5kaXN0YW5jZSpNYXRoLmNvcyh0aGlzLmFuZ2xlKSx0aGlzLnRhcmdldFRyYW5zZm9ybS50eT10aGlzLmRpc3RhbmNlKk1hdGguc2luKHRoaXMuYW5nbGUpfSxuLmRpc3RhbmNlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9kaXN0YW5jZX0sbi5kaXN0YW5jZS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5fZGlzdGFuY2U9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCksdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4ucm90YXRpb24uZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYW5nbGUvUElYSS5ERUdfVE9fUkFEfSxuLnJvdGF0aW9uLnNldD1mdW5jdGlvbih0KXt0aGlzLmFuZ2xlPXQqUElYSS5ERUdfVE9fUkFELHRoaXMuX3VwZGF0ZVRhcmdldFRyYW5zZm9ybSgpfSxuLmJsdXIuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmx1ckZpbHRlci5ibHVyfSxuLmJsdXIuc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYmx1ckZpbHRlci5ibHVyPXQsdGhpcy5fdXBkYXRlUGFkZGluZygpfSxuLmFscGhhLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuYWxwaGF9LG4uYWxwaGEuc2V0PWZ1bmN0aW9uKHQpe3RoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYT10fSxuLmNvbG9yLmdldD1mdW5jdGlvbigpe3JldHVybiBQSVhJLnV0aWxzLnJnYjJoZXgodGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sbi5jb2xvci5zZXQ9ZnVuY3Rpb24odCl7UElYSS51dGlscy5oZXgycmdiKHQsdGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmNvbG9yKX0sT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaS5wcm90b3R5cGUsbiksaX0oUElYSS5GaWx0ZXIpO1BJWEkuZmlsdGVycy5Ecm9wU2hhZG93RmlsdGVyPWksdC5Ecm9wU2hhZG93RmlsdGVyPWksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci1kcm9wLXNoYWRvdy5qcy5tYXBcbiIsIi8qanNsaW50IG9uZXZhcjp0cnVlLCB1bmRlZjp0cnVlLCBuZXdjYXA6dHJ1ZSwgcmVnZXhwOnRydWUsIGJpdHdpc2U6dHJ1ZSwgbWF4ZXJyOjUwLCBpbmRlbnQ6NCwgd2hpdGU6ZmFsc2UsIG5vbWVuOmZhbHNlLCBwbHVzcGx1czpmYWxzZSAqL1xuLypnbG9iYWwgZGVmaW5lOmZhbHNlLCByZXF1aXJlOmZhbHNlLCBleHBvcnRzOmZhbHNlLCBtb2R1bGU6ZmFsc2UsIHNpZ25hbHM6ZmFsc2UgKi9cblxuLyoqIEBsaWNlbnNlXG4gKiBKUyBTaWduYWxzIDxodHRwOi8vbWlsbGVybWVkZWlyb3MuZ2l0aHViLmNvbS9qcy1zaWduYWxzLz5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogQXV0aG9yOiBNaWxsZXIgTWVkZWlyb3NcbiAqIFZlcnNpb246IDEuMC4wIC0gQnVpbGQ6IDI2OCAoMjAxMi8xMS8yOSAwNTo0OCBQTSlcbiAqL1xuXG4oZnVuY3Rpb24oZ2xvYmFsKXtcblxuICAgIC8vIFNpZ25hbEJpbmRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLyoqXG4gICAgICogT2JqZWN0IHRoYXQgcmVwcmVzZW50cyBhIGJpbmRpbmcgYmV0d2VlbiBhIFNpZ25hbCBhbmQgYSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAgICAgKiA8YnIgLz4tIDxzdHJvbmc+VGhpcyBpcyBhbiBpbnRlcm5hbCBjb25zdHJ1Y3RvciBhbmQgc2hvdWxkbid0IGJlIGNhbGxlZCBieSByZWd1bGFyIHVzZXJzLjwvc3Ryb25nPlxuICAgICAqIDxiciAvPi0gaW5zcGlyZWQgYnkgSm9hIEViZXJ0IEFTMyBTaWduYWxCaW5kaW5nIGFuZCBSb2JlcnQgUGVubmVyJ3MgU2xvdCBjbGFzc2VzLlxuICAgICAqIEBhdXRob3IgTWlsbGVyIE1lZGVpcm9zXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQGludGVybmFsXG4gICAgICogQG5hbWUgU2lnbmFsQmluZGluZ1xuICAgICAqIEBwYXJhbSB7U2lnbmFsfSBzaWduYWwgUmVmZXJlbmNlIHRvIFNpZ25hbCBvYmplY3QgdGhhdCBsaXN0ZW5lciBpcyBjdXJyZW50bHkgYm91bmQgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgSGFuZGxlciBmdW5jdGlvbiBib3VuZCB0byB0aGUgc2lnbmFsLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNPbmNlIElmIGJpbmRpbmcgc2hvdWxkIGJlIGV4ZWN1dGVkIGp1c3Qgb25jZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2xpc3RlbmVyQ29udGV4dF0gQ29udGV4dCBvbiB3aGljaCBsaXN0ZW5lciB3aWxsIGJlIGV4ZWN1dGVkIChvYmplY3QgdGhhdCBzaG91bGQgcmVwcmVzZW50IHRoZSBgdGhpc2AgdmFyaWFibGUgaW5zaWRlIGxpc3RlbmVyIGZ1bmN0aW9uKS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ByaW9yaXR5XSBUaGUgcHJpb3JpdHkgbGV2ZWwgb2YgdGhlIGV2ZW50IGxpc3RlbmVyLiAoZGVmYXVsdCA9IDApLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFNpZ25hbEJpbmRpbmcoc2lnbmFsLCBsaXN0ZW5lciwgaXNPbmNlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXIgZnVuY3Rpb24gYm91bmQgdG8gdGhlIHNpZ25hbC5cbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gbGlzdGVuZXI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGJpbmRpbmcgc2hvdWxkIGJlIGV4ZWN1dGVkIGp1c3Qgb25jZS5cbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNPbmNlID0gaXNPbmNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb250ZXh0IG9uIHdoaWNoIGxpc3RlbmVyIHdpbGwgYmUgZXhlY3V0ZWQgKG9iamVjdCB0aGF0IHNob3VsZCByZXByZXNlbnQgdGhlIGB0aGlzYCB2YXJpYWJsZSBpbnNpZGUgbGlzdGVuZXIgZnVuY3Rpb24pLlxuICAgICAgICAgKiBAbWVtYmVyT2YgU2lnbmFsQmluZGluZy5wcm90b3R5cGVcbiAgICAgICAgICogQG5hbWUgY29udGV4dFxuICAgICAgICAgKiBAdHlwZSBPYmplY3R8dW5kZWZpbmVkfG51bGxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGxpc3RlbmVyQ29udGV4dDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVmZXJlbmNlIHRvIFNpZ25hbCBvYmplY3QgdGhhdCBsaXN0ZW5lciBpcyBjdXJyZW50bHkgYm91bmQgdG8uXG4gICAgICAgICAqIEB0eXBlIFNpZ25hbFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fc2lnbmFsID0gc2lnbmFsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMaXN0ZW5lciBwcmlvcml0eVxuICAgICAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3ByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcbiAgICB9XG5cbiAgICBTaWduYWxCaW5kaW5nLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYmluZGluZyBpcyBhY3RpdmUgYW5kIHNob3VsZCBiZSBleGVjdXRlZC5cbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKi9cbiAgICAgICAgYWN0aXZlIDogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBwYXJhbWV0ZXJzIHBhc3NlZCB0byBsaXN0ZW5lciBkdXJpbmcgYFNpZ25hbC5kaXNwYXRjaGAgYW5kIGBTaWduYWxCaW5kaW5nLmV4ZWN1dGVgLiAoY3VycmllZCBwYXJhbWV0ZXJzKVxuICAgICAgICAgKiBAdHlwZSBBcnJheXxudWxsXG4gICAgICAgICAqL1xuICAgICAgICBwYXJhbXMgOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWxsIGxpc3RlbmVyIHBhc3NpbmcgYXJiaXRyYXJ5IHBhcmFtZXRlcnMuXG4gICAgICAgICAqIDxwPklmIGJpbmRpbmcgd2FzIGFkZGVkIHVzaW5nIGBTaWduYWwuYWRkT25jZSgpYCBpdCB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZCBmcm9tIHNpZ25hbCBkaXNwYXRjaCBxdWV1ZSwgdGhpcyBtZXRob2QgaXMgdXNlZCBpbnRlcm5hbGx5IGZvciB0aGUgc2lnbmFsIGRpc3BhdGNoLjwvcD5cbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gW3BhcmFtc0Fycl0gQXJyYXkgb2YgcGFyYW1ldGVycyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIGxpc3RlbmVyXG4gICAgICAgICAqIEByZXR1cm4geyp9IFZhbHVlIHJldHVybmVkIGJ5IHRoZSBsaXN0ZW5lci5cbiAgICAgICAgICovXG4gICAgICAgIGV4ZWN1dGUgOiBmdW5jdGlvbiAocGFyYW1zQXJyKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlclJldHVybiwgcGFyYW1zO1xuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlICYmICEhdGhpcy5fbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB0aGlzLnBhcmFtcz8gdGhpcy5wYXJhbXMuY29uY2F0KHBhcmFtc0FycikgOiBwYXJhbXNBcnI7XG4gICAgICAgICAgICAgICAgaGFuZGxlclJldHVybiA9IHRoaXMuX2xpc3RlbmVyLmFwcGx5KHRoaXMuY29udGV4dCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJSZXR1cm47XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGFjaCBiaW5kaW5nIGZyb20gc2lnbmFsLlxuICAgICAgICAgKiAtIGFsaWFzIHRvOiBteVNpZ25hbC5yZW1vdmUobXlCaW5kaW5nLmdldExpc3RlbmVyKCkpO1xuICAgICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbnxudWxsfSBIYW5kbGVyIGZ1bmN0aW9uIGJvdW5kIHRvIHRoZSBzaWduYWwgb3IgYG51bGxgIGlmIGJpbmRpbmcgd2FzIHByZXZpb3VzbHkgZGV0YWNoZWQuXG4gICAgICAgICAqL1xuICAgICAgICBkZXRhY2ggOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0JvdW5kKCk/IHRoaXMuX3NpZ25hbC5yZW1vdmUodGhpcy5fbGlzdGVuZXIsIHRoaXMuY29udGV4dCkgOiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYmluZGluZyBpcyBzdGlsbCBib3VuZCB0byB0aGUgc2lnbmFsIGFuZCBoYXZlIGEgbGlzdGVuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBpc0JvdW5kIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICghIXRoaXMuX3NpZ25hbCAmJiAhIXRoaXMuX2xpc3RlbmVyKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gSWYgU2lnbmFsQmluZGluZyB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb25jZS5cbiAgICAgICAgICovXG4gICAgICAgIGlzT25jZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc09uY2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBIYW5kbGVyIGZ1bmN0aW9uIGJvdW5kIHRvIHRoZSBzaWduYWwuXG4gICAgICAgICAqL1xuICAgICAgICBnZXRMaXN0ZW5lciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7U2lnbmFsfSBTaWduYWwgdGhhdCBsaXN0ZW5lciBpcyBjdXJyZW50bHkgYm91bmQgdG8uXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTaWduYWwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2lnbmFsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgaW5zdGFuY2UgcHJvcGVydGllc1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2Rlc3Ryb3kgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fc2lnbmFsO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHRvU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdbU2lnbmFsQmluZGluZyBpc09uY2U6JyArIHRoaXMuX2lzT25jZSArJywgaXNCb3VuZDonKyB0aGlzLmlzQm91bmQoKSArJywgYWN0aXZlOicgKyB0aGlzLmFjdGl2ZSArICddJztcbiAgICAgICAgfVxuXG4gICAgfTtcblxuXG4vKmdsb2JhbCBTaWduYWxCaW5kaW5nOmZhbHNlKi9cblxuICAgIC8vIFNpZ25hbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVMaXN0ZW5lcihsaXN0ZW5lciwgZm5OYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggJ2xpc3RlbmVyIGlzIGEgcmVxdWlyZWQgcGFyYW0gb2Yge2ZufSgpIGFuZCBzaG91bGQgYmUgYSBGdW5jdGlvbi4nLnJlcGxhY2UoJ3tmbn0nLCBmbk5hbWUpICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDdXN0b20gZXZlbnQgYnJvYWRjYXN0ZXJcbiAgICAgKiA8YnIgLz4tIGluc3BpcmVkIGJ5IFJvYmVydCBQZW5uZXIncyBBUzMgU2lnbmFscy5cbiAgICAgKiBAbmFtZSBTaWduYWxcbiAgICAgKiBAYXV0aG9yIE1pbGxlciBNZWRlaXJvc1xuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFNpZ25hbCgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIEFycmF5LjxTaWduYWxCaW5kaW5nPlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fYmluZGluZ3MgPSBbXTtcbiAgICAgICAgdGhpcy5fcHJldlBhcmFtcyA9IG51bGw7XG5cbiAgICAgICAgLy8gZW5mb3JjZSBkaXNwYXRjaCB0byBhd2F5cyB3b3JrIG9uIHNhbWUgY29udGV4dCAoIzQ3KVxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2ggPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgU2lnbmFsLnByb3RvdHlwZS5kaXNwYXRjaC5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIFNpZ25hbC5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNpZ25hbHMgVmVyc2lvbiBOdW1iZXJcbiAgICAgICAgICogQHR5cGUgU3RyaW5nXG4gICAgICAgICAqIEBjb25zdFxuICAgICAgICAgKi9cbiAgICAgICAgVkVSU0lPTiA6ICcxLjAuMCcsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIFNpZ25hbCBzaG91bGQga2VlcCByZWNvcmQgb2YgcHJldmlvdXNseSBkaXNwYXRjaGVkIHBhcmFtZXRlcnMgYW5kXG4gICAgICAgICAqIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSBsaXN0ZW5lciBkdXJpbmcgYGFkZCgpYC9gYWRkT25jZSgpYCBpZiBTaWduYWwgd2FzXG4gICAgICAgICAqIGFscmVhZHkgZGlzcGF0Y2hlZCBiZWZvcmUuXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICovXG4gICAgICAgIG1lbW9yaXplIDogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9zaG91bGRQcm9wYWdhdGUgOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBTaWduYWwgaXMgYWN0aXZlIGFuZCBzaG91bGQgYnJvYWRjYXN0IGV2ZW50cy5cbiAgICAgICAgICogPHA+PHN0cm9uZz5JTVBPUlRBTlQ6PC9zdHJvbmc+IFNldHRpbmcgdGhpcyBwcm9wZXJ0eSBkdXJpbmcgYSBkaXNwYXRjaCB3aWxsIG9ubHkgYWZmZWN0IHRoZSBuZXh0IGRpc3BhdGNoLCBpZiB5b3Ugd2FudCB0byBzdG9wIHRoZSBwcm9wYWdhdGlvbiBvZiBhIHNpZ25hbCB1c2UgYGhhbHQoKWAgaW5zdGVhZC48L3A+XG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICovXG4gICAgICAgIGFjdGl2ZSA6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNPbmNlXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbbGlzdGVuZXJDb250ZXh0XVxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ByaW9yaXR5XVxuICAgICAgICAgKiBAcmV0dXJuIHtTaWduYWxCaW5kaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX3JlZ2lzdGVyTGlzdGVuZXIgOiBmdW5jdGlvbiAobGlzdGVuZXIsIGlzT25jZSwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSkge1xuXG4gICAgICAgICAgICB2YXIgcHJldkluZGV4ID0gdGhpcy5faW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyLCBsaXN0ZW5lckNvbnRleHQpLFxuICAgICAgICAgICAgICAgIGJpbmRpbmc7XG5cbiAgICAgICAgICAgIGlmIChwcmV2SW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgYmluZGluZyA9IHRoaXMuX2JpbmRpbmdzW3ByZXZJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmcuaXNPbmNlKCkgIT09IGlzT25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW5ub3QgYWRkJysgKGlzT25jZT8gJycgOiAnT25jZScpICsnKCkgdGhlbiBhZGQnKyAoIWlzT25jZT8gJycgOiAnT25jZScpICsnKCkgdGhlIHNhbWUgbGlzdGVuZXIgd2l0aG91dCByZW1vdmluZyB0aGUgcmVsYXRpb25zaGlwIGZpcnN0LicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYmluZGluZyA9IG5ldyBTaWduYWxCaW5kaW5nKHRoaXMsIGxpc3RlbmVyLCBpc09uY2UsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FkZEJpbmRpbmcoYmluZGluZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMubWVtb3JpemUgJiYgdGhpcy5fcHJldlBhcmFtcyl7XG4gICAgICAgICAgICAgICAgYmluZGluZy5leGVjdXRlKHRoaXMuX3ByZXZQYXJhbXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYmluZGluZztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtTaWduYWxCaW5kaW5nfSBiaW5kaW5nXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfYWRkQmluZGluZyA6IGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgICAgICAvL3NpbXBsaWZpZWQgaW5zZXJ0aW9uIHNvcnRcbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoO1xuICAgICAgICAgICAgZG8geyAtLW47IH0gd2hpbGUgKHRoaXMuX2JpbmRpbmdzW25dICYmIGJpbmRpbmcuX3ByaW9yaXR5IDw9IHRoaXMuX2JpbmRpbmdzW25dLl9wcmlvcml0eSk7XG4gICAgICAgICAgICB0aGlzLl9iaW5kaW5ncy5zcGxpY2UobiArIDEsIDAsIGJpbmRpbmcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfaW5kZXhPZkxpc3RlbmVyIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuX2JpbmRpbmdzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBjdXI7XG4gICAgICAgICAgICB3aGlsZSAobi0tKSB7XG4gICAgICAgICAgICAgICAgY3VyID0gdGhpcy5fYmluZGluZ3Nbbl07XG4gICAgICAgICAgICAgICAgaWYgKGN1ci5fbGlzdGVuZXIgPT09IGxpc3RlbmVyICYmIGN1ci5jb250ZXh0ID09PSBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2sgaWYgbGlzdGVuZXIgd2FzIGF0dGFjaGVkIHRvIFNpZ25hbC5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XVxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBpZiBTaWduYWwgaGFzIHRoZSBzcGVjaWZpZWQgbGlzdGVuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBoYXMgOiBmdW5jdGlvbiAobGlzdGVuZXIsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmRleE9mTGlzdGVuZXIobGlzdGVuZXIsIGNvbnRleHQpICE9PSAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGEgbGlzdGVuZXIgdG8gdGhlIHNpZ25hbC5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgU2lnbmFsIGhhbmRsZXIgZnVuY3Rpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbbGlzdGVuZXJDb250ZXh0XSBDb250ZXh0IG9uIHdoaWNoIGxpc3RlbmVyIHdpbGwgYmUgZXhlY3V0ZWQgKG9iamVjdCB0aGF0IHNob3VsZCByZXByZXNlbnQgdGhlIGB0aGlzYCB2YXJpYWJsZSBpbnNpZGUgbGlzdGVuZXIgZnVuY3Rpb24pLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ByaW9yaXR5XSBUaGUgcHJpb3JpdHkgbGV2ZWwgb2YgdGhlIGV2ZW50IGxpc3RlbmVyLiBMaXN0ZW5lcnMgd2l0aCBoaWdoZXIgcHJpb3JpdHkgd2lsbCBiZSBleGVjdXRlZCBiZWZvcmUgbGlzdGVuZXJzIHdpdGggbG93ZXIgcHJpb3JpdHkuIExpc3RlbmVycyB3aXRoIHNhbWUgcHJpb3JpdHkgbGV2ZWwgd2lsbCBiZSBleGVjdXRlZCBhdCB0aGUgc2FtZSBvcmRlciBhcyB0aGV5IHdlcmUgYWRkZWQuIChkZWZhdWx0ID0gMClcbiAgICAgICAgICogQHJldHVybiB7U2lnbmFsQmluZGluZ30gQW4gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgYmluZGluZyBiZXR3ZWVuIHRoZSBTaWduYWwgYW5kIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgYWRkIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUxpc3RlbmVyKGxpc3RlbmVyLCAnYWRkJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lciwgZmFsc2UsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgbGlzdGVuZXIgdG8gdGhlIHNpZ25hbCB0aGF0IHNob3VsZCBiZSByZW1vdmVkIGFmdGVyIGZpcnN0IGV4ZWN1dGlvbiAod2lsbCBiZSBleGVjdXRlZCBvbmx5IG9uY2UpLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBTaWduYWwgaGFuZGxlciBmdW5jdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtsaXN0ZW5lckNvbnRleHRdIENvbnRleHQgb24gd2hpY2ggbGlzdGVuZXIgd2lsbCBiZSBleGVjdXRlZCAob2JqZWN0IHRoYXQgc2hvdWxkIHJlcHJlc2VudCB0aGUgYHRoaXNgIHZhcmlhYmxlIGluc2lkZSBsaXN0ZW5lciBmdW5jdGlvbikuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcHJpb3JpdHldIFRoZSBwcmlvcml0eSBsZXZlbCBvZiB0aGUgZXZlbnQgbGlzdGVuZXIuIExpc3RlbmVycyB3aXRoIGhpZ2hlciBwcmlvcml0eSB3aWxsIGJlIGV4ZWN1dGVkIGJlZm9yZSBsaXN0ZW5lcnMgd2l0aCBsb3dlciBwcmlvcml0eS4gTGlzdGVuZXJzIHdpdGggc2FtZSBwcmlvcml0eSBsZXZlbCB3aWxsIGJlIGV4ZWN1dGVkIGF0IHRoZSBzYW1lIG9yZGVyIGFzIHRoZXkgd2VyZSBhZGRlZC4gKGRlZmF1bHQgPSAwKVxuICAgICAgICAgKiBAcmV0dXJuIHtTaWduYWxCaW5kaW5nfSBBbiBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBiaW5kaW5nIGJldHdlZW4gdGhlIFNpZ25hbCBhbmQgbGlzdGVuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBhZGRPbmNlIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUxpc3RlbmVyKGxpc3RlbmVyLCAnYWRkT25jZScpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lzdGVyTGlzdGVuZXIobGlzdGVuZXIsIHRydWUsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYSBzaW5nbGUgbGlzdGVuZXIgZnJvbSB0aGUgZGlzcGF0Y2ggcXVldWUuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIEhhbmRsZXIgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgcmVtb3ZlZC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBFeGVjdXRpb24gY29udGV4dCAoc2luY2UgeW91IGNhbiBhZGQgdGhlIHNhbWUgaGFuZGxlciBtdWx0aXBsZSB0aW1lcyBpZiBleGVjdXRpbmcgaW4gYSBkaWZmZXJlbnQgY29udGV4dCkuXG4gICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBMaXN0ZW5lciBoYW5kbGVyIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlIDogZnVuY3Rpb24gKGxpc3RlbmVyLCBjb250ZXh0KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUxpc3RlbmVyKGxpc3RlbmVyLCAncmVtb3ZlJyk7XG5cbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5faW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdzW2ldLl9kZXN0cm95KCk7IC8vbm8gcmVhc29uIHRvIGEgU2lnbmFsQmluZGluZyBleGlzdCBpZiBpdCBpc24ndCBhdHRhY2hlZCB0byBhIHNpZ25hbFxuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZnJvbSB0aGUgU2lnbmFsLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlQWxsIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAobi0tKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ3Nbbl0uX2Rlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdzLmxlbmd0aCA9IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge251bWJlcn0gTnVtYmVyIG9mIGxpc3RlbmVycyBhdHRhY2hlZCB0byB0aGUgU2lnbmFsLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TnVtTGlzdGVuZXJzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JpbmRpbmdzLmxlbmd0aDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RvcCBwcm9wYWdhdGlvbiBvZiB0aGUgZXZlbnQsIGJsb2NraW5nIHRoZSBkaXNwYXRjaCB0byBuZXh0IGxpc3RlbmVycyBvbiB0aGUgcXVldWUuXG4gICAgICAgICAqIDxwPjxzdHJvbmc+SU1QT1JUQU5UOjwvc3Ryb25nPiBzaG91bGQgYmUgY2FsbGVkIG9ubHkgZHVyaW5nIHNpZ25hbCBkaXNwYXRjaCwgY2FsbGluZyBpdCBiZWZvcmUvYWZ0ZXIgZGlzcGF0Y2ggd29uJ3QgYWZmZWN0IHNpZ25hbCBicm9hZGNhc3QuPC9wPlxuICAgICAgICAgKiBAc2VlIFNpZ25hbC5wcm90b3R5cGUuZGlzYWJsZVxuICAgICAgICAgKi9cbiAgICAgICAgaGFsdCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuX3Nob3VsZFByb3BhZ2F0ZSA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwYXRjaC9Ccm9hZGNhc3QgU2lnbmFsIHRvIGFsbCBsaXN0ZW5lcnMgYWRkZWQgdG8gdGhlIHF1ZXVlLlxuICAgICAgICAgKiBAcGFyYW0gey4uLip9IFtwYXJhbXNdIFBhcmFtZXRlcnMgdGhhdCBzaG91bGQgYmUgcGFzc2VkIHRvIGVhY2ggaGFuZGxlci5cbiAgICAgICAgICovXG4gICAgICAgIGRpc3BhdGNoIDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgaWYgKCEgdGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYXJhbXNBcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLFxuICAgICAgICAgICAgICAgIG4gPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgYmluZGluZ3M7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1lbW9yaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldlBhcmFtcyA9IHBhcmFtc0FycjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEgbikge1xuICAgICAgICAgICAgICAgIC8vc2hvdWxkIGNvbWUgYWZ0ZXIgbWVtb3JpemVcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJpbmRpbmdzID0gdGhpcy5fYmluZGluZ3Muc2xpY2UoKTsgLy9jbG9uZSBhcnJheSBpbiBjYXNlIGFkZC9yZW1vdmUgaXRlbXMgZHVyaW5nIGRpc3BhdGNoXG4gICAgICAgICAgICB0aGlzLl9zaG91bGRQcm9wYWdhdGUgPSB0cnVlOyAvL2luIGNhc2UgYGhhbHRgIHdhcyBjYWxsZWQgYmVmb3JlIGRpc3BhdGNoIG9yIGR1cmluZyB0aGUgcHJldmlvdXMgZGlzcGF0Y2guXG5cbiAgICAgICAgICAgIC8vZXhlY3V0ZSBhbGwgY2FsbGJhY2tzIHVudGlsIGVuZCBvZiB0aGUgbGlzdCBvciB1bnRpbCBhIGNhbGxiYWNrIHJldHVybnMgYGZhbHNlYCBvciBzdG9wcyBwcm9wYWdhdGlvblxuICAgICAgICAgICAgLy9yZXZlcnNlIGxvb3Agc2luY2UgbGlzdGVuZXJzIHdpdGggaGlnaGVyIHByaW9yaXR5IHdpbGwgYmUgYWRkZWQgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdFxuICAgICAgICAgICAgZG8geyBuLS07IH0gd2hpbGUgKGJpbmRpbmdzW25dICYmIHRoaXMuX3Nob3VsZFByb3BhZ2F0ZSAmJiBiaW5kaW5nc1tuXS5leGVjdXRlKHBhcmFtc0FycikgIT09IGZhbHNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRm9yZ2V0IG1lbW9yaXplZCBhcmd1bWVudHMuXG4gICAgICAgICAqIEBzZWUgU2lnbmFsLm1lbW9yaXplXG4gICAgICAgICAqL1xuICAgICAgICBmb3JnZXQgOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5fcHJldlBhcmFtcyA9IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhbGwgYmluZGluZ3MgZnJvbSBzaWduYWwgYW5kIGRlc3Ryb3kgYW55IHJlZmVyZW5jZSB0byBleHRlcm5hbCBvYmplY3RzIChkZXN0cm95IFNpZ25hbCBvYmplY3QpLlxuICAgICAgICAgKiA8cD48c3Ryb25nPklNUE9SVEFOVDo8L3N0cm9uZz4gY2FsbGluZyBhbnkgbWV0aG9kIG9uIHRoZSBzaWduYWwgaW5zdGFuY2UgYWZ0ZXIgY2FsbGluZyBkaXNwb3NlIHdpbGwgdGhyb3cgZXJyb3JzLjwvcD5cbiAgICAgICAgICovXG4gICAgICAgIGRpc3Bvc2UgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2JpbmRpbmdzO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ByZXZQYXJhbXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICB0b1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnW1NpZ25hbCBhY3RpdmU6JysgdGhpcy5hY3RpdmUgKycgbnVtTGlzdGVuZXJzOicrIHRoaXMuZ2V0TnVtTGlzdGVuZXJzKCkgKyddJztcbiAgICAgICAgfVxuXG4gICAgfTtcblxuXG4gICAgLy8gTmFtZXNwYWNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvKipcbiAgICAgKiBTaWduYWxzIG5hbWVzcGFjZVxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbmFtZSBzaWduYWxzXG4gICAgICovXG4gICAgdmFyIHNpZ25hbHMgPSBTaWduYWw7XG5cbiAgICAvKipcbiAgICAgKiBDdXN0b20gZXZlbnQgYnJvYWRjYXN0ZXJcbiAgICAgKiBAc2VlIFNpZ25hbFxuICAgICAqL1xuICAgIC8vIGFsaWFzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSAoc2VlICNnaC00NClcbiAgICBzaWduYWxzLlNpZ25hbCA9IFNpZ25hbDtcblxuXG5cbiAgICAvL2V4cG9ydHMgdG8gbXVsdGlwbGUgZW52aXJvbm1lbnRzXG4gICAgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKXsgLy9BTURcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNpZ25hbHM7IH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpeyAvL25vZGVcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBzaWduYWxzO1xuICAgIH0gZWxzZSB7IC8vYnJvd3NlclxuICAgICAgICAvL3VzZSBzdHJpbmcgYmVjYXVzZSBvZiBHb29nbGUgY2xvc3VyZSBjb21waWxlciBBRFZBTkNFRF9NT0RFXG4gICAgICAgIC8qanNsaW50IHN1Yjp0cnVlICovXG4gICAgICAgIGdsb2JhbFsnc2lnbmFscyddID0gc2lnbmFscztcbiAgICB9XG5cbn0odGhpcykpO1xuIiwiaW1wb3J0IF9TdGFydFN0YWdlQ3JlYXRlciBmcm9tIFwiLi9TdGFydExheWVyXCJcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJhc2VMYXllcihBcHApIHtcclxuXHJcblx0bGV0IF9iYXNlU3RhZ2U7XHJcblxyXG5cdEFwcC5sb2FkZXJcclxuXHRcdC5hZGQoXCJiYXNlX3N0YWdlXCIsIFwiLi9zcmMvbWFwcy9iYXNlLmpzb25cIilcclxuXHRcdC5sb2FkKChsLCByZXMpID0+IHtcclxuICAgIFx0XHJcbiAgICBcdF9iYXNlU3RhZ2UgPSByZXMuYmFzZV9zdGFnZS5zdGFnZTtcclxuICAgIFx0X2Jhc2VTdGFnZS5hcHAgPSBBcHA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX2Jhc2VTdGFnZS5zY2FsZS5zZXQoXHJcbiAgICAgICAgICAgIEFwcC5yZW5kZXJlci53aWR0aCAvIF9iYXNlU3RhZ2UubGF5ZXJXaWR0aCxcclxuICAgICAgICAgICAgQXBwLnJlbmRlcmVyLmhlaWdodCAvIF9iYXNlU3RhZ2UubGF5ZXJIZWlnaHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBBcHAuc3RhZ2UuYWRkQ2hpbGQoX2Jhc2VTdGFnZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgX1N0YXJ0U3RhZ2VDcmVhdGVyKF9iYXNlU3RhZ2UsIHMgPT57XHJcbiAgICAgICAgXHRzLnBhcmVudEdyb3VwID0gX2Jhc2VTdGFnZS5CQVNFX01JRERMRS5ncm91cDtcclxuICAgICAgICBcdF9iYXNlU3RhZ2UuYWRkQ2hpbGQocyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIEluaXQoKTtcclxuICAgIH0pO1xyXG5cclxuXHRsZXQgSW5pdCA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0QXBwLmxvYWRlclxyXG5cdFx0LmFkZChcImZsYWdfc2tlXCIsIFwiLi9zcmMvYW5pbXMvZmxhZy9mbGFnX3NrZS5qc29uXCIpXHJcblx0XHQuYWRkKFwib2JqX3NrZVwiLCBcIi4vc3JjL2FuaW1zL29iai9vYmpBbmltc19za2UuanNvblwiKVxyXG5cdFx0LmxvYWQoKGwsIHJlcykgPT4ge1xyXG5cclxuXHRcdFx0Ly9yZXMub2JqX3NrZS5vbkxvYWQuYWRkKCB4ID0+IHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgeCA9IHt9XHJcblx0XHRcdFx0eC5vcmFuZ2UgPSByZXMub2JqX3NrZS5vYmplY3RzLm9yYW5nZS5jcmVhdGUoKTtcclxuXHRcdFx0XHRfYmFzZVN0YWdlLmFkZENoaWxkKHgub3JhbmdlKTtcclxuXHRcdFx0XHR4Lm9yYW5nZS5wb3NpdGlvbi5zZXQoMTAwLDEwMCk7XHJcblx0XHRcdFx0eC5vcmFuZ2UuYW5pbWF0aW9uLnBsYXkoXCJpZGxlXCIpO1xyXG5cdFx0XHRcdHgub3JhbmdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0dmFyIF9zdGF0ZV9zaG93ID0gbnVsbDtcclxuXHRcdCAgICBcdHgub3JhbmdlLm9uKFwicG9pbnRlcm92ZXJcIiwgKCkgPT4ge1xyXG5cdFx0ICAgIFx0XHRfc3RhdGVfc2hvdyA9IHgub3JhbmdlLmFuaW1hdGlvbi5mYWRlSW4oXCJzaG93XCIsMC4yLCAxKTtcclxuXHRcdCAgICBcdH0pO1xyXG5cclxuXHRcdCAgICBcdHgub3JhbmdlLm9uKFwicG9pbnRlcm91dFwiLCAoKSA9PntcclxuXHRcdCAgICBcdFx0XHR4Lm9yYW5nZS5hbmltYXRpb24uZmFkZUluKFwiaWRsZVwiLDAuMiwxKTtcclxuXHRcdCAgICBcdH0pO1xyXG5cdFx0XHQvL30pO1xyXG5cclxuXHRcdFx0Ly9pZihyZXMuZmxhZ19za2Uub25Mb2FkKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvL3Jlcy5mbGFnX3NrZS5vbkxvYWQuYWRkKCB4ID0+IHtcclxuXHJcblx0XHRcdFx0XHRpZigheC5pbnN0YW5jZSl7XHJcblx0XHRcdFx0XHRcdHguRmxhZyA9IHJlcy5mbGFnX3NrZS5vYmplY3RzLkZsYWcuY3JlYXRlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR4LkZsYWcucGFyZW50R3JvdXAgPSBfYmFzZVN0YWdlLkJBU0VfVUkuZ3JvdXA7XHJcblx0XHRcdFx0XHR4LkZsYWcuc2NhbGUuc2V0KDIsMik7XHJcblx0XHRcdFx0XHR4LkZsYWcucG9zaXRpb24uc2V0KHguRmxhZy5nZXRMb2NhbEJvdW5kcygpLndpZHRoICogMiwgLTkwKTtcclxuXHRcdFx0XHRcdHguRmxhZy5wYXJlbnRHcm91cCA9IF9iYXNlU3RhZ2UuQkFTRV9VSS5ncm91cDtcclxuXHRcdFx0XHRcdHguRmxhZy5hbmltYXRpb24ucGxheSh4LkZsYWcuYW5pbWF0aW9uLmFuaW1hdGlvbk5hbWVzWzBdKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgY2xvbmUgPSB4LkZsYWcubGlnaHRDb3B5KCk7XHJcblx0XHRcdFx0XHRjbG9uZS5wb3NpdGlvbi54ICs9IDEwMDtcclxuXHJcblx0XHRcdFx0XHRjbG9uZS5hbmltYXRpb24uZ290b0FuZFBsYXlCeVByb2dyZXNzKGNsb25lLmFuaW1hdGlvbi5hbmltYXRpb25OYW1lc1swXSwgTWF0aC5yYW5kb20oKSk7XHJcblx0XHRcdFx0XHRfYmFzZVN0YWdlLmFkZENoaWxkKGNsb25lKTtcclxuXHRcdFx0XHRcdF9iYXNlU3RhZ2UuYWRkQ2hpbGQoeC5GbGFnKTtcclxuXHJcblx0XHRcdC8vXHR9KTtcclxuXHRcdFx0Ly99XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG4gICAgLy8gYmFzZVN0YWdlIHVwZGF0ZTtcclxuICAgIEFwcC50aWNrZXIuYWRkKCgpID0+IHtcclxuXHJcbiAgICB9KTsgICBcclxufSIsIlxyXG4vL0JsYWRlIEpTIGNvbnN0cnVjdG9yXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGFkZSh0ZXh0dXJlKSB7XHJcbiAgdmFyIGNvdW50ID1cclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTA7XHJcbiAgdmFyIG1pbkRpc3QgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiA0MDtcclxuICB2YXIgbGl2ZVRpbWUgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAyMDtcclxuXHJcbiAgdmFyIHBvaW50cyA9IFtdO1xyXG4gIHRoaXMuY291bnQgPSBjb3VudDtcclxuICB0aGlzLm1pbkRpc3QgPSBtaW5EaXN0O1xyXG4gIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgdGhpcy5taW5Nb3Rpb25TcGVlZCA9IDQwMDAuMDtcclxuICB0aGlzLmxpdmVUaW1lID0gbGl2ZVRpbWU7XHJcbiAgdGhpcy5sYXN0TW90aW9uU3BlZWQgPSAwO1xyXG4gIHRoaXMudGFyZ2V0UG9zaXRpb24gPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHJcbiAgdGhpcy5ib2R5ID0gbmV3IFBJWEkubWVzaC5Sb3BlKHRleHR1cmUsIHBvaW50cyk7XHJcblxyXG4gIHZhciBsYXN0UG9zaXRpb24gPSBudWxsO1xyXG4gIHRoaXMuVXBkYXRlID0gZnVuY3Rpb24odGlja2VyKSB7XHJcbiAgICB2YXIgaXNEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBwb2ludHMgPSB0aGlzLmJvZHkucG9pbnRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgaWYgKHBvaW50c1tpXS5sYXN0VGltZSArIHRoaXMubGl2ZVRpbWUgPCB0aWNrZXIubGFzdFRpbWUpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBpc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB0ID0gbmV3IFBJWEkuUG9pbnQoXHJcbiAgICAgIHRoaXMudGFyZ2V0UG9zaXRpb24ueCAvIHRoaXMuYm9keS5zY2FsZS54LFxyXG4gICAgICB0aGlzLnRhcmdldFBvc2l0aW9uLnkgLyB0aGlzLmJvZHkuc2NhbGUueVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAobGFzdFBvc2l0aW9uID09IG51bGwpIGxhc3RQb3NpdGlvbiA9IHQ7XHJcblxyXG4gICAgdC5sYXN0VGltZSA9IHRpY2tlci5sYXN0VGltZTtcclxuXHJcbiAgICB2YXIgcCA9IGxhc3RQb3NpdGlvbjtcclxuXHJcbiAgICB2YXIgZHggPSB0LnggLSBwLng7XHJcbiAgICB2YXIgZHkgPSB0LnkgLSBwLnk7XHJcblxyXG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgIHRoaXMubGFzdE1vdGlvblNwZWVkID0gZGlzdCAqIDEwMDAgLyB0aWNrZXIuZWxhcHNlZE1TO1xyXG4gICAgaWYgKGRpc3QgPiBtaW5EaXN0KSB7XHJcbiAgICAgIGlmICh0aGlzLmxhc3RNb3Rpb25TcGVlZCA+IHRoaXMubWluTW90aW9uU3BlZWQpIHtcclxuICAgICAgICBwb2ludHMucHVzaCh0KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IHRoaXMuY291bnQpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaXNEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGFzdFBvc2l0aW9uID0gdDtcclxuICAgIGlmIChpc0RpcnR5KSB7XHJcbiAgICAgIHRoaXMuYm9keS5yZWZyZXNoKHRydWUpO1xyXG4gICAgICB0aGlzLmJvZHkucmVuZGVyYWJsZSA9IHBvaW50cy5sZW5ndGggPiAxO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuUmVhZENhbGxiYWNrcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRhcmdldC5tb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHNlbGYudGFyZ2V0UG9zaXRpb24gPSBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQubW91c2VvdmVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAvL1x0c2VsZi50YXJnZXRQb3NpdGlvbiA9ICBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgICAvL1x0Y29uc29sZS5sb2coXCJvdmVyXCIpO1xyXG4gICAgICAvLyAgc2VsZi5Nb3ZlQWxsKGUuZGF0YS5nbG9iYWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQudG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIG1vdmVcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5kYXRhKTtcclxuICAgICAgc2VsZi50YXJnZXRQb3NpdGlvbiA9IGUuZGF0YS5nbG9iYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaHN0YXJ0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIHN0YXJ0XCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUuZGF0YSk7XHJcbiAgICAgIC8vICBzZWxmLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJUb3VjaCBzdGFydFwiKTtcclxuICAgICAgLy8gX0JsYWRlLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG4gICAgLy8g0LAg0YLQviDQu9Cw0L/RiNCwINC60LDQutCw0Y8t0YLQvlxyXG4gIH07XHJcbn07XHJcblxyXG4vL3JldHVybiBCbGFkZTtcclxuXHJcbiIsIi8vaW1wb3J0IHtTaWduYWx9IGZyb20gXCJzaWduYWxzXCI7XHJcblxyXG5sZXQgQ29uc3RydWN0QnlOYW1lID0gZnVuY3Rpb24oZmFjdG9yeSwgbmFtZSkge1xyXG5cclxuXHRsZXQgb2JqID0gZmFjdG9yeS5idWlsZEFybWF0dXJlRGlzcGxheShuYW1lKTtcclxuXHRcdFx0XHRcclxuXHRvYmoubmFtZSA9IG5hbWU7XHJcblx0b2JqLmZhY3RvcnkgPSBmYWN0b3J5O1xyXG5cdG9iai5vcmlnTmFtZSA9IG5hbWU7XHJcblxyXG5cdFxyXG5cdG9iai5fX3Byb3RvX18ubGlnaHRDb3B5ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdGxldCBfbmFtZSA9IG5hbWU7XHJcblx0XHRsZXQgX2Nsb25lID0gQ29uc3RydWN0QnlOYW1lKHRoaXMuZmFjdG9yeSwgdGhpcy5vcmlnTmFtZSk7XHJcblx0XHRcclxuXHRcdF9jbG9uZS5wb3NpdGlvbi5zZXQodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnkpO1xyXG5cdFx0XHJcblx0XHRfY2xvbmUuYWxwaGEgPSB0aGlzLmFscGhhO1xyXG5cdFx0X2Nsb25lLnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbjtcclxuXHRcdF9jbG9uZS5waXZvdC5jb3B5KHRoaXMucGl2b3QpO1xyXG5cdFx0X2Nsb25lLmFuY2hvci5jb3B5KHRoaXMuYW5jaG9yKTtcclxuXHRcdF9jbG9uZS5zY2FsZS5jb3B5KHRoaXMuc2NhbGUpO1xyXG5cdFx0X2Nsb25lLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcblx0XHRfY2xvbmUucGFyZW50R3JvdXAgPSB0aGlzLnBhcmVudEdyb3VwO1xyXG5cdFx0X2Nsb25lLmNsb25lSUQgPSB0aGlzLmNsb25lSUQ/ICh0aGlzLmNsb25lSUQgKyAxKSA6IDA7XHJcblx0XHRfY2xvbmUubmFtZSA9IHRoaXMubmFtZSArIFwiX2Nsb25lX1wiICsgX2Nsb25lLmNsb25lSUQ7XHJcblx0XHRcclxuXHRcdHJldHVybiBfY2xvbmU7XHJcblx0XHQvL1xyXG5cdH1cclxuXHRcclxuXHJcblx0XHJcblx0Ly9vYmouaW1wb3J0V2lkdGggPSBfZGF0YS5hcm1hdHVyZVtpXS5hYWJiLndpZHRoO1xyXG5cdC8vb2JqLmltcG9ydEhlaWdodCA9IF9kYXRhLmFybWF0dXJlW2ldLmFhYmIuaGVpZ2h0O1xyXG5cdFxyXG5cdHJldHVybiBvYmo7XHJcbn0gXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmFnb25Cb25lTG9hZGVyKCkge1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24ocmVzLCBuZXh0KSB7XHJcblxyXG5cdFx0aWYocmVzLnVybC5pbmRleE9mKFwiLmRiYmluXCIpID4gLTEpe1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coXCJDYW4ndCBzdXBwb3J0IHRoaXMgZm9ybWF0IGluIERyYWdvbkJvbmUgUElYSSBGYWN0b3J5IVwiKTtcclxuXHRcdFx0bmV4dCgpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIShyZXMudXJsLmluZGV4T2YoXCIuanNvblwiKSA+IC0xICYmIHJlcy5kYXRhICYmIHJlcy5kYXRhLmFybWF0dXJlICYmIHJlcy5kYXRhLmZyYW1lUmF0ZSkpXHJcblx0XHR7XHJcblx0XHRcdG5leHQoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCEoZHJhZ29uQm9uZXMgJiYgZHJhZ29uQm9uZXMuUGl4aUZhY3RvcnkpKXtcclxuXHRcdFx0bmV4dCgpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJEcmFnb25Cb25lIFBJWEkgUHJlTG9hZGVyIFxcbiBlWHBvbmVudGEge3JvbmRvLmRldmlsW2FdZ21haWwuY29tfVwiKTtcclxuXHJcblx0XHQvL2RlcHJpY2F0ZWRcclxuXHRcdC8vcmVzLm9uTG9hZCA9IG5ldyBTaWduYWwoKTtcclxuXHJcblx0XHRsZXQgX2RhdGEgPSByZXMuZGF0YTtcclxuXHRcdFxyXG5cdFx0Ly8gYWRkIFRleHR1cmVEYXRhSnNvblxyXG5cdFx0Ly8gYWRkIHRvIGN1cnJldG4gbG9hZGVyXHJcblx0XHQvLyBjYWxsYmFjayBjYW4gYmUgY2hhbmdlZCB0byB0aGlzLm9uQ29tcGxldGUub25jZShmdW5jLCB0aGlzLCAxMDAwMDAwMDApO1xyXG5cdFx0Ly8gY3VyZW50bHkgdGhleSBjYWxsZWQgYWZ0ZXIgbG9hZGluZyBvZiB0ZXh0dXJlXHJcblx0XHRsZXQgbCA9IHRoaXM7Ly9uZXcgUElYSS5sb2FkZXJzLkxvYWRlcigpO1xyXG5cdFx0bC5hZGQocmVzLm5hbWUgKyBcIl90ZXhcIiwgcmVzLnVybC5yZXBsYWNlKFwic2tlLmpzb25cIixcInRleC5qc29uXCIpLCB7cGFyZW50UmVzb3VyY2U6IHJlc30pXHJcblx0XHQgLmFkZChyZXMubmFtZSArIFwiX2ltZ1wiLCByZXMudXJsLnJlcGxhY2UoXCJza2UuanNvblwiLFwidGV4LnBuZ1wiKSwge3BhcmVudFJlc291cmNlOiByZXN9LCAoKSA9PiB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyB1cGRhdGUgYWZ0ZXIgaW1hZ2UgbG9hZGluZ1xyXG5cdFx0XHRsZXQgX3JlcyA9IHRoaXMucmVzb3VyY2VzO1xyXG5cclxuXHRcdFx0bGV0IF9mYWN0b3J5ID0gZHJhZ29uQm9uZXMuUGl4aUZhY3RvcnkuZmFjdG9yeTtcclxuXHRcdFx0X2ZhY3RvcnkucGFyc2VEcmFnb25Cb25lc0RhdGEoX2RhdGEpO1xyXG5cdFx0XHRfZmFjdG9yeS5wYXJzZVRleHR1cmVBdGxhc0RhdGEoX3Jlc1tyZXMubmFtZSArIFwiX3RleFwiXS5kYXRhLF9yZXNbcmVzLm5hbWUgKyBcIl9pbWdcIl0udGV4dHVyZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXMub2JqZWN0cyA9IHt9O1xyXG5cdFx0XHRmb3IgKGxldCBpPSAwOyBpIDwgX2RhdGEuYXJtYXR1cmUubGVuZ3RoOyBpKyspIFxyXG5cdFx0XHR7XHJcblxyXG5cdFx0XHRcdGxldCBuYW1lID0gX2RhdGEuYXJtYXR1cmVbaV0ubmFtZTtcclxuXHJcblx0XHRcdFx0cmVzLm9iamVjdHNbbmFtZV0gPSAge307XHJcblx0XHRcdFx0aWYoZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcgJiYgZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcuY3JlYXRlKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdHJlcy5vYmplY3RzW25hbWVdID0gQ29uc3RydWN0QnlOYW1lKF9mYWN0b3J5LCBuYW1lKTtcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXMub2JqZWN0c1tuYW1lXS5jcmVhdGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0bGV0IF9mID0gX2ZhY3RvcnksXHJcblx0XHRcdFx0XHRcdF9uID0gbmFtZTtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gQ29uc3RydWN0QnlOYW1lKF9mLCBfbik7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0cmVzLm9iamVjdHNbbmFtZV0uaW5zdGFuY2UgPSAoZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcgJiYgZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcuY3JlYXRlKTtcclxuXHJcblx0XHRcdH1cclxuXHRcdFx0Ly9kZXByaWNhdGVkXHJcblx0XHRcdC8vcmVzLm9uTG9hZC5kaXNwYXRjaChyZXMub2JqZWN0cyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRuZXh0KCk7XHJcblx0fTtcclxufVxyXG5cclxuZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcgPSB7XHJcblx0Y3JlYXRlIDogZmFsc2VcclxufVxyXG5cclxuUElYSS5sb2FkZXJzLkxvYWRlci5hZGRQaXhpTWlkZGxld2FyZShEcmFnb25Cb25lTG9hZGVyKTtcclxuUElYSS5sb2FkZXIudXNlKERyYWdvbkJvbmVMb2FkZXIoKSk7IiwiXHJcblBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5nZXRDaGlsZEJ5TmFtZSA9IGZ1bmN0aW9uIGdldENoaWxkQnlOYW1lKG5hbWUpXHJcbntcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXS5uYW1lID09PSBuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59OyIsImltcG9ydCBTaWduYWwgZnJvbSBcInNpZ25hbHNcIlxyXG5cclxudmFyIF9NRSA9IE1hdHRlci5FbmdpbmUsXHJcbiAgICBfTVcgPSBNYXR0ZXIuV29ybGQsXHJcbiAgICBfTUJzID0gTWF0dGVyLkJvZGllcyxcclxuICAgIF9NQiA9IE1hdHRlci5Cb2R5LFxyXG4gICAgX01DID0gTWF0dGVyLkNvbXBvc2l0ZSxcclxuICAgIF9NRXYgPSBNYXR0ZXIuRXZlbnRzLFxyXG4gICAgX01WID0gTWF0dGVyLlZlY3RvcjtcclxuXHJcbmxldCBDcmVhdGVTdWJCb2R5ID0gZnVuY3Rpb24ocGFyZW50LCB0ZXhEYXRhKXtcclxuXHJcbiAgbGV0IG9iaiA9IENyZWF0ZVNsaWNhYmxlT2JqZWN0KHBhcmVudC5wb3NpdGlvbiwgcGFyZW50LmVuZ2luZSwgdGV4RGF0YSk7XHJcbiAgXHJcbiAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgb2JqLnBhcmVudEdyb3VwID0gdGV4RGF0YS5ncm91cDtcclxuXHJcbiAgX01CLnNldE1hc3Mob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS5tYXNzICogMC41KTtcclxuICBfTUIuc2V0VmVsb2NpdHkob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS52ZWxvY2l0eSk7XHJcbiAgX01CLnNldEFuZ2xlKG9iai5waEJvZHksIHBhcmVudC5waEJvZHkuc2xpY2VBbmdsZSk7XHJcblxyXG4gIGxldCBhbmNob3JlZF9kaXIgPSBfTVYubm9ybWFsaXNlKHt4Om9iai5hbmNob3IueCAtIDAuNSwgeTogMC41IC0gb2JqLmFuY2hvci55IH0pO1xyXG4gIGFuY2hvcmVkX2RpciA9IF9NVi5yb3RhdGUoYW5jaG9yZWRfZGlyLCBwYXJlbnQucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG5cclxuICBfTUIuYXBwbHlGb3JjZShvYmoucGhCb2R5LCBvYmoucGhCb2R5LnBvc2l0aW9uLCB7XHJcbiAgICB4OiAgYW5jaG9yZWRfZGlyLnggKiAwLjAyLFxyXG4gICAgeTogIGFuY2hvcmVkX2Rpci55ICogMC4wMlxyXG4gIH0pO1xyXG5cclxuICAvL2Rvd25QYXJ0LnBoQm9keS50b3JxdWUgPSB0aGlzLnBoQm9keS50b3JxdWUgKiAxMDtcclxuXHJcbiAgcGFyZW50LnBhcmVudC5hZGRDaGlsZChvYmopO1xyXG5cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDcmVhdGVTbGljYWJsZU9iamVjdChwb3MsIGVuZ2luZSwgZGF0YSkge1xyXG4gIFxyXG4gIHZhciBvYmogPSBudWxsO1xyXG5cclxuICBpZiAoZGF0YSAmJiBkYXRhLm5vcm1hbCkge1xyXG4gICAgb2JqID0gbmV3IFBJWEkuU3ByaXRlKGRhdGEubm9ybWFsLnRleCk7XHJcblxyXG4gICAgaWYgKGRhdGEubm9ybWFsLnBpdm90KSB7XHJcbiAgICAgIG9iai5hbmNob3Iuc2V0KGRhdGEubm9ybWFsLnBpdm90LngsIGRhdGEubm9ybWFsLnBpdm90LnkpO1xyXG4gICAgfVxyXG5cclxuICB9IGVsc2Uge1xyXG4gIFxyXG4gICAgb2JqID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuICAgIG9iai5iZWdpbkZpbGwoMHg5OTY2ZiAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgb2JqLmRyYXdDaXJjbGUoMCwgMCwgNTApO1xyXG4gICAgb2JqLmVuZEZpbGwoKTtcclxuICB9XHJcblxyXG4gIG9iai5zcHJpdGVEYXRhID0gZGF0YTtcclxuICBvYmouZW5naW5lID0gZW5naW5lO1xyXG4gIG9iai54ID0gcG9zLng7XHJcbiAgb2JqLnkgPSBwb3MueTtcclxuICBvYmoucGFyZW50R3JvdXAgPSBkYXRhLm5vcm1hbC5ncm91cDtcclxuICBcclxuICBvYmoub25zbGljZSA9IG5ldyBTaWduYWwoKTtcclxuXHJcbiAgb2JqLmtpbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLnBoQm9keS5zbGljZWQgJiYgdGhpcy5vbnNsaWNlKSB7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLm9uc2xpY2UuZGlzcGF0Y2godGhpcyk7XHJcbiAgICAgIFxyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgb2JqLnNwcml0ZURhdGEucGFydHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIENyZWF0ZVN1YkJvZHkob2JqLCB7bm9ybWFsOiBvYmouc3ByaXRlRGF0YS5wYXJ0c1tpXX0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSh7IGNoaWxkcmVuOiB0cnVlIH0pO1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBoQm9keSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBfTUMucmVtb3ZlKGVuZ2luZS53b3JsZCwgdGhpcy5waEJvZHkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG9iai5vbnNsaWNlLmFkZCgoKSA9PnsgY29uc29sZS5sb2coXCJMaXN0ZW4gU2lnbmFsXCIpO30pO1xyXG5cclxuICB2YXIgcGhCb2R5ID0gX01Ccy5jaXJjbGUocG9zLngsIHBvcy55LCA1MCk7XHJcbiAgcGhCb2R5LmNvbGxpc2lvbkZpbHRlci5tYXNrICY9IH5waEJvZHkuY29sbGlzaW9uRmlsdGVyLmNhdGVnb3J5O1xyXG4gIF9NVy5hZGQoZW5naW5lLndvcmxkLCBwaEJvZHkpO1xyXG5cclxuICBwaEJvZHkucGlPYmogPSBvYmo7XHJcbiAgb2JqLnBoQm9keSA9IHBoQm9keTtcclxuXHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG4iLCJpbXBvcnQge0Ryb3BTaGFkb3dGaWx0ZXJ9IGZyb20gJ0BwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdydcclxuaW1wb3J0IENyZWF0ZVNsaWNhYmxlT2JqZWN0IGZyb20gJy4vU2xpY2FibGVPYmplY3QnXHJcbmltcG9ydCBCbGFkZSBmcm9tICcuL0JsYWRlJ1xyXG5cclxuLy8gZnVuY3Rpb24sIHdobyBjcmVhdGUgYW5kIGluc3RhbmNlIFNsaWNlZExheW91dFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTbGljZUxheWVyIChhcHApIHtcclxuICB2YXIgX01FID0gTWF0dGVyLkVuZ2luZSxcclxuICAgIF9NVyA9IE1hdHRlci5Xb3JsZCxcclxuICAgIF9NQnMgPSBNYXR0ZXIuQm9kaWVzLFxyXG4gICAgX01CID0gTWF0dGVyLkJvZHksXHJcbiAgICBfTUMgPSBNYXR0ZXIuQ29tcG9zaXRlLFxyXG4gICAgX01FdiA9IE1hdHRlci5FdmVudHMsXHJcbiAgICBfTVYgPSBNYXR0ZXIuVmVjdG9yLFxyXG4gICAgX0xSZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIGVuZ2luZSA9IF9NRS5jcmVhdGUoKTtcclxuICBlbmdpbmUud29ybGQuc2NhbGUgPSAwLjAwMDE7XHJcbiAgZW5naW5lLndvcmxkLmdyYXZpdHkueSA9IDAuMzU7XHJcblxyXG4gIF9NRS5ydW4oZW5naW5lKTtcclxuXHJcbiAgdmFyIHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gIHZhciBfbHJlcyA9IGFwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG5cclxuICB2YXIgc2xpY2VVcEdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgxLCBmYWxzZSk7XHJcbiAgdmFyIHNsaWNlTWlkZGxlR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDAsIGZhbHNlKTtcclxuICB2YXIgc2xpY2VEb3duR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKC0xLCBmYWxzZSk7XHJcbiAgdmFyIHVpR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDEwLCBmYWxzZSk7XHJcbiAgXHJcbiAvLyBzdGFnZS5maWx0ZXJzID0gW25ldyBEcm9wU2hhZG93RmlsdGVyKCldO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlVXBHcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VEb3duR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlTWlkZGxlR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHVpR3JvdXApKTtcclxuXHJcbiAgLy9zdGFnZS5ncm91cC5lbmFibGVTb3J0ID0gdHJ1ZTtcclxuICBzdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIHN0YWdlLl9kZWJ1Z1RleHQgPSBuZXcgUElYSS5UZXh0KFwiQm9keSBjb3VudDogMFwiLCB7XHJcbiAgICBmb250RmFtaWx5OiBcIkFyaWFsXCIsXHJcbiAgICBmb250U2l6ZTogMzIsXHJcbiAgICBmaWxsOiAweGZmMTAxMCxcclxuICAgIHN0cm9rZTogMHgwMGNjMTAsXHJcbiAgICBhbGlnbjogXCJsZWZ0XCJcclxuICB9KTtcclxuXHJcbiAgc3RhZ2UuX2RlYnVnVGV4dC5wb3NpdGlvbi5zZXQoMTAsIDQyKTtcclxuIC8vIGNvbnNvbGUubG9nKFwicHJlXCIpO1xyXG4gIHN0YWdlLmJsYWRlID0gbmV3IEJsYWRlKFxyXG4gICAgX2xyZXMuYmxhZGVfdGV4LnRleHR1cmUsXHJcbiAgICAzMCxcclxuICAgIDEwLFxyXG4gICAgMTAwXHJcbiAgKTtcclxuICBzdGFnZS5ibGFkZS5taW5Nb3ZhYmxlU3BlZWQgPSAxMDAwO1xyXG4gIHN0YWdlLmJsYWRlLmJvZHkucGFyZW50R3JvdXAgPSBzbGljZU1pZGRsZUdyb3VwO1xyXG4gIHN0YWdlLmJsYWRlLlJlYWRDYWxsYmFja3Moc3RhZ2UpO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5ibGFkZS5ib2R5KTtcclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5fZGVidWdUZXh0KTtcclxuXHJcbiAgdmFyIHNsaWNlcyA9IDA7XHJcbiAgLy8gc2xpY2VzIHZpYSBSYXljYXN0IFRlc3RpbmdcclxuICB2YXIgUmF5Q2FzdFRlc3QgPSBmdW5jdGlvbiBSYXlDYXN0VGVzdChib2RpZXMpIHtcclxuICAgIGlmIChzdGFnZS5ibGFkZS5sYXN0TW90aW9uU3BlZWQgPiBzdGFnZS5ibGFkZS5taW5Nb3Rpb25TcGVlZCkge1xyXG4gICAgICB2YXIgcHBzID0gc3RhZ2UuYmxhZGUuYm9keS5wb2ludHM7XHJcblxyXG4gICAgICBpZiAocHBzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IE1hdGgubWluKHBwcy5sZW5ndGgsIDQpOyBpKyspIHtcclxuICAgICAgICAgIC8vIDQg0L/QvtGB0LvQtdC00L3QuNGFINGB0LXQs9C80LXQvdGC0LBcclxuXHJcbiAgICAgICAgICB2YXIgc3AgPSBwcHNbaSAtIDFdO1xyXG4gICAgICAgICAgdmFyIGVwID0gcHBzW2ldO1xyXG5cclxuICAgICAgICAgIHZhciBjb2xsaXNpb25zID0gTWF0dGVyLlF1ZXJ5LnJheShib2RpZXMsIHNwLCBlcCk7XHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbGxpc2lvbnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnNbal0uYm9keS5jYW5TbGljZSkge1xyXG4gICAgICAgICAgICAgIHZhciBzdiA9IHsgeTogZXAueSAtIHNwLnksIHg6IGVwLnggLSBzcC54IH07XHJcbiAgICAgICAgICAgICAgc3YgPSBfTVYubm9ybWFsaXNlKHN2KTtcclxuXHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUgPSBfTVYuYW5nbGUoc3AsIGVwKTtcclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VWZWN0b3IgPSBzdjtcclxuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm9keSBzbGljZSBhbmdsZTpcIiwgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUpO1xyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICBzbGljZXMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBmcmFtZXMgPSAwO1xyXG4gIHZhciBsYXN0U2hvdFggPSBudWxsO1xyXG5cclxuICAvLyB1cGRhdGUgdmlld1xyXG4gIHZhciBVcGRhdGUgPSBmdW5jdGlvbiBVcGRhdGUoKSB7XHJcblxyXG4gIFx0Ly9zdGFnZS51cGRhdGVTdGFnZSgpO1xyXG4gICAgc3RhZ2UuX2RlYnVnVGV4dC50ZXh0ID1cclxuICAgICAgXCLQktGLINC00LXRgNC30LrQviDQt9Cw0YDQtdC30LDQu9C4IFwiICsgc2xpY2VzLnRvU3RyaW5nKCkgKyBcIiDQutGA0L7Qu9C40Lpv0LIo0LrQsCkoXCI7XHJcblxyXG4gICAgdmFyIGJvZGllcyA9IF9NQy5hbGxCb2RpZXMoZW5naW5lLndvcmxkKTtcclxuXHJcbiAgICBmcmFtZXMrKztcclxuICAgIGlmIChmcmFtZXMgPj0gMjAgJiYgYm9kaWVzLmxlbmd0aCA8IDUpIHtcclxuICAgICAgZnJhbWVzID0gMDtcclxuICAgICAgdmFyIHBvcyA9IHtcclxuICAgICAgICB4OlxyXG4gICAgICAgICAgTWF0aC5yb3VuZChNYXRoLnJhbmRvbVJhbmdlKDAsIDEwKSkgKlxyXG4gICAgICAgICAgTWF0aC5mbG9vcigoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKSAvIDEwKSxcclxuICAgICAgICB5OiBhcHAucmVuZGVyZXIuaGVpZ2h0ICsgMTAwXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB3aGlsZSAobGFzdFNob3RYICE9PSBudWxsICYmIE1hdGguYWJzKGxhc3RTaG90WCAtIHBvcy54KSA8IDIwMCkge1xyXG4gICAgICAgIHBvcy54ID1cclxuICAgICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb21SYW5nZSgwLCAxMCkpICpcclxuICAgICAgICAgIE1hdGguZmxvb3IoKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCkgLyAxMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxhc3RTaG90WCA9IHBvcy54O1xyXG5cclxuICAgICAgcG9zLnggLT0gMTAwOyAvL29mZnNldFxyXG5cclxuICAgICAgLy8vINCS0YvQvdC10YHRgtC4INGN0YLQviDQs9C+0LLQvdC+INC60YPQtNCwLdC90LjQsdGD0LTRjCDQsiDQtNGA0YPQs9C+0LUg0LzQtdGB0YLQvlxyXG5cclxuICAgICAgLy9iYW5ueVxyXG5cdCAgICBsZXQgYmRhdGEgPSBfTFJlcy5idW5ueS5zcHJpdGVzaGVldDtcclxuXHJcblx0XHRsZXQgZGF0YSA9IHtcclxuXHQgICAgICBcdG5vcm1hbDoge1xyXG5cdCAgICAgXHQgICB0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55LFxyXG5cdCAgICAgXHQgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnkucGl2b3QsXHJcblx0ICAgICBcdCAgIGdyb3VwOnNsaWNlRG93bkdyb3VwXHJcblx0ICAgICAgXHR9LFxyXG5cdCAgICAgIFx0cGFydHM6W1xyXG5cdFx0ICAgICAgXHR7XHJcblx0XHQgICAgICAgICAgdGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueV90b3JzZSxcclxuXHRcdCAgICAgICAgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnlfdG9yc2UucGl2b3QsXHJcblx0XHQgICAgICAgICAgZ3JvdXA6IHNsaWNlRG93bkdyb3VwXHJcblx0XHQgICAgICAgIH0sXHJcblx0XHQgICAgICAgIHtcclxuXHRcdCAgICAgICAgXHR0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55X2hlYWQsXHJcblx0XHQgICAgICAgIFx0cGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55X2hlYWQucGl2b3QsXHJcblx0XHQgICAgICAgIFx0Z3JvdXA6IHNsaWNlVXBHcm91cFxyXG5cdCAgICAgICAgXHR9XHJcblx0ICAgICAgICBdXHJcblx0ICAgIH07XHJcblxyXG4gICAgICB2YXIgb2JqID0gQ3JlYXRlU2xpY2FibGVPYmplY3QocG9zLCBlbmdpbmUsIGRhdGEpO1xyXG5cclxuICAgICAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgICAgIG9iai5waEJvZHkuY2FuU2xpY2UgPSB0cnVlO1xyXG5cclxuICAgICAgdmFyIF9vZnggPSAwLjUgLSAocG9zLnggKyAxMDApIC8gKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCk7XHJcblxyXG4gICAgICB2YXIgcmFuZ2UgPSAwLjg7XHJcbiAgICAgIHZhciBpbXAgPSB7XHJcbiAgICAgICAgeDogcmFuZ2UgKiBfb2Z4LFxyXG4gICAgICAgIHk6IC1NYXRoLnJhbmRvbVJhbmdlKDAuNCwgMC41KVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgX01CLmFwcGx5Rm9yY2Uob2JqLnBoQm9keSwgb2JqLnBoQm9keS5wb3NpdGlvbiwgaW1wKTtcclxuICAgICAgb2JqLnBoQm9keS50b3JxdWUgPSBNYXRoLnJhbmRvbVJhbmdlKC0xMCwgMTApO1xyXG5cclxuICAgICAgc3RhZ2UuYWRkQ2hpbGQob2JqKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGlja2VyID0gYXBwLnRpY2tlcjtcclxuICAgIHN0YWdlLmJsYWRlLlVwZGF0ZSh0aWNrZXIpO1xyXG5cclxuICAgIC8vQ2FzdFRlc3RcclxuICAgIFJheUNhc3RUZXN0KGJvZGllcyk7XHJcblxyXG4gICAgX01FLnVwZGF0ZShlbmdpbmUpO1xyXG4gICAgLy8gaXRlcmF0ZSBvdmVyIGJvZGllcyBhbmQgZml4dHVyZXNcclxuXHJcbiAgICBmb3IgKHZhciBpID0gYm9kaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIHZhciBib2R5ID0gYm9kaWVzW2ldO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBib2R5LnBpT2JqICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgKGJvZHkucG9zaXRpb24ueSA+IGFwcC5yZW5kZXJlci5oZWlnaHQgKyAxMDAgJiZcclxuICAgICAgICAgICAgYm9keS52ZWxvY2l0eS55ID4gMCkgfHxcclxuICAgICAgICAgIGJvZHkuc2xpY2VkXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLmtpbGwoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYm9keS5waU9iai54ID0gYm9keS5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgYm9keS5waU9iai55ID0gYm9keS5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgYm9keS5waU9iai5yb3RhdGlvbiA9IGJvZHkuYW5nbGU7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGJvZHkuYW5nbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIE1hdGgucmFuZG9tUmFuZ2UgPSBmdW5jdGlvbihtaW4sIG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuICB9O1xyXG4gIC8vcnVuIFVwZGF0ZVxyXG4gIGFwcC50aWNrZXIuYWRkKFVwZGF0ZSwgdGhpcyk7XHJcblxyXG4gIC8vLy8gUkVUVVJOXHJcbiAgcmV0dXJuIHN0YWdlO1xyXG59XHJcblxyXG4vL2V4cG9ydCB7U2xpY2VMYXllciB9O1xyXG4vL21vZHVsZS5leHBvcnRzID0gU2xpY2VMYXllcjtcclxuLy9yZXR1cm4gU2xpY2VMYXllcjtcclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhcnRMYXllcihiYXNlLCBjYWxsYmFjaykge1xyXG5cdGxldCBfc3RhcnRMYXllcjtcclxuXHJcblx0dmFyIGxvYWRlciA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XHJcblxyXG4gICAgbG9hZGVyLmFkZChcInN0YXJ0X3N0YWdlXCIsXCIuL3NyYy9tYXBzL3N0YXJ0Lmpzb25cIikubG9hZCggKGwsIHJlcykgPT57XHJcbiAgICBcdFxyXG4gICAgXHRfc3RhcnRMYXllciA9IHJlcy5zdGFydF9zdGFnZS5zdGFnZTtcclxuICAgIFx0XHJcbiAgICBcdGlmKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpe1xyXG4gICAgXHRcdGNhbGxiYWNrKF9zdGFydExheWVyKTtcclxuICAgIFx0fVxyXG5cclxuICAgIFx0SW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IEluaXQgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgIFx0bGV0IF9zdGFydF9idXR0b24gPSBfc3RhcnRMYXllci5nZXRDaGlsZEJ5TmFtZShcInN0YXJ0X2J1dHRvbjpub3JtYWxcIik7XHJcbiAgICBcdGxldCBfc3RhcnRfYnV0dG9uX2hvdmVyID0gX3N0YXJ0TGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJzdGFydF9idXR0b246aG92ZXJcIik7XHJcblxyXG4gICAgXHRsZXQgX3N0YXJ0X2J1dHRvbl9ub3JtYWxfdGV4ID0gX3N0YXJ0X2J1dHRvbi50ZXh0dXJlO1xyXG4gICAgXHRsZXQgX3N0YXJ0X2J1dHRvbl9ob3Zlcl90ZXggPSBfc3RhcnRfYnV0dG9uX2hvdmVyLnRleHR1cmU7XHJcbiAgICBcdFxyXG4gICAgXHRfc3RhcnRfYnV0dG9uLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5idXR0b25Nb2RlID0gdHJ1ZTtcclxuXHJcbiAgICBcdF9zdGFydF9idXR0b24ub24oXCJwb2ludGVyb3ZlclwiLCAoKSA9PiB7XHJcbiAgICBcdFx0X3N0YXJ0X2J1dHRvbi50ZXh0dXJlID0gX3N0YXJ0X2J1dHRvbl9ob3Zlcl90ZXg7XHJcbiAgICBcdH0pO1xyXG4gICAgXHRfc3RhcnRfYnV0dG9uLm9uKFwicG9pbnRlcm91dFwiLCAoKSA9PntcclxuICAgIFx0XHRfc3RhcnRfYnV0dG9uLnRleHR1cmUgPSBfc3RhcnRfYnV0dG9uX25vcm1hbF90ZXg7XHJcbiAgICBcdH0pO1xyXG5cclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5vbihcInBvaW50ZXJ0YXBcIiwgKCkgPT57XHJcbiAgICBcdFx0XHJcbiAgICBcdFx0X3N0YXJ0TGF5ZXIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgXHRcdHdpbmRvdy5Mb2FkR2FtZSgpO1xyXG4gICAgXHR9KVxyXG4gICAgfVxyXG59IiwiXHJcbmxldCBQYXJzZUNvbG9yID0gZnVuY3Rpb24odmFsdWUpe1xyXG5cdFxyXG5cdGlmKCF2YWx1ZSlcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG5cdGlmKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKVxyXG5cdHtcclxuXHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiNcIixcIlwiKTtcclxuXHRcdGlmKHZhbHVlLmxlbmd0aCA+IDYpXHJcblx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDIpO1xyXG5cclxuXHRcdGxldCBwYXJzZSA9IHBhcnNlSW50KHZhbHVlLCAxNik7XHJcblx0XHRyZXR1cm4gcGFyc2U7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmxldCBQYXJzZUFscGhhID0gZnVuY3Rpb24odmFsdWUpe1xyXG5cdFxyXG5cdGlmKCF2YWx1ZSlcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG5cdGlmKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKVxyXG5cdHtcclxuXHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiNcIixcIlwiKTtcclxuXHRcdGlmKHZhbHVlLmxlbmd0aCA+IDYpXHJcblx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsMik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiAxO1xyXG5cclxuXHRcdGxldCBwYXJzZSA9IHBhcnNlSW50KHZhbHVlLCAxNik7XHJcblx0XHRyZXR1cm4gcGFyc2UgLyAyNTY7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcblx0UGFyc2VDb2xvcixcclxuXHRQYXJzZUFscGhhXHJcbn1cclxuIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnN0cnVjdG9yU3ByaXRyKG9iaikge1xyXG5cdGxldCBfbyA9IG9iajsgXHJcblxyXG5cdGxldCBzcHIgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKF9vLnVybCk7XHJcblx0c3ByLm5hbWUgPSBfby5uYW1lO1xyXG5cdHNwci5hbmNob3Iuc2V0KDAsIDEpOyAvLyBzZXQgZG93biB0byBhbmNob3JcclxuXHRcclxuXHRpZihfby53aWR0aClcclxuXHRcdHNwci53aWR0aCA9IF9vLndpZHRoO1xyXG5cdFxyXG5cdGlmKF9vLmhlaWdodClcclxuXHRcdHNwci5oZWlnaHQgPSBfby5oZWlnaHQ7XHJcblx0XHJcblx0c3ByLnJvdGF0aW9uID0gKF9vLnJvdGF0aW9uIHx8IDApICAqIE1hdGguUEkgLyAxODA7XHJcblx0c3ByLnggPSBfby54O1xyXG5cdHNwci55ID0gX28ueTtcclxuXHRzcHIudmlzaWJsZSA9IF9vLnZpc2libGUgPT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vLnZpc2libGU7XHJcblx0XHJcblx0c3ByLnR5cGVzID0gX28udHlwZSA/IF9vLnR5cGUuc3BsaXQoXCI6XCIpOiBbXTtcclxuXHJcblx0aWYoX28ucHJvcGVydGllcylcclxuXHR7XHJcblx0XHRzcHIuYWxwaGEgPSBfby5wcm9wZXJ0aWVzLm9wYWNpdHkgfHwgMTtcclxuXHRcdE9iamVjdC5hc3NpZ24oc3ByLCBfby5wcm9wZXJ0aWVzKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzcHI7XHJcbn0iLCJpbXBvcnQge1BhcnNlQ29sb3IsUGFyc2VBbHBoYSB9IGZyb20gXCIuL0NvbG9yUGFyc2VyXCJcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25zdHJ1Y3RvclRleHQob2JqLCApIHtcclxuXHJcblx0bGV0IF9vID0gb2JqO1xyXG5cdGxldCBfY29udCA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRsZXQgX3RleHQgPSBuZXcgUElYSS5UZXh0KCk7XHJcblx0X3RleHQubmFtZSA9IF9vLm5hbWUgKyBcIl9UZXh0XCI7XHJcblxyXG5cdF9jb250Lm5hbWUgPSBfby5uYW1lO1xyXG5cdF9jb250LnR5cGVzID0gX28udHlwZSA/IF9vLnR5cGUuc3BsaXQoXCI6XCIpOiBbXTtcclxuXHJcblxyXG5cdF9jb250LndpZHRoID0gX28ud2lkdGg7XHJcblx0X2NvbnQuaGVpZ2h0ID0gX28uaGVpZ2h0O1xyXG5cclxuXHQvL19jb250LmxpbmVTdHlsZSgyLCAweEZGMDBGRiwgMSk7XHJcblx0Ly9fY29udC5iZWdpbkZpbGwoMHhGRjAwQkIsIDAuMjUpO1xyXG5cdC8vX2NvbnQuZHJhd1JvdW5kZWRSZWN0KDAsIDAsIF9vLndpZHRoLCBfby5oZWlnaHQpO1xyXG5cdC8vX2NvbnQuZW5kRmlsbCgpO1xyXG5cclxuXHRfY29udC5waXZvdC5zZXQoMCwwKTtcclxuXHJcblx0X2NvbnQucm90YXRpb24gPSBfby5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XHJcblx0X2NvbnQuYWxwaGEgPSBQYXJzZUFscGhhKF9vLnRleHQuY29sb3IpIHx8IDE7XHJcblx0X3RleHQudGV4dCA9IF9vLnRleHQudGV4dDtcclxuXHJcblx0c3dpdGNoIChfby50ZXh0LmhhbGlnaCkge1xyXG5cdFx0Y2FzZSBcInJpZ2h0XCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiY2VudGVyXCI6XHJcblx0XHRcdFx0e1xyXG5cclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci54ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoICogMC41O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAwO1xyXG5cdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnggPSAwO1x0XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHRzd2l0Y2ggKF9vLnRleHQudmFsaWduKSB7XHJcblx0XHRjYXNlIFwiYm90dG9tXCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnkgPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBcImNlbnRlclwiOlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci55ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodCAqIDAuNTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0e1xyXG5cclxuXHRcdFx0XHRfdGV4dC5hbmNob3IueSA9IDA7XHJcblx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHJcblx0X2NvbnQucG9zaXRpb24uc2V0KF9vLngsIF9vLnkpO1xyXG5cdF90ZXh0LnN0eWxlID0ge1xyXG5cdFx0d29yZFdyYXA6IF9vLnRleHQud3JhcCxcclxuXHRcdGZpbGw6IFBhcnNlQ29sb3IoX28udGV4dC5jb2xvcikgfHwgMHgwMDAwMDAsXHJcblx0XHRhbGlnbjogX28udGV4dC52YWxpZ24gfHwgXCJjZW50ZXJcIixcclxuXHRcdGZvbnRTaXplOiBfby50ZXh0LnBpeGVsc2l6ZSB8fCAyNCxcclxuXHRcdGZvbnRGYW1pbHk6IF9vLnRleHQuZm9udGZhbWlseSB8fCBcIkFyaWFsXCIsXHJcblx0XHRmb250V2VpZ2h0OiBfby50ZXh0LmJvbGQgPyBcImJvbGRcIjogXCJub3JtYWxcIixcclxuXHRcdGZvbnRTdHlsZTogX28udGV4dC5pdGFsaWMgPyBcIml0YWxpY1wiIDogXCJub3JtYWxcIlxyXG5cdFx0fTtcclxuXHJcblx0aWYoX28ucHJvcGVydGllcylcclxuXHR7XHJcblx0XHRfdGV4dC5zdHlsZS5zdHJva2UgPSAgUGFyc2VDb2xvcihfby5wcm9wZXJ0aWVzLnN0cm9rZUNvbG9yKSB8fCAwO1xyXG5cdFx0X3RleHQuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzID0gIF9vLnByb3BlcnRpZXMuc3Ryb2tlVGhpY2tuZXNzIHx8IDA7XHJcblx0XHRcclxuXHRcdE9iamVjdC5hc3NpZ24oX2NvbnQsIF9vLnByb3BlcnRpZXMpO1xyXG5cdH1cclxuXHJcblx0Ly9fY29udC5wYXJlbnRHcm91cCA9IF9sYXllci5ncm91cDtcclxuXHRfY29udC5hZGRDaGlsZChfdGV4dCk7XHJcblx0Ly9fc3RhZ2UuYWRkQ2hpbGQoX2NvbnQpO1xyXG5cdHJldHVybiBfY29udDtcclxufSIsImltcG9ydCBDVGV4dCBmcm9tIFwiLi9Db25zdHJ1Y3RvclRleHRcIlxyXG5pbXBvcnQgQ1Nwcml0ZSBmcm9tIFwiLi9Db25zdHJ1Y3RvclNwcml0ZVwiXHJcblxyXG5sZXQgTGF5ZXIgPSBQSVhJLmRpc3BsYXkuTGF5ZXI7XHJcbmxldCBHcm91cCA9IFBJWEkuZGlzcGxheS5Hcm91cDtcclxubGV0IFN0YWdlID0gUElYSS5kaXNwbGF5LlN0YWdlO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE9HUGFyc2VyKCl7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIChyZXNvdXJjZSwgbmV4dCkge1xyXG5cdFx0Ly9mYWxsYmFjayBcclxuXHRcdFxyXG4gICAgICAgIGlmICghcmVzb3VyY2UuZGF0YSB8fCAhKHJlc291cmNlLmRhdGEudHlwZSAhPT0gdW5kZWZpbmVkICYmIHJlc291cmNlLmRhdGEudHlwZSA9PSAnbWFwJykpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRpbGVkIE9HIGltcG9ydGVyIVxcbiBlWHBvbmVudGEge3JvbmRvLmRldmlsW2FdZ21haWwuY29tfVwiKTtcclxuICAgICAgICBsZXQgX2RhdGEgPSByZXNvdXJjZS5kYXRhOyBcclxuICAgICAgICBsZXQgX3N0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgIF9zdGFnZS5sYXllckhlaWdodCA9IF9kYXRhLmhlaWdodDtcclxuICAgICAgICBfc3RhZ2UubGF5ZXJXaWR0aCA9IF9kYXRhLndpZHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGJhc2VVcmwgPSByZXNvdXJjZS51cmwucmVwbGFjZSh0aGlzLmJhc2VVcmwsXCJcIik7XHJcbiAgICAgICAgbGV0IGxhc3RJbmRleE9mID0gYmFzZVVybC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYobGFzdEluZGV4T2YgPT0gLTEpXHJcbiAgICAgICAgXHRsYXN0SW5kZXhPZiA9IGJhc2VVcmwubGFzdEluZGV4T2YoXCJcXFxcXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGxhc3RJbmRleE9mID09IC0xIClcclxuICAgIFx0e1xyXG4gICAgXHRcdGNvbnNvbGUubG9nKFwiQ2FuJ3QgcGFyc2U6XCIgKyBiYXNlVXJsKTtcclxuICAgIFx0XHRuZXh0KCk7XHJcbiAgICBcdFx0cmV0dXJuO1xyXG4gICAgXHR9XHJcblxyXG4gICAgICAgIGJhc2VVcmwgPSBiYXNlVXJsLnN1YnN0cmluZygwLCBsYXN0SW5kZXhPZik7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZyhcIkRpciB1cmw6XCIgKyBiYXNlVXJsKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGxvYWRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogcmVzb3VyY2UuY3Jvc3NPcmlnaW4sXHJcbiAgICAgICAgICAgIGxvYWRUeXBlOiBQSVhJLmxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLFxyXG4gICAgICAgICAgICBwYXJlbnRSZXNvdXJjZTogcmVzb3VyY2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0NoZWNrIFRpbGVyIE1hcCB0eXBlXHJcbiAgICAgICAvLyBpZihfZGF0YS50eXBlICE9PSB1bmRlZmluZWQgJiYgX2RhdGEudHlwZSA9PSAnbWFwJylcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIFx0aWYoX2RhdGEubGF5ZXJzKSBcclxuICAgICAgICBcdHtcclxuICAgICAgICBcdFx0Zm9yKGxldCBpID0gMDsgaSA8IF9kYXRhLmxheWVycy5sZW5ndGg7IGkrKylcclxuICAgICAgICBcdFx0e1xyXG4gICAgICAgIFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdGxldCBfbCA9IF9kYXRhLmxheWVyc1tpXTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRpZihfbC50eXBlICE9PSBcIm9iamVjdGdyb3VwXCIgJiYgX2wudHlwZSAhPT0gXCJpbWFnZWxheWVyXCIpXHJcbiAgICAgICAgXHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiT0dQYXJzZXIgc3VwcG9ydCBvbmx5IE9CSkVDVCBvciBJTUFHRSBsYXllcyEhXCIpO1xyXG4gICAgICAgIFx0XHRcdFx0Ly9uZXh0KCk7XHJcbiAgICAgICAgXHRcdFx0XHQvL3JldHVybjtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0aWYoX2wucHJvcGVydGllcyAmJiAoX2wucHJvcGVydGllcy5pZ25vcmUgfHwgX2wucHJvcGVydGllcy5pZ25vcmVMb2FkKSl7XHJcblxyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coXCJPR1BhcnNlcjogaWdub3JlIGxvYWRpbmcgbGF5ZXI6XCIgKyBfbC5uYW1lKTtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0XHJcbiAgICAgICAgXHRcdFx0bGV0IF9ncm91cCA9IG5ldyBHcm91cCggX2wucHJvcGVydGllcyA/IChfbC5wcm9wZXJ0aWVzLnpPcmRlciB8fCBpKSA6IGksIHRydWUpO1xyXG4gICAgICAgIFx0XHRcdGxldCBfbGF5ZXIgPSBuZXcgTGF5ZXIoX2dyb3VwKTtcclxuICAgICAgICBcdFx0XHRfbGF5ZXIubmFtZSA9IF9sLm5hbWU7XHJcbiAgICAgICAgXHRcdFx0X3N0YWdlW19sLm5hbWVdID0gX2xheWVyO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci52aXNpYmxlID0gX2wudmlzaWJsZTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRfbGF5ZXIucG9zaXRpb24uc2V0KF9sLngsIF9sLnkpO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci5hbHBoYSA9IF9sLm9wYWNpdHkgfHwgMTtcclxuXHJcbiAgICAgICAgXHRcdFx0X3N0YWdlLmFkZENoaWxkKF9sYXllcik7XHJcbiAgICAgICAgXHRcdFx0aWYoX2wudHlwZSA9PSBcImltYWdlbGF5ZXJcIil7XHJcblx0ICAgICAgICBcdFx0XHRfbC5vYmplY3RzID0gW1xyXG5cdCAgICAgICAgXHRcdFx0XHR7XHJcblx0ICAgICAgICBcdFx0XHRcdFx0aW1hZ2U6IF9sLmltYWdlLFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdG5hbWU6IF9sLm5hbWUsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eDogX2wueCAsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eTogX2wueSArIF9zdGFnZS5sYXllckhlaWdodCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL3dpZHRoOiBfbC53aWR0aCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL2hlaWdodDogX2wuaGVpZ2h0LFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdHByb3BlcnRpZXM6IF9sLnByb3BlcnRpZXMsXHJcblx0ICAgICAgICBcdFx0XHRcdH1cclxuXHQgICAgICAgIFx0XHRcdF07XHJcbiAgICAgICAgXHRcdFx0fVxyXG5cclxuICAgICAgICBcdFx0XHRpZihfbC5vYmplY3RzKSBcclxuICAgICAgICBcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IF9sLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgXHRcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX28gPSBfbC5vYmplY3RzW2pdO1xyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX29iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgXHRcdFx0XHRcdGlmKCFfby5uYW1lIHx8IF9vLm5hbWUgPT0gXCJcIilcclxuICAgICAgICBcdFx0XHRcdFx0XHRfby5uYW1lID0gXCJvYmpfXCIgKyBqO1xyXG4gICAgICAgIFx0XHRcdFx0XHQvLyBpbWFnZSBMb2FkZXJcclxuXHRcdFx0XHRcdFx0XHRpZihfZGF0YS50aWxlc2V0cyAmJiBfZGF0YS50aWxlc2V0cy5sZW5ndGggPiAwICYmIF9vLmdpZCB8fCBfby5pbWFnZSlcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRpZighX28uaW1hZ2Upe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgX3RzID0gdW5kZWZpbmVkOyAvL19kYXRhLnRpbGVzZXRzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgX2RhdGEudGlsZXNldHMubGVuZ3RoOyBpICsrKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihfZGF0YS50aWxlc2V0c1tpXS5maXJzdGdpZCA8PSBfby5naWQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0X3RzID0gX2RhdGEudGlsZXNldHNbaV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZighX3RzKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkltYWdlIHdpdGggZ2lkOlwiICsgX28uZ2lkICsgXCIgbm90IGZvdW5kIVwiKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBfcmVhbEdpZCA9IF9vLmdpZCAtIF90cy5maXJzdGdpZDtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdGxldCBfaW1nID0gX3RzLnRpbGVzW1wiXCIgKyBfcmVhbEdpZF07XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdF9vLnVybCA9ICBiYXNlVXJsICsgXCIvXCIgKyBfaW1nLmltYWdlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRpZighX2ltZyl7XHJcblxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHRjb25zb2xlLmxvZyhcIkxvYWQgcmVzIE1JU1NFRCBnaWQ6XCIgKyBfcmVhbEdpZCArIFwiIHVybDpcIiArIHVybCk7XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0fVxyXG5cdFx0XHRcdFx0ICAgICAgICBcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0X28udXJsID0gIGJhc2VVcmwgKyBcIi9cIiArIF9vLmltYWdlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0IFxyXG5cdFx0XHRcdFx0ICAgICAgICBcdH1cclxuXHRcdFx0XHRcdCAgICAgICAgXHRcclxuXHRcdFx0XHRcdCAgICAgICAgXHQvL1Nwcml0ZSBMb2FkZXJcclxuXHRcdFx0XHRcdCAgICAgICAgXHRfb2JqID0gQ1Nwcml0ZShfbyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBUZXh0TG9hZGVyXHJcblx0XHRcdFx0XHRcdFx0aWYoX28udGV4dCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0X29iaiA9IENUZXh0KF9vKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYoX29iail7XHJcblx0XHRcdFx0XHRcdFx0XHRfb2JqLnBhcmVudEdyb3VwID0gX2xheWVyLmdyb3VwO1xyXG5cdFx0XHRcdFx0XHRcdFx0X3N0YWdlLmFkZENoaWxkKF9vYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvdXJjZS5zdGFnZSA9IF9zdGFnZTtcclxuXHJcblx0XHQvLyBjYWxsIG5leHQgbG9hZGVyXHJcblx0XHRuZXh0KCk7XHJcblxyXG5cdH07XHJcbn1cclxuIiwiaW1wb3J0IE9HUGFyc2VyIGZyb20gXCIuL09HUGFyc2VyXCJcclxuXHJcblBJWEkubG9hZGVycy5Mb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoT0dQYXJzZXIpO1xyXG5QSVhJLmxvYWRlci51c2UoT0dQYXJzZXIoKSk7XHJcbi8vIG5vdGhpbmcgdG8gZXhwb3J0XHJcbiIsImltcG9ydCBcIi4vUGl4aUhlbHBlclwiO1xyXG5cclxuaW1wb3J0IF9CYXNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL0Jhc2VMYXllclwiXHJcbmltcG9ydCBfU2xpY2VTdGFnZUNyZWF0ZXIgZnJvbSBcIi4vU2xpY2VMYXllclwiXHJcblxyXG5pbXBvcnQgXCIuL1RpbGVkT0dMb2FkZXIvVGlsZWRPYmpHcm91cExvYWRlclwiXHJcbmltcG9ydCBcIi4vRHJhZ29uQm9uZUxvYWRlclwiO1xyXG5cclxuXHJcbnZhciBfQXBwID0gbnVsbCxcclxuICBfTFJlcyA9IG51bGwsXHJcbiAgLy9fUmVuZGVyZXIgPSBudWxsLFxyXG4gIC8vX0ludE1hbmFnZXIgPSBudWxsLFxyXG4gIF9TbGljZWRTdGFnZSA9IG51bGw7XHJcblxyXG52YXIgSW5pdCA9IGZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgX0FwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHtcclxuICAgIHdpZHRoOiAxOTIwLFxyXG4gICAgaGVpZ2h0OiAxMDgwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweGZmZmZmZlxyXG4gIH0pO1xyXG5cclxuICAvL9Ci0LDQuiDQvdCw0LTQviwg0YHRgtCw0L3QtNCw0YDRgtC90YvQtSDQvdC1INCx0YPQtNGD0YIg0L7RgtC+0LHRgNCw0LbQsNGC0YHRj1xyXG4gIF9BcHAuc3RhZ2UgPSBuZXcgUElYSS5kaXNwbGF5LlN0YWdlKCk7XHJcblxyXG4gIF9MUmVzID0gX0FwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG4gIHdpbmRvdy5fTFJlcyA9IF9MUmVzO1xyXG5cclxuLy8gIF9JbnRNYW5hZ2VyID0gX0FwcC5yZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9BcHAudmlldyk7XHJcbiAgb25SZXNpemUoKTtcclxuICB3aW5kb3cub25yZXNpemUgPSBvblJlc2l6ZTtcclxuXHJcbiAgX0Jhc2VTdGFnZUNyZWF0ZXIoX0FwcCk7XHJcbi8vICBfQXBwLnN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIFxyXG59O1xyXG5cclxuLy9pbnZva2VkIGFmdGVyIGxvYWRpbmcgZ2FtZSByZXNvdXJjZXNcclxudmFyIEdhbWVMb2FkZWQgPSBmdW5jdGlvbiBHYW1lTG9hZGVkKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiR2FtZSBpcyBsb2FkZWRcIik7XHJcblxyXG4gIF9TbGljZWRTdGFnZSA9ICBfU2xpY2VTdGFnZUNyZWF0ZXIoX0FwcCk7IC8vX0xSZXMuc2xpY2VfanMuZnVuY3Rpb24oX0FwcCk7XHJcblxyXG4gIF9BcHAuc3RhZ2UuYWRkQ2hpbGQoX1NsaWNlZFN0YWdlKTtcclxuXHJcbiAgX0FwcC5Mb2FkU3RhZ2UuZGVzdHJveSgpO1xyXG59O1xyXG5cclxudmFyIExvYWRHYW1lID0gZnVuY3Rpb24gTG9hZEdhbWUoKSB7XHJcbiAgdmFyIGxvYWRlciA9IF9BcHAubG9hZGVyO1xyXG5cclxuICBsb2FkZXJcclxuICAgIC5hZGQoXCJibGFkZV90ZXhcIiwgXCIuL3NyYy9pbWFnZXMvYmxhZGUucG5nXCIpXHJcbiAgICAuYWRkKFwiYnVubnlcIiwgXCIuL3NyYy9pbWFnZXMvYnVubnlfc3MuanNvblwiKVxyXG4gICAgLmxvYWQoZnVuY3Rpb24obCwgcmVzKSB7XHJcblxyXG4gICAgICBHYW1lTG9hZGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0IGxvYWRcIik7XHJcbn07XHJcblxyXG4vLyByZXNpemVcclxudmFyIG9uUmVzaXplID0gZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcclxuICB2YXIgX3cgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gIHZhciBfaCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBpZiAoX3cgLyBfaCA8IDE2IC8gOSkge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX3cgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX3cgKiA5IC8gMTYgKyBcInB4XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF9oICogMTYgLyA5ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF9oICsgXCJweFwiO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5Mb2FkR2FtZSA9IExvYWRHYW1lO1xyXG53aW5kb3cub25sb2FkID0gSW5pdDsiXX0=
