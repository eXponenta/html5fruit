import {ParseColor} from "./TiledOGLoader/ColorParser"

export default function SliceDataPreparer (config, sprites, groups) {

	let newConfig = Object.assign({}, config);
	
	let ss = sprites.spritesheet.textures;

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
			group: groups.down,
			isTop : true
		},
		{
			tex: ss[name+"_b"],
			group: groups.up,
		}]};
	}
	return newConfig;
}