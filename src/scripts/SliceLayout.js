
// function, who create and instance SlicedLayout
function SliceLayer(app) {

	let _ME = Matter.Engine,
		_MW = Matter.World,
    	_MBs = Matter.Bodies,
    	_MB = Matter.Body,
    	_MC = Matter.Composite,
    	_MEv = Matter.Events;

    let engine = _ME.create();
    	engine.world.scale = 0.0001;
    	engine.world.gravity.y = 0.35;	
    


    _ME.run(engine);
    	      
	var AddSlicableObject = function(pos){

		var circle = new PIXI.Graphics();
			circle.beginFill(0x9966F * Math.random());
			circle.drawCircle(0, 0, 50);
			circle.endFill();
			circle.x = pos.x;
			circle.y = pos.y;

			circle.kill = function(){
				if(this.phBody.sliced){
					console.log("NOT IMPLEMENTED YET");
				}
				this.destroy({children: true, texture : true});
				if(typeof this.phBody !== "undefined")
				{
					_MC.remove(engine.world, this.phBody);
				}
			};

		let phBody = _MBs.circle(pos.x, pos.y, 50);
			phBody.isSensor = true;
			phBody.collisionFilter.mask &= ~ phBody.collisionFilter.category;
		_MW.add(engine.world, phBody);

		phBody.piObj = circle;
		circle.phBody = phBody;
	
		return circle;
	}

	//

	var stage = new PIXI.display.Stage();

	let _lres = app.loader.resources;

	var sliceUpGroup = new PIXI.display.Group(1, false);
	var sliceMiddleGroup = new PIXI.display.Group(0, false);
	var sliceDownGroup = new PIXI.display.Group(-1, false);
	var uiGroup = new PIXI.display.Group(10, false);


	stage.addChild(new PIXI.display.Layer(sliceUpGroup));
	stage.addChild(new PIXI.display.Layer(sliceDownGroup));
	stage.addChild(new PIXI.display.Layer(sliceMiddleGroup));
	stage.addChild(new PIXI.display.Layer(uiGroup));


	//stage.group.enableSort = true;
	stage.interactive = true;

	stage._debugText = new PIXI.Text(
		'Body count: 0',
        {
        	fontFamily : 'Arial',
        	fontSize: 32,
        	fill : 0xff1010,
        	stroke: 0x00cc10,
        	align : 'left'
        });

	stage._debugText.position.set(10,42);
	
	stage.blade = new _lres.blade_js.function(_lres.blade_tex.texture, 30, 10, 100);
	stage.blade.minMovableSpeed = 1000;
    stage.blade.body.parentGroup = sliceMiddleGroup;
    stage.blade.phBody = _MBs.rectangle(0,0,stage.blade.minDist * 3, 50, {mass:0,isSensor:true});
    //stage.blade.phBody.isSensor = true;
    stage.blade.phBody.collisionFilter.category = _MB.nextCategory();
    _MW.add(engine.world, stage.blade.phBody);
    stage.blade.ReadCallbacks(stage);

    stage.addChild(stage.blade.body);
    stage.addChild(stage._debugText);


	//callbakcs
    var OnCollisionEnter = function(event){
    	
    	var pairs = event.pairs;
		
		if(stage.blade.lastMotionSpeed > stage.blade.minMotionSpeed){
			for (var i = 0, j = pairs.length; i != j; ++i) {
	           
	            var pair = pairs[i];

	            if (pair.bodyA === stage.blade.phBody) {
	                pair.bodyB.sliced = true;
	            } else if (pair.bodyB === stage.blade.phBody) {
	                pair.bodyA.sliced = true;
	            }
	        }
    	}
	};

	var OnCollisionExit = function(event){

	};
	
	// Register callbacks
    _MEv.on(engine, "collisionStart", OnCollisionEnter);
    _MEv.on(engine, "collisionEnd", OnCollisionExit);

    var frames = 0;
    var lastShotX = null;

	// update view
	var Update = function(){

	   // stage._debugText.text = "Collision counts:" + coolis.toString();

	    var bodies = _MC.allBodies(engine.world);
		frames ++;
		if(frames >= 20 && bodies.length < 5){
			
			frames = 0;
			var pos = { 
				x: Math.round(Math.randomRange(0,10)) * Math.floor((app.renderer.width + 200) / 10),
				y:app.renderer.height + 100};
			
			while(lastShotX !== null && Math.abs(lastShotX - pos.x) < 200){
				pos.x  = Math.round(Math.randomRange(0,10)) * Math.floor((app.renderer.width + 200) / 10);
			}

			lastShotX = pos.x;
			
			pos.x -= 100; //offset

			var obj = AddSlicableObject(pos);

			let _ofx = 0.5 - (pos.x + 100) / (app.renderer.width + 200);
			
			let range = 0.8;
			var imp = {
				x: range * _ofx,
			 	y: -Math.randomRange(0.4, 0.5)
			 };

			 //let len = Math.sqrt(imp.x * imp.x + imp.y * imp.y);
			 //let rndLen = Math.randomRange(0.4, 0.52);
			 
			 //imp.x = imp.x * rndLen / len;
			 //imp.y = imp.y * rndLen / len;

			_MB.applyForce(obj.phBody, {x:0, y:0}, imp);
			obj.parentGroup = sliceDownGroup;
			stage.addChild(obj);
		}

		var ticker = app.ticker;
		stage.blade.Update(ticker);
 		_MB.setPosition(stage.blade.phBody, stage.blade.targetPosition);
		// Physic

		_ME.update(engine); 
	    // iterate over bodies and fixtures

	    for (var i = bodies.length - 1; i >= 0; i--) {
	    	
	    	var body = bodies[i];

	    	if(typeof body.piObj !== "undefined"){

	    		if(body.position.y > app.renderer.height + 100 && body.velocity.y > 0 || body.sliced){

	    			body.piObj.kill();
	    		
	    		} else {

	    			body.piObj.x = body.position.x;
	    			body.piObj.y = body.position.y;
	    			body.piObj.angle = body.angle;
	    		}
	    	}	
	    }
	};

	
	Math.randomRange =  function(min, max) {
  		return Math.random() * (max - min) + min;
	}
	//run Update
	app.ticker.add(Update, this);
	

	//// RETURN
	return stage;
}

return SliceLayer;