import _StartStageCreater from "./StartLayer"
import _ListStageCreater from "./ListLayer"
import _GameStageCreater from "./GameLayer"
import _ResultStageCreater from "./ResultLayer"

import Cookie from "js-cookie"
//import FFS from "fontfaceobserver"

//import "pixi-timer"

let LoadFontCostil = function() {
	window.WebFontConfig = {
      google: {
      	families:['Amatic SC']
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

	let volume_bar, volume_mask, volume_btn;
	let linear_volume = 0;

	// preload basss stage
	App.loader
		.add("base_stage", "./src/maps/base.json")
		.load((l, res) => {
    	
    	this.stage = res.base_stage.stage;
    	this.app = App;
        
        this.stage.scale.set(
            App.renderer.width / this.stage.layerWidth,
            App.renderer.height / this.stage.layerHeight
        );

        App.stage.addChild(this.stage);
        
        
        this.stages["Base"] = this;

        l.progress = 0;
        this.Init();
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
				}
			}
		);

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
    		this.LoadedAll();
    	});

    	App.loader.onProgress.add( (l, res) => {
    		console.log("Progress:", l.progress);
    	});
	}

	this.LoadedAll = function() {
	
		LoadFontCostil();

		///debug
		this.SetStage("Start");


		this.stage.getChildByName("volume_off").destroy();
		this.stage.getChildByName("BASE_LOAD_BG").destroy();
		
		let layer = this.stage.getChildByName("BASE_LOAD_BG");
		if(layer) 
			layer.destroy();
		
		//let _S = this.SetStage("Start");
	}

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
		volume_mask.anchor.y = 1;
		//volume_mask.position.y += volume_mask.height;

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

	this.SetStage = function(name) {
		
		if(this._currentStage){
			this.stage.removeChild(this._currentStage.stage);
			this._currentStage.stage.parentGroup = null;
			
			if(this._currentStage.OnRemove)
				this._currentStage.OnRemove();

		}

		this._currentStage = this.stages[name];
		if(this._currentStage){
			this._currentStage.stage.parentGroup = this.stage.BASE_MIDDLE.group;
			
			if(this._currentStage.OnAdd)
				this._currentStage.OnAdd();
			
			this.stage.addChild(this._currentStage.stage);
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

    // baseStage update;
    App.ticker.add(() => {
    	if(this._currentStage && this._currentStage.Update && this._currentStage.isInit){
    		
    		this._currentStage.Update(App.ticker);

    	}
    });   
}