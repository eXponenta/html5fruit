import {ParseColor} from "./TiledOGLoader/ColorParser"

export default function SliceDataPreparer (config, sprites, groups) {

	let newConfig = Object.assign({}, config);
	
	let ss = sprites.spritesheet.textures;

	let minChance = 1;
	let maxChance = 1;
	let summoryChance = 0;
	let objCount = 0;
	for(let name in newConfig){
		
		newConfig[name].name = name;
		newConfig[name].color = ParseColor(newConfig[name].color);
		newConfig[name].slice = {
		normal:{
			tex: ss[name],
			group: groups.down,
			canSlice: true
		},
		parts :[
		{	
			tex: ss[name+"_t"],
			group: groups.up,
			isTop : true
		},
		{
			tex: ss[name+"_b"],
			group: groups.down,
		}]};

		newConfig[name].chance = (newConfig[name].chance || 1);

		minChance = Math.min(newConfig[name].chance || 1, minChance);
		maxChance = Math.max(newConfig[name].chance || 1, maxChance);

		summoryChance += newConfig[name].chance;
		objCount ++;
	}

	let scale = (summoryChance / (minChance * objCount));

	for(let name in newConfig){
		let count = Math.max(((scale * newConfig[name].chance) << 0), 1);
		for(let i = 1; i < count; i++){
			newConfig[name+"_"+i] = Object.assign({}, newConfig[name]);	
		}
	}

	return newConfig;
}