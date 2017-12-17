import {TimelineLite, TweenLite} from "gsap"
import PixiPlugin from "gsap/PixiPlugin"
import "gsap/EasePack"

export default function ResultLayer(base, loader, callback) {
	this.stage = null;
	this.isInit = false;
	
	let ANIMATION_DELAY = 0.5;
	let ANIMATION_DURATION = 2;
	
	let _base = base;
	let _textBoxes = {
        orange:0,
        watermelon:0,
        mango:0,
        qiwi:0,
        strawberry:0,
        marakuja:0,
        banana:0,
        raspberry:0,
        lemon:0,
        pineapple:0,
        apple:0,
        pumpkin:0,
        pomade:0,
        burger:0,
        phone:0
    };

	//var loader = new PIXI.loaders.Loader();

    loader.add("result_stage","./src/maps/result.json", () =>{
    	
    	this.stage = loader.resources.result_stage.stage;
    	
    	if(typeof callback == "function"){
    		callback(this);
    	}
    });


    this.SetResults = function(_results){
    	let _index = 0;

    	for(var name in _results){
			let _text = _textBoxes[name];
			_text.var = 0;
			_text.text = _results[name];

			TweenLite.to(_text, ANIMATION_DURATION,{
				var: _results[name],
				onUpdate: function(){
					_text.text = Math.ceil(_text.var);
				},
				//ease: Power4.easeOut
			});

    	}
    }

    this.OnAdd = function(param) {
    	if(!this.isInit)
    		this.Init();

    	this.SetResults(param);
    }

    this.OnRemove = function() {

    }

    this.OnDestroy = function() {

    	this.stage.destroy({children:true});
    }

    this.Init = function(){
    	this.stage.reParentAll();

    	let _close_button = this.stage.getChildByName("result_close");

    	_close_button.on("pointertap", () =>{
    		
    		PIXI.sound.play("click");
    		//PIXI.sound.play("base");
    		_base.SetStage("Game");
    	});

    	for(var name in _textBoxes){
    		var _text_c = this.stage.getChildByName(name + "_text");
    		if(_text_c){
    			
    			let _text = _text_c.text;
    			_text.var = 0;
    			_text.style.padding = 30;
    			_text.text = "0";
    			_textBoxes[name] = _text;
    		}
    	}

    	this.isInit = true;
    }

}