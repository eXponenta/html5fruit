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

		App.loader
		.add("flag_ske", "./src/anims/flag/flag_ske.json")
		.load((l, res) => {

			if(res.flag_ske.onCreate){
				
				res.flag_ske.onCreate.add( x => {

					x.Flag.parentGroup = _baseStage.BASE_UI.group;
					x.Flag.scale.set(2,2);
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

	}
    // baseStage update;
    App.ticker.add(() => {

    });   
}