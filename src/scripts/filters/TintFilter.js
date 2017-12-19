import vertex from './default.vert.js';
import fragment from './simpleTint.frag.js';

/**
 * Simple Tint Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/rgb.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [color] Tint color 
 */
export default class SimpleTint extends PIXI.Filter {
    
    constructor(color) {
        super(vertex, fragment);
        this.color = color || 0xFF0000;
    }

    set color(val) {
    	this.uniforms.color = PIXI.utils.hex2rgb(val);
    }

    get color(){
    	return PIXI.utils.rgb2hex(this.uniforms.color);
    }

}

// Export to PixiJS namespace
PIXI.filters.SimpleTint = SimpleTint;