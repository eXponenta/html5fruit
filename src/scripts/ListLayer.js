import {TweenLite} from "gsap"
import PixiPlugin from "gsap/PixiPlugin"

export default function ListLayer(base, loader, callback) {


	this.stage = null;
    this.isInit = false;
    
    let animations = [];
    let _rules_dsk;
    var _rendr = base.app.renderer;
   
   loader.add("fruit_anims", "./src/anims/obj/fruits_anims_ske.json")
         .add("title_anim", "./src/anims/title/title_anim_ske.json")
         .add("list_stage","./src/maps/list.json", () =>{
    	
    	this.stage = loader.resources.list_stage.stage;
    	
    	if(typeof callback == "function"){
    		callback(this);
    	}

    });

  

    this.Replace = function(){

        let _fruit_obj = loader.resources.fruit_anims.objects;
        Object.assign(_fruit_obj, loader.resources.title_anim.objects);
        let _lastTween;

        let flagsCount = 0;
        for(let j = this.stage.children.length - 1; j >= 0; j--){

            let _rep_child = this.stage.children[j];

            if(_rep_child.types && _rep_child.types.indexOf("replacer") > -1){

                let _name = _rep_child.name.replace("_anim","");
                let _constructor = _fruit_obj[_name];
                if(_constructor){

                    let _f = _constructor.create();
                    
                    animations.push(_f);

                    let _offset = {
                        x: _rep_child.hitArea.width / 2,
                        y:-_rep_child.hitArea.height
                    };

                    _f.position.x = _rep_child.position.x + _offset.x;
                    _f.position.y = _rep_child.position.y + _offset.y;
                    _f.name = _name;
                    _f.parentGroup = _rep_child.parentGroup;

                    _f.self_start = function() {
                        _f.animation.gotoAndPlayByProgress("idle", Math.random(), 0);
                    };

                    _f.self_start();

                    _f.interactive = true;
                    _f.showing = false;
                    _f.pointerOut = true;
                    
                    _f.on("complete", x => {
                        if(_f.pointerOut && _f.showing){

                            _f.animation.timeScale = 1;
                            _f.animation.fadeIn("idle", 0.2);
                        }
                        _f.showing = false;
                    });

                    _f.self_show = function() {
                        _f.animation.timeScale = 2.5;
                        _f.animation.fadeIn("show", 0.2, 1);
                        _f.showing = true;
                        PIXI.sound.play("blink");
                    };

                    _f.self_hide = function() {
                        _f.pointerOut = true;
                        _f.lastOutTime = PIXI.ticker.shared.lastTime;

                        if (!_f.showing) {

                            _f.animation.timeScale = 1;
                            _f.animation.fadeIn("idle", 0.2);   
                        }
                    };

                    if(!PIXI.utils.isMobile.any){
                        
                        _f.on("pointerout", () => {
                            _f.self_hide();
                        });

                        _f.on("pointerover", ()=> {
                            if(_lastTween)
                                _lastTween.kill();

                            _lastTween = TweenLite.delayedCall(
                             0.2, () => {
                                if(!_f.pointerOut){
                                    _f.self_show();
                                }
                            });
                            _f.pointerOut = false; 
                        });

                    }else{
                        _f.on("pointerdown", () => {
                            _f.self_show();
                            _f.pointerOut = false; 
                        });

                        _f.on("pointerupoutside", ()=>{
                            _f.self_hide();
                            _f.pointerOut = true;
                        });

                        _f.on("pointerup", ()=>{
                            _f.self_hide();
                            _f.pointerOut = true;
                        });
                    }
                    

                    _f.armature.cacheFrameRate = 24;
                    _rep_child.parent.addChild(_f);
                    

                    if(_name !="title"){
                        
                        let c_flag = _fruit_obj.Flag.create();
                        c_flag.name = c_flag.name + "_"+ _name;
                        animations.push(c_flag);

                        c_flag.self_start = function(){
                            if(name !== "marakuja" && _name !== "pumpkin")
                            {
                                c_flag.animation.gotoAndPlayByProgress("idle", Math.random(), 0);
                            }
                            else {
                                c_flag.animation.gotoAndPlayByProgress("idle_50", Math.random(), 0);   
                            }
                        }
                        
                        c_flag.position.copy(_f.position);
                        c_flag.parentGroup = this.stage.Flags.group;
                        
                        c_flag.self_start();

                        c_flag.armature.cacheFrameRate = 24;

                        _rep_child.parent.addChild(c_flag);
                    }
                    
                    _rep_child.destroy();

                }
            }

        }
    };

    let startAllAnims = function(){
        for (var i = animations.length - 1; i >= 0; i--) {
            animations[i].self_start();
        }
    }

    let stopAllAnims = function(){
        for (var i = animations.length - 1; i >= 0; i--) {
            animations[i].animation.reset();
        }
    }
    
    this.OnDestroy = function(){
        this.OnRemove();
        this.stage.destroy({children:true});
    }

    this.OnRemove = function() {
        StopAll();
    }

    this.OnAdd = function(){
        if(!this.isInit){
            this.Init();
        }

        _rules_dsk.position.y = _rendr.height + _rules_dsk.width;
        _rules_dsk.visible = false;
        StartAll();
    }

    this.Init = function(){
        this.isInit = true;

        let _s = this.stage;
        window.StartAll = startAllAnims;
        window.StopAll = stopAllAnims;
        
        _s.reParentAll();
        this.Replace();


        let _rules_btn = _s.getChildByName("rules_button");
        _rules_dsk = _s.getChildByName("rules_desk");
        let _rules_close_btn = _rules_dsk.getChildByName("close_rules");

        let _rulesStartY = _rules_dsk.position.y;
        
        _rules_close_btn.on("pointertap", () =>{
            
            PIXI.sound.play("click");

            TweenLite.to(_rules_dsk, 0.25, {
                pixi:{
                    positionY:_rendr.height + _rules_dsk.width
                },
                onComplete: function() {
                    _rules_dsk.visible = false;
                }
            });

        });

        _rules_btn.on("pointertap", () =>{
            PIXI.sound.play("click");
            
            _rules_dsk.visible = true;
            TweenLite.to(_rules_dsk, 0.25, {
                pixi:{
                    positionY:_rulesStartY
                    }
                }
            );
            //console.warn("TODO:ANIMATION fadeIn");
        });

        let _startButton = this.stage.getChildByName("start_button");
        let _startButton_rules = _rules_dsk.getChildByName("start_button");

        let _run_game_f = function() {
            
            PIXI.sound.play("click");
            base.SetStage("Game");
        };
        _startButton.on("pointertap", _run_game_f);
        _startButton_rules.on("pointertap", _run_game_f)


    }

}