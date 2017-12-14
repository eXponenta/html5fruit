export default function ConstructorContainer (obj) {
	let _o = obj;

	let _c = new PIXI.Container();
	_c.name = _o.name;
	_c.pivot.set(0, 1); // set down to anchor
	
	if(_c.width)
		spr.width = _o.width;
	
	if(_c.height)
		spr.height = _o.height;
	
	_c.rotation = (_o.rotation || 0)  * Math.PI / 180;
	_c.x = _o.x;
	_c.y = _o.y;
	_c.visible = _o.visible == undefined ? true : _o.visible;
	
	_c.types = _o.type ? _o.type.split(":"): [];

	if(_c.properties)
	{
		_c.alpha = _o.properties.opacity || 1;
		Object.assign(_c, _o.properties);
	}

	return _c; 
}