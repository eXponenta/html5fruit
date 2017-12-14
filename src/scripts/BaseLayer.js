import _StartStageCreater from "./StartLayer"
import _ListStageCreater from "./ListLayer"
//import "pixi-timer"

export default function BaseLayer(App) {

	let _currentState = null;
	let _thisStage = {};
	let stages = {};

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

	let LoadNext = function(){
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

    // baseStage update;
    App.ticker.add(() => {

    	if(PIXI.timerManager){
    		PIXI.timerManager.update();
    	}
    });   
}