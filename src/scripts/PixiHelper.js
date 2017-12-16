
PIXI.Container.prototype.getChildByName = function getChildByName(name)
{
    for (let i = 0; i < this.children.length; i++)
    {
        if (this.children[i].name === name)
        {
            return this.children[i];
        }
    }

    return null;
};

PIXI.Container.prototype.reParentAll = function reParentAll()
{
	for (let i = this.children.length - 1; i >= 0; i--)
	{    
        let _c = this.children[i];
        if(_c.reParentTo){
            let parent = this.getChildByName(_c.reParentTo);
            if(parent) {
                parent.toLocal(new PIXI.Point(0,0), _c, _c.position);
                parent.addChild(_c);
            }
        }

        if(_c.maskedBy){
            _c.mask = this.getChildByName(_c.maskedBy);
        }
    }    
}