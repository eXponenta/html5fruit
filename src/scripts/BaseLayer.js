import _StartStageCreater from "./StartLayer"

export default function BaseLayer(App) {

	let _baseStage;

	App.loader
		.add("base_stage", "./src/maps/base.json")
		.load((l, res) => {
    	
    	_baseStage = res.base_stage.stage;
    	_baseStage.app = App;
        
        _baseStage.scale.set(
            App.renderer.width / _baseStage.layerWidth,
            App.renderer.height / _baseStage.layerHeight
        );

        App.stage.addChild(_baseStage);
        
        _StartStageCreater(_baseStage, s =>{
        	s.parentGroup = _baseStage.BASE_MIDDLE.group;
        	_baseStage.addChild(s);
        });

        Init();
    });

	let Init = function(){
		
	}
    // baseStage update;
    App.ticker.add(() => {

    });   
}