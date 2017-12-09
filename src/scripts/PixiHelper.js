
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