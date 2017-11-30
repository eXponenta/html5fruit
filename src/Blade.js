
//Blade JS constructor

function Blade(texture, count = 10, speed = 10, maxLenght = 400) {

		var points = []
		this.count = count;
		this.speed = speed
		this.maxLenght = maxLenght;

		this.targetPosition = new PIXI.Point(0,0);

		for (var i = 0; i < count; i++) {
			points.push(new PIXI.Point( 0, 0));
		}

		this.body = new PIXI.mesh.Rope(texture, points);

		this.MoveAll = function(point) {
			this.targetPosition = point;
			for (var i = 0; i < count; i++) {
				points[i].set(point.x /  this.body.scale.x, point.y /  this.body.scale.y);					
			}
		}

		this.Update = function(dt) {

			var points = this.body.points;
			
			var t = new PIXI.Point(this.targetPosition.x / this.body.scale.x
								, this.targetPosition.y / this.body.scale.y);
			points[0].set(t.x, t.y);

			for (var i = 1; i < count; i++) {

				var p = points[i];

				let dx = t.x - p.x;
				let dy = t.y - p.y;

				let dist = Math.sqrt(dx*dx + dy*dy);

				if(dist > 5) {

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
}


return Blade;

//