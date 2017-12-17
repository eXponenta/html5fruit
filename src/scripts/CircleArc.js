
export default class CircleArc extends PIXI.Graphics {
	
	constructor(lines, radius, startAngle, anticlockwise){
		super(lines);

		
		this.radius = radius || 50;
		this.startAngle = startAngle || -Math.PI / 2;
		this.anticlockwise = anticlockwise;
		this._progress = 0;
		this.fillColor = 0xFFFFFF;
	}

	updateProgress(){
		if(this._progress < 0.001)
			return;
		
	    this.clear();
	  	this.beginFill(this.fillColor);
	    this.arc(0,0,this.radius, this.startAngle, -Math.PI / 2 + this._progress * Math.PI * 2, this.anticlockwise);
	    this.lineTo(0,0);
	    this.endFill();
	}

	get progress() {
		return this._progress;
	}

	set progress(val) {
		this._progress = Math.min(1, Math.max(0,val));
		this.updateProgress();
	}

}