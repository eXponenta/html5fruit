
var _ME = Matter.Engine,
    _MW = Matter.World,
    _MBs = Matter.Bodies,
    _MB = Matter.Body,
    _MC = Matter.Composite,
    _MEv = Matter.Events,
    _MV = Matter.Vector;

export default function CreateSlicableObject(pos, engine, texSH = null) {
  
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
  phBody.collisionFilter.mask &= ~phBody.collisionFilter.category;
  _MW.add(engine.world, phBody);

  phBody.piObj = obj;
  obj.phBody = phBody;

  return obj;
}
