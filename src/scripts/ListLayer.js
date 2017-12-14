export default function ListLayer(base, loader, callback) {
	this.stage = null;
    this.isInit = false;

	//var loader = new PIXI.loaders.Loader();

    loader.add("list_stage","./src/maps/list.json", () =>{
    	
    	this.stage = loader.resources.list_stage.stage;
    	
    	if(typeof callback == "function"){
    		callback(this);
    	}

    });

    this.OnRemove = function() {

    }
    this.OnAdd = function(){
        if(!this.isInit){
            this.Init();
        }
    }


    this.Init = function(){
        let _s = this.stage;
        window.List = _s;
        _s.reParentAll();
        this.isInit = true;

        let _rules_btn = _s.getChildByName("rules_button");
        let _rules_dsk = _s.getChildByName("rules_desk");
        
        _rules_btn.on("pointertap", () =>{
            _rules_dsk.visible = true;
        });
    }

}