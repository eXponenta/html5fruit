
export default function ConstructorSpritr(obj) {
	let _o = obj; 

	let spr = new PIXI.Sprite.fromImage(_o.url);
	spr.name = _o.name;
	spr.anchor.set(0, 1); // set down to anchor
	
	if(_o.width)
		spr.width = _o.width;
	
	if(_o.height)
		spr.height = _o.height;
	
	spr.rotation = (_o.rotation || 0)  * Math.PI / 180;
	spr.x = _o.x;
	spr.y = _o.y;
	spr.visible = _o.visible == undefined ? true : _o.visible;
	
	spr.types = _o.type ? _o.type.split(":"): [];

	if(_o.properties)
	{
		spr.alpha = _o.properties.opacity || 1;
		Object.assign(spr, _o.properties);
	}

	return spr;
}