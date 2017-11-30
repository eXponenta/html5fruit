
let _App = null,
    _Renderer = null

var init = function(){
    
    _App = new PIXI.Application({
        width: 1280,
        height: 720
    });


    // The application will create a canvas element for you that you
    // can then insert into the DOM
    document.body.appendChild(_App.view);
    onResize();
    window.onresize = onResize;

    // load the texture we need
    PIXI.loader.add('bunny', 'bunny.png').load((loader, resources) => {
        // This creates a texture from a 'bunny.png' image
        const bunny = new PIXI.Sprite(resources.bunny.texture);

        // Setup the position of the bunny
        bunny.x = _App.renderer.width / 2;
        bunny.y = _App.renderer.height / 2;

        // Rotate around the center
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;

        // Add the bunny to the scene we are building
        _App.stage.addChild(bunny);

        // Listen for frame updates
        _App.ticker.add(() => {
             // each frame we spin the bunny around a bit
            bunny.rotation += 0.01;
        });
    });

}


var onResize = function(event){
    let _w = document.body.clientWidth;
    let _h = document.body.clientHeight;

    if((_w / _h) < (16 / 9)){
        _App.view.width = _w;
        _App.view.height = _w * 9 / 16;

    } else {

        _App.view.width = _h * 16 / 9;
        _App.view.height = _h;
    }
}