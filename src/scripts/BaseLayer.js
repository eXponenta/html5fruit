import _StartStageCreater from "./StartLayer"
import _ListStageCreater from "./ListLayer"
import _GameStageCreater from "./GameLayer"
import _ResultStageCreater from "./ResultLayer"
import {TweenLite} from "gsap"

import Cookie from "js-cookie"
//import FFS from "fontfaceobserver"

//import "pixi-timer"

let LoadFontCostil = function() {
	window.WebFontConfig = {
      google: {
      	families:['Amatic SC', "Neucha"]
      }
   };

   (function(d) {
      var wf = d.createElement('script'), s = d.scripts[0];
      wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
      wf.async = true;
      s.parentNode.insertBefore(wf, s);
   })(document);
}

export default function BaseLayer(App) {

	this._currentStage = null;
	this.stage = {};
	this.stages = {};
	this.app = {};
	this.rulesIsShowed = false;

	let volume_bar, volume_mask, volume_btn;
	let rules_desk, rules_btn, r_start_btn, r_resume_btn;

	let linear_volume = 0;
	let loading = false;
	let loadCircle = null;
	// preload basss stage
	App.loader
		.add("build_config", "./src/configs/base_config.json")
		.add("base_stage", "./src/maps/base.json")
		.load((l, res) => {
    	
    	this.buildConfig = res.build_config.data;
    	//console.log(this.buildConfig);
    	this.stage = res.base_stage.stage;
    	this.app = App;
        
        this.stage.scale.set(
            App.renderer.width / this.stage.layerWidth,
            App.renderer.height / this.stage.layerHeight
        );

        this.stages["Base"] = this;

        this.Init();

		App.stage.addChild(this.stage);

        l.progress = 0;

    });

	let _lastTween;
	this.SetVolume = function (vol){
		
		linear_volume = vol;
		PIXI.sound.volumeAll = Math.pow(10, vol) / 10;

		if(vol <= 0.01){

			PIXI.sound.muteAll();
			volume_btn.texture = volume_btn.off;

		} else {
			PIXI.sound.unmuteAll();	
			volume_btn.texture = volume_btn.normal;
		}

		volume_bar.visible = true;
		volume_bar.alpha = 1;
		if(_lastTween)
			_lastTween.kill();
		_lastTween = TweenLite.to (volume_bar, 2,
		 {
			pixi:{
				alpha:0
			},
			onComplete: function() {
                    volume_bar.visible = false;
               }
         });

		volume_mask.height = volume_bar.height * vol;

		let _conf = this.GetConfig();
		_conf.volume = vol;
		this.SaveCongig();
	}

	this.LoadNext = function(){

		loading = true;
		loadCircle = this.stage.getChildByName("progress");
		loadCircle.anchor.set(0.5,0.5);
		loadCircle.position.x += loadCircle.width * 0.5;
		loadCircle.position.y -= loadCircle.height * 0.5;
		
		/*
		//start loading after base 
		PIXI.sound.add(
			{
				click:
				{
					url: "./src/audio/button_sound.mp3",
					preload: true
				},
				blink: {
					url :"./src/audio/earnpointsvita_sound.mp3",
					preload: true
				},
				base: // very big, last it
				{
					url: "./src/audio/basicthehappy_sound.mp3",
					preload : true,
					loaded: (e, s) => {
						s.play();
						s.loop = true;
						s.volume = 0.5;
					}
				},
				win: {
					url: "./src/audio/winnerofgame_sound.mp3",
					preload: true	
				},
				slice: {
					url: "./src/audio/slicefruit_sound.wav",
					preload:true
				}
			}
		);
		*/
		
		let _this = this;
    	new _StartStageCreater(this, App.loader, s =>{
    		_this.stages["Start"] = s;
    	});

    	new _ListStageCreater(this, App.loader, s =>{
    		_this.stages["List"] = s;
    	});

    	new _GameStageCreater(this, App.loader, s =>{
    		_this.stages["Game"] = s;
    	});

    	new _ResultStageCreater(this, App.loader, s =>{
    		_this.stages["Result"] = s;
    	}); 
    	
    	App.loader.load((l, res) => {
    		loading = false;
    		this.LoadedAll();
    	});
	}

	this.LoadedAll = function() {
	
		LoadFontCostil();

		this.stage.getChildByName("volume_off").destroy();
		

		TweenLite.to(loadCircle,0.5, {pixi:{alpha:0}, onComplete: function() {
			loadCircle.destroy();	
		}});

		this.stage.getChildByName("title").destroy();
		
		this.stage.getChildByName("BASE_LOAD_BG").destroy();
		
		let layer = this.stage.getChildByName("BASE_LOAD_BG");
		if(layer) 
			layer.destroy();
		

		///debug
		this.SetStage("Start");


		//let _S = this.SetStage("Start");
	}


	let _full;

	this.Init = function(){

		this.stage.reParentAll();
		this.LoadNext();

		
		volume_btn = this.stage.getChildByName("volume_normal");
		volume_btn.normal = volume_btn.texture;

		let _off = this.stage.getChildByName("volume_off");
		volume_btn.off = _off.texture;
		//_off.destroy();

		volume_bar = this.stage.getChildByName("volume_bg");
		volume_mask = volume_bar.getChildByName("volume_mask");
		//volume_mask.transform.onchange();
		volume_mask.anchor.y = 1;
		volume_mask.position.y += volume_mask.height;
		
		//volume_mask.transform.updateLocalTransform();

		let _bar = volume_bar.getChildByName("volume_bar");
		_bar.mask = volume_mask;

		volume_btn.on("pointertap",() => {

			let vol = linear_volume + 0.25;
			if(vol > 1)
				vol = 0;

			this.SetVolume(vol);
			PIXI.sound.play("click");
		});

		let _vol = 0.25;
		let _conf = this.GetConfig();
		if(_conf.volume !== undefined)
			_vol = _conf.volume;

		this.SetVolume(_vol);

		let _close = this.stage.getChildByName("close_button");
		_close.on("pointertap", ()=>{

			PIXI.sound.play("click");
			if(window.game.allowClosing){
				this.OnDestroy();
			}else {
      			console.warn('Closing not allowed! Set `window.game.allowClosing = true`');
			}
		});


		rules_btn = this.stage.getChildByName("show_rules");
        rules_desk = this.stage.getChildByName("rules_desk");
        r_start_btn = rules_desk.getChildByName("start_button");
        r_resume_btn = rules_desk.getChildByName("resume_button");

        let _rules_close_btn = rules_desk.getChildByName("close_rules");

        rules_desk.rulesStartY = rules_desk.position.y;
        
        let _this = this;
        
        r_start_btn.on("pointertap", () =>{

        	_this.HideRules();        
            PIXI.sound.play("click");

        });

        r_resume_btn.on("pointertap", () =>{

        	_this.HideRules();        
            PIXI.sound.play("click");

        });
        
        _rules_close_btn.on("pointertap", () =>{

        	_this.HideRules(close);        
            PIXI.sound.play("click");

        });

        rules_btn.on("pointertap", () =>{
            PIXI.sound.play("click");
            _this.ShowRules();
        });

        _full = this.stage.getChildByName("full_button");
        
        _full.toFull = _full.texture;
        _full.toNormal = _close.texture;

        _full.on("pointertap", () =>{
        	let isFull = document.webkitIsFullScreen || document.fullscreenEnabled || document.mozFullScreenEnabled || iosFullHack;
        	if(!isFull)
        		this.Fullscreen();
        	else
        		this.DisableFullscreen();

        });

	}


	let _rules_close_func;
	let _rules_button_func;
	let _rules_show_func;

	let _rules_type = "start";

	this.RulesButtonSetShowable = function(show){
		rules_btn.visible = show;
	}

	this.RegisterRules = function(button, close, show, type = "start",){
	
		_rules_button_func = button;
		_rules_close_func = close;
		_rules_show_func = show;

		_rules_type = type;

		r_resume_btn.visible = type != "start";
		r_start_btn.visible = type == "start"
	}

	this.HideRules = function(isClose) {
		let _this = this; 
	    TweenLite.to(rules_desk, 0.25, {
            
            pixi:{
                positionY:App.renderer.height + rules_desk.height
            },

            onComplete: () => {
                rules_desk.visible = false;
                _this.rulesIsShowed = false;
                
                if(_rules_button_func && !isClose){
                	_rules_button_func();
                }

                if(_rules_close_func && isClose){
                	_rules_close_func();
                }

            }
        });
	}

	this.ShowRules = function(button, close, show, type = "start") {

		if(button){
			this.RegisterRules(button, close, show, type);
		}

		if(_rules_show_func)
			_rules_show_func();

	    this.rulesIsShowed = true;
        rules_desk.visible = true;
        rules_desk.position.y = App.renderer.height + rules_desk.height;

        TweenLite.to(rules_desk, 0.25, {
            pixi:{
                positionY:rules_desk.rulesStartY
                }
            }
        );
	}

	this.OnDestroy = function() {
		
		//dragonBones.PixiFactory.factory.clear();
		for(var s in this.stages){
			if(s.OnDestroy)
				s.OnDestroy();
		}
		this.stage.destroy({children:true});
		//PIXI.sound.stopAll();
		PIXI.sound.removeAll();

		App.closing();
	}

	this.SetStage = function(name, param) {
		
		if(this._currentStage){
			this.stage.removeChild(this._currentStage.stage);
			this._currentStage.stage.parentGroup = null;
			this._currentStage.active = false;
			if(this._currentStage.OnRemove)
				this._currentStage.OnRemove();

		}

		this._currentStage = this.stages[name];
		if(this._currentStage){
			this._currentStage.stage.parentGroup = this.stage.BASE_MIDDLE.group;
			this._currentStage.active = true;
			
			this.stage.addChild(this._currentStage.stage);

			if(this._currentStage.OnAdd)
				this._currentStage.OnAdd(param);
		}

		return this._currentStage;
	}

	this._config;
	this.GetConfig = function() {
		
		if(!this._config){
			this._config = Cookie.getJSON("config");
			if(!this._config){
				this._config = {};
			}
		}

		return this._config;
	}

	this.SaveCongig = function(){
		Cookie.set("config", this.GetConfig(), {path:"", expires: 1000});
	}

	let iosMetaTag = document.createElement("meta");
		iosMetaTag.name = "apple-mobile-web-app-capable";
		iosMetaTag.content = "yes";
	
	let iosFullHack = false;

 	this.Fullscreen = function(){
		    
		  console.log("Go to fullscreen");
		  if(this.app.renderer.view.requestFullscreen) {
		    this.app.renderer.view.requestFullscreen();
		  } else if(this.app.renderer.view.webkitRequestFullscreen) {
		    this.app.renderer.view.webkitRequestFullscreen();
		  } else if(this.app.renderer.view.webkitEnterFullscreen) {
		  	this.app.renderer.view.webkitEnterFullscreen();
		  } else if(this.app.renderer.view.mozRequestFullscreen) {
		    this.app.renderer.view.mozRequestFullScreen();
		  }

		if(/*PIXI.utils.isMobile.apple.device && */ !iosFullHack){
			iosFullHack = true;
			document.querySelector("meta").parentNode.appendChild(iosMetaTag);
		}
	} 

	this.DisableFullscreen = function(){
		  console.log("Go out from fullscreen");
		  if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }

        if(/*PIXI.utils.isMobile.apple.device && */ iosFullHack){
			iosFullHack = false;
			document.querySelector("meta").parentNode.removeChild(iosMetaTag);
		}
	} 
	
    // baseStage update;
    App.ticker.add(() => {

    	if(_full) {
    		
    		let isFull = document.webkitIsFullScreen 
    			|| document.fullscreenEnabled 
    			|| document.mozFullScreenEnabled || iosFullHack;

    		if(_full.texture == _full.toNormal && !isFull)
    			_full.texture = _full.toFull;

    		if(_full.texture == _full.toFull && isFull)
    			_full.texture = _full.toNormal;
    	}

    	if(this._currentStage && this._currentStage.Update && this._currentStage.isInit){
    		
    		this._currentStage.Update(App.ticker);

    	}

    	if(loadCircle && loading){
    		loadCircle.rotation += Math.PI / 60;
    	}
    }); 
}