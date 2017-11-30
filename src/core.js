

let _App = null,
    _Renderer = null,
    _Blade = null
    _IntManager = null;

var Init = function(){

    _App = new PIXI.Application({
        width: 1280,
        height: 720
    });

    _IntManager = _App.renderer.plugins.interaction;

    document.body.appendChild(_App.view);
    onResize();
    window.onresize = onResize;

    _App.ticker.add(onUpdate, this);


    _App.loader.add("blade_js","./src/Blade.js") 
                .add("blade_tex","./src/images/blade.png")
    .load((l, res) =>{  

            var _bladeFunc = (new Function(res.blade_js.data))();
           // console.log(_bladeFunc);
            _Blade = new _bladeFunc(res.blade_tex.texture, 10, 0.6);
         //   _Blade.body.scale.set(0.5,0.5);
            _Blade.MoveAll(_IntManager.mouse.global);
            _App.stage.addChild(_Blade.body);

    });

/*
    _App.stage.interactive = true;
    _App.stage.mousemove = function(e) {

        if(_Blade !== null){
         //   _Blade.targetPosition = e.data.global;
        }
    }
    */
    let loadStage = new PIXI.Container();

    let loadButton = new PIXI.Text('This is a Load Button',
        {fontFamily : 'Arial', fontSize: 74, fill : 0xff1010, align : 'center'});

    loadButton.anchor.set(.5,.5)
    loadButton.buttonMode = true;
    loadButton.interactive = true;


    loadButton.position.set(_App.renderer.width / 2, _App.renderer.height / 2);

    loadButton.click = LoadGame;
    loadStage.addChild(loadButton);

    _App.LoadStage = loadStage;
    _App.stage.addChild(loadStage);

}




// update function, pass Window as scope (this = _App)
var onUpdate = function() {
    let dt = _App.ticker.deltaTime;

    if(_Blade !== null){
        // need mobile test
        //if(_App.renderer.plugins.interaction.)
        
         _Blade.targetPosition = _IntManager.mouse.global;
        _Blade.Update(dt);
    }
}


//invoked after loading game resources
var GameLoaded = function(){

    console.log("Game is loaded");

}


var LoadGame = function() {
    
    let loader = PIXI.loader;

    console.log("Game start load");

/*
    loader.add("blade_js","./src/Blade.js")
          .add('bunny', './src/images/bunny.png')
        
        .load((l, res) =>{  
        
            (new Function(res.blade_js.data))();

            GameLoaded();
            _App.LoadStage.destroy();
        });
*/
} 

// resize
var onResize = function(event){
    let _w = document.body.clientWidth;
    let _h = document.body.clientHeight;

    if((_w / _h) < (16 / 9)){
        
        _App.view.style.width = _w + "px";
        _App.view.style.height = _w * 9 / 16 + "px";

    } else {

        _App.view.style.width = _h * 16 / 9 +"px";
        _App.view.style.height = _h + "px";
    }
}
