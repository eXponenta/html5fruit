import {ParseColor,ParseAlpha } from "./ColorParser"


export default function ConstructorText(obj) {

	let _o = obj;
	let _cont = new PIXI.Container();
									
	let _text = new PIXI.Text();
	_text.name = _o.name + "_Text";

	_cont.name = _o.name;
	_cont.types = _o.type ? _o.type.split(":"): [];


	_cont.width = _o.width;
	_cont.height = _o.height;

	//_cont.lineStyle(2, 0xFF00FF, 1);
	//_cont.beginFill(0xFF00BB, 0.25);
	//_cont.drawRoundedRect(0, 0, _o.width, _o.height);
	//_cont.endFill();

	_cont.pivot.set(0,0);

	_cont.rotation = _o.rotation * Math.PI / 180;
	_cont.alpha = ParseAlpha(_o.text.color) || 1;
	_text.text = _o.text.text;

	var _padding = (_o.properties !== undefined) ? (_o.properties.fontPadding || 0) : 0;

	console.log(_o.text.halign);
	switch (_o.text.halign) {
		case "right":
				{
					_text.anchor.x = 1;
					_text.position.x = _o.width;
				}
			break;
		case "center":
				{
					_text.anchor.x = 0.5;
					_text.position.x = _o.width * 0.5 ;
				}
			break;
		default:
			{
				_text.anchor.x = 0;
				_text.position.x = 0;	
			}
			break;
	}

	switch (_o.text.valign) {
		case "bottom":
				{
					_text.anchor.y = 1;
					_text.position.y = _o.height ;
				}
			break;
		case "center":
				{
					_text.anchor.y = 0.5;
					_text.position.y =  _o.height * 0.5;
				}
			break;
		default:
			{

				_text.anchor.y = 0;
				_text.position.y = 0;
			}
			break;
	}


	_cont.position.set(_o.x, _o.y);
	_text.style = {

		wordWrap: _o.text.wrap,
		fill: ParseColor(_o.text.color) || 0x000000,
		align: _o.text.valign || "center",
		fontSize: _o.text.pixelsize || 24,
		fontFamily: _o.text.fontfamily || "Arial",
		fontWeight: _o.text.bold ? "bold": "normal",
		fontStyle: _o.text.italic ? "italic" : "normal"
	};

	if(_o.properties)
	{
		_text.style.stroke =  ParseColor(_o.properties.strokeColor) || 0;
		_text.style.strokeThickness =  _o.properties.strokeThickness || 0;
		_text.style.padding = _o.properties.fontPadding || 0;	
		Object.assign(_cont, _o.properties);
	}

	//_cont.parentGroup = _layer.group;
	_cont.addChild(_text);
	//_stage.addChild(_cont);
	return _cont;
}