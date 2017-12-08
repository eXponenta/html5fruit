
let Layer = PIXI.display.Layer;
let Group = PIXI.display.Group;
let Stage = PIXI.display.Stage;

export default function OGParser(){
	return function (resource, next) {
		//fallback 
		 if (!resource.data || !(resource.data.type !== undefined && resource.data.type == 'map')) {
            next();
            return;
        }

        console.log("Run Tilde OG importer");
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
        console.log("Dir url:" + baseUrl);
        

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
        			
        			let _group = new Group(i, true);
        			let _layer = new Layer(_group);
        			_layer.name = _l.name;
        			_stage[_l.name] = _layer;
        			_layer.visible = _data.layers[i].visibility;
        			_layer.position.set(_l.x, _l.y);
        			_layer.alpha = _l.opacity;

        			_stage.addChild(_layer);

        			if(_l.objects) 
        			{
        				for (let j = 0; j < _l.objects.length; j++)
        				{
        					
        					let _o = _l.objects[j];
        					if(!_o.name || _o.name == "")
        						_o.name = "obj_" + j;

        					// image Loader
							if(_data.tilesets && _data.tilesets.length > 0 && _o.gid)
							{
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
					        	
					        	let url =  baseUrl + "/" + _img.image;
					        	if(!_img){

					        		console.log("Load res MISSED gid:" + _realGid + " url:" + url);
					        		continue;
					        	}

					        //	console.log("ADD Res:" + _realGid + " url:" + url + " name:" + _o.name);

					        	//this.add("ts:" + _o.name, url, loadOptions, function()
					        	{

					        	//	console.log("Loaded Res:" + _o.gid + " url:" + url);
					        		
					        		//let tex = resource["ts:"+_o.name];//.texture;
					        		//console.log(tex);
					        		let spr = new PIXI.Sprite.fromImage(url);
					        		spr.name = _o.name;
					        		spr.anchor.set(0, 1); // set down to anchor
					        		spr.width = _o.width;
					        		spr.height = _o.height;
					        		spr.rotation = _o.rotation * Math.PI / 180;
					        		spr.alpha = _o.opacity;
					        		spr.x = _o.x;
					        		spr.y = _o.y;
					        		spr.parentGroup = _layer.group;

					        		_stage.addChild(spr);
					        	}
					        	//);

							}

							// TextLoader

							if(_o.text) {

								let _text = new PIXI.Text();
								_text.name = _o.name;
								_text.tag_type = _o.type;

								_text.width = _o.width;
								_text.height = _o.height;
								_text.anchor.set(0,0);

								_text.rotation = _o.rotation * Math.PI / 180;
								_text.text = _o.text.text;
								_text.alpha = _o.opacity

								_text.position.set(_o.x, _o.y);

								_text.style = {
									wordWrap: _o.text.wrap,
									fill: _o.text.color || 0x000000,
									align: _o.text.valign || "center",
									fontSize: _o.text.pixelsize || 24,
									fontFamily: _o.text.fontfamily || "Arial",
									fontWeight: _o.text.bold ? "bold": "normal",
									fontStyle: _o.text.italic ? "italic" : "normal",
									stroke: _o.text.strokeColor || _o.text.color,
									strokeThickness: _o.text.strokeThickness || 0
 								};

 								_text.parentGroup = _layer.group;
 								_stage.addChild(_text);
							}

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
