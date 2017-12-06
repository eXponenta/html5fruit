
// function, who create and instance SlicedLayout
var SliceLayer = function (app) {
  var _ME = Matter.Engine,
    _MW = Matter.World,
    _MBs = Matter.Bodies,
    _MB = Matter.Body,
    _MC = Matter.Composite,
    _MEv = Matter.Events,
    _MV = Matter.Vector,
    _LRes = app.loader.resources;

  var engine = _ME.create();
  engine.world.scale = 0.0001;
  engine.world.gravity.y = 0.35;

  _ME.run(engine);

  // TODO : SlicableObject.js
  var AddSlicableObject = function AddSlicableObject(pos) {
    var texSH =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var obj = null;

    if (texSH) {
      obj = new PIXI.Sprite(texSH.tex);

      if (texSH.pivot) {
        obj.anchor.set(texSH.pivot.x, texSH.pivot.y);
        //console.log(texSH.pivot);
      }
    } else {
      obj = new PIXI.Graphics();
      obj.beginFill(0x9966f * Math.random());
      obj.drawCircle(0, 0, 50);
      obj.endFill();
    }

    obj.x = pos.x;
    obj.y = pos.y;
    obj.onslice = function() {
      console.log("NOT IMPLEMENTED YET");
    };

    obj.kill = function() {
      if (this.phBody.sliced && this.onslice) {
        this.onslice();
      }

      this.destroy({ children: true });
      if (typeof this.phBody !== "undefined") {
        _MC.remove(engine.world, this.phBody);
      }
    };

    var phBody = _MBs.circle(pos.x, pos.y, 50);
    //	phBody.isSensor = true;
    //	phBody.inertia = 0.0001;
    phBody.collisionFilter.mask &= ~phBody.collisionFilter.category;
    //_MB.setMass(phBody, 10);
    _MW.add(engine.world, phBody);

    phBody.piObj = obj;
    obj.phBody = phBody;

    return obj;
  };

  // -- SlicableObject.js

  var stage = new PIXI.display.Stage();

  var _lres = app.loader.resources;

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

  stage._debugText = new PIXI.Text("Body count: 0", {
    fontFamily: "Arial",
    fontSize: 32,
    fill: 0xff1010,
    stroke: 0x00cc10,
    align: "left"
  });

  stage._debugText.position.set(10, 42);
 // console.log("pre");
  stage.blade = new _lres.blade_js.function(
    _lres.blade_tex.texture,
    30,
    10,
    100
  );
  stage.blade.minMovableSpeed = 1000;
  stage.blade.body.parentGroup = sliceMiddleGroup;
  stage.blade.ReadCallbacks(stage);

  stage.addChild(stage.blade.body);
  stage.addChild(stage._debugText);

  var slices = 0;
  // slices via Raycast Testing
  var RayCastTest = function RayCastTest(bodies) {
    if (stage.blade.lastMotionSpeed > stage.blade.minMotionSpeed) {
      var pps = stage.blade.body.points;

      if (pps.length > 1) {
        for (var i = 1; i < Math.min(pps.length, 4); i++) {
          // 4 последних сегмента

          var sp = pps[i - 1];
          var ep = pps[i];

          var collisions = Matter.Query.ray(bodies, sp, ep);
          for (var j = 0; j < collisions.length; j++) {
            if (collisions[j].body.canSlice) {
              var sv = { y: ep.y - sp.y, x: ep.x - sp.x };
              sv = _MV.normalise(sv);

              collisions[j].body.sliceAngle = _MV.angle(sp, ep);
              collisions[j].body.sliceVector = sv;
              //console.log("body slice angle:", collisions[j].body.sliceAngle);
              collisions[j].body.sliced = true;

              slices++;
            }
          }
        }
      }
    }
  };

  var frames = 0;
  var lastShotX = null;

  // update view
  var Update = function Update() {
    stage._debugText.text =
      "Вы дерзко зарезали " + slices.toString() + " кроликoв(ка)(";

    var bodies = _MC.allBodies(engine.world);

    frames++;
    if (frames >= 20 && bodies.length < 5) {
      frames = 0;
      var pos = {
        x:
          Math.round(Math.randomRange(0, 10)) *
          Math.floor((app.renderer.width + 200) / 10),
        y: app.renderer.height + 100
      };

      while (lastShotX !== null && Math.abs(lastShotX - pos.x) < 200) {
        pos.x =
          Math.round(Math.randomRange(0, 10)) *
          Math.floor((app.renderer.width + 200) / 10);
      }

      lastShotX = pos.x;

      pos.x -= 100; //offset

      /// Вынести это говно куда-нибудь в другое место

      //banny
      var bdata = _LRes.bunny.spritesheet;
      var obj = AddSlicableObject(pos, {
        tex: bdata.textures.bunny,
        pivot: bdata.data.frames.bunny.pivot
      });

      obj.scale.set(0.2, 0.2);
      obj.parentGroup = sliceDownGroup;
      obj.phBody.canSlice = true;
      //длиннннный калбек
      obj.onslice = function() {
        var downPart = AddSlicableObject(this.position, {
          tex: bdata.textures.bunny_torse,
          pivot: bdata.data.frames.bunny_torse.pivot
        });

        downPart.scale.set(0.2, 0.2);
        downPart.parentGroup = sliceDownGroup;

        _MB.setMass(downPart.phBody, this.phBody.mass * 0.5);
        _MB.setVelocity(downPart.phBody, this.phBody.velocity);
        _MB.setAngle(downPart.phBody, this.phBody.sliceAngle);

        _MB.applyForce(downPart.phBody, downPart.phBody.position, {
          x: this.phBody.sliceVector.y * 0.02,
          y: this.phBody.sliceVector.x * 0.02
        });

        //downPart.phBody.torque = this.phBody.torque * 10;

        stage.addChild(downPart);

        var upPart = AddSlicableObject(this.position, {
          tex: bdata.textures.bunny_head,
          pivot: bdata.data.frames.bunny_head.pivot
        });

        upPart.scale.set(0.2, 0.2);
        upPart.parentGroup = sliceDownGroup;

        _MB.setMass(upPart.phBody, this.phBody.mass * 0.5);
        _MB.setVelocity(upPart.phBody, this.phBody.velocity);
        _MB.setAngle(upPart.phBody, this.phBody.sliceAngle);
        _MB.applyForce(upPart.phBody, upPart.phBody.position, {
          x: this.phBody.sliceVector.y * 0.02,
          y: -this.phBody.sliceVector.x * 0.02
        });
        //upPart.phBody.torque = this.phBody.torque * 10;

        stage.addChild(upPart);
      };
      // --- до сюдда

      var _ofx = 0.5 - (pos.x + 100) / (app.renderer.width + 200);

      var range = 0.8;
      var imp = {
        x: range * _ofx,
        y: -Math.randomRange(0.4, 0.5)
      };

      _MB.applyForce(obj.phBody, obj.phBody.position, imp);
      obj.phBody.torque = Math.randomRange(-10, 10);

      stage.addChild(obj);
    }

    var ticker = app.ticker;
    stage.blade.Update(ticker);

    //CastTest
    RayCastTest(bodies);

    _ME.update(engine);
    // iterate over bodies and fixtures

    for (var i = bodies.length - 1; i >= 0; i--) {
      var body = bodies[i];

      if (typeof body.piObj !== "undefined") {
        if (
          (body.position.y > app.renderer.height + 100 &&
            body.velocity.y > 0) ||
          body.sliced
        ) {
          body.piObj.kill();
        } else {
          body.piObj.x = body.position.x;
          body.piObj.y = body.position.y;
          body.piObj.rotation = body.angle;
          //console.log(body.angle);
        }
      }
    }
  };

  Math.randomRange = function(min, max) {
    return Math.random() * (max - min) + min;
  };
  //run Update
  app.ticker.add(Update, this);

  //// RETURN
  return stage;
}

//module.exports = SliceLayer;
return SliceLayer;
