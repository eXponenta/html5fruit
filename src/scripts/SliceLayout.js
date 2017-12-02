
// function, who create and instance SlicedLayout
function SliceLayer(app) {

	let _ME = Matter.Engine,
		_MW = Matter.World,
    	_MB = Matter.Bodies,
    	_MC = Matter.Composite;

    let engine = _ME.create();
    _ME.run(engine);
    	      
	var AddSlicableObject = function(pos){

		var circle = new PIXI.Graphics();
			circle.beginFill(0x9966FF);
			circle.drawCircle(0, 0, 50);
			circle.endFill();
			circle.x = pos.x;
			circle.y = pos.y;

		let phBody = _MB.circle(pos.x, pos.y, 50);

		_MW.add(engine.world, phBody);
		//console.log(phBody);
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
		'Slices count: 0',
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
    
    stage.blade.ReadCallbacks(stage);
    stage.addChild(stage.blade.body);
    stage.addChild(stage._debugText);

    var frames = 0;
	var Update = function(){

		frames ++;
		if(frames >= 100){
			
			frames = 0;
			var pos = {x:200 + Math.random()*(app.renderer.width - 400), y: 200}//app.renderer.height + 100};

			var obj = AddSlicableObject(pos);


	       // var f = obj.phBody.getWorldVector();
	       // obj.phBody.applyForceToCenter(_P.Vec2(0.0, -1000000000), true);
			
			obj.parentGroup = sliceDownGroup;
			stage.addChild(obj);
		}

		var ticker = app.ticker;
		stage.blade.Update(ticker);

		// Physic

		_ME.update(engine, ticker.elapsedMS);
	    // iterate over bodies and fixtures
	    var bodies = _MC.allBodies(engine.world);

	    for (var i = bodies.length - 1; i >= 0; i--) {
	    	
	    	var body = bodies[i];

	    	if(typeof body.piObj !== undefined){

	    		if(body.position.y > app.renderer.height + 100 && body.velocity.y > 0){
	    			
	    			body.piObj.destroy();
	    			_MC.remove(engine.world, body);
	    		
	    		} else {

	    			body.piObj.x = body.position.x;
	    			body.piObj.y = body.position.y;
	    			body.piObj.angle = body.angle;
	    		}
	    	}
	    }
	};

	//run Update
	app.ticker.add(Update, this);
	

	//// RETURN
	return stage;
}

return SliceLayer;