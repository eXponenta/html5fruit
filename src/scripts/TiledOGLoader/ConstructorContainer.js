export default function ConstructorContainer (obj) {
	let _o = obj;

	let _cont = new PIXI.Container();
	_cont.name = _o.name;
	_cont.pivot.set(0, 1); // set down to anchor
	
	if(_o.width && _o.height){
		_cont.hitArea = new PIXI.Rectangle(0, 0, _o.width, _o.height);
	}
	_cont.rotation = (_o.rotation || 0)  * Math.PI / 180;
	_cont.x = _o.x;
	_cont.y = _o.y;
	_cont.visible = _o.visible == undefined ? true : _o.visible;
	
	_cont.types = _o.type ? _o.type.split(":"): [];

	if(_o.properties)
	{
		_cont.alpha = _o.properties.opacity || 1;
		Object.assign(_cont, _o.properties);
	}

	return _cont; 
}