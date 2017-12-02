
//Blade JS constructor

function Blade(texture, count = 10, speed = 10, maxLenght = 400) {

		var points = []
		this.count = count;
		this.speed = speed
		this.maxLenght = maxLenght;
		this.canUpdate = true;

		this.targetPosition = new PIXI.Point(0,0);

		for (var i = 0; i < count; i++) {
			points.push(new PIXI.Point( 0, 0));
		}

		this.body = new PIXI.mesh.Rope(texture, points);

		this.MoveAll = function(point) {

			for (var i = 0; i < count; i++) {
				points[i].set(point.x /  this.body.scale.x, point.y /  this.body.scale.y);					
			}

			this.targetPosition.set(point.x, point.y);
		}

		this.Update = function(dt) {
		//	if(!this.canUpdate)
	//			return;

			var points = this.body.points;
			
			var t = new PIXI.Point(this.targetPosition.x / this.body.scale.x
								, this.targetPosition.y / this.body.scale.y);
			points[0].set(t.x, t.y);

			for (var i = 1; i < count; i++) {

				var p = points[i];

				let dx = t.x - p.x;
				let dy = t.y - p.y;

				let dist = Math.sqrt(dx*dx + dy*dy);

				if(dist > 10) {

					/*
					let sL = this.maxLenght / this.count;
					
					if(dist > sL)
					{
						p.x += (dist - sL) * dx / dist;
						p.y += (dist - sL) * dy / dist;
					}*/
					p.x += dx * dt * this.speed;
					p.y += dy * dt * this.speed;
					
				} else {

					p.set(t.x, t.y);

				}
				t = p;
			}
		};

		this.ReadCallbacks = function(target) {
			
			let self =  this;

			target.mousemove = function(e){
			   self.targetPosition =  e.data.global;	
			}

			target.mouseover = function(e) {
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
			    self.MoveAll(e.data.global);   
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