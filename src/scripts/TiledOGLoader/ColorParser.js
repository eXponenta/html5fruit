
let ParseColor = function(value){
	
	if(!value)
		return undefined;

	if(typeof value == "string")
	{
		value = value.replace("#","");
		if(value.length > 6)
			value = value.substring(2);

		let parse = parseInt(value, 16);
		return parse;
	}

	return value;
}

let ParseAlpha = function(value){
	
	if(!value)
		return undefined;

	if(typeof value == "string")
	{
		value = value.replace("#","");
		if(value.length > 6)
			value = value.substring(0,2);
		else
			return 1;

		let parse = parseInt(value, 16);
		return parse / 256;
	}

	return value;
}

export {
	ParseColor,
	ParseAlpha
}
