import _StartStageCreater from "./StartLayer"
import _ListStageCreater from "./ListLayer"
import Cookie from "js-cookie"

//import "pixi-timer"

export default function BaseLayer(App) {

	let _currentState = null;
	let _thisStage = {};
	let stages = {};
	let volume_bar, volume_mask, volume_btn;
	let linear_volume = 0;



	// preload basss stage
	App.loader
		.add("base_stage", "./src/maps/base.json")
		.load((l, res) => {
    	
    	_thisStage = res.base_stage.stage;
    	_thisStage.app = App;
        
        _thisStage.scale.set(
            App.renderer.width / _thisStage.layerWidth,
            App.renderer.height / _thisStage.layerHeight
        );

        App.stage.addChild(_thisStage);
        
        
        _thisStage.Init = Init;
        _thisStage.SetState = SetState;

        _thisStage.stages = stages;
        stages["Base"] = _thisStage;

        l.progress = 0;
        LoadNext();
    });

	let _lastTween;
	let SetVolume = function (vol){
		
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

		let _conf = GetConfig();
		_conf.volume = vol;
		SaveCongig();
	}

	let LoadNext = function(){
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
				}
			}
		);

    	new _StartStageCreater(_thisStage, App.loader, s =>{
    		stages["Start"] = s;
    	});

    	new _ListStageCreater(_thisStage, App.loader, s =>{
    		stages["List"] = s;
    	});

    	App.loader.load((l, res) => {
    		Init();
    	});

    	App.loader.onProgress.add( (l, res) => {
    		console.log("Progress:", l.progress);
    	});
	}

	let Init = function(){
		_thisStage.reParentAll();

		volume_btn = _thisStage.getChildByName("volume_normal");
		volume_btn.normal = volume_btn.texture;

		let _off = _thisStage.getChildByName("volume_off");
		volume_btn.off = _off.texture;
		_off.destroy();

		volume_bar = _thisStage.getChildByName("volume_bg");
		volume_mask = volume_bar.getChildByName("volume_mask");
		volume_mask.anchor.y = 1;
		volume_mask.position.y += volume_mask.height;

		let _bar = volume_bar.getChildByName("volume_bar");
		_bar.mask = volume_mask;

		volume_btn.on("pointertap",() => {

			let vol = linear_volume + 0.25;
			if(vol > 1)
				vol = 0;

			SetVolume(vol);
			PIXI.sound.play("click");
		});

		let _vol = 0.25;
		let _conf = GetConfig();
		if(_conf.volume !== undefined)
			_vol = _conf.volume;

		SetVolume(_vol);

		let _S = SetState("Start");
		_S.Init();
	}

	let SetState = function(name) {
		
		if(_currentState){
			_thisStage.removeChild(_currentState.stage);
			_currentState.stage.parentGroup = null;
			if(_currentState.OnRemove)
				_currentState.OnRemove();

		}

		_currentState = stages[name];
		if(_currentState){
			_currentState.stage.parentGroup = _thisStage.BASE_MIDDLE.group;
			_thisStage.addChild(_currentState.stage);
			if(_currentState.OnAdd)
				_currentState.OnAdd();
						
		}

		return _currentState;
	}

	let _config;
	let GetConfig = function() {
		
		if(!_config){
			_config = Cookie.getJSON("config");
			if(!_config){
				_config = {};
			}
		}

		return _config;
	}

	let SaveCongig = function(){
		Cookie.set("config", GetConfig(), {path:"", expires: 1000});
	}

    // baseStage update;
    App.ticker.add(() => {

    	if(PIXI.timerManager){
    		PIXI.timerManager.update();
    	}
    });   
}