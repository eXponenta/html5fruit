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

			res.obj_ske.onLoad.add(function (x) {

				x.orange = x.orange.create();
				_baseStage.addChild(x.orange);
				x.orange.position.set(100, 100);
				x.orange.animation.play("idle");
				x.orange.interactive = true;

				var _state_show = null;
				x.orange.on("pointerover", function () {
					_state_show = x.orange.animation.fadeIn("show", 0.2, 1);
				});

				x.orange.on("pointerout", function () {
					if (!_state_show) {
						x.orange.animation.fadeIn("idle", 0.2, 1);
					} else {
						_state_show.play();
						_state_show.timeScale = -1;
					}
				});
			});

			if (res.flag_ske.onLoad) {

				res.flag_ske.onLoad.add(function (x) {

					if (!x.instance) {
						x.Flag = x.Flag.create();
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
(function (global){
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

		res.onLoad = new _signals.Signal();

		var _data = res.data;

		// add TextureDataJson
		//run new Loader
		var l = new PIXI.loaders.Loader();
		l.add(res.name + "_tex", res.url.replace("ske.json", "tex.json")).add(res.name + "_img", res.url.replace("ske.json", "tex.png")).load(function (_l, _res) {

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

			res.onLoad.dispatch(res.objects);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9AcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cvbGliL2ZpbHRlci1kcm9wLXNoYWRvdy5qcyIsIm5vZGVfbW9kdWxlcy9zaWduYWxzL2Rpc3Qvc2lnbmFscy5qcyIsInNyY1xcc2NyaXB0c1xcQmFzZUxheWVyLmpzIiwic3JjXFxzY3JpcHRzXFxCbGFkZS5qcyIsInNyY1xcc2NyaXB0c1xcc3JjXFxzY3JpcHRzXFxEcmFnb25Cb25lTG9hZGVyLmpzIiwic3JjXFxzY3JpcHRzXFxQaXhpSGVscGVyLmpzIiwic3JjXFxzY3JpcHRzXFxTbGljYWJsZU9iamVjdC5qcyIsInNyY1xcc2NyaXB0c1xcU2xpY2VMYXllci5qcyIsInNyY1xcc2NyaXB0c1xcU3RhcnRMYXllci5qcyIsInNyY1xcc2NyaXB0c1xcVGlsZWRPR0xvYWRlclxcQ29sb3JQYXJzZXIuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXENvbnN0cnVjdG9yU3ByaXRlLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxDb25zdHJ1Y3RvclRleHQuanMiLCJzcmNcXHNjcmlwdHNcXFRpbGVkT0dMb2FkZXJcXE9HUGFyc2VyLmpzIiwic3JjXFxzY3JpcHRzXFxUaWxlZE9HTG9hZGVyXFxUaWxlZE9iakdyb3VwTG9hZGVyLmpzIiwic3JjXFxzY3JpcHRzXFxjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QixZQUFwQjs7QUFFQSxPQUFLLFNBQUwsQ0FBZSxPQUFmO0FBQ0QsQ0FSRDs7QUFVQSxJQUFJLFdBQVcsU0FBUyxRQUFULEdBQW9CO0FBQ2pDLE1BQUksU0FBUyxLQUFLLE1BQWxCOztBQUVBLFNBQ0csR0FESCxDQUNPLFdBRFAsRUFDb0Isd0JBRHBCLEVBRUcsR0FGSCxDQUVPLE9BRlAsRUFFZ0IsNEJBRmhCLEVBR0csSUFISCxDQUdRLFVBQVMsQ0FBVCxFQUFZLEdBQVosRUFBaUI7O0FBRXJCO0FBQ0QsR0FOSDs7QUFRQSxVQUFRLEdBQVIsQ0FBWSxpQkFBWjtBQUNELENBWkQ7O0FBY0E7QUFDQSxJQUFJLFdBQVcsU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQXlCO0FBQ3RDLE1BQUksS0FBSyxTQUFTLElBQVQsQ0FBYyxXQUF2QjtBQUNBLE1BQUksS0FBSyxTQUFTLElBQVQsQ0FBYyxZQUF2Qjs7QUFFQSxNQUFJLEtBQUssRUFBTCxHQUFVLEtBQUssQ0FBbkIsRUFBc0I7QUFDcEIsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixLQUFoQixHQUF3QixLQUFLLElBQTdCO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixNQUFoQixHQUF5QixLQUFLLENBQUwsR0FBUyxFQUFULEdBQWMsSUFBdkM7QUFDRCxHQUhELE1BR087QUFDTCxTQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLEtBQUssRUFBTCxHQUFVLENBQVYsR0FBYyxJQUF0QztBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsS0FBSyxJQUE5QjtBQUNEO0FBQ0YsQ0FYRDs7QUFhQSxPQUFPLFFBQVAsR0FBa0IsUUFBbEI7QUFDQSxPQUFPLE1BQVAsR0FBZ0IsSUFBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBAcGl4aS9maWx0ZXItZHJvcC1zaGFkb3cgLSB2Mi4zLjFcbiAqIENvbXBpbGVkIFdlZCwgMjkgTm92IDIwMTcgMTY6NDU6MTkgVVRDXG4gKlxuICogcGl4aS1maWx0ZXJzIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqL1xuIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZShleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sZSk6ZSh0Ll9fZmlsdGVyX2Ryb3Bfc2hhZG93PXt9KX0odGhpcyxmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgZT1cImF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyBwcm9qZWN0aW9uTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZ2xfUG9zaXRpb24gPSB2ZWM0KChwcm9qZWN0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIixyPVwidmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCBhbHBoYTtcXG51bmlmb3JtIHZlYzMgY29sb3I7XFxudm9pZCBtYWluKHZvaWQpe1xcbiAgICB2ZWM0IHNhbXBsZSA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCk7XFxuXFxuICAgIC8vIFVuLXByZW11bHRpcGx5IGFscGhhIGJlZm9yZSBhcHBseWluZyB0aGUgY29sb3JcXG4gICAgaWYgKHNhbXBsZS5hID4gMC4wKSB7XFxuICAgICAgICBzYW1wbGUucmdiIC89IHNhbXBsZS5hO1xcbiAgICB9XFxuXFxuICAgIC8vIFByZW11bHRpcGx5IGFscGhhIGFnYWluXFxuICAgIHNhbXBsZS5yZ2IgPSBjb2xvci5yZ2IgKiBzYW1wbGUuYTtcXG5cXG4gICAgLy8gYWxwaGEgdXNlciBhbHBoYVxcbiAgICBzYW1wbGUgKj0gYWxwaGE7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHNhbXBsZTtcXG59XCIsaT1mdW5jdGlvbih0KXtmdW5jdGlvbiBpKGksbixvLGEsbCl7dm9pZCAwPT09aSYmKGk9NDUpLHZvaWQgMD09PW4mJihuPTUpLHZvaWQgMD09PW8mJihvPTIpLHZvaWQgMD09PWEmJihhPTApLHZvaWQgMD09PWwmJihsPS41KSx0LmNhbGwodGhpcyksdGhpcy50aW50RmlsdGVyPW5ldyBQSVhJLkZpbHRlcihlLHIpLHRoaXMuYmx1ckZpbHRlcj1uZXcgUElYSS5maWx0ZXJzLkJsdXJGaWx0ZXIsdGhpcy5ibHVyRmlsdGVyLmJsdXI9byx0aGlzLnRhcmdldFRyYW5zZm9ybT1uZXcgUElYSS5NYXRyaXgsdGhpcy5yb3RhdGlvbj1pLHRoaXMucGFkZGluZz1uLHRoaXMuZGlzdGFuY2U9bix0aGlzLmFscGhhPWwsdGhpcy5jb2xvcj1hfXQmJihpLl9fcHJvdG9fXz10KSwoaS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0JiZ0LnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPWk7dmFyIG49e2Rpc3RhbmNlOntjb25maWd1cmFibGU6ITB9LHJvdGF0aW9uOntjb25maWd1cmFibGU6ITB9LGJsdXI6e2NvbmZpZ3VyYWJsZTohMH0sYWxwaGE6e2NvbmZpZ3VyYWJsZTohMH0sY29sb3I6e2NvbmZpZ3VyYWJsZTohMH19O3JldHVybiBpLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbih0LGUscixpKXt2YXIgbj10LmdldFJlbmRlclRhcmdldCgpO24udHJhbnNmb3JtPXRoaXMudGFyZ2V0VHJhbnNmb3JtLHRoaXMudGludEZpbHRlci5hcHBseSh0LGUsbiwhMCksdGhpcy5ibHVyRmlsdGVyLmFwcGx5KHQsbixyKSx0LmFwcGx5RmlsdGVyKHRoaXMsZSxyLGkpLG4udHJhbnNmb3JtPW51bGwsdC5yZXR1cm5SZW5kZXJUYXJnZXQobil9LGkucHJvdG90eXBlLl91cGRhdGVQYWRkaW5nPWZ1bmN0aW9uKCl7dGhpcy5wYWRkaW5nPXRoaXMuZGlzdGFuY2UrMip0aGlzLmJsdXJ9LGkucHJvdG90eXBlLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm09ZnVuY3Rpb24oKXt0aGlzLnRhcmdldFRyYW5zZm9ybS50eD10aGlzLmRpc3RhbmNlKk1hdGguY29zKHRoaXMuYW5nbGUpLHRoaXMudGFyZ2V0VHJhbnNmb3JtLnR5PXRoaXMuZGlzdGFuY2UqTWF0aC5zaW4odGhpcy5hbmdsZSl9LG4uZGlzdGFuY2UuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2Rpc3RhbmNlfSxuLmRpc3RhbmNlLnNldD1mdW5jdGlvbih0KXt0aGlzLl9kaXN0YW5jZT10LHRoaXMuX3VwZGF0ZVBhZGRpbmcoKSx0aGlzLl91cGRhdGVUYXJnZXRUcmFuc2Zvcm0oKX0sbi5yb3RhdGlvbi5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hbmdsZS9QSVhJLkRFR19UT19SQUR9LG4ucm90YXRpb24uc2V0PWZ1bmN0aW9uKHQpe3RoaXMuYW5nbGU9dCpQSVhJLkRFR19UT19SQUQsdGhpcy5fdXBkYXRlVGFyZ2V0VHJhbnNmb3JtKCl9LG4uYmx1ci5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibHVyRmlsdGVyLmJsdXJ9LG4uYmx1ci5zZXQ9ZnVuY3Rpb24odCl7dGhpcy5ibHVyRmlsdGVyLmJsdXI9dCx0aGlzLl91cGRhdGVQYWRkaW5nKCl9LG4uYWxwaGEuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGludEZpbHRlci51bmlmb3Jtcy5hbHBoYX0sbi5hbHBoYS5zZXQ9ZnVuY3Rpb24odCl7dGhpcy50aW50RmlsdGVyLnVuaWZvcm1zLmFscGhhPXR9LG4uY29sb3IuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIFBJWEkudXRpbHMucmdiMmhleCh0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxuLmNvbG9yLnNldD1mdW5jdGlvbih0KXtQSVhJLnV0aWxzLmhleDJyZ2IodCx0aGlzLnRpbnRGaWx0ZXIudW5pZm9ybXMuY29sb3IpfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpLnByb3RvdHlwZSxuKSxpfShQSVhJLkZpbHRlcik7UElYSS5maWx0ZXJzLkRyb3BTaGFkb3dGaWx0ZXI9aSx0LkRyb3BTaGFkb3dGaWx0ZXI9aSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsdGVyLWRyb3Atc2hhZG93LmpzLm1hcFxuIiwiLypqc2xpbnQgb25ldmFyOnRydWUsIHVuZGVmOnRydWUsIG5ld2NhcDp0cnVlLCByZWdleHA6dHJ1ZSwgYml0d2lzZTp0cnVlLCBtYXhlcnI6NTAsIGluZGVudDo0LCB3aGl0ZTpmYWxzZSwgbm9tZW46ZmFsc2UsIHBsdXNwbHVzOmZhbHNlICovXG4vKmdsb2JhbCBkZWZpbmU6ZmFsc2UsIHJlcXVpcmU6ZmFsc2UsIGV4cG9ydHM6ZmFsc2UsIG1vZHVsZTpmYWxzZSwgc2lnbmFsczpmYWxzZSAqL1xuXG4vKiogQGxpY2Vuc2VcbiAqIEpTIFNpZ25hbHMgPGh0dHA6Ly9taWxsZXJtZWRlaXJvcy5naXRodWIuY29tL2pzLXNpZ25hbHMvPlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBBdXRob3I6IE1pbGxlciBNZWRlaXJvc1xuICogVmVyc2lvbjogMS4wLjAgLSBCdWlsZDogMjY4ICgyMDEyLzExLzI5IDA1OjQ4IFBNKVxuICovXG5cbihmdW5jdGlvbihnbG9iYWwpe1xuXG4gICAgLy8gU2lnbmFsQmluZGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvKipcbiAgICAgKiBPYmplY3QgdGhhdCByZXByZXNlbnRzIGEgYmluZGluZyBiZXR3ZWVuIGEgU2lnbmFsIGFuZCBhIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICAgICAqIDxiciAvPi0gPHN0cm9uZz5UaGlzIGlzIGFuIGludGVybmFsIGNvbnN0cnVjdG9yIGFuZCBzaG91bGRuJ3QgYmUgY2FsbGVkIGJ5IHJlZ3VsYXIgdXNlcnMuPC9zdHJvbmc+XG4gICAgICogPGJyIC8+LSBpbnNwaXJlZCBieSBKb2EgRWJlcnQgQVMzIFNpZ25hbEJpbmRpbmcgYW5kIFJvYmVydCBQZW5uZXIncyBTbG90IGNsYXNzZXMuXG4gICAgICogQGF1dGhvciBNaWxsZXIgTWVkZWlyb3NcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKiBAbmFtZSBTaWduYWxCaW5kaW5nXG4gICAgICogQHBhcmFtIHtTaWduYWx9IHNpZ25hbCBSZWZlcmVuY2UgdG8gU2lnbmFsIG9iamVjdCB0aGF0IGxpc3RlbmVyIGlzIGN1cnJlbnRseSBib3VuZCB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBIYW5kbGVyIGZ1bmN0aW9uIGJvdW5kIHRvIHRoZSBzaWduYWwuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc09uY2UgSWYgYmluZGluZyBzaG91bGQgYmUgZXhlY3V0ZWQganVzdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbbGlzdGVuZXJDb250ZXh0XSBDb250ZXh0IG9uIHdoaWNoIGxpc3RlbmVyIHdpbGwgYmUgZXhlY3V0ZWQgKG9iamVjdCB0aGF0IHNob3VsZCByZXByZXNlbnQgdGhlIGB0aGlzYCB2YXJpYWJsZSBpbnNpZGUgbGlzdGVuZXIgZnVuY3Rpb24pLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcHJpb3JpdHldIFRoZSBwcmlvcml0eSBsZXZlbCBvZiB0aGUgZXZlbnQgbGlzdGVuZXIuIChkZWZhdWx0ID0gMCkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gU2lnbmFsQmluZGluZyhzaWduYWwsIGxpc3RlbmVyLCBpc09uY2UsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmdW5jdGlvbiBib3VuZCB0byB0aGUgc2lnbmFsLlxuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBsaXN0ZW5lcjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYmluZGluZyBzaG91bGQgYmUgZXhlY3V0ZWQganVzdCBvbmNlLlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc09uY2UgPSBpc09uY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnRleHQgb24gd2hpY2ggbGlzdGVuZXIgd2lsbCBiZSBleGVjdXRlZCAob2JqZWN0IHRoYXQgc2hvdWxkIHJlcHJlc2VudCB0aGUgYHRoaXNgIHZhcmlhYmxlIGluc2lkZSBsaXN0ZW5lciBmdW5jdGlvbikuXG4gICAgICAgICAqIEBtZW1iZXJPZiBTaWduYWxCaW5kaW5nLnByb3RvdHlwZVxuICAgICAgICAgKiBAbmFtZSBjb250ZXh0XG4gICAgICAgICAqIEB0eXBlIE9iamVjdHx1bmRlZmluZWR8bnVsbFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbGlzdGVuZXJDb250ZXh0O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWZlcmVuY2UgdG8gU2lnbmFsIG9iamVjdCB0aGF0IGxpc3RlbmVyIGlzIGN1cnJlbnRseSBib3VuZCB0by5cbiAgICAgICAgICogQHR5cGUgU2lnbmFsXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9zaWduYWwgPSBzaWduYWw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExpc3RlbmVyIHByaW9yaXR5XG4gICAgICAgICAqIEB0eXBlIE51bWJlclxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuICAgIH1cblxuICAgIFNpZ25hbEJpbmRpbmcucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBiaW5kaW5nIGlzIGFjdGl2ZSBhbmQgc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqL1xuICAgICAgICBhY3RpdmUgOiB0cnVlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IHBhcmFtZXRlcnMgcGFzc2VkIHRvIGxpc3RlbmVyIGR1cmluZyBgU2lnbmFsLmRpc3BhdGNoYCBhbmQgYFNpZ25hbEJpbmRpbmcuZXhlY3V0ZWAuIChjdXJyaWVkIHBhcmFtZXRlcnMpXG4gICAgICAgICAqIEB0eXBlIEFycmF5fG51bGxcbiAgICAgICAgICovXG4gICAgICAgIHBhcmFtcyA6IG51bGwsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbGwgbGlzdGVuZXIgcGFzc2luZyBhcmJpdHJhcnkgcGFyYW1ldGVycy5cbiAgICAgICAgICogPHA+SWYgYmluZGluZyB3YXMgYWRkZWQgdXNpbmcgYFNpZ25hbC5hZGRPbmNlKClgIGl0IHdpbGwgYmUgYXV0b21hdGljYWxseSByZW1vdmVkIGZyb20gc2lnbmFsIGRpc3BhdGNoIHF1ZXVlLCB0aGlzIG1ldGhvZCBpcyB1c2VkIGludGVybmFsbHkgZm9yIHRoZSBzaWduYWwgZGlzcGF0Y2guPC9wPlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBbcGFyYW1zQXJyXSBBcnJheSBvZiBwYXJhbWV0ZXJzIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCB0byB0aGUgbGlzdGVuZXJcbiAgICAgICAgICogQHJldHVybiB7Kn0gVmFsdWUgcmV0dXJuZWQgYnkgdGhlIGxpc3RlbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZXhlY3V0ZSA6IGZ1bmN0aW9uIChwYXJhbXNBcnIpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyUmV0dXJuLCBwYXJhbXM7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmUgJiYgISF0aGlzLl9saXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHRoaXMucGFyYW1zPyB0aGlzLnBhcmFtcy5jb25jYXQocGFyYW1zQXJyKSA6IHBhcmFtc0FycjtcbiAgICAgICAgICAgICAgICBoYW5kbGVyUmV0dXJuID0gdGhpcy5fbGlzdGVuZXIuYXBwbHkodGhpcy5jb250ZXh0LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc09uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlclJldHVybjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0YWNoIGJpbmRpbmcgZnJvbSBzaWduYWwuXG4gICAgICAgICAqIC0gYWxpYXMgdG86IG15U2lnbmFsLnJlbW92ZShteUJpbmRpbmcuZ2V0TGlzdGVuZXIoKSk7XG4gICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufG51bGx9IEhhbmRsZXIgZnVuY3Rpb24gYm91bmQgdG8gdGhlIHNpZ25hbCBvciBgbnVsbGAgaWYgYmluZGluZyB3YXMgcHJldmlvdXNseSBkZXRhY2hlZC5cbiAgICAgICAgICovXG4gICAgICAgIGRldGFjaCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzQm91bmQoKT8gdGhpcy5fc2lnbmFsLnJlbW92ZSh0aGlzLl9saXN0ZW5lciwgdGhpcy5jb250ZXh0KSA6IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBiaW5kaW5nIGlzIHN0aWxsIGJvdW5kIHRvIHRoZSBzaWduYWwgYW5kIGhhdmUgYSBsaXN0ZW5lci5cbiAgICAgICAgICovXG4gICAgICAgIGlzQm91bmQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKCEhdGhpcy5fc2lnbmFsICYmICEhdGhpcy5fbGlzdGVuZXIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJZiBTaWduYWxCaW5kaW5nIHdpbGwgb25seSBiZSBleGVjdXRlZCBvbmNlLlxuICAgICAgICAgKi9cbiAgICAgICAgaXNPbmNlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzT25jZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IEhhbmRsZXIgZnVuY3Rpb24gYm91bmQgdG8gdGhlIHNpZ25hbC5cbiAgICAgICAgICovXG4gICAgICAgIGdldExpc3RlbmVyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtTaWduYWx9IFNpZ25hbCB0aGF0IGxpc3RlbmVyIGlzIGN1cnJlbnRseSBib3VuZCB0by5cbiAgICAgICAgICovXG4gICAgICAgIGdldFNpZ25hbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zaWduYWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZSBpbnN0YW5jZSBwcm9wZXJ0aWVzXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfZGVzdHJveSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zaWduYWw7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlzdGVuZXI7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jb250ZXh0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdG9TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1tTaWduYWxCaW5kaW5nIGlzT25jZTonICsgdGhpcy5faXNPbmNlICsnLCBpc0JvdW5kOicrIHRoaXMuaXNCb3VuZCgpICsnLCBhY3RpdmU6JyArIHRoaXMuYWN0aXZlICsgJ10nO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbi8qZ2xvYmFsIFNpZ25hbEJpbmRpbmc6ZmFsc2UqL1xuXG4gICAgLy8gU2lnbmFsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUxpc3RlbmVyKGxpc3RlbmVyLCBmbk5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnbGlzdGVuZXIgaXMgYSByZXF1aXJlZCBwYXJhbSBvZiB7Zm59KCkgYW5kIHNob3VsZCBiZSBhIEZ1bmN0aW9uLicucmVwbGFjZSgne2ZufScsIGZuTmFtZSkgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEN1c3RvbSBldmVudCBicm9hZGNhc3RlclxuICAgICAqIDxiciAvPi0gaW5zcGlyZWQgYnkgUm9iZXJ0IFBlbm5lcidzIEFTMyBTaWduYWxzLlxuICAgICAqIEBuYW1lIFNpZ25hbFxuICAgICAqIEBhdXRob3IgTWlsbGVyIE1lZGVpcm9zXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gU2lnbmFsKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUgQXJyYXkuPFNpZ25hbEJpbmRpbmc+XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9iaW5kaW5ncyA9IFtdO1xuICAgICAgICB0aGlzLl9wcmV2UGFyYW1zID0gbnVsbDtcblxuICAgICAgICAvLyBlbmZvcmNlIGRpc3BhdGNoIHRvIGF3YXlzIHdvcmsgb24gc2FtZSBjb250ZXh0ICgjNDcpXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kaXNwYXRjaCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBTaWduYWwucHJvdG90eXBlLmRpc3BhdGNoLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgU2lnbmFsLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2lnbmFscyBWZXJzaW9uIE51bWJlclxuICAgICAgICAgKiBAdHlwZSBTdHJpbmdcbiAgICAgICAgICogQGNvbnN0XG4gICAgICAgICAqL1xuICAgICAgICBWRVJTSU9OIDogJzEuMC4wJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgU2lnbmFsIHNob3VsZCBrZWVwIHJlY29yZCBvZiBwcmV2aW91c2x5IGRpc3BhdGNoZWQgcGFyYW1ldGVycyBhbmRcbiAgICAgICAgICogYXV0b21hdGljYWxseSBleGVjdXRlIGxpc3RlbmVyIGR1cmluZyBgYWRkKClgL2BhZGRPbmNlKClgIGlmIFNpZ25hbCB3YXNcbiAgICAgICAgICogYWxyZWFkeSBkaXNwYXRjaGVkIGJlZm9yZS5cbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKi9cbiAgICAgICAgbWVtb3JpemUgOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX3Nob3VsZFByb3BhZ2F0ZSA6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIFNpZ25hbCBpcyBhY3RpdmUgYW5kIHNob3VsZCBicm9hZGNhc3QgZXZlbnRzLlxuICAgICAgICAgKiA8cD48c3Ryb25nPklNUE9SVEFOVDo8L3N0cm9uZz4gU2V0dGluZyB0aGlzIHByb3BlcnR5IGR1cmluZyBhIGRpc3BhdGNoIHdpbGwgb25seSBhZmZlY3QgdGhlIG5leHQgZGlzcGF0Y2gsIGlmIHlvdSB3YW50IHRvIHN0b3AgdGhlIHByb3BhZ2F0aW9uIG9mIGEgc2lnbmFsIHVzZSBgaGFsdCgpYCBpbnN0ZWFkLjwvcD5cbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKi9cbiAgICAgICAgYWN0aXZlIDogdHJ1ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc09uY2VcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtsaXN0ZW5lckNvbnRleHRdXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcHJpb3JpdHldXG4gICAgICAgICAqIEByZXR1cm4ge1NpZ25hbEJpbmRpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBfcmVnaXN0ZXJMaXN0ZW5lciA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgaXNPbmNlLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5KSB7XG5cbiAgICAgICAgICAgIHZhciBwcmV2SW5kZXggPSB0aGlzLl9pbmRleE9mTGlzdGVuZXIobGlzdGVuZXIsIGxpc3RlbmVyQ29udGV4dCksXG4gICAgICAgICAgICAgICAgYmluZGluZztcblxuICAgICAgICAgICAgaWYgKHByZXZJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBiaW5kaW5nID0gdGhpcy5fYmluZGluZ3NbcHJldkluZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZy5pc09uY2UoKSAhPT0gaXNPbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbm5vdCBhZGQnKyAoaXNPbmNlPyAnJyA6ICdPbmNlJykgKycoKSB0aGVuIGFkZCcrICghaXNPbmNlPyAnJyA6ICdPbmNlJykgKycoKSB0aGUgc2FtZSBsaXN0ZW5lciB3aXRob3V0IHJlbW92aW5nIHRoZSByZWxhdGlvbnNoaXAgZmlyc3QuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBiaW5kaW5nID0gbmV3IFNpZ25hbEJpbmRpbmcodGhpcywgbGlzdGVuZXIsIGlzT25jZSwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkQmluZGluZyhiaW5kaW5nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5tZW1vcml6ZSAmJiB0aGlzLl9wcmV2UGFyYW1zKXtcbiAgICAgICAgICAgICAgICBiaW5kaW5nLmV4ZWN1dGUodGhpcy5fcHJldlBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBiaW5kaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge1NpZ25hbEJpbmRpbmd9IGJpbmRpbmdcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9hZGRCaW5kaW5nIDogZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgICAgIC8vc2ltcGxpZmllZCBpbnNlcnRpb24gc29ydFxuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgICAgICAgICBkbyB7IC0tbjsgfSB3aGlsZSAodGhpcy5fYmluZGluZ3Nbbl0gJiYgYmluZGluZy5fcHJpb3JpdHkgPD0gdGhpcy5fYmluZGluZ3Nbbl0uX3ByaW9yaXR5KTtcbiAgICAgICAgICAgIHRoaXMuX2JpbmRpbmdzLnNwbGljZShuICsgMSwgMCwgYmluZGluZyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIF9pbmRleE9mTGlzdGVuZXIgOiBmdW5jdGlvbiAobGlzdGVuZXIsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGN1cjtcbiAgICAgICAgICAgIHdoaWxlIChuLS0pIHtcbiAgICAgICAgICAgICAgICBjdXIgPSB0aGlzLl9iaW5kaW5nc1tuXTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyLl9saXN0ZW5lciA9PT0gbGlzdGVuZXIgJiYgY3VyLmNvbnRleHQgPT09IGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayBpZiBsaXN0ZW5lciB3YXMgYXR0YWNoZWQgdG8gU2lnbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IGlmIFNpZ25hbCBoYXMgdGhlIHNwZWNpZmllZCBsaXN0ZW5lci5cbiAgICAgICAgICovXG4gICAgICAgIGhhcyA6IGZ1bmN0aW9uIChsaXN0ZW5lciwgY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lciwgY29udGV4dCkgIT09IC0xO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgYSBsaXN0ZW5lciB0byB0aGUgc2lnbmFsLlxuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBTaWduYWwgaGFuZGxlciBmdW5jdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtsaXN0ZW5lckNvbnRleHRdIENvbnRleHQgb24gd2hpY2ggbGlzdGVuZXIgd2lsbCBiZSBleGVjdXRlZCAob2JqZWN0IHRoYXQgc2hvdWxkIHJlcHJlc2VudCB0aGUgYHRoaXNgIHZhcmlhYmxlIGluc2lkZSBsaXN0ZW5lciBmdW5jdGlvbikuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbcHJpb3JpdHldIFRoZSBwcmlvcml0eSBsZXZlbCBvZiB0aGUgZXZlbnQgbGlzdGVuZXIuIExpc3RlbmVycyB3aXRoIGhpZ2hlciBwcmlvcml0eSB3aWxsIGJlIGV4ZWN1dGVkIGJlZm9yZSBsaXN0ZW5lcnMgd2l0aCBsb3dlciBwcmlvcml0eS4gTGlzdGVuZXJzIHdpdGggc2FtZSBwcmlvcml0eSBsZXZlbCB3aWxsIGJlIGV4ZWN1dGVkIGF0IHRoZSBzYW1lIG9yZGVyIGFzIHRoZXkgd2VyZSBhZGRlZC4gKGRlZmF1bHQgPSAwKVxuICAgICAgICAgKiBAcmV0dXJuIHtTaWduYWxCaW5kaW5nfSBBbiBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBiaW5kaW5nIGJldHdlZW4gdGhlIFNpZ25hbCBhbmQgbGlzdGVuZXIuXG4gICAgICAgICAqL1xuICAgICAgICBhZGQgOiBmdW5jdGlvbiAobGlzdGVuZXIsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlTGlzdGVuZXIobGlzdGVuZXIsICdhZGQnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3Rlckxpc3RlbmVyKGxpc3RlbmVyLCBmYWxzZSwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBsaXN0ZW5lciB0byB0aGUgc2lnbmFsIHRoYXQgc2hvdWxkIGJlIHJlbW92ZWQgYWZ0ZXIgZmlyc3QgZXhlY3V0aW9uICh3aWxsIGJlIGV4ZWN1dGVkIG9ubHkgb25jZSkuXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIFNpZ25hbCBoYW5kbGVyIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2xpc3RlbmVyQ29udGV4dF0gQ29udGV4dCBvbiB3aGljaCBsaXN0ZW5lciB3aWxsIGJlIGV4ZWN1dGVkIChvYmplY3QgdGhhdCBzaG91bGQgcmVwcmVzZW50IHRoZSBgdGhpc2AgdmFyaWFibGUgaW5zaWRlIGxpc3RlbmVyIGZ1bmN0aW9uKS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtwcmlvcml0eV0gVGhlIHByaW9yaXR5IGxldmVsIG9mIHRoZSBldmVudCBsaXN0ZW5lci4gTGlzdGVuZXJzIHdpdGggaGlnaGVyIHByaW9yaXR5IHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIGxpc3RlbmVycyB3aXRoIGxvd2VyIHByaW9yaXR5LiBMaXN0ZW5lcnMgd2l0aCBzYW1lIHByaW9yaXR5IGxldmVsIHdpbGwgYmUgZXhlY3V0ZWQgYXQgdGhlIHNhbWUgb3JkZXIgYXMgdGhleSB3ZXJlIGFkZGVkLiAoZGVmYXVsdCA9IDApXG4gICAgICAgICAqIEByZXR1cm4ge1NpZ25hbEJpbmRpbmd9IEFuIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIGJpbmRpbmcgYmV0d2VlbiB0aGUgU2lnbmFsIGFuZCBsaXN0ZW5lci5cbiAgICAgICAgICovXG4gICAgICAgIGFkZE9uY2UgOiBmdW5jdGlvbiAobGlzdGVuZXIsIGxpc3RlbmVyQ29udGV4dCwgcHJpb3JpdHkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlTGlzdGVuZXIobGlzdGVuZXIsICdhZGRPbmNlJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lciwgdHJ1ZSwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhIHNpbmdsZSBsaXN0ZW5lciBmcm9tIHRoZSBkaXNwYXRjaCBxdWV1ZS5cbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgSGFuZGxlciBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSByZW1vdmVkLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIEV4ZWN1dGlvbiBjb250ZXh0IChzaW5jZSB5b3UgY2FuIGFkZCB0aGUgc2FtZSBoYW5kbGVyIG11bHRpcGxlIHRpbWVzIGlmIGV4ZWN1dGluZyBpbiBhIGRpZmZlcmVudCBjb250ZXh0KS5cbiAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IExpc3RlbmVyIGhhbmRsZXIgZnVuY3Rpb24uXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmUgOiBmdW5jdGlvbiAobGlzdGVuZXIsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlTGlzdGVuZXIobGlzdGVuZXIsICdyZW1vdmUnKTtcblxuICAgICAgICAgICAgdmFyIGkgPSB0aGlzLl9pbmRleE9mTGlzdGVuZXIobGlzdGVuZXIsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ3NbaV0uX2Rlc3Ryb3koKTsgLy9ubyByZWFzb24gdG8gYSBTaWduYWxCaW5kaW5nIGV4aXN0IGlmIGl0IGlzbid0IGF0dGFjaGVkIHRvIGEgc2lnbmFsXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZGluZ3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYWxsIGxpc3RlbmVycyBmcm9tIHRoZSBTaWduYWwuXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVBbGwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuX2JpbmRpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChuLS0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kaW5nc1tuXS5fZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYmluZGluZ3MubGVuZ3RoID0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7bnVtYmVyfSBOdW1iZXIgb2YgbGlzdGVuZXJzIGF0dGFjaGVkIHRvIHRoZSBTaWduYWwuXG4gICAgICAgICAqL1xuICAgICAgICBnZXROdW1MaXN0ZW5lcnMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmluZGluZ3MubGVuZ3RoO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdG9wIHByb3BhZ2F0aW9uIG9mIHRoZSBldmVudCwgYmxvY2tpbmcgdGhlIGRpc3BhdGNoIHRvIG5leHQgbGlzdGVuZXJzIG9uIHRoZSBxdWV1ZS5cbiAgICAgICAgICogPHA+PHN0cm9uZz5JTVBPUlRBTlQ6PC9zdHJvbmc+IHNob3VsZCBiZSBjYWxsZWQgb25seSBkdXJpbmcgc2lnbmFsIGRpc3BhdGNoLCBjYWxsaW5nIGl0IGJlZm9yZS9hZnRlciBkaXNwYXRjaCB3b24ndCBhZmZlY3Qgc2lnbmFsIGJyb2FkY2FzdC48L3A+XG4gICAgICAgICAqIEBzZWUgU2lnbmFsLnByb3RvdHlwZS5kaXNhYmxlXG4gICAgICAgICAqL1xuICAgICAgICBoYWx0IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fc2hvdWxkUHJvcGFnYXRlID0gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BhdGNoL0Jyb2FkY2FzdCBTaWduYWwgdG8gYWxsIGxpc3RlbmVycyBhZGRlZCB0byB0aGUgcXVldWUuXG4gICAgICAgICAqIEBwYXJhbSB7Li4uKn0gW3BhcmFtc10gUGFyYW1ldGVycyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gZWFjaCBoYW5kbGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZGlzcGF0Y2ggOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAoISB0aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhcmFtc0FyciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXG4gICAgICAgICAgICAgICAgbiA9IHRoaXMuX2JpbmRpbmdzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBiaW5kaW5ncztcblxuICAgICAgICAgICAgaWYgKHRoaXMubWVtb3JpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2UGFyYW1zID0gcGFyYW1zQXJyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoISBuKSB7XG4gICAgICAgICAgICAgICAgLy9zaG91bGQgY29tZSBhZnRlciBtZW1vcml6ZVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmluZGluZ3MgPSB0aGlzLl9iaW5kaW5ncy5zbGljZSgpOyAvL2Nsb25lIGFycmF5IGluIGNhc2UgYWRkL3JlbW92ZSBpdGVtcyBkdXJpbmcgZGlzcGF0Y2hcbiAgICAgICAgICAgIHRoaXMuX3Nob3VsZFByb3BhZ2F0ZSA9IHRydWU7IC8vaW4gY2FzZSBgaGFsdGAgd2FzIGNhbGxlZCBiZWZvcmUgZGlzcGF0Y2ggb3IgZHVyaW5nIHRoZSBwcmV2aW91cyBkaXNwYXRjaC5cblxuICAgICAgICAgICAgLy9leGVjdXRlIGFsbCBjYWxsYmFja3MgdW50aWwgZW5kIG9mIHRoZSBsaXN0IG9yIHVudGlsIGEgY2FsbGJhY2sgcmV0dXJucyBgZmFsc2VgIG9yIHN0b3BzIHByb3BhZ2F0aW9uXG4gICAgICAgICAgICAvL3JldmVyc2UgbG9vcCBzaW5jZSBsaXN0ZW5lcnMgd2l0aCBoaWdoZXIgcHJpb3JpdHkgd2lsbCBiZSBhZGRlZCBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0XG4gICAgICAgICAgICBkbyB7IG4tLTsgfSB3aGlsZSAoYmluZGluZ3Nbbl0gJiYgdGhpcy5fc2hvdWxkUHJvcGFnYXRlICYmIGJpbmRpbmdzW25dLmV4ZWN1dGUocGFyYW1zQXJyKSAhPT0gZmFsc2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGb3JnZXQgbWVtb3JpemVkIGFyZ3VtZW50cy5cbiAgICAgICAgICogQHNlZSBTaWduYWwubWVtb3JpemVcbiAgICAgICAgICovXG4gICAgICAgIGZvcmdldCA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLl9wcmV2UGFyYW1zID0gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGFsbCBiaW5kaW5ncyBmcm9tIHNpZ25hbCBhbmQgZGVzdHJveSBhbnkgcmVmZXJlbmNlIHRvIGV4dGVybmFsIG9iamVjdHMgKGRlc3Ryb3kgU2lnbmFsIG9iamVjdCkuXG4gICAgICAgICAqIDxwPjxzdHJvbmc+SU1QT1JUQU5UOjwvc3Ryb25nPiBjYWxsaW5nIGFueSBtZXRob2Qgb24gdGhlIHNpZ25hbCBpbnN0YW5jZSBhZnRlciBjYWxsaW5nIGRpc3Bvc2Ugd2lsbCB0aHJvdyBlcnJvcnMuPC9wPlxuICAgICAgICAgKi9cbiAgICAgICAgZGlzcG9zZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fYmluZGluZ3M7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJldlBhcmFtcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHRvU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdbU2lnbmFsIGFjdGl2ZTonKyB0aGlzLmFjdGl2ZSArJyBudW1MaXN0ZW5lcnM6JysgdGhpcy5nZXROdW1MaXN0ZW5lcnMoKSArJ10nO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICAvLyBOYW1lc3BhY2UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8qKlxuICAgICAqIFNpZ25hbHMgbmFtZXNwYWNlXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBuYW1lIHNpZ25hbHNcbiAgICAgKi9cbiAgICB2YXIgc2lnbmFscyA9IFNpZ25hbDtcblxuICAgIC8qKlxuICAgICAqIEN1c3RvbSBldmVudCBicm9hZGNhc3RlclxuICAgICAqIEBzZWUgU2lnbmFsXG4gICAgICovXG4gICAgLy8gYWxpYXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IChzZWUgI2doLTQ0KVxuICAgIHNpZ25hbHMuU2lnbmFsID0gU2lnbmFsO1xuXG5cblxuICAgIC8vZXhwb3J0cyB0byBtdWx0aXBsZSBlbnZpcm9ubWVudHNcbiAgICBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpeyAvL0FNRFxuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2lnbmFsczsgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyl7IC8vbm9kZVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHNpZ25hbHM7XG4gICAgfSBlbHNlIHsgLy9icm93c2VyXG4gICAgICAgIC8vdXNlIHN0cmluZyBiZWNhdXNlIG9mIEdvb2dsZSBjbG9zdXJlIGNvbXBpbGVyIEFEVkFOQ0VEX01PREVcbiAgICAgICAgLypqc2xpbnQgc3ViOnRydWUgKi9cbiAgICAgICAgZ2xvYmFsWydzaWduYWxzJ10gPSBzaWduYWxzO1xuICAgIH1cblxufSh0aGlzKSk7XG4iLCJpbXBvcnQgX1N0YXJ0U3RhZ2VDcmVhdGVyIGZyb20gXCIuL1N0YXJ0TGF5ZXJcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmFzZUxheWVyKEFwcCkge1xyXG5cclxuXHRsZXQgX2Jhc2VTdGFnZTtcclxuXHJcblx0QXBwLmxvYWRlclxyXG5cdFx0LmFkZChcImJhc2Vfc3RhZ2VcIiwgXCIuL3NyYy9tYXBzL2Jhc2UuanNvblwiKVxyXG5cdFx0LmxvYWQoKGwsIHJlcykgPT4ge1xyXG4gICAgXHRcclxuICAgIFx0X2Jhc2VTdGFnZSA9IHJlcy5iYXNlX3N0YWdlLnN0YWdlO1xyXG4gICAgXHRfYmFzZVN0YWdlLmFwcCA9IEFwcDtcclxuICAgICAgICBcclxuICAgICAgICBfYmFzZVN0YWdlLnNjYWxlLnNldChcclxuICAgICAgICAgICAgQXBwLnJlbmRlcmVyLndpZHRoIC8gX2Jhc2VTdGFnZS5sYXllcldpZHRoLFxyXG4gICAgICAgICAgICBBcHAucmVuZGVyZXIuaGVpZ2h0IC8gX2Jhc2VTdGFnZS5sYXllckhlaWdodFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIEFwcC5zdGFnZS5hZGRDaGlsZChfYmFzZVN0YWdlKTtcclxuICAgICAgICBcclxuICAgICAgICBfU3RhcnRTdGFnZUNyZWF0ZXIoX2Jhc2VTdGFnZSwgcyA9PntcclxuICAgICAgICBcdHMucGFyZW50R3JvdXAgPSBfYmFzZVN0YWdlLkJBU0VfTUlERExFLmdyb3VwO1xyXG4gICAgICAgIFx0X2Jhc2VTdGFnZS5hZGRDaGlsZChzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgSW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG5cdGxldCBJbml0ID0gZnVuY3Rpb24oKXtcclxuXHJcblx0XHRBcHAubG9hZGVyXHJcblx0XHQuYWRkKFwiZmxhZ19za2VcIiwgXCIuL3NyYy9hbmltcy9mbGFnL2ZsYWdfc2tlLmpzb25cIilcclxuXHRcdC5hZGQoXCJvYmpfc2tlXCIsIFwiLi9zcmMvYW5pbXMvb2JqL29iakFuaW1zX3NrZS5qc29uXCIpXHJcblx0XHQubG9hZCgobCwgcmVzKSA9PiB7XHJcblxyXG5cdFx0XHRyZXMub2JqX3NrZS5vbkxvYWQuYWRkKCB4ID0+IHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR4Lm9yYW5nZSA9IHgub3JhbmdlLmNyZWF0ZSgpO1xyXG5cdFx0XHRcdF9iYXNlU3RhZ2UuYWRkQ2hpbGQoeC5vcmFuZ2UpO1xyXG5cdFx0XHRcdHgub3JhbmdlLnBvc2l0aW9uLnNldCgxMDAsMTAwKTtcclxuXHRcdFx0XHR4Lm9yYW5nZS5hbmltYXRpb24ucGxheShcImlkbGVcIik7XHJcblx0XHRcdFx0eC5vcmFuZ2UuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHR2YXIgX3N0YXRlX3Nob3cgPSBudWxsO1xyXG5cdFx0ICAgIFx0eC5vcmFuZ2Uub24oXCJwb2ludGVyb3ZlclwiLCAoKSA9PiB7XHJcblx0XHQgICAgXHRcdF9zdGF0ZV9zaG93ID0geC5vcmFuZ2UuYW5pbWF0aW9uLmZhZGVJbihcInNob3dcIiwwLjIsIDEpO1xyXG5cdFx0ICAgIFx0fSk7XHJcblxyXG5cdFx0ICAgIFx0eC5vcmFuZ2Uub24oXCJwb2ludGVyb3V0XCIsICgpID0+e1xyXG5cdFx0ICAgIFx0XHRpZighX3N0YXRlX3Nob3cpe1xyXG5cdFx0ICAgIFx0XHRcdHgub3JhbmdlLmFuaW1hdGlvbi5mYWRlSW4oXCJpZGxlXCIsMC4yLDEpO1xyXG5cdFx0ICAgIFx0XHR9XHJcblx0XHQgICAgXHRcdGVsc2V7XHJcblx0XHRcdFx0XHRcdF9zdGF0ZV9zaG93LnBsYXkoKTtcclxuXHRcdCAgICBcdFx0XHRfc3RhdGVfc2hvdy50aW1lU2NhbGUgPSAtMTtcclxuXHRcdCAgICBcdFx0fVxyXG5cdFx0ICAgIFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYocmVzLmZsYWdfc2tlLm9uTG9hZCl7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cmVzLmZsYWdfc2tlLm9uTG9hZC5hZGQoIHggPT4ge1xyXG5cclxuXHRcdFx0XHRcdGlmKCF4Lmluc3RhbmNlKXtcclxuXHRcdFx0XHRcdFx0eC5GbGFnID0geC5GbGFnLmNyZWF0ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0eC5GbGFnLnBhcmVudEdyb3VwID0gX2Jhc2VTdGFnZS5CQVNFX1VJLmdyb3VwO1xyXG5cdFx0XHRcdFx0eC5GbGFnLnNjYWxlLnNldCgyLDIpO1xyXG5cdFx0XHRcdFx0eC5GbGFnLnBvc2l0aW9uLnNldCh4LkZsYWcuZ2V0TG9jYWxCb3VuZHMoKS53aWR0aCAqIDIsIC05MCk7XHJcblx0XHRcdFx0XHR4LkZsYWcucGFyZW50R3JvdXAgPSBfYmFzZVN0YWdlLkJBU0VfVUkuZ3JvdXA7XHJcblx0XHRcdFx0XHR4LkZsYWcuYW5pbWF0aW9uLnBsYXkoeC5GbGFnLmFuaW1hdGlvbi5hbmltYXRpb25OYW1lc1swXSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGNsb25lID0geC5GbGFnLmxpZ2h0Q29weSgpO1xyXG5cdFx0XHRcdFx0Y2xvbmUucG9zaXRpb24ueCArPSAxMDA7XHJcblxyXG5cdFx0XHRcdFx0Y2xvbmUuYW5pbWF0aW9uLmdvdG9BbmRQbGF5QnlQcm9ncmVzcyhjbG9uZS5hbmltYXRpb24uYW5pbWF0aW9uTmFtZXNbMF0sIE1hdGgucmFuZG9tKCkpO1xyXG5cdFx0XHRcdFx0X2Jhc2VTdGFnZS5hZGRDaGlsZChjbG9uZSk7XHJcblx0XHRcdFx0XHRfYmFzZVN0YWdlLmFkZENoaWxkKHguRmxhZyk7XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG4gICAgLy8gYmFzZVN0YWdlIHVwZGF0ZTtcclxuICAgIEFwcC50aWNrZXIuYWRkKCgpID0+IHtcclxuXHJcbiAgICB9KTsgICBcclxufSIsIlxyXG4vL0JsYWRlIEpTIGNvbnN0cnVjdG9yXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbGFkZSh0ZXh0dXJlKSB7XHJcbiAgdmFyIGNvdW50ID1cclxuICAgIGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMTA7XHJcbiAgdmFyIG1pbkRpc3QgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiA0MDtcclxuICB2YXIgbGl2ZVRpbWUgPVxyXG4gICAgYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAyMDtcclxuXHJcbiAgdmFyIHBvaW50cyA9IFtdO1xyXG4gIHRoaXMuY291bnQgPSBjb3VudDtcclxuICB0aGlzLm1pbkRpc3QgPSBtaW5EaXN0O1xyXG4gIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgdGhpcy5taW5Nb3Rpb25TcGVlZCA9IDQwMDAuMDtcclxuICB0aGlzLmxpdmVUaW1lID0gbGl2ZVRpbWU7XHJcbiAgdGhpcy5sYXN0TW90aW9uU3BlZWQgPSAwO1xyXG4gIHRoaXMudGFyZ2V0UG9zaXRpb24gPSBuZXcgUElYSS5Qb2ludCgwLCAwKTtcclxuXHJcbiAgdGhpcy5ib2R5ID0gbmV3IFBJWEkubWVzaC5Sb3BlKHRleHR1cmUsIHBvaW50cyk7XHJcblxyXG4gIHZhciBsYXN0UG9zaXRpb24gPSBudWxsO1xyXG4gIHRoaXMuVXBkYXRlID0gZnVuY3Rpb24odGlja2VyKSB7XHJcbiAgICB2YXIgaXNEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBwb2ludHMgPSB0aGlzLmJvZHkucG9pbnRzO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgaWYgKHBvaW50c1tpXS5sYXN0VGltZSArIHRoaXMubGl2ZVRpbWUgPCB0aWNrZXIubGFzdFRpbWUpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgICBpc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB0ID0gbmV3IFBJWEkuUG9pbnQoXHJcbiAgICAgIHRoaXMudGFyZ2V0UG9zaXRpb24ueCAvIHRoaXMuYm9keS5zY2FsZS54LFxyXG4gICAgICB0aGlzLnRhcmdldFBvc2l0aW9uLnkgLyB0aGlzLmJvZHkuc2NhbGUueVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAobGFzdFBvc2l0aW9uID09IG51bGwpIGxhc3RQb3NpdGlvbiA9IHQ7XHJcblxyXG4gICAgdC5sYXN0VGltZSA9IHRpY2tlci5sYXN0VGltZTtcclxuXHJcbiAgICB2YXIgcCA9IGxhc3RQb3NpdGlvbjtcclxuXHJcbiAgICB2YXIgZHggPSB0LnggLSBwLng7XHJcbiAgICB2YXIgZHkgPSB0LnkgLSBwLnk7XHJcblxyXG4gICAgdmFyIGRpc3QgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuICAgIHRoaXMubGFzdE1vdGlvblNwZWVkID0gZGlzdCAqIDEwMDAgLyB0aWNrZXIuZWxhcHNlZE1TO1xyXG4gICAgaWYgKGRpc3QgPiBtaW5EaXN0KSB7XHJcbiAgICAgIGlmICh0aGlzLmxhc3RNb3Rpb25TcGVlZCA+IHRoaXMubWluTW90aW9uU3BlZWQpIHtcclxuICAgICAgICBwb2ludHMucHVzaCh0KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IHRoaXMuY291bnQpIHtcclxuICAgICAgICBwb2ludHMuc2hpZnQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaXNEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGFzdFBvc2l0aW9uID0gdDtcclxuICAgIGlmIChpc0RpcnR5KSB7XHJcbiAgICAgIHRoaXMuYm9keS5yZWZyZXNoKHRydWUpO1xyXG4gICAgICB0aGlzLmJvZHkucmVuZGVyYWJsZSA9IHBvaW50cy5sZW5ndGggPiAxO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRoaXMuUmVhZENhbGxiYWNrcyA9IGZ1bmN0aW9uKHRhcmdldCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRhcmdldC5tb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgIHNlbGYudGFyZ2V0UG9zaXRpb24gPSBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQubW91c2VvdmVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAvL1x0c2VsZi50YXJnZXRQb3NpdGlvbiA9ICBlLmRhdGEuZ2xvYmFsO1xyXG4gICAgICAvL1x0Y29uc29sZS5sb2coXCJvdmVyXCIpO1xyXG4gICAgICAvLyAgc2VsZi5Nb3ZlQWxsKGUuZGF0YS5nbG9iYWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0YXJnZXQudG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIG1vdmVcIik7XHJcbiAgICAgIC8vY29uc29sZS5sb2coZS5kYXRhKTtcclxuICAgICAgc2VsZi50YXJnZXRQb3NpdGlvbiA9IGUuZGF0YS5nbG9iYWw7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaHN0YXJ0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdWNoIHN0YXJ0XCIpO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGUuZGF0YSk7XHJcbiAgICAgIC8vICBzZWxmLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRhcmdldC50b3VjaGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJUb3VjaCBzdGFydFwiKTtcclxuICAgICAgLy8gX0JsYWRlLk1vdmVBbGwoZS5kYXRhLmdsb2JhbCk7XHJcbiAgICB9O1xyXG4gICAgLy8g0LAg0YLQviDQu9Cw0L/RiNCwINC60LDQutCw0Y8t0YLQvlxyXG4gIH07XHJcbn07XHJcblxyXG4vL3JldHVybiBCbGFkZTtcclxuXHJcbiIsImltcG9ydCB7U2lnbmFsfSBmcm9tIFwic2lnbmFsc1wiO1xyXG5cclxubGV0IENvbnN0cnVjdEJ5TmFtZSA9IGZ1bmN0aW9uKGZhY3RvcnksIG5hbWUpIHtcclxuXHJcblx0bGV0IG9iaiA9IGZhY3RvcnkuYnVpbGRBcm1hdHVyZURpc3BsYXkobmFtZSk7XHJcblx0XHRcdFx0XHJcblx0b2JqLm5hbWUgPSBuYW1lO1xyXG5cdG9iai5mYWN0b3J5ID0gZmFjdG9yeTtcclxuXHRvYmoub3JpZ05hbWUgPSBuYW1lO1xyXG5cclxuXHRcclxuXHRvYmouX19wcm90b19fLmxpZ2h0Q29weSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHJcblx0XHRsZXQgX25hbWUgPSBuYW1lO1xyXG5cdFx0bGV0IF9jbG9uZSA9IENvbnN0cnVjdEJ5TmFtZSh0aGlzLmZhY3RvcnksIHRoaXMub3JpZ05hbWUpO1xyXG5cdFx0XHJcblx0XHRfY2xvbmUucG9zaXRpb24uc2V0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55KTtcclxuXHRcdFxyXG5cdFx0X2Nsb25lLmFscGhhID0gdGhpcy5hbHBoYTtcclxuXHRcdF9jbG9uZS5yb3RhdGlvbiA9IHRoaXMucm90YXRpb247XHJcblx0XHRfY2xvbmUucGl2b3QuY29weSh0aGlzLnBpdm90KTtcclxuXHRcdF9jbG9uZS5hbmNob3IuY29weSh0aGlzLmFuY2hvcik7XHJcblx0XHRfY2xvbmUuc2NhbGUuY29weSh0aGlzLnNjYWxlKTtcclxuXHRcdF9jbG9uZS52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xyXG5cdFx0X2Nsb25lLnBhcmVudEdyb3VwID0gdGhpcy5wYXJlbnRHcm91cDtcclxuXHRcdF9jbG9uZS5jbG9uZUlEID0gdGhpcy5jbG9uZUlEPyAodGhpcy5jbG9uZUlEICsgMSkgOiAwO1xyXG5cdFx0X2Nsb25lLm5hbWUgPSB0aGlzLm5hbWUgKyBcIl9jbG9uZV9cIiArIF9jbG9uZS5jbG9uZUlEO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gX2Nsb25lO1xyXG5cdFx0Ly9cclxuXHR9XHJcblx0XHJcblxyXG5cdFxyXG5cdC8vb2JqLmltcG9ydFdpZHRoID0gX2RhdGEuYXJtYXR1cmVbaV0uYWFiYi53aWR0aDtcclxuXHQvL29iai5pbXBvcnRIZWlnaHQgPSBfZGF0YS5hcm1hdHVyZVtpXS5hYWJiLmhlaWdodDtcclxuXHRcclxuXHRyZXR1cm4gb2JqO1xyXG59IFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRHJhZ29uQm9uZUxvYWRlcigpIHtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uKHJlcywgbmV4dCkge1xyXG5cclxuXHRcdGlmKHJlcy51cmwuaW5kZXhPZihcIi5kYmJpblwiKSA+IC0xKXtcclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQ2FuJ3Qgc3VwcG9ydCB0aGlzIGZvcm1hdCBpbiBEcmFnb25Cb25lIFBJWEkgRmFjdG9yeSFcIik7XHJcblx0XHRcdG5leHQoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCEocmVzLnVybC5pbmRleE9mKFwiLmpzb25cIikgPiAtMSAmJiByZXMuZGF0YSAmJiByZXMuZGF0YS5hcm1hdHVyZSAmJiByZXMuZGF0YS5mcmFtZVJhdGUpKVxyXG5cdFx0e1xyXG5cdFx0XHRuZXh0KCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZighKGRyYWdvbkJvbmVzICYmIGRyYWdvbkJvbmVzLlBpeGlGYWN0b3J5KSl7XHJcblx0XHRcdG5leHQoKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnNvbGUubG9nKFwiRHJhZ29uQm9uZSBQSVhJIFByZUxvYWRlciBcXG4gZVhwb25lbnRhIHtyb25kby5kZXZpbFthXWdtYWlsLmNvbX1cIik7XHJcblxyXG5cclxuXHRcdHJlcy5vbkxvYWQgPSBuZXcgU2lnbmFsKCk7XHJcblxyXG5cdFx0bGV0IF9kYXRhID0gcmVzLmRhdGE7XHJcblx0XHRcclxuXHRcdC8vIGFkZCBUZXh0dXJlRGF0YUpzb25cclxuXHRcdC8vcnVuIG5ldyBMb2FkZXJcclxuXHRcdGxldCBsID0gbmV3IFBJWEkubG9hZGVycy5Mb2FkZXIoKTtcclxuXHRcdGwuYWRkKHJlcy5uYW1lICsgXCJfdGV4XCIsIHJlcy51cmwucmVwbGFjZShcInNrZS5qc29uXCIsXCJ0ZXguanNvblwiKSlcclxuXHRcdC5hZGQocmVzLm5hbWUgKyBcIl9pbWdcIiwgcmVzLnVybC5yZXBsYWNlKFwic2tlLmpzb25cIixcInRleC5wbmdcIikpXHJcblx0XHQubG9hZCggKF9sLCBfcmVzKSA9PiB7XHJcblxyXG5cdFx0XHRsZXQgX2ZhY3RvcnkgPSBkcmFnb25Cb25lcy5QaXhpRmFjdG9yeS5mYWN0b3J5O1xyXG5cdFx0XHRfZmFjdG9yeS5wYXJzZURyYWdvbkJvbmVzRGF0YShfZGF0YSk7XHJcblx0XHRcdF9mYWN0b3J5LnBhcnNlVGV4dHVyZUF0bGFzRGF0YShfcmVzW3Jlcy5uYW1lICsgXCJfdGV4XCJdLmRhdGEsX3Jlc1tyZXMubmFtZSArIFwiX2ltZ1wiXS50ZXh0dXJlKTtcclxuXHRcdFx0XHJcblx0XHRcdHJlcy5vYmplY3RzID0ge307XHJcblx0XHRcdGZvciAobGV0IGk9IDA7IGkgPCBfZGF0YS5hcm1hdHVyZS5sZW5ndGg7IGkrKykgXHJcblx0XHRcdHtcclxuXHJcblx0XHRcdFx0bGV0IG5hbWUgPSBfZGF0YS5hcm1hdHVyZVtpXS5uYW1lO1xyXG5cclxuXHRcdFx0XHRyZXMub2JqZWN0c1tuYW1lXSA9ICB7fTtcclxuXHRcdFx0XHRpZihnbG9iYWwuRHJhZ29uQm9uZUxvYWRlckNvbmZpZyAmJiBnbG9iYWwuRHJhZ29uQm9uZUxvYWRlckNvbmZpZy5jcmVhdGUpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0cmVzLm9iamVjdHNbbmFtZV0gPSBDb25zdHJ1Y3RCeU5hbWUoX2ZhY3RvcnksIG5hbWUpO1x0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJlcy5vYmplY3RzW25hbWVdLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRsZXQgX2YgPSBfZmFjdG9yeSxcclxuXHRcdFx0XHRcdFx0X24gPSBuYW1lO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiBDb25zdHJ1Y3RCeU5hbWUoX2YsIF9uKTtcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRyZXMub2JqZWN0c1tuYW1lXS5pbnN0YW5jZSA9IChnbG9iYWwuRHJhZ29uQm9uZUxvYWRlckNvbmZpZyAmJiBnbG9iYWwuRHJhZ29uQm9uZUxvYWRlckNvbmZpZy5jcmVhdGUpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmVzLm9uTG9hZC5kaXNwYXRjaChyZXMub2JqZWN0cyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRuZXh0KCk7XHJcblx0fTtcclxufVxyXG5cclxuZ2xvYmFsLkRyYWdvbkJvbmVMb2FkZXJDb25maWcgPSB7XHJcblx0Y3JlYXRlIDogZmFsc2VcclxufVxyXG5cclxuUElYSS5sb2FkZXJzLkxvYWRlci5hZGRQaXhpTWlkZGxld2FyZShEcmFnb25Cb25lTG9hZGVyKTtcclxuUElYSS5sb2FkZXIudXNlKERyYWdvbkJvbmVMb2FkZXIoKSk7IiwiXHJcblBJWEkuQ29udGFpbmVyLnByb3RvdHlwZS5nZXRDaGlsZEJ5TmFtZSA9IGZ1bmN0aW9uIGdldENoaWxkQnlOYW1lKG5hbWUpXHJcbntcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKylcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbltpXS5uYW1lID09PSBuYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG59OyIsImltcG9ydCBTaWduYWwgZnJvbSBcInNpZ25hbHNcIlxyXG5cclxudmFyIF9NRSA9IE1hdHRlci5FbmdpbmUsXHJcbiAgICBfTVcgPSBNYXR0ZXIuV29ybGQsXHJcbiAgICBfTUJzID0gTWF0dGVyLkJvZGllcyxcclxuICAgIF9NQiA9IE1hdHRlci5Cb2R5LFxyXG4gICAgX01DID0gTWF0dGVyLkNvbXBvc2l0ZSxcclxuICAgIF9NRXYgPSBNYXR0ZXIuRXZlbnRzLFxyXG4gICAgX01WID0gTWF0dGVyLlZlY3RvcjtcclxuXHJcbmxldCBDcmVhdGVTdWJCb2R5ID0gZnVuY3Rpb24ocGFyZW50LCB0ZXhEYXRhKXtcclxuXHJcbiAgbGV0IG9iaiA9IENyZWF0ZVNsaWNhYmxlT2JqZWN0KHBhcmVudC5wb3NpdGlvbiwgcGFyZW50LmVuZ2luZSwgdGV4RGF0YSk7XHJcbiAgXHJcbiAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgb2JqLnBhcmVudEdyb3VwID0gdGV4RGF0YS5ncm91cDtcclxuXHJcbiAgX01CLnNldE1hc3Mob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS5tYXNzICogMC41KTtcclxuICBfTUIuc2V0VmVsb2NpdHkob2JqLnBoQm9keSwgcGFyZW50LnBoQm9keS52ZWxvY2l0eSk7XHJcbiAgX01CLnNldEFuZ2xlKG9iai5waEJvZHksIHBhcmVudC5waEJvZHkuc2xpY2VBbmdsZSk7XHJcblxyXG4gIGxldCBhbmNob3JlZF9kaXIgPSBfTVYubm9ybWFsaXNlKHt4Om9iai5hbmNob3IueCAtIDAuNSwgeTogMC41IC0gb2JqLmFuY2hvci55IH0pO1xyXG4gIGFuY2hvcmVkX2RpciA9IF9NVi5yb3RhdGUoYW5jaG9yZWRfZGlyLCBwYXJlbnQucGhCb2R5LnNsaWNlQW5nbGUpO1xyXG5cclxuICBfTUIuYXBwbHlGb3JjZShvYmoucGhCb2R5LCBvYmoucGhCb2R5LnBvc2l0aW9uLCB7XHJcbiAgICB4OiAgYW5jaG9yZWRfZGlyLnggKiAwLjAyLFxyXG4gICAgeTogIGFuY2hvcmVkX2Rpci55ICogMC4wMlxyXG4gIH0pO1xyXG5cclxuICAvL2Rvd25QYXJ0LnBoQm9keS50b3JxdWUgPSB0aGlzLnBoQm9keS50b3JxdWUgKiAxMDtcclxuXHJcbiAgcGFyZW50LnBhcmVudC5hZGRDaGlsZChvYmopO1xyXG5cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDcmVhdGVTbGljYWJsZU9iamVjdChwb3MsIGVuZ2luZSwgZGF0YSkge1xyXG4gIFxyXG4gIHZhciBvYmogPSBudWxsO1xyXG5cclxuICBpZiAoZGF0YSAmJiBkYXRhLm5vcm1hbCkge1xyXG4gICAgb2JqID0gbmV3IFBJWEkuU3ByaXRlKGRhdGEubm9ybWFsLnRleCk7XHJcblxyXG4gICAgaWYgKGRhdGEubm9ybWFsLnBpdm90KSB7XHJcbiAgICAgIG9iai5hbmNob3Iuc2V0KGRhdGEubm9ybWFsLnBpdm90LngsIGRhdGEubm9ybWFsLnBpdm90LnkpO1xyXG4gICAgfVxyXG5cclxuICB9IGVsc2Uge1xyXG4gIFxyXG4gICAgb2JqID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcclxuICAgIG9iai5iZWdpbkZpbGwoMHg5OTY2ZiAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgb2JqLmRyYXdDaXJjbGUoMCwgMCwgNTApO1xyXG4gICAgb2JqLmVuZEZpbGwoKTtcclxuICB9XHJcblxyXG4gIG9iai5zcHJpdGVEYXRhID0gZGF0YTtcclxuICBvYmouZW5naW5lID0gZW5naW5lO1xyXG4gIG9iai54ID0gcG9zLng7XHJcbiAgb2JqLnkgPSBwb3MueTtcclxuICBvYmoucGFyZW50R3JvdXAgPSBkYXRhLm5vcm1hbC5ncm91cDtcclxuICBcclxuICBvYmoub25zbGljZSA9IG5ldyBTaWduYWwoKTtcclxuXHJcbiAgb2JqLmtpbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLnBoQm9keS5zbGljZWQgJiYgdGhpcy5vbnNsaWNlKSB7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLm9uc2xpY2UuZGlzcGF0Y2godGhpcyk7XHJcbiAgICAgIFxyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgb2JqLnNwcml0ZURhdGEucGFydHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIENyZWF0ZVN1YkJvZHkob2JqLCB7bm9ybWFsOiBvYmouc3ByaXRlRGF0YS5wYXJ0c1tpXX0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVzdHJveSh7IGNoaWxkcmVuOiB0cnVlIH0pO1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBoQm9keSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBfTUMucmVtb3ZlKGVuZ2luZS53b3JsZCwgdGhpcy5waEJvZHkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG9iai5vbnNsaWNlLmFkZCgoKSA9PnsgY29uc29sZS5sb2coXCJMaXN0ZW4gU2lnbmFsXCIpO30pO1xyXG5cclxuICB2YXIgcGhCb2R5ID0gX01Ccy5jaXJjbGUocG9zLngsIHBvcy55LCA1MCk7XHJcbiAgcGhCb2R5LmNvbGxpc2lvbkZpbHRlci5tYXNrICY9IH5waEJvZHkuY29sbGlzaW9uRmlsdGVyLmNhdGVnb3J5O1xyXG4gIF9NVy5hZGQoZW5naW5lLndvcmxkLCBwaEJvZHkpO1xyXG5cclxuICBwaEJvZHkucGlPYmogPSBvYmo7XHJcbiAgb2JqLnBoQm9keSA9IHBoQm9keTtcclxuXHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG4iLCJpbXBvcnQge0Ryb3BTaGFkb3dGaWx0ZXJ9IGZyb20gJ0BwaXhpL2ZpbHRlci1kcm9wLXNoYWRvdydcclxuaW1wb3J0IENyZWF0ZVNsaWNhYmxlT2JqZWN0IGZyb20gJy4vU2xpY2FibGVPYmplY3QnXHJcbmltcG9ydCBCbGFkZSBmcm9tICcuL0JsYWRlJ1xyXG5cclxuLy8gZnVuY3Rpb24sIHdobyBjcmVhdGUgYW5kIGluc3RhbmNlIFNsaWNlZExheW91dFxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTbGljZUxheWVyIChhcHApIHtcclxuICB2YXIgX01FID0gTWF0dGVyLkVuZ2luZSxcclxuICAgIF9NVyA9IE1hdHRlci5Xb3JsZCxcclxuICAgIF9NQnMgPSBNYXR0ZXIuQm9kaWVzLFxyXG4gICAgX01CID0gTWF0dGVyLkJvZHksXHJcbiAgICBfTUMgPSBNYXR0ZXIuQ29tcG9zaXRlLFxyXG4gICAgX01FdiA9IE1hdHRlci5FdmVudHMsXHJcbiAgICBfTVYgPSBNYXR0ZXIuVmVjdG9yLFxyXG4gICAgX0xSZXMgPSBhcHAubG9hZGVyLnJlc291cmNlcztcclxuXHJcbiAgdmFyIGVuZ2luZSA9IF9NRS5jcmVhdGUoKTtcclxuICBlbmdpbmUud29ybGQuc2NhbGUgPSAwLjAwMDE7XHJcbiAgZW5naW5lLndvcmxkLmdyYXZpdHkueSA9IDAuMzU7XHJcblxyXG4gIF9NRS5ydW4oZW5naW5lKTtcclxuXHJcbiAgdmFyIHN0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gIHZhciBfbHJlcyA9IGFwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG5cclxuICB2YXIgc2xpY2VVcEdyb3VwID0gbmV3IFBJWEkuZGlzcGxheS5Hcm91cCgxLCBmYWxzZSk7XHJcbiAgdmFyIHNsaWNlTWlkZGxlR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDAsIGZhbHNlKTtcclxuICB2YXIgc2xpY2VEb3duR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKC0xLCBmYWxzZSk7XHJcbiAgdmFyIHVpR3JvdXAgPSBuZXcgUElYSS5kaXNwbGF5Lkdyb3VwKDEwLCBmYWxzZSk7XHJcbiAgXHJcbiAvLyBzdGFnZS5maWx0ZXJzID0gW25ldyBEcm9wU2hhZG93RmlsdGVyKCldO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlVXBHcm91cCkpO1xyXG4gIHN0YWdlLmFkZENoaWxkKG5ldyBQSVhJLmRpc3BsYXkuTGF5ZXIoc2xpY2VEb3duR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHNsaWNlTWlkZGxlR3JvdXApKTtcclxuICBzdGFnZS5hZGRDaGlsZChuZXcgUElYSS5kaXNwbGF5LkxheWVyKHVpR3JvdXApKTtcclxuXHJcbiAgLy9zdGFnZS5ncm91cC5lbmFibGVTb3J0ID0gdHJ1ZTtcclxuICBzdGFnZS5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gIHN0YWdlLl9kZWJ1Z1RleHQgPSBuZXcgUElYSS5UZXh0KFwiQm9keSBjb3VudDogMFwiLCB7XHJcbiAgICBmb250RmFtaWx5OiBcIkFyaWFsXCIsXHJcbiAgICBmb250U2l6ZTogMzIsXHJcbiAgICBmaWxsOiAweGZmMTAxMCxcclxuICAgIHN0cm9rZTogMHgwMGNjMTAsXHJcbiAgICBhbGlnbjogXCJsZWZ0XCJcclxuICB9KTtcclxuXHJcbiAgc3RhZ2UuX2RlYnVnVGV4dC5wb3NpdGlvbi5zZXQoMTAsIDQyKTtcclxuIC8vIGNvbnNvbGUubG9nKFwicHJlXCIpO1xyXG4gIHN0YWdlLmJsYWRlID0gbmV3IEJsYWRlKFxyXG4gICAgX2xyZXMuYmxhZGVfdGV4LnRleHR1cmUsXHJcbiAgICAzMCxcclxuICAgIDEwLFxyXG4gICAgMTAwXHJcbiAgKTtcclxuICBzdGFnZS5ibGFkZS5taW5Nb3ZhYmxlU3BlZWQgPSAxMDAwO1xyXG4gIHN0YWdlLmJsYWRlLmJvZHkucGFyZW50R3JvdXAgPSBzbGljZU1pZGRsZUdyb3VwO1xyXG4gIHN0YWdlLmJsYWRlLlJlYWRDYWxsYmFja3Moc3RhZ2UpO1xyXG5cclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5ibGFkZS5ib2R5KTtcclxuICBzdGFnZS5hZGRDaGlsZChzdGFnZS5fZGVidWdUZXh0KTtcclxuXHJcbiAgdmFyIHNsaWNlcyA9IDA7XHJcbiAgLy8gc2xpY2VzIHZpYSBSYXljYXN0IFRlc3RpbmdcclxuICB2YXIgUmF5Q2FzdFRlc3QgPSBmdW5jdGlvbiBSYXlDYXN0VGVzdChib2RpZXMpIHtcclxuICAgIGlmIChzdGFnZS5ibGFkZS5sYXN0TW90aW9uU3BlZWQgPiBzdGFnZS5ibGFkZS5taW5Nb3Rpb25TcGVlZCkge1xyXG4gICAgICB2YXIgcHBzID0gc3RhZ2UuYmxhZGUuYm9keS5wb2ludHM7XHJcblxyXG4gICAgICBpZiAocHBzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IE1hdGgubWluKHBwcy5sZW5ndGgsIDQpOyBpKyspIHtcclxuICAgICAgICAgIC8vIDQg0L/QvtGB0LvQtdC00L3QuNGFINGB0LXQs9C80LXQvdGC0LBcclxuXHJcbiAgICAgICAgICB2YXIgc3AgPSBwcHNbaSAtIDFdO1xyXG4gICAgICAgICAgdmFyIGVwID0gcHBzW2ldO1xyXG5cclxuICAgICAgICAgIHZhciBjb2xsaXNpb25zID0gTWF0dGVyLlF1ZXJ5LnJheShib2RpZXMsIHNwLCBlcCk7XHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbGxpc2lvbnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGNvbGxpc2lvbnNbal0uYm9keS5jYW5TbGljZSkge1xyXG4gICAgICAgICAgICAgIHZhciBzdiA9IHsgeTogZXAueSAtIHNwLnksIHg6IGVwLnggLSBzcC54IH07XHJcbiAgICAgICAgICAgICAgc3YgPSBfTVYubm9ybWFsaXNlKHN2KTtcclxuXHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUgPSBfTVYuYW5nbGUoc3AsIGVwKTtcclxuICAgICAgICAgICAgICBjb2xsaXNpb25zW2pdLmJvZHkuc2xpY2VWZWN0b3IgPSBzdjtcclxuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm9keSBzbGljZSBhbmdsZTpcIiwgY29sbGlzaW9uc1tqXS5ib2R5LnNsaWNlQW5nbGUpO1xyXG4gICAgICAgICAgICAgIGNvbGxpc2lvbnNbal0uYm9keS5zbGljZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICBzbGljZXMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBmcmFtZXMgPSAwO1xyXG4gIHZhciBsYXN0U2hvdFggPSBudWxsO1xyXG5cclxuICAvLyB1cGRhdGUgdmlld1xyXG4gIHZhciBVcGRhdGUgPSBmdW5jdGlvbiBVcGRhdGUoKSB7XHJcblxyXG4gIFx0Ly9zdGFnZS51cGRhdGVTdGFnZSgpO1xyXG4gICAgc3RhZ2UuX2RlYnVnVGV4dC50ZXh0ID1cclxuICAgICAgXCLQktGLINC00LXRgNC30LrQviDQt9Cw0YDQtdC30LDQu9C4IFwiICsgc2xpY2VzLnRvU3RyaW5nKCkgKyBcIiDQutGA0L7Qu9C40Lpv0LIo0LrQsCkoXCI7XHJcblxyXG4gICAgdmFyIGJvZGllcyA9IF9NQy5hbGxCb2RpZXMoZW5naW5lLndvcmxkKTtcclxuXHJcbiAgICBmcmFtZXMrKztcclxuICAgIGlmIChmcmFtZXMgPj0gMjAgJiYgYm9kaWVzLmxlbmd0aCA8IDUpIHtcclxuICAgICAgZnJhbWVzID0gMDtcclxuICAgICAgdmFyIHBvcyA9IHtcclxuICAgICAgICB4OlxyXG4gICAgICAgICAgTWF0aC5yb3VuZChNYXRoLnJhbmRvbVJhbmdlKDAsIDEwKSkgKlxyXG4gICAgICAgICAgTWF0aC5mbG9vcigoYXBwLnJlbmRlcmVyLndpZHRoICsgMjAwKSAvIDEwKSxcclxuICAgICAgICB5OiBhcHAucmVuZGVyZXIuaGVpZ2h0ICsgMTAwXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB3aGlsZSAobGFzdFNob3RYICE9PSBudWxsICYmIE1hdGguYWJzKGxhc3RTaG90WCAtIHBvcy54KSA8IDIwMCkge1xyXG4gICAgICAgIHBvcy54ID1cclxuICAgICAgICAgIE1hdGgucm91bmQoTWF0aC5yYW5kb21SYW5nZSgwLCAxMCkpICpcclxuICAgICAgICAgIE1hdGguZmxvb3IoKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCkgLyAxMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxhc3RTaG90WCA9IHBvcy54O1xyXG5cclxuICAgICAgcG9zLnggLT0gMTAwOyAvL29mZnNldFxyXG5cclxuICAgICAgLy8vINCS0YvQvdC10YHRgtC4INGN0YLQviDQs9C+0LLQvdC+INC60YPQtNCwLdC90LjQsdGD0LTRjCDQsiDQtNGA0YPQs9C+0LUg0LzQtdGB0YLQvlxyXG5cclxuICAgICAgLy9iYW5ueVxyXG5cdCAgICBsZXQgYmRhdGEgPSBfTFJlcy5idW5ueS5zcHJpdGVzaGVldDtcclxuXHJcblx0XHRsZXQgZGF0YSA9IHtcclxuXHQgICAgICBcdG5vcm1hbDoge1xyXG5cdCAgICAgXHQgICB0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55LFxyXG5cdCAgICAgXHQgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnkucGl2b3QsXHJcblx0ICAgICBcdCAgIGdyb3VwOnNsaWNlRG93bkdyb3VwXHJcblx0ICAgICAgXHR9LFxyXG5cdCAgICAgIFx0cGFydHM6W1xyXG5cdFx0ICAgICAgXHR7XHJcblx0XHQgICAgICAgICAgdGV4OiBiZGF0YS50ZXh0dXJlcy5idW5ueV90b3JzZSxcclxuXHRcdCAgICAgICAgICBwaXZvdDogYmRhdGEuZGF0YS5mcmFtZXMuYnVubnlfdG9yc2UucGl2b3QsXHJcblx0XHQgICAgICAgICAgZ3JvdXA6IHNsaWNlRG93bkdyb3VwXHJcblx0XHQgICAgICAgIH0sXHJcblx0XHQgICAgICAgIHtcclxuXHRcdCAgICAgICAgXHR0ZXg6IGJkYXRhLnRleHR1cmVzLmJ1bm55X2hlYWQsXHJcblx0XHQgICAgICAgIFx0cGl2b3Q6IGJkYXRhLmRhdGEuZnJhbWVzLmJ1bm55X2hlYWQucGl2b3QsXHJcblx0XHQgICAgICAgIFx0Z3JvdXA6IHNsaWNlVXBHcm91cFxyXG5cdCAgICAgICAgXHR9XHJcblx0ICAgICAgICBdXHJcblx0ICAgIH07XHJcblxyXG4gICAgICB2YXIgb2JqID0gQ3JlYXRlU2xpY2FibGVPYmplY3QocG9zLCBlbmdpbmUsIGRhdGEpO1xyXG5cclxuICAgICAgb2JqLnNjYWxlLnNldCgwLjIsIDAuMik7XHJcbiAgICAgIG9iai5waEJvZHkuY2FuU2xpY2UgPSB0cnVlO1xyXG5cclxuICAgICAgdmFyIF9vZnggPSAwLjUgLSAocG9zLnggKyAxMDApIC8gKGFwcC5yZW5kZXJlci53aWR0aCArIDIwMCk7XHJcblxyXG4gICAgICB2YXIgcmFuZ2UgPSAwLjg7XHJcbiAgICAgIHZhciBpbXAgPSB7XHJcbiAgICAgICAgeDogcmFuZ2UgKiBfb2Z4LFxyXG4gICAgICAgIHk6IC1NYXRoLnJhbmRvbVJhbmdlKDAuNCwgMC41KVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgX01CLmFwcGx5Rm9yY2Uob2JqLnBoQm9keSwgb2JqLnBoQm9keS5wb3NpdGlvbiwgaW1wKTtcclxuICAgICAgb2JqLnBoQm9keS50b3JxdWUgPSBNYXRoLnJhbmRvbVJhbmdlKC0xMCwgMTApO1xyXG5cclxuICAgICAgc3RhZ2UuYWRkQ2hpbGQob2JqKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdGlja2VyID0gYXBwLnRpY2tlcjtcclxuICAgIHN0YWdlLmJsYWRlLlVwZGF0ZSh0aWNrZXIpO1xyXG5cclxuICAgIC8vQ2FzdFRlc3RcclxuICAgIFJheUNhc3RUZXN0KGJvZGllcyk7XHJcblxyXG4gICAgX01FLnVwZGF0ZShlbmdpbmUpO1xyXG4gICAgLy8gaXRlcmF0ZSBvdmVyIGJvZGllcyBhbmQgZml4dHVyZXNcclxuXHJcbiAgICBmb3IgKHZhciBpID0gYm9kaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIHZhciBib2R5ID0gYm9kaWVzW2ldO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBib2R5LnBpT2JqICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgKGJvZHkucG9zaXRpb24ueSA+IGFwcC5yZW5kZXJlci5oZWlnaHQgKyAxMDAgJiZcclxuICAgICAgICAgICAgYm9keS52ZWxvY2l0eS55ID4gMCkgfHxcclxuICAgICAgICAgIGJvZHkuc2xpY2VkXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBib2R5LnBpT2JqLmtpbGwoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYm9keS5waU9iai54ID0gYm9keS5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgYm9keS5waU9iai55ID0gYm9keS5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgYm9keS5waU9iai5yb3RhdGlvbiA9IGJvZHkuYW5nbGU7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGJvZHkuYW5nbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIE1hdGgucmFuZG9tUmFuZ2UgPSBmdW5jdGlvbihtaW4sIG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcclxuICB9O1xyXG4gIC8vcnVuIFVwZGF0ZVxyXG4gIGFwcC50aWNrZXIuYWRkKFVwZGF0ZSwgdGhpcyk7XHJcblxyXG4gIC8vLy8gUkVUVVJOXHJcbiAgcmV0dXJuIHN0YWdlO1xyXG59XHJcblxyXG4vL2V4cG9ydCB7U2xpY2VMYXllciB9O1xyXG4vL21vZHVsZS5leHBvcnRzID0gU2xpY2VMYXllcjtcclxuLy9yZXR1cm4gU2xpY2VMYXllcjtcclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RhcnRMYXllcihiYXNlLCBjYWxsYmFjaykge1xyXG5cdGxldCBfc3RhcnRMYXllcjtcclxuXHJcblx0dmFyIGxvYWRlciA9IG5ldyBQSVhJLmxvYWRlcnMuTG9hZGVyKCk7XHJcblxyXG4gICAgbG9hZGVyLmFkZChcInN0YXJ0X3N0YWdlXCIsXCIuL3NyYy9tYXBzL3N0YXJ0Lmpzb25cIikubG9hZCggKGwsIHJlcykgPT57XHJcbiAgICBcdFxyXG4gICAgXHRfc3RhcnRMYXllciA9IHJlcy5zdGFydF9zdGFnZS5zdGFnZTtcclxuICAgIFx0XHJcbiAgICBcdGlmKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpe1xyXG4gICAgXHRcdGNhbGxiYWNrKF9zdGFydExheWVyKTtcclxuICAgIFx0fVxyXG5cclxuICAgIFx0SW5pdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IEluaXQgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgIFx0bGV0IF9zdGFydF9idXR0b24gPSBfc3RhcnRMYXllci5nZXRDaGlsZEJ5TmFtZShcInN0YXJ0X2J1dHRvbjpub3JtYWxcIik7XHJcbiAgICBcdGxldCBfc3RhcnRfYnV0dG9uX2hvdmVyID0gX3N0YXJ0TGF5ZXIuZ2V0Q2hpbGRCeU5hbWUoXCJzdGFydF9idXR0b246aG92ZXJcIik7XHJcblxyXG4gICAgXHRsZXQgX3N0YXJ0X2J1dHRvbl9ub3JtYWxfdGV4ID0gX3N0YXJ0X2J1dHRvbi50ZXh0dXJlO1xyXG4gICAgXHRsZXQgX3N0YXJ0X2J1dHRvbl9ob3Zlcl90ZXggPSBfc3RhcnRfYnV0dG9uX2hvdmVyLnRleHR1cmU7XHJcbiAgICBcdFxyXG4gICAgXHRfc3RhcnRfYnV0dG9uLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5idXR0b25Nb2RlID0gdHJ1ZTtcclxuXHJcbiAgICBcdF9zdGFydF9idXR0b24ub24oXCJwb2ludGVyb3ZlclwiLCAoKSA9PiB7XHJcbiAgICBcdFx0X3N0YXJ0X2J1dHRvbi50ZXh0dXJlID0gX3N0YXJ0X2J1dHRvbl9ob3Zlcl90ZXg7XHJcbiAgICBcdH0pO1xyXG4gICAgXHRfc3RhcnRfYnV0dG9uLm9uKFwicG9pbnRlcm91dFwiLCAoKSA9PntcclxuICAgIFx0XHRfc3RhcnRfYnV0dG9uLnRleHR1cmUgPSBfc3RhcnRfYnV0dG9uX25vcm1hbF90ZXg7XHJcbiAgICBcdH0pO1xyXG5cclxuICAgIFx0X3N0YXJ0X2J1dHRvbi5vbihcInBvaW50ZXJ0YXBcIiwgKCkgPT57XHJcbiAgICBcdFx0XHJcbiAgICBcdFx0X3N0YXJ0TGF5ZXIudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgXHRcdHdpbmRvdy5Mb2FkR2FtZSgpO1xyXG4gICAgXHR9KVxyXG4gICAgfVxyXG59IiwiXHJcbmxldCBQYXJzZUNvbG9yID0gZnVuY3Rpb24odmFsdWUpe1xyXG5cdFxyXG5cdGlmKCF2YWx1ZSlcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG5cdGlmKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKVxyXG5cdHtcclxuXHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiNcIixcIlwiKTtcclxuXHRcdGlmKHZhbHVlLmxlbmd0aCA+IDYpXHJcblx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDIpO1xyXG5cclxuXHRcdGxldCBwYXJzZSA9IHBhcnNlSW50KHZhbHVlLCAxNik7XHJcblx0XHRyZXR1cm4gcGFyc2U7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmxldCBQYXJzZUFscGhhID0gZnVuY3Rpb24odmFsdWUpe1xyXG5cdFxyXG5cdGlmKCF2YWx1ZSlcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG5cdGlmKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKVxyXG5cdHtcclxuXHRcdHZhbHVlID0gdmFsdWUucmVwbGFjZShcIiNcIixcIlwiKTtcclxuXHRcdGlmKHZhbHVlLmxlbmd0aCA+IDYpXHJcblx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsMik7XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiAxO1xyXG5cclxuXHRcdGxldCBwYXJzZSA9IHBhcnNlSW50KHZhbHVlLCAxNik7XHJcblx0XHRyZXR1cm4gcGFyc2UgLyAyNTY7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcblx0UGFyc2VDb2xvcixcclxuXHRQYXJzZUFscGhhXHJcbn1cclxuIiwiXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbnN0cnVjdG9yU3ByaXRyKG9iaikge1xyXG5cdGxldCBfbyA9IG9iajsgXHJcblxyXG5cdGxldCBzcHIgPSBuZXcgUElYSS5TcHJpdGUuZnJvbUltYWdlKF9vLnVybCk7XHJcblx0c3ByLm5hbWUgPSBfby5uYW1lO1xyXG5cdHNwci5hbmNob3Iuc2V0KDAsIDEpOyAvLyBzZXQgZG93biB0byBhbmNob3JcclxuXHRcclxuXHRpZihfby53aWR0aClcclxuXHRcdHNwci53aWR0aCA9IF9vLndpZHRoO1xyXG5cdFxyXG5cdGlmKF9vLmhlaWdodClcclxuXHRcdHNwci5oZWlnaHQgPSBfby5oZWlnaHQ7XHJcblx0XHJcblx0c3ByLnJvdGF0aW9uID0gKF9vLnJvdGF0aW9uIHx8IDApICAqIE1hdGguUEkgLyAxODA7XHJcblx0c3ByLnggPSBfby54O1xyXG5cdHNwci55ID0gX28ueTtcclxuXHRzcHIudmlzaWJsZSA9IF9vLnZpc2libGUgPT0gdW5kZWZpbmVkID8gdHJ1ZSA6IF9vLnZpc2libGU7XHJcblx0XHJcblx0c3ByLnR5cGVzID0gX28udHlwZSA/IF9vLnR5cGUuc3BsaXQoXCI6XCIpOiBbXTtcclxuXHJcblx0aWYoX28ucHJvcGVydGllcylcclxuXHR7XHJcblx0XHRzcHIuYWxwaGEgPSBfby5wcm9wZXJ0aWVzLm9wYWNpdHkgfHwgMTtcclxuXHRcdE9iamVjdC5hc3NpZ24oc3ByLCBfby5wcm9wZXJ0aWVzKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzcHI7XHJcbn0iLCJpbXBvcnQge1BhcnNlQ29sb3IsUGFyc2VBbHBoYSB9IGZyb20gXCIuL0NvbG9yUGFyc2VyXCJcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb25zdHJ1Y3RvclRleHQob2JqLCApIHtcclxuXHJcblx0bGV0IF9vID0gb2JqO1xyXG5cdGxldCBfY29udCA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRsZXQgX3RleHQgPSBuZXcgUElYSS5UZXh0KCk7XHJcblx0X3RleHQubmFtZSA9IF9vLm5hbWUgKyBcIl9UZXh0XCI7XHJcblxyXG5cdF9jb250Lm5hbWUgPSBfby5uYW1lO1xyXG5cdF9jb250LnR5cGVzID0gX28udHlwZSA/IF9vLnR5cGUuc3BsaXQoXCI6XCIpOiBbXTtcclxuXHJcblxyXG5cdF9jb250LndpZHRoID0gX28ud2lkdGg7XHJcblx0X2NvbnQuaGVpZ2h0ID0gX28uaGVpZ2h0O1xyXG5cclxuXHQvL19jb250LmxpbmVTdHlsZSgyLCAweEZGMDBGRiwgMSk7XHJcblx0Ly9fY29udC5iZWdpbkZpbGwoMHhGRjAwQkIsIDAuMjUpO1xyXG5cdC8vX2NvbnQuZHJhd1JvdW5kZWRSZWN0KDAsIDAsIF9vLndpZHRoLCBfby5oZWlnaHQpO1xyXG5cdC8vX2NvbnQuZW5kRmlsbCgpO1xyXG5cclxuXHRfY29udC5waXZvdC5zZXQoMCwwKTtcclxuXHJcblx0X2NvbnQucm90YXRpb24gPSBfby5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XHJcblx0X2NvbnQuYWxwaGEgPSBQYXJzZUFscGhhKF9vLnRleHQuY29sb3IpIHx8IDE7XHJcblx0X3RleHQudGV4dCA9IF9vLnRleHQudGV4dDtcclxuXHJcblx0c3dpdGNoIChfby50ZXh0LmhhbGlnaCkge1xyXG5cdFx0Y2FzZSBcInJpZ2h0XCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlIFwiY2VudGVyXCI6XHJcblx0XHRcdFx0e1xyXG5cclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci54ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueCA9IF9jb250LndpZHRoICogMC41O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0XHRkZWZhdWx0OlxyXG5cdFx0XHR7XHJcblx0XHRcdFx0X3RleHQuYW5jaG9yLnggPSAwO1xyXG5cdFx0XHRcdF90ZXh0LnBvc2l0aW9uLnggPSAwO1x0XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHRzd2l0Y2ggKF9vLnRleHQudmFsaWduKSB7XHJcblx0XHRjYXNlIFwiYm90dG9tXCI6XHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0X3RleHQuYW5jaG9yLnkgPSAxO1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSBcImNlbnRlclwiOlxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdF90ZXh0LmFuY2hvci55ID0gMC41O1xyXG5cdFx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IF9jb250LmhlaWdodCAqIDAuNTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0ZGVmYXVsdDpcclxuXHRcdFx0e1xyXG5cclxuXHRcdFx0XHRfdGV4dC5hbmNob3IueSA9IDA7XHJcblx0XHRcdFx0X3RleHQucG9zaXRpb24ueSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG5cclxuXHJcblx0X2NvbnQucG9zaXRpb24uc2V0KF9vLngsIF9vLnkpO1xyXG5cdF90ZXh0LnN0eWxlID0ge1xyXG5cdFx0d29yZFdyYXA6IF9vLnRleHQud3JhcCxcclxuXHRcdGZpbGw6IFBhcnNlQ29sb3IoX28udGV4dC5jb2xvcikgfHwgMHgwMDAwMDAsXHJcblx0XHRhbGlnbjogX28udGV4dC52YWxpZ24gfHwgXCJjZW50ZXJcIixcclxuXHRcdGZvbnRTaXplOiBfby50ZXh0LnBpeGVsc2l6ZSB8fCAyNCxcclxuXHRcdGZvbnRGYW1pbHk6IF9vLnRleHQuZm9udGZhbWlseSB8fCBcIkFyaWFsXCIsXHJcblx0XHRmb250V2VpZ2h0OiBfby50ZXh0LmJvbGQgPyBcImJvbGRcIjogXCJub3JtYWxcIixcclxuXHRcdGZvbnRTdHlsZTogX28udGV4dC5pdGFsaWMgPyBcIml0YWxpY1wiIDogXCJub3JtYWxcIlxyXG5cdFx0fTtcclxuXHJcblx0aWYoX28ucHJvcGVydGllcylcclxuXHR7XHJcblx0XHRfdGV4dC5zdHlsZS5zdHJva2UgPSAgUGFyc2VDb2xvcihfby5wcm9wZXJ0aWVzLnN0cm9rZUNvbG9yKSB8fCAwO1xyXG5cdFx0X3RleHQuc3R5bGUuc3Ryb2tlVGhpY2tuZXNzID0gIF9vLnByb3BlcnRpZXMuc3Ryb2tlVGhpY2tuZXNzIHx8IDA7XHJcblx0XHRcclxuXHRcdE9iamVjdC5hc3NpZ24oX2NvbnQsIF9vLnByb3BlcnRpZXMpO1xyXG5cdH1cclxuXHJcblx0Ly9fY29udC5wYXJlbnRHcm91cCA9IF9sYXllci5ncm91cDtcclxuXHRfY29udC5hZGRDaGlsZChfdGV4dCk7XHJcblx0Ly9fc3RhZ2UuYWRkQ2hpbGQoX2NvbnQpO1xyXG5cdHJldHVybiBfY29udDtcclxufSIsImltcG9ydCBDVGV4dCBmcm9tIFwiLi9Db25zdHJ1Y3RvclRleHRcIlxyXG5pbXBvcnQgQ1Nwcml0ZSBmcm9tIFwiLi9Db25zdHJ1Y3RvclNwcml0ZVwiXHJcblxyXG5sZXQgTGF5ZXIgPSBQSVhJLmRpc3BsYXkuTGF5ZXI7XHJcbmxldCBHcm91cCA9IFBJWEkuZGlzcGxheS5Hcm91cDtcclxubGV0IFN0YWdlID0gUElYSS5kaXNwbGF5LlN0YWdlO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE9HUGFyc2VyKCl7XHJcblx0cmV0dXJuIGZ1bmN0aW9uIChyZXNvdXJjZSwgbmV4dCkge1xyXG5cdFx0Ly9mYWxsYmFjayBcclxuXHRcdFxyXG4gICAgICAgIGlmICghcmVzb3VyY2UuZGF0YSB8fCAhKHJlc291cmNlLmRhdGEudHlwZSAhPT0gdW5kZWZpbmVkICYmIHJlc291cmNlLmRhdGEudHlwZSA9PSAnbWFwJykpIHtcclxuICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlRpbGVkIE9HIGltcG9ydGVyIVxcbiBlWHBvbmVudGEge3JvbmRvLmRldmlsW2FdZ21haWwuY29tfVwiKTtcclxuICAgICAgICBsZXQgX2RhdGEgPSByZXNvdXJjZS5kYXRhOyBcclxuICAgICAgICBsZXQgX3N0YWdlID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XHJcblxyXG4gICAgICAgIF9zdGFnZS5sYXllckhlaWdodCA9IF9kYXRhLmhlaWdodDtcclxuICAgICAgICBfc3RhZ2UubGF5ZXJXaWR0aCA9IF9kYXRhLndpZHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGJhc2VVcmwgPSByZXNvdXJjZS51cmwucmVwbGFjZSh0aGlzLmJhc2VVcmwsXCJcIik7XHJcbiAgICAgICAgbGV0IGxhc3RJbmRleE9mID0gYmFzZVVybC5sYXN0SW5kZXhPZihcIi9cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYobGFzdEluZGV4T2YgPT0gLTEpXHJcbiAgICAgICAgXHRsYXN0SW5kZXhPZiA9IGJhc2VVcmwubGFzdEluZGV4T2YoXCJcXFxcXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGxhc3RJbmRleE9mID09IC0xIClcclxuICAgIFx0e1xyXG4gICAgXHRcdGNvbnNvbGUubG9nKFwiQ2FuJ3QgcGFyc2U6XCIgKyBiYXNlVXJsKTtcclxuICAgIFx0XHRuZXh0KCk7XHJcbiAgICBcdFx0cmV0dXJuO1xyXG4gICAgXHR9XHJcblxyXG4gICAgICAgIGJhc2VVcmwgPSBiYXNlVXJsLnN1YnN0cmluZygwLCBsYXN0SW5kZXhPZik7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZyhcIkRpciB1cmw6XCIgKyBiYXNlVXJsKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgbGV0IGxvYWRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogcmVzb3VyY2UuY3Jvc3NPcmlnaW4sXHJcbiAgICAgICAgICAgIGxvYWRUeXBlOiBQSVhJLmxvYWRlcnMuUmVzb3VyY2UuTE9BRF9UWVBFLklNQUdFLFxyXG4gICAgICAgICAgICBwYXJlbnRSZXNvdXJjZTogcmVzb3VyY2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0NoZWNrIFRpbGVyIE1hcCB0eXBlXHJcbiAgICAgICAvLyBpZihfZGF0YS50eXBlICE9PSB1bmRlZmluZWQgJiYgX2RhdGEudHlwZSA9PSAnbWFwJylcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgIFx0aWYoX2RhdGEubGF5ZXJzKSBcclxuICAgICAgICBcdHtcclxuICAgICAgICBcdFx0Zm9yKGxldCBpID0gMDsgaSA8IF9kYXRhLmxheWVycy5sZW5ndGg7IGkrKylcclxuICAgICAgICBcdFx0e1xyXG4gICAgICAgIFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdGxldCBfbCA9IF9kYXRhLmxheWVyc1tpXTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRpZihfbC50eXBlICE9PSBcIm9iamVjdGdyb3VwXCIgJiYgX2wudHlwZSAhPT0gXCJpbWFnZWxheWVyXCIpXHJcbiAgICAgICAgXHRcdFx0e1xyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiT0dQYXJzZXIgc3VwcG9ydCBvbmx5IE9CSkVDVCBvciBJTUFHRSBsYXllcyEhXCIpO1xyXG4gICAgICAgIFx0XHRcdFx0Ly9uZXh0KCk7XHJcbiAgICAgICAgXHRcdFx0XHQvL3JldHVybjtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0aWYoX2wucHJvcGVydGllcyAmJiAoX2wucHJvcGVydGllcy5pZ25vcmUgfHwgX2wucHJvcGVydGllcy5pZ25vcmVMb2FkKSl7XHJcblxyXG4gICAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coXCJPR1BhcnNlcjogaWdub3JlIGxvYWRpbmcgbGF5ZXI6XCIgKyBfbC5uYW1lKTtcclxuICAgICAgICBcdFx0XHRcdGNvbnRpbnVlO1xyXG4gICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgXHRcdFx0XHJcbiAgICAgICAgXHRcdFx0bGV0IF9ncm91cCA9IG5ldyBHcm91cCggX2wucHJvcGVydGllcyA/IChfbC5wcm9wZXJ0aWVzLnpPcmRlciB8fCBpKSA6IGksIHRydWUpO1xyXG4gICAgICAgIFx0XHRcdGxldCBfbGF5ZXIgPSBuZXcgTGF5ZXIoX2dyb3VwKTtcclxuICAgICAgICBcdFx0XHRfbGF5ZXIubmFtZSA9IF9sLm5hbWU7XHJcbiAgICAgICAgXHRcdFx0X3N0YWdlW19sLm5hbWVdID0gX2xheWVyO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci52aXNpYmxlID0gX2wudmlzaWJsZTtcclxuICAgICAgICBcdFx0XHRcclxuICAgICAgICBcdFx0XHRfbGF5ZXIucG9zaXRpb24uc2V0KF9sLngsIF9sLnkpO1xyXG4gICAgICAgIFx0XHRcdF9sYXllci5hbHBoYSA9IF9sLm9wYWNpdHkgfHwgMTtcclxuXHJcbiAgICAgICAgXHRcdFx0X3N0YWdlLmFkZENoaWxkKF9sYXllcik7XHJcbiAgICAgICAgXHRcdFx0aWYoX2wudHlwZSA9PSBcImltYWdlbGF5ZXJcIil7XHJcblx0ICAgICAgICBcdFx0XHRfbC5vYmplY3RzID0gW1xyXG5cdCAgICAgICAgXHRcdFx0XHR7XHJcblx0ICAgICAgICBcdFx0XHRcdFx0aW1hZ2U6IF9sLmltYWdlLFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdG5hbWU6IF9sLm5hbWUsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eDogX2wueCAsXHJcblx0ICAgICAgICBcdFx0XHRcdFx0eTogX2wueSArIF9zdGFnZS5sYXllckhlaWdodCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL3dpZHRoOiBfbC53aWR0aCxcclxuXHQgICAgICAgIFx0XHRcdFx0XHQvL2hlaWdodDogX2wuaGVpZ2h0LFxyXG5cdCAgICAgICAgXHRcdFx0XHRcdHByb3BlcnRpZXM6IF9sLnByb3BlcnRpZXMsXHJcblx0ICAgICAgICBcdFx0XHRcdH1cclxuXHQgICAgICAgIFx0XHRcdF07XHJcbiAgICAgICAgXHRcdFx0fVxyXG5cclxuICAgICAgICBcdFx0XHRpZihfbC5vYmplY3RzKSBcclxuICAgICAgICBcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IF9sLm9iamVjdHMubGVuZ3RoOyBqKyspXHJcbiAgICAgICAgXHRcdFx0XHR7XHJcbiAgICAgICAgXHRcdFx0XHRcdFxyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX28gPSBfbC5vYmplY3RzW2pdO1xyXG4gICAgICAgIFx0XHRcdFx0XHRsZXQgX29iaiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgXHRcdFx0XHRcdGlmKCFfby5uYW1lIHx8IF9vLm5hbWUgPT0gXCJcIilcclxuICAgICAgICBcdFx0XHRcdFx0XHRfby5uYW1lID0gXCJvYmpfXCIgKyBqO1xyXG4gICAgICAgIFx0XHRcdFx0XHQvLyBpbWFnZSBMb2FkZXJcclxuXHRcdFx0XHRcdFx0XHRpZihfZGF0YS50aWxlc2V0cyAmJiBfZGF0YS50aWxlc2V0cy5sZW5ndGggPiAwICYmIF9vLmdpZCB8fCBfby5pbWFnZSlcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRpZighX28uaW1hZ2Upe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgX3RzID0gdW5kZWZpbmVkOyAvL19kYXRhLnRpbGVzZXRzWzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgX2RhdGEudGlsZXNldHMubGVuZ3RoOyBpICsrKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZihfZGF0YS50aWxlc2V0c1tpXS5maXJzdGdpZCA8PSBfby5naWQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0X3RzID0gX2RhdGEudGlsZXNldHNbaV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZighX3RzKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkltYWdlIHdpdGggZ2lkOlwiICsgX28uZ2lkICsgXCIgbm90IGZvdW5kIVwiKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTs7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBfcmVhbEdpZCA9IF9vLmdpZCAtIF90cy5maXJzdGdpZDtcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdGxldCBfaW1nID0gX3RzLnRpbGVzW1wiXCIgKyBfcmVhbEdpZF07XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRcclxuXHRcdFx0XHRcdFx0ICAgICAgICBcdF9vLnVybCA9ICBiYXNlVXJsICsgXCIvXCIgKyBfaW1nLmltYWdlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRpZighX2ltZyl7XHJcblxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0XHRjb25zb2xlLmxvZyhcIkxvYWQgcmVzIE1JU1NFRCBnaWQ6XCIgKyBfcmVhbEdpZCArIFwiIHVybDpcIiArIHVybCk7XHJcblx0XHRcdFx0XHRcdCAgICAgICAgXHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0fVxyXG5cdFx0XHRcdFx0ICAgICAgICBcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0X28udXJsID0gIGJhc2VVcmwgKyBcIi9cIiArIF9vLmltYWdlO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIFx0IFxyXG5cdFx0XHRcdFx0ICAgICAgICBcdH1cclxuXHRcdFx0XHRcdCAgICAgICAgXHRcclxuXHRcdFx0XHRcdCAgICAgICAgXHQvL1Nwcml0ZSBMb2FkZXJcclxuXHRcdFx0XHRcdCAgICAgICAgXHRfb2JqID0gQ1Nwcml0ZShfbyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBUZXh0TG9hZGVyXHJcblx0XHRcdFx0XHRcdFx0aWYoX28udGV4dCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0X29iaiA9IENUZXh0KF9vKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYoX29iail7XHJcblx0XHRcdFx0XHRcdFx0XHRfb2JqLnBhcmVudEdyb3VwID0gX2xheWVyLmdyb3VwO1xyXG5cdFx0XHRcdFx0XHRcdFx0X3N0YWdlLmFkZENoaWxkKF9vYmopO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHRcdH1cclxuICAgICAgICBcdFx0XHR9XHJcbiAgICAgICAgXHRcdH1cclxuICAgICAgICBcdH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvdXJjZS5zdGFnZSA9IF9zdGFnZTtcclxuXHJcblx0XHQvLyBjYWxsIG5leHQgbG9hZGVyXHJcblx0XHRuZXh0KCk7XHJcblxyXG5cdH07XHJcbn1cclxuIiwiaW1wb3J0IE9HUGFyc2VyIGZyb20gXCIuL09HUGFyc2VyXCJcclxuXHJcblBJWEkubG9hZGVycy5Mb2FkZXIuYWRkUGl4aU1pZGRsZXdhcmUoT0dQYXJzZXIpO1xyXG5QSVhJLmxvYWRlci51c2UoT0dQYXJzZXIoKSk7XHJcbi8vIG5vdGhpbmcgdG8gZXhwb3J0XHJcbiIsImltcG9ydCBcIi4vUGl4aUhlbHBlclwiO1xyXG5cclxuaW1wb3J0IF9CYXNlU3RhZ2VDcmVhdGVyIGZyb20gXCIuL0Jhc2VMYXllclwiXHJcbmltcG9ydCBfU2xpY2VTdGFnZUNyZWF0ZXIgZnJvbSBcIi4vU2xpY2VMYXllclwiXHJcblxyXG5pbXBvcnQgXCIuL1RpbGVkT0dMb2FkZXIvVGlsZWRPYmpHcm91cExvYWRlclwiXHJcbmltcG9ydCBcIi4vRHJhZ29uQm9uZUxvYWRlclwiO1xyXG5cclxuXHJcbnZhciBfQXBwID0gbnVsbCxcclxuICBfTFJlcyA9IG51bGwsXHJcbiAgLy9fUmVuZGVyZXIgPSBudWxsLFxyXG4gIC8vX0ludE1hbmFnZXIgPSBudWxsLFxyXG4gIF9TbGljZWRTdGFnZSA9IG51bGw7XHJcblxyXG52YXIgSW5pdCA9IGZ1bmN0aW9uIEluaXQoKSB7XHJcbiAgX0FwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHtcclxuICAgIHdpZHRoOiAxOTIwLFxyXG4gICAgaGVpZ2h0OiAxMDgwLFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAweGZmZmZmZlxyXG4gIH0pO1xyXG5cclxuICAvL9Ci0LDQuiDQvdCw0LTQviwg0YHRgtCw0L3QtNCw0YDRgtC90YvQtSDQvdC1INCx0YPQtNGD0YIg0L7RgtC+0LHRgNCw0LbQsNGC0YHRj1xyXG4gIF9BcHAuc3RhZ2UgPSBuZXcgUElYSS5kaXNwbGF5LlN0YWdlKCk7XHJcblxyXG4gIF9MUmVzID0gX0FwcC5sb2FkZXIucmVzb3VyY2VzO1xyXG4gIHdpbmRvdy5fTFJlcyA9IF9MUmVzO1xyXG5cclxuLy8gIF9JbnRNYW5hZ2VyID0gX0FwcC5yZW5kZXJlci5wbHVnaW5zLmludGVyYWN0aW9uO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9BcHAudmlldyk7XHJcbiAgb25SZXNpemUoKTtcclxuICB3aW5kb3cub25yZXNpemUgPSBvblJlc2l6ZTtcclxuXHJcbiAgX0Jhc2VTdGFnZUNyZWF0ZXIoX0FwcCk7XHJcbi8vICBfQXBwLnN0YWdlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgIFxyXG59O1xyXG5cclxuLy9pbnZva2VkIGFmdGVyIGxvYWRpbmcgZ2FtZSByZXNvdXJjZXNcclxudmFyIEdhbWVMb2FkZWQgPSBmdW5jdGlvbiBHYW1lTG9hZGVkKCkge1xyXG4gIGNvbnNvbGUubG9nKFwiR2FtZSBpcyBsb2FkZWRcIik7XHJcblxyXG4gIF9TbGljZWRTdGFnZSA9ICBfU2xpY2VTdGFnZUNyZWF0ZXIoX0FwcCk7IC8vX0xSZXMuc2xpY2VfanMuZnVuY3Rpb24oX0FwcCk7XHJcblxyXG4gIF9BcHAuc3RhZ2UuYWRkQ2hpbGQoX1NsaWNlZFN0YWdlKTtcclxuXHJcbiAgX0FwcC5Mb2FkU3RhZ2UuZGVzdHJveSgpO1xyXG59O1xyXG5cclxudmFyIExvYWRHYW1lID0gZnVuY3Rpb24gTG9hZEdhbWUoKSB7XHJcbiAgdmFyIGxvYWRlciA9IF9BcHAubG9hZGVyO1xyXG5cclxuICBsb2FkZXJcclxuICAgIC5hZGQoXCJibGFkZV90ZXhcIiwgXCIuL3NyYy9pbWFnZXMvYmxhZGUucG5nXCIpXHJcbiAgICAuYWRkKFwiYnVubnlcIiwgXCIuL3NyYy9pbWFnZXMvYnVubnlfc3MuanNvblwiKVxyXG4gICAgLmxvYWQoZnVuY3Rpb24obCwgcmVzKSB7XHJcblxyXG4gICAgICBHYW1lTG9hZGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0IGxvYWRcIik7XHJcbn07XHJcblxyXG4vLyByZXNpemVcclxudmFyIG9uUmVzaXplID0gZnVuY3Rpb24gb25SZXNpemUoZXZlbnQpIHtcclxuICB2YXIgX3cgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gIHZhciBfaCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBpZiAoX3cgLyBfaCA8IDE2IC8gOSkge1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLndpZHRoID0gX3cgKyBcInB4XCI7XHJcbiAgICBfQXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gX3cgKiA5IC8gMTYgKyBcInB4XCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9BcHAudmlldy5zdHlsZS53aWR0aCA9IF9oICogMTYgLyA5ICsgXCJweFwiO1xyXG4gICAgX0FwcC52aWV3LnN0eWxlLmhlaWdodCA9IF9oICsgXCJweFwiO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5Mb2FkR2FtZSA9IExvYWRHYW1lO1xyXG53aW5kb3cub25sb2FkID0gSW5pdDsiXX0=
