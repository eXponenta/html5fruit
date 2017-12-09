export default function StartLayer(base, callback) {
	let _startLayer;

	var loader = new PIXI.loaders.Loader();

    loader.add("start_stage","./src/maps/start.json").load( (l, res) =>{
    	
    	_startLayer = res.start_stage.stage;
    	
    	if(typeof callback == "function"){
    		callback(_startLayer);
    	}

    	Init();
    });

    let Init = function(){

    	let _start_button = _startLayer.getChildByName("start_button:normal");
    	let _start_button_hover = _startLayer.getChildByName("start_button:hover");

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
    		
    		_startLayer.visible = false;
    		window.LoadGame();
    	})
    }
}