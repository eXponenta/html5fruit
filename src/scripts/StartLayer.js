import {TimelineLite, TweenLite} from "gsap"
import PixiPlugin from "gsap/PixiPlugin"
import "gsap/EasePack"

export default function StartLayer(base, loader, callback) {
	this.stage = null;
	this.isInit = false;
	
	let _base = base;
	//var loader = new PIXI.loaders.Loader();

    loader.add("start_stage","./src/maps/start.json", () =>{
    	
    	this.stage = loader.resources.start_stage.stage;
    	
    	if(typeof callback == "function"){
    		callback(this);
    	}
    });

    this.OnAdd = function() {
    	if(!this.isInit)
    		this.Init();

    	_tween.play();
    }

    this.OnRemove = function() {
    	_tween.stop();
    	//this.stage.destroy();
    }

    this.OnDestroy = function() {
    	_tween.kill();
    	this.stage.destroy({children:true});
    }

    let _tween;
    this.Init = function(){

    	let _start_button = this.stage.getChildByName("start_button:normal");
    	let _start_button_hover = this.stage.getChildByName("start_button:hover");

    	let _start_button_normal_tex = _start_button.texture;
    	let _start_button_hover_tex = _start_button_hover.texture;
    	
    	_start_button.interactive = true;
    	_start_button.buttonMode = true;
    	
    	let _target = _start_button.position.y - 50;
    	let _def = _start_button.position.y;

    	_tween = new TimelineLite(
    		{
    			onComplete:function() {
   				 this.restart();
   				}
			});

    	_tween
    	.add(TweenLite.to(_start_button, 1,{
    		pixi:{
    			positionY: _target
    		},
    		ease: Elastic.easeIn.config(1, 0.5)
    	}))
    	.add(TweenLite.to(_start_button, 2,{
    		pixi:{
    			positionY: _def
    		},
    		ease: Elastic.easeOut.config(1, 0.2)
    	}));

    	_tween.play();

    	_start_button.on("pointerover", () => {
    		_start_button.texture = _start_button_hover_tex;
    		if(_tween){
    			_tween.stop();
    		}
    	});
    	_start_button.on("pointerout", () =>{
    		_start_button.texture = _start_button_normal_tex;
    		if(_tween){
    			_tween.play();
    		}
    	});

    	_start_button.on("pointertap", () =>{
    		
    		PIXI.sound.play("click");
    		let _l = _base.SetState("List");
    		//_l.Init();
    		//window.LoadGame();
    	});

    	this.isInit = true;
    }

}