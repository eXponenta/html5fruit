
var _ME = Matter.Engine,
    _MW = Matter.World,
    _MBs = Matter.Bodies,
    _MB = Matter.Body,
    _MC = Matter.Composite,
    _MEv = Matter.Events,
    _MV = Matter.Vector;

let CreateSubBody = function(parent, texData){

  let obj = CreateSlicableObject(parent.position, parent.engine, texData);
  
  obj.scale.set(0.2, 0.2);
  obj.parentGroup = texData.group;

  _MB.setMass(obj.phBody, parent.phBody.mass * 0.5);
  _MB.setVelocity(obj.phBody, parent.phBody.velocity);
  _MB.setAngle(obj.phBody, parent.phBody.sliceAngle);

  let anchored_dir = _MV.normalise({x:obj.anchor.x - 0.5, y: 0.5 - obj.anchor.y });
  anchored_dir = _MV.rotate(anchored_dir, parent.phBody.sliceAngle);

  _MB.applyForce(obj.phBody, obj.phBody.position, {
    x:  anchored_dir.x * 0.02,
    y:  anchored_dir.y * 0.02
  });

  //downPart.phBody.torque = this.phBody.torque * 10;

  parent.parent.addChild(obj);

  return obj;
}

export default function CreateSlicableObject(pos, engine, data) {
  
  var obj = null;
  if (data && data.normal) {
    obj = new PIXI.Sprite(data.normal.tex);

    if (data.normal.pivot) {
      obj.anchor.set(data.normal.pivot.x, data.normal.pivot.y);
      //console.log(texSH.pivot);
    }
  } else {
  
    obj = new PIXI.Graphics();
    obj.beginFill(0x9966f * Math.random());
    obj.drawCircle(0, 0, 50);
    obj.endFill();
  
  }

  obj.spriteData = data;
  obj.engine = engine;
  obj.x = pos.x;
  obj.y = pos.y;

  obj.onslice = function() {

    for(let i = 0; i < obj.spriteData.parts.length; i++){
      CreateSubBody(obj, {normal: obj.spriteData.parts[i]});
    }

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
  phBody.collisionFilter.mask &= ~phBody.collisionFilter.category;
  _MW.add(engine.world, phBody);

  phBody.piObj = obj;
  obj.phBody = phBody;

  return obj;
}
