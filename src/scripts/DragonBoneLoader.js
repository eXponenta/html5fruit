//import {Signal} from "signals";

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
let wasShowed = false;
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

		if(!wasShowed){
			console.log("DragonBone PIXI PreLoader \n eXponenta {rondo.devil[a]gmail.com}");
			wasShowed = true;
		}
		//depricated
		//res.onLoad = new Signal();

		let _data = res.data;
		
		// add TextureDataJson
		// add to curretn loader
		// callback can be changed to this.onComplete.once(func, this, 100000000);
		// curently they called after loading of texture
		let l = this;//new PIXI.loaders.Loader();
		l.add(res.name + "_tex", res.url.replace("ske.json","tex.json"), {parentResource: res})
		 .add(res.name + "_img", res.url.replace("ske.json","tex.png"), {parentResource: res}, () => {
			
			// update after image loading
			let _res = this.resources;

			let _factory = dragonBones.PixiFactory.factory;
			_factory.parseDragonBonesData(_data);
			_factory.parseTextureAtlasData(_res[res.name + "_tex"].data,_res[res.name + "_img"].texture);
			
			res.objects = {};
			for (let i= 0; i < _data.armature.length; i++) 
			{

				let name = _data.armature[i].name;

				res.objects[name] =  {};
				if(global.DragonBoneLoaderConfig && global.DragonBoneLoaderConfig.create){
				
					res.objects[name] = ConstructByName(_factory, name);	
				}
				
				res.objects[name].create = function(){
					let _f = _factory,
						_n = name;

					return ConstructByName(_f, _n);
				};

				res.objects[name].instance = (global.DragonBoneLoaderConfig && global.DragonBoneLoaderConfig.create);

			}
			//depricated
			//res.onLoad.dispatch(res.objects);
		});

		next();
	};
}

global.DragonBoneLoaderConfig = {
	create : false
}

PIXI.loaders.Loader.addPixiMiddleware(DragonBoneLoader);
PIXI.loader.use(DragonBoneLoader());