
export default function ConstructorSpritr(obj, loader, res, parent) {
	

	let create = () =>{ 
		
		let _o = obj; 
		let _l = loader;

		let spr = new PIXI.Sprite(loader.resources[obj.url].texture);

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
		spr.parentGroup = _o.parentGroup;
		parent.addChild(spr);
	};


	if(!loader.resources[obj.url]){
		loader.add(obj.url, {parentResource: res}, create);
	} else {
		create();
	}
	//return spr;
}