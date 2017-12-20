export default function ConstructorContainer (obj, loader, res, parent) {
	let _o = obj;
	
	let _types =  _o.type ? _o.type.split(":"): [];

	let _cont;
	if(_types.indexOf("mask") > -1){
	
		_cont = new PIXI.Sprite(PIXI.Texture.WHITE);
	
	}
	else{
		_cont = new PIXI.Container();
	}
	
	
	if(_o.width && _o.height){
		_cont.width = _o.width;
		_cont.height = _o.height;
		_cont.hitArea = new PIXI.Rectangle(0, 0, _o.width, _o.height);
	}

	_cont.types = _types;
	_cont.name = _o.name;
	
	//Контейнер из картинки, анхоры в 0,1, если просто Shape, то 0,0
	if(_o.gid){
		if(_cont.anchor){
			_cont.anchor.set(0, 1); // set down to anchor
		}
		else {
			_cont.pivot.set(0, 1); // set down to anchor		
		}	
	}
	_cont.rotation = (_o.rotation || 0)  * Math.PI / 180;
	_cont.x = _o.x;
	_cont.y = _o.y;
	_cont.visible = _o.visible == undefined ? true : _o.visible;
	

	if(_o.properties)
	{
		_cont.alpha = _o.properties.opacity || 1;
		Object.assign(_cont, _o.properties);
	}

	//return _cont;
	_cont.parentGroup = _o.parentGroup;
	parent.addChild(_cont);
}