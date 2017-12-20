import CText from "./ConstructorText"
import CSprite from "./ConstructorSprite"
import CContainer from "./ConstructorContainer"

let Layer = PIXI.display.Layer;
let Group = PIXI.display.Group;
let Stage = PIXI.display.Stage;

let wasShowed = false;

export default function OGParser(){
	return function (resource, next) {
		//fallback 
		
        if (!resource.data || !(resource.data.type !== undefined && resource.data.type == 'map')) {
            next();
            return;
        }

        if(!wasShowed) {
            console.log("Tiled OG importer!\n eXponenta {rondo.devil[a]gmail.com}");
            wasShowed = true;
        }
        let _data = resource.data; 
        let _stage = new PIXI.Container();

        _stage.layerHeight = _data.height;
        _stage.layerWidth = _data.width;
        
        let _this = this;
        let baseUrl = resource.url.replace(this.baseUrl,"");
        let lastIndexOf = baseUrl.lastIndexOf("/");
        
        if(lastIndexOf == -1)
        	lastIndexOf = baseUrl.lastIndexOf("\\");
        
        if(lastIndexOf == -1 )
    	{
    		console.log("Can't parse:" + baseUrl);
    		next();
    		return;
    	}

        baseUrl = baseUrl.substring(0, lastIndexOf);
    //    console.log("Dir url:" + baseUrl);
        

        let loadOptions = {
            crossOrigin: resource.crossOrigin,
            loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
            parentResource: resource
        };

        //Check Tiler Map type
       // if(_data.type !== undefined && _data.type == 'map')
        {

        	if(_data.layers) 
        	{
        		for(let i = 0; i < _data.layers.length; i++)
        		{
        			
        			let _l = _data.layers[i];
        			
        			if(_l.type !== "objectgroup" && _l.type !== "imagelayer")
        			{
        				console.warn("OGParser support only OBJECT or IMAGE layes!!");
        				//next();
        				//return;
        				continue;
        			}

        			if(_l.properties && (_l.properties.ignore || _l.properties.ignoreLoad)){

        				//console.log("OGParser: ignore loading layer:" + _l.name);
        				continue;
        			}

        			
        			let _group = new Group( _l.properties ? (_l.properties.zOrder || i) : i, true);
        			let _layer = new Layer(_group);
        			_layer.name = _l.name;
        			_stage[_l.name] = _layer;
        			_layer.visible = _l.visible;
        			
        			_layer.position.set(_l.x, _l.y);
        			_layer.alpha = _l.opacity || 1;

        			_stage.addChild(_layer);
        			if(_l.type == "imagelayer"){
	        			_l.objects = [
	        				{
	        					image: _l.image,
	        					name: _l.name,
	        					x: _l.x ,
	        					y: _l.y + _stage.layerHeight,
	        					//width: _l.width,
	        					//height: _l.height,
	        					properties: _l.properties,
	        				}
	        			];
        			}

        			if(_l.objects) 
        			{
        				for (let j = 0; j < _l.objects.length; j++)
        				{
        					
        					let _o = _l.objects[j];
                            _o.parentGroup = _layer.group;
        					let _obj = undefined;

        					if(!_o.name || _o.name == "")
        						_o.name = "obj_" + j;
        					
                            var _isContainer = !(_o.gid || _o.image || _o.text) || (_o.properties && _o.properties.container);
                            var _isText = _o.text != undefined;
                            var _isImage = (_data.tilesets && _data.tilesets.length > 0) && !_isContainer && !_isText;
                            // image Loader
							if(_isImage)
							{
								if(!_o.image){
									var _ts = undefined; //_data.tilesets[0];
									for(let i = 0; i < _data.tilesets.length; i ++){
										if(_data.tilesets[i].firstgid <= _o.gid){
											_ts = _data.tilesets[i];
										}
									}

									if(!_ts){
										console.log("Image with gid:" + _o.gid + " not found!");
										continue;;
									}

									let _realGid = _o.gid - _ts.firstgid;
						        	let _img = _ts.tiles["" + _realGid];
						        	
						        	_o.url =  baseUrl + "/" + _img.image;
						        	
						        	if(!_img){

						        		console.log("Load res MISSED gid:" + _realGid + " url:" + url);
						        		continue;
						        	}
					        	} else {

						        	_o.url =  baseUrl + "/" + _o.image;
						        	 
					        	}
					        	
					        	//Sprite Loader
					        	_obj = CSprite(_o, this, resource, _stage);
							}

							// TextLoader
							if(_isText) {
								_obj = CText(_o, this, resource, _stage);
							}
                            if(_isContainer){
                                _obj = CContainer(_o, this, resource, _stage);
                            }
                            /*
							if(_obj){
								_obj.parentGroup = _layer.group;
								_stage.addChild(_obj);
							}*/
        				}
        			}
        		}
        	}

        }

        
        resource.stage = _stage;

		// call next loader
		next();

	};
}
