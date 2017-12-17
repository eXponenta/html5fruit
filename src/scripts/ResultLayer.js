import {TimelineLite, TweenLite} from "gsap"
import PixiPlugin from "gsap/PixiPlugin"
import "gsap/EasePack"

export default function ResultLayer(base, loader, callback) {
	this.stage = null;
	this.isInit = false;
	
	let ANIMATION_DELAY = 0.5;
	let ANIMATION_DURATION = 2;
	
	let _base = base;
	//var loader = new PIXI.loaders.Loader();

    loader.add("result_stage","./src/maps/result.json", () =>{
    	
    	this.stage = loader.resources.result_stage.stage;
    	
    	if(typeof callback == "function"){
    		callback(this);
    	}
    });

    this.SetResults = function(results){

    	let _index = 0;

    	for(var name in results){
    		var _text_c = this.stage.getChildByName(name + "_text");
    		if(_text_c){
    			
    			let _text = _text_c.text;
    			_text.var = 0;
    			_text.style.padding = 30;
    			TweenLite.to(_text, ANIMATION_DURATION,{
    				var: results[name],
    				delay:ANIMATION_DELAY,
    				onUpdate: function(){
    					_text.text = Math.ceil(_text.var);
    				}
    			});
    		}
    	}
    }

    this.OnAdd = function() {
    	if(!this.isInit)
    		this.Init();

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


    	this.isInit = true;
    }

}