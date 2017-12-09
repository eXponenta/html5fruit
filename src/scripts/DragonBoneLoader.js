import {Signal} from "signals";

let ConstructByName = function(factory, name) {

	let obj = factory.buildArmatureDisplay(name);
				
	obj.name = name;
	obj.factory = factory;
	obj.origName = name;

	
	obj.__proto__.lightCopy = function() {
		
		let _name = name;
		let _clone = ConstructByName(this.factory, this.origName);
		
		_clone.position.set(this.position.x, this.position.y);
		
		_clone.alpha = this.alpha;
		_clone.rotation = this.rotation;
		_clone.pivot.copy(this.pivot);
		_clone.anchor.copy(this.anchor);
		_clone.scale.copy(this.scale);
		_clone.visible = this.visible;
		_clone.parentGroup = this.parentGroup;
		_clone.cloneID = this.cloneID? (this.cloneID + 1) : 0;
		_clone.name = this.name + "_clone_" + _clone.cloneID;
		
		return _clone;
		//
	}
	

	
	//obj.importWidth = _data.armature[i].aabb.width;
	//obj.importHeight = _data.armature[i].aabb.height;
	
	return obj;
} 

export default function DragonBoneLoader() {

	return function(res, next) {

		if(res.url.indexOf(".dbbin") > -1){

			console.log("Can't support this format in DragonBone PIXI Factory!");
			next();
			return;
		}

		if(!(res.url.indexOf(".json") > -1 && res.data && res.data.armature && res.data.frameRate))
		{
			next();
			return;
		}

		if(!(dragonBones && dragonBones.PixiFactory)){
			next();
			return;
		}

		console.log("DragonBone PIXI PreLoader \n eXponenta {rondo.devil[a]gmail.com}");


		res.onCreate = new Signal();

		let _data = res.data;
		
		// add TextureDataJson
		//run new Loader
		let l = new PIXI.loaders.Loader();
		l.add(res.name + "_tex", res.url.replace("ske.json","tex.json"))
		.add(res.name + "_img", res.url.replace("ske.json","tex.png"))
		.load( (_l, _res) => {

			let _factory = dragonBones.PixiFactory.factory;
			_factory.parseDragonBonesData(_data);
			_factory.parseTextureAtlasData(_res[res.name + "_tex"].data,_res[res.name + "_img"].texture);
			
			res.objects = {};
			for (let i= 0; i < _data.armature.length; i++) 
			{

				let name = _data.armature[i].name;

				res.objects[name] = ConstructByName(_factory, name);

				res.onCreate.dispatch(res.objects);
			}
		});

		next();
	};
}

PIXI.loaders.Loader.addPixiMiddleware(DragonBoneLoader);
PIXI.loader.use(DragonBoneLoader());