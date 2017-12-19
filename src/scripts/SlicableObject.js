import Signal from "signals"

var _ME = Matter.Engine,
    _MW = Matter.World,
    _MBs = Matter.Bodies,
    _MB = Matter.Body,
    _MC = Matter.Composite,
    _MEv = Matter.Events,
    _MV = Matter.Vector;

let CreateSubBody = function(parent, texData){

  let obj = CreateSlicableObject(parent.position, parent.engine, texData);
  
  _MB.setMass(obj.phBody, parent.phBody.mass * 0.5);
  _MB.setVelocity(obj.phBody, parent.phBody.velocity);
  _MB.setAngle(obj.phBody, parent.phBody.sliceAngle);
  
  let isTop = texData.normal.isTop;

  let anchored_dir = {x:0, y: isTop ? -1 : 1};

  anchored_dir = _MV.rotate(anchored_dir, parent.phBody.sliceAngle);

  _MB.applyForce(obj.phBody, obj.phBody.position, {
    x:  anchored_dir.x * 0.15,
    y:  anchored_dir.y * 0.15
  });

  obj.phBody.torque = Math.random()*400* (isTop  ? 1: -1);

  parent.parent.addChild(obj);

  return obj;
}

export default function CreateSlicableObject(pos, engine, data) {
  
  var obj = {};
  var texData = data.slice || data;
  
  if (texData && texData.normal) {

    obj = new PIXI.Sprite(texData.normal.tex);

    if (texData.normal.pivot) {
      obj.anchor.set(texData.normal.pivot.x, texData.normal.pivot.y);
    } else {
      obj.anchor.set(0.5, 0.5);
    }
  }

  if(texData.normal.scale){
    obj.scale.set(texData.normal.scale.x, texData.normal.scale.y);
  }

  obj.spriteData = data;
  obj.engine = engine;
  obj.x = pos.x;
  obj.y = pos.y;

  obj.parentGroup = texData.normal.group;
  
  obj.onslice = new Signal();

  obj.kill = function(force) {
    if (this.phBody.sliced && this.onslice && !force) {
      
      this.onslice.dispatch(this, data);
      
      for(let i = 0; i < obj.spriteData.slice.parts.length; i++){
        CreateSubBody(obj, {normal: texData.parts[i]});
      }

    }

    this.destroy({ children: true });
    
    if (typeof this.phBody !== "undefined") {
      _MC.remove(engine.world, this.phBody);
    }

  };

  var phBody = _MBs.rectangle(pos.x, pos.y, obj.width, obj.height);
  
  _MB.setMass(phBody,10);
  phBody.collisionFilter.mask &= ~phBody.collisionFilter.category;
  _MW.add(engine.world, phBody);

  phBody.piObj = obj;
  obj.phBody = phBody;
  obj.phBody.canSlice = texData.normal.canSlice;
  //console.log("creat body :", texData);
  return obj;
}
