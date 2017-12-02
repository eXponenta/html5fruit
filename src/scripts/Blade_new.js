
//Blade JS constructor

function Blade(texture, count = 10, minDist = 40, liveTime = 20) {

		var points = []
		this.count = count;
		this.minDist = minDist;
		this.texture = texture;
		this.minMovableSpeed = 4000.0;
		this.liveTime = liveTime;
		this.targetPosition = new PIXI.Point(0,0);

		this.body = new PIXI.mesh.Rope(texture, points);

		var lastPoint = null;
		this.Update = function(ticker) {

			var isDirty = false;

			var points = this.body.points;
			

			for (var i = points.length - 1; i >= 0; i--) {
				
				if(points[i].lastTime + this.liveTime < ticker.lastTime){
					points.shift();
					isDirty = true;
				}
			}

			var t = new PIXI.Point(this.targetPosition.x / this.body.scale.x
								, this.targetPosition.y / this.body.scale.y);
			
			if(lastPoint == null)
				lastPoint = t;

			t.lastTime = ticker.lastTime;

			let p = lastPoint;

			let dx = t.x - p.x;
			let dy = t.y - p.y;

			let dist = Math.sqrt(dx*dx + dy*dy);


			if(dist > minDist ){

				if((dist * 1000 / ticker.elapsedMS) > this.minMovableSpeed){
					points.push(t);
				}
				if(points.length > this.count){
					points.shift();
				}


				isDirty = true;
			}


			lastPoint = t;
			if(isDirty){

				this.body.refresh(true);
				this.body.renderable = (points.length  > 1);

			}
		};

		this.ReadCallbacks = function(target) {
			
			let self =  this;

			target.mousemove = function(e){

			   self.targetPosition =  e.data.global;	
			}

			target.mouseover = function(e) {
			//	self.targetPosition =  e.data.global;
			//	console.log("over");
			  //  self.MoveAll(e.data.global);    
		    }

	    	target.touchmove = function(e) {
	            console.log("Touch move");
	            //console.log(e.data);
	            self.targetPosition =  e.data.global;   
		    }

		    target.touchstart = function(e) {
		        console.log("Touch start");
		            //console.log(e.data);
			  //  self.MoveAll(e.data.global);   
		    }

		    target.touchend = function(e) {
		         console.log("Touch start");
				// _Blade.MoveAll(e.data.global); 
		    }
		    // а то лапша какая-то

		};
}


return Blade;

//