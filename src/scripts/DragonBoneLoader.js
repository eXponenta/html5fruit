import {Signal} from "signals";

export default function DragonBoneLoader() {

	return function(res, next) {

		if(res.url.endsWith(".dbbin")){

			console.log("Can't support this format in DragonBone PIXI Factory!");
			next();
			return;
		}

		if(!(res.url.endsWith(".json") && res.data && res.data.armature && res.data.frameRate))
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
				
				let obj = _factory.buildArmatureDisplay(name);
				
				obj.name = name;
				
				obj.importWidth = _data.armature[i].aabb.width;
				obj.importHeight = _data.armature[i].aabb.height;
				
				res.objects[name] = obj;

				res.onCreate.dispatch(res.objects);
			}
		});

		next();
	};
}

PIXI.loaders.Loader.addPixiMiddleware(DragonBoneLoader);
PIXI.loader.use(DragonBoneLoader());