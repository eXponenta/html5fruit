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
    }

    this.OnRemove = function() {

    }

    this.Init = function(){

    	let _start_button = this.stage.getChildByName("start_button:normal");
    	let _start_button_hover = this.stage.getChildByName("start_button:hover");

    	let _start_button_normal_tex = _start_button.texture;
    	let _start_button_hover_tex = _start_button_hover.texture;
    	
    	_start_button.interactive = true;
    	_start_button.buttonMode = true;

    	_start_button.on("pointerover", () => {
    		_start_button.texture = _start_button_hover_tex;
    	});
    	_start_button.on("pointerout", () =>{
    		_start_button.texture = _start_button_normal_tex;
    	});

    	_start_button.on("pointertap", () =>{
    		
    		let _l = _base.SetState("List");
    		//_l.Init();
    		//window.LoadGame();
    	})

    	this.isInit = true;
    }

}