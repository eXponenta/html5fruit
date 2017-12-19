
import CreateSlicableObject from './SlicableObject'
import Blade from './Blade'
import DataPreparer from './SliceDataPreparer'

// function, who create and instance SlicedLayout
export default function SliceLayer (parent) {


  var _ME = Matter.Engine,
    _MW = Matter.World,
    _MBs = Matter.Bodies,
    _MB = Matter.Body,
    _MC = Matter.Composite,
    _MEv = Matter.Events,
    _MV = Matter.Vector,
    _LRes = parent.base.app.loader.resources;

  var engine = _ME.create();
  let app = parent.base.app;
  engine.world.gravity.y = 1;
  //_ME.run(engine);


  this.fireImpulseYRange = parent.base.buildConfig.fireImpulseYRange || {from: 0.8, to:1.1};
  this.fireImpulseXRange = {from: 1.6, to:1.9};
  this.xPositionOffset = parent.base.buildConfig.xPositionOffset || 100;
  this.yPositionOffset = 40; 
  this.mixXDistance = 200;

  this.updatePhysics = true;
  this.updateSlice = true;
  

  this.activeObjects = 0;

  this.stage = parent.stage; //new PIXI.Container();

  var sliceUpGroup = parent.stage.UP.group;
  var sliceMiddleGroup = parent.stage.MIDDLE.group;
  var sliceDownGroup = parent.stage.DOWN.group;
  var sliceSplashGroup = parent.stage.SPLASH.group;

 // stage.filters = [new DropShadowFilter()];
  var blade = new Blade(_LRes.others.textures.blade, 30, 40, 100);

  //stage.group.enableSort = true;
  this.stage.interactive = true;

  blade.minMovableSpeed = 1000;
  blade.body.parentGroup = sliceUpGroup;
  blade.RegisterCallbacks(this.stage);

  this.stage.addChild(blade.body);



  this._sliceCallback = undefined;

  this.RegisterSliceCallback = function(callback){
    if(typeof callback === "function"){
      this._sliceCallback = callback;
    }
  }
  
  this.SliceDetected = function(slices) {

    // show splash, elements, other, fire sound itc

    if(this._sliceCallback){
      this._sliceCallback(slices);
    }
  }

 // var slices = 0;
  // slices via Raycast Testing
  this.RayCastTest = function RayCastTest(bodies) {
    
    if (blade.lastMotionSpeed > blade.minMotionSpeed) {
      
      let ret_slices = [];

      var pps = blade.body.points;
      if (pps.length > 1) {
        
        // 4 последних сегмента
        for (var i = 1; i < Math.min(pps.length, 4); i++) {
          
          var sp = pps[i - 1];
          var ep = pps[i];

          var collisions = Matter.Query.ray(bodies, sp, ep);
          for (var j = 0; j < collisions.length; j++) {
            
            if (collisions[j].body.canSlice) {
              var sv = { y: ep.y - sp.y, x: ep.x - sp.x };
              sv = _MV.normalise(sv);

              collisions[j].body.sliceAngle = _MV.angle(sp, ep);
              collisions[j].body.sliceVector = sv;
             // console.log("body slice angle:", collisions[j].body.sliceAngle);
              collisions[j].body.sliced = true;
            //  slices++;
              ret_slices.push(collisions[j].body.piObj);
            }

          }
        }

        if(ret_slices.length > 0){
          this.SliceDetected(ret_slices);
        }
      }
    }
  };

  var frames = 0;
  var lastShotX = null;


  this.FireObject = function(object_data){
    
      let pos = {
        x:
          Math.round(Math.randomRange(0, 10)) *
          Math.floor((app.renderer.width + this.xPositionOffset) / 10),
        y: app.renderer.height + this.xPositionOffset
      };

      while (lastShotX !== null && Math.abs(lastShotX - pos.x) < this.mixXDistance) {
        pos.x =
          Math.round(Math.randomRange(0, 10)) *
          Math.floor((app.renderer.width + this.xPositionOffset * 2) / 10);
      }

      lastShotX = pos.x;

      pos.x -= this.xPositionOffset; //offset

      var obj = CreateSlicableObject(pos, engine, object_data);
      var _ofx = 0.5 - (pos.x + this.xPositionOffset) / (app.renderer.width + this.xPositionOffset * 2);


      var range = Math.randomRange(this.fireImpulseXRange.from, this.fireImpulseXRange.to);
      var imp = {
        x: range * _ofx,
        y: -Math.randomRange(this.fireImpulseYRange.from, this.fireImpulseYRange.to)
      };

      _MB.applyForce(obj.phBody, obj.phBody.position, imp);
      obj.phBody.torque = Math.randomRange(-400, 400);

      this.stage.addChild(obj);
  }


  let forcedRemoveAll = false;

  this.RemoveAllObjects = function(){

    if(this.updatePhysics && !forcedRemoveAll){
      forcedRemoveAll = true;
      return;
    }

    var bodies = _MC.allBodies(engine.world);

    for(let i = 0; i <  bodies.length; i ++){
     
      let piObj = bodies[i].piObj;
      if(piObj){
          piObj.kill(true);
      }
    }

    forcedRemoveAll = false;
  }

  this.GetActiveObjectsCount = function(){
    this.activeObjects = _MC.allBodies(engine.world).length;
    return this.activeObjects;
  }

  // update view
  this.Update = function Update(ticker) {

    blade.Update(ticker);

    if(this.updatePhysics)
    {
      var bodies = _MC.allBodies(engine.world);
      this.activeObjects = bodies.length;
      //CastTest
     
     if(this.updateSlice)
        this.RayCastTest(bodies);

      _ME.update(engine);

      for (var i = this.activeObjects - 1; i >= 0; i--) {
        var body = bodies[i];

        if (typeof body.piObj !== "undefined") {
          if ((body.position.y > app.renderer.height + 100 &&
              body.velocity.y > 0) || body.sliced) 
          {
            
            body.piObj.kill();

          } else {
            body.piObj.x = body.position.x;
            body.piObj.y = body.position.y;
            body.piObj.rotation = body.angle;
            //console.log(body.angle);
          }
        }
      }

      if(forcedRemoveAll){
        this.RemoveAllObjects();
      }
    }
  };

  Math.randomRange = function(min, max) {
    return Math.random() * (max - min) + min;
  };
}

