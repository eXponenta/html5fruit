import {TimelineLite, TweenLite} from "gsap"
import PixiPlugin from "gsap/PixiPlugin"
import "gsap/EasePack"
import CircleArc from "./CircleArc";
import Preparer from "./SliceDataPreparer"
import {DropShadowFilter} from '@pixi/filter-drop-shadow'
import _SliceStageCreater from "./SliceLayer"
import MiniPool from "./MiniPool";
import SimpleTint from "./filters/TintFilter"

export default function GameLayer(base, loader, callback) {

	this.stage = null;
	this.isInit = false;
	this.base = base;
    
    this.objectsPreparedData;
    this.sliceManager;
    this.currentPeriod = 0;

	let _base = base;

    const SPLASH_LIVE_TIME = 5;
    let BOOM_FREEZ_TIME = base.buildConfig.boomFreezTime ? base.buildConfig.boomFreezTime : 0.5;
    let ELEMENTS_LIVE_TIME = base.buildConfig.elementsLiveDuration || 1;
    let ELEMENTS_DISTANCE = 300;

    const UPDATE_PERIOD = 10;//sec
    const TOTAL_TIME = 60;//sec
    const SCORE_MASK_STEP = 50;
    const SCORE_MAX = 350;
    const POOL_SIZE = 4;
    
    let _timerProgressRing;
    let _timerProgressText;
    let _timeOverDesk;
    let _pauseButton;
    let _scoreStar;
    let _scoreText;
    let _scoreBGMask;

    let SPLASH_BG_POOL = new MiniPool(true);
    let SPLASH_BOOM_POOL = new MiniPool(true);
    let SPLASH_ANIM_POOL = new MiniPool(true);
    let STARS_ANIM_POOL = new MiniPool(true);
    let ELEMENTS = {
        elmA:null,
        elmC:null,
        elmCa:null,
        elmMg:null,
        elmP:null,
        elmK:null,
        elmZn:null,
    };
    
    let _timerTime = 0;
    let _totalScore = 0;

    let TOTAL_SLISES = {
        orange:0,
        watermelon:0,
        mango:0,
        qiwi:0,
        strawberry:0,
        marakuja:0,
        banana:0,
        raspberry:0,
        lemon:0,
        pineapple:0,
        apple:0,
        pumpkin:0,
        pomade:0,
        burger:0,
        phone:0
    };

    let SUMMARY_SLICES = 0;

	//var loader = new PIXI.loaders.Loader();

    loader.add("object_config","./src/configs/object_config.json");
    loader.add("others", "./src/images/others.json");
    loader.add("fruits", "./src/images/fruits.json");

    loader.add("game_stage","./src/maps/game.json", () =>{
    	
    	this.stage = loader.resources.game_stage.stage;
    	
    	if(typeof callback == "function"){
    		callback(this);
    	}
    });

    let _lastTweenTimer;
    let _timerIsPaused = false;
    let _timerStoped = true;
    this.StartTimer = function(restart){
        
        // free
      

        this.StartPeriod(!_timerIsPaused || restart);
        

        if(!_timerIsPaused ||_timerStoped || restart){

            for(var f in TOTAL_SLISES){
                TOTAL_SLISES[f] = 0;//Math.round( Math.random() * 20 );
            }
            SUMMARY_SLICES = 0;

            _timerTime = TOTAL_TIME;
            this.AddScore(-_totalScore); // update score

        }


        _timerStoped = false;
        this.sliceManager.updateSlice = true;

        _timerIsPaused = false;

        _timerTime += UPDATE_PERIOD;

        let _updateTween = () => {

            _timerTime -= UPDATE_PERIOD;
            this.TimerUpdate(_timerTime);
           
            if(_timerTime > 0)
            {
                _lastTweenTimer = TweenLite.delayedCall(UPDATE_PERIOD, _updateTween);
            } else {
                this.TimerStoped();
            } 
        };

        _updateTween();

        TweenLite.to(_timeOverDesk, 0.25,{
            pixi: {
                positionY: _timeOverDesk.endPos
            },
            onComplete:function(){
                _timeOverDesk.visible = false;
            }
        });

        _pauseButton.texture = _pauseButton.pause; 
    }

    this.TimerUpdate = function(time) {
        TweenLite.to(_timerProgressRing.mask, UPDATE_PERIOD / 4, {progress: time / TOTAL_TIME});

        //_timerProgressRing.mask.progress = time / TOTAL_TIME;
        _timerProgressText.text = (Math.floor(time/ 60)).pad(1) + ":" + (time%60).pad(2);
    }

    this.PausingTimer = function() {
        this.sliceManager.updateSlice = false;
        _timerIsPaused = true;
        _lastTweenTimer.kill();
        _pauseButton.texture = _pauseButton.normal;
        _periodIsPaused = true;
    }

    this.TimerStoped = function() {
        this.GameOver(_totalScore >= SCORE_MAX);

    }

    let _lastStarTween;
    this.AddScore = function(val) {
    
        _totalScore += val;
        _totalScore = Math.max(0,_totalScore);
        
        if(_lastStarTween)
            _lastStarTween.kill();

        _lastStarTween = new TimelineLite();
        _lastStarTween.add(
            TweenLite.to(_scoreStar, 0.1,{
            pixi:{
                positionY: _scoreStar.startY - 30
            },
            ease: Elastic.easeIn.config(1, 0.5)
        }))
        .add(TweenLite.to(_scoreStar, 1.5,{
            pixi:{
                positionY: _scoreStar.startY
            },
            ease: Elastic.easeOut.config(1, 0.2)
        }));

        _scoreText.text = _totalScore.toString();

        if(_totalScore % SCORE_MASK_STEP == 0){
            
            let maskPos = _totalScore / SCORE_MAX;

            let _targetH = maskPos * _scoreBGMask.startHeight + ((maskPos > 0) ? _scoreBGMask.startOffset: 0);
            
            TweenLite.to(_scoreBGMask,1,{
                pixi:{
                    height:_targetH
                }
            });
        }

        if(_totalScore >= SCORE_MAX){

           this.GameOver(true);
           //pause timer, they cant call TimerStop
           this.PausingTimer(); 
        }
    }

    this.GameOver = function(win){

        _timerStoped = true;
        _periodIsPaused = true;
        _timeOverDesk.visible = true;
        
        if(!win){

            this.sliceManager.updateSlice = false;
            TweenLite.to(_timeOverDesk, 0.25,{
                pixi: {
                    positionY: _timeOverDesk.startPos
                }
            });
        
        } else {

            TweenLite.delayedCall(3, () => {
                base.SetStage("Result",TOTAL_SLISES);
                //PIXI.sound.stop("base");
                PIXI.sound.play("win");
            });

        }
    }

    //stage callbacks
    this.OnAdd = function() {
    	if(!this.isInit)
    		this.Init();

        base.RulesButtonSetShowable(true);
        
        let resume = () => {
            if(this.active) {
                this.StartTimer();
            }
        };

        let show = () => {
            if(this.active){
                this.PausingTimer();
            }
        };
        base.RegisterRules( resume, resume, show, "resume");

        this.StartTimer(true);
    }

    this.OnRemove = function() {
        this.sliceManager.RemoveAllObjects();

        base.RulesButtonSetShowable(false);
    }

    this.OnDestroy = function() {

    	this.stage.destroy({children:true});
    }

    this.Init = function(){
        this.stage.reParentAll();

        let _progressBg = this.stage.getChildByName("timer_bg");
        _timerProgressRing = _progressBg.getChildByName("timer_ring");

        _timerProgressRing.mask = new CircleArc(false, _timerProgressRing.width/2 + 20, - Math.PI/2);
        _progressBg.addChild(_timerProgressRing.mask);
        _timerProgressRing.mask.pivot.set(0.5,0.5);
        _timerProgressRing.mask.position.set(_timerProgressRing.width/2,-_timerProgressRing.height/2);

        //exporter add Tiled text to container;
        _timerProgressText = this.stage.getChildByName("timer_text").text;
        _timerProgressText.text = "-";

        _timeOverDesk = this.stage.getChildByName("time_over_desk");
        _timeOverDesk.startPos = _timeOverDesk.position.y;
        _timeOverDesk.endPos = _base.app.renderer.height + _timeOverDesk.height;
        

        _timeOverDesk.children[0].on("pointertap", () => {    
                this.StartTimer(true);
                PIXI.sound.play("click");
        });
        _timeOverDesk.children[1].on("pointertap", () => {    
                this.StartTimer(true);
                PIXI.sound.play("click");
        });
        
        
        _pauseButton = this.stage.getChildByName("button_play");
        _pauseButton.normal = _pauseButton.texture;
        _pauseButton.pause = this.stage.getChildByName("button_pause").texture;
        
        _pauseButton.on("pointertap", () => {
            if(!_timerStoped){

                if(_timerIsPaused){
                    this.StartTimer();
                }
                else{
                    this.PausingTimer();
                }
            }
            PIXI.sound.play("click");
 
        });

        _scoreStar = this.stage.getChildByName("score_star");
        _scoreStar.startY = _scoreStar.position.y;

        _scoreText = this.stage.getChildByName("score_text").text;
        _scoreBGMask = this.stage.getChildByName("masked_glass_mask");
        _scoreBGMask.anchor.y = 1;
        _scoreBGMask.position.y += _scoreBGMask.height;

        _scoreBGMask.startOffset = 10;
        _scoreBGMask.startHeight = _scoreBGMask.height - _scoreBGMask.startOffset;

        this.sliceManager = new _SliceStageCreater(this);
        

        let groups = {
            up: this.stage.UP.group,
            middle: this.stage.MIDDLE.group,
            down: this.stage.MIDDLE.group,
        }

        this.objectsPreparedData = Preparer(
            loader.resources.object_config.data,
            loader.resources.fruits, groups);
        //console.log("prepared data:",this.objectsPreparedData);

        this.sliceManager.RegisterSliceCallback( arr => this.SliceCallback(arr));


        let res = loader.resources;
        
        var _s_boom_bg = res.others.textures["boom"];
            
        var _s_boom_bg = new PIXI.Sprite(_s_boom_bg);
        _s_boom_bg.anchor.set(0.3,0.5);
        _s_boom_bg.parentGroup = this.stage.UP_SPLASH.group;
        SPLASH_BOOM_POOL.add(_s_boom_bg);

        for(let i = 0; i < POOL_SIZE; i++){
            var _s_bg = res.others.textures["splash"];
            
            var _s_bg_sp = new PIXI.Sprite(_s_bg);
            _s_bg_sp.anchor.set(0.5,0.5);
            _s_bg_sp.parentGroup = this.stage.SPLASH.group;

            SPLASH_BG_POOL.add(_s_bg_sp);

            var _s_anim_sp = res.sands.objects.splash.create();
            _s_anim_sp.parentGroup = this.stage.UP_SPLASH.group;
            _s_anim_sp.filter = new SimpleTint();
            _s_anim_sp.filters = [_s_anim_sp.filter];
            
            _s_anim_sp.name = "splash_" + i;

            
            _s_anim_sp.on("complete", function(){
                this.Return();
                this.parent.removeChild(this);
            });

            _s_anim_sp.animation.timeScale = 0.8;
            _s_anim_sp.scale.set(1.5,1.5);
            SPLASH_ANIM_POOL.add(_s_anim_sp);

            var _s_anim_stars = res.sands.objects.stars.create();
            _s_anim_stars.name = "stars_" + i;
            _s_anim_stars.parentGroup = this.stage.UP_SPLASH.group;

            _s_anim_stars.on("complete", function(){
                this.Return();
                this.parent.removeChild(this);
            });

            _s_anim_stars.scale.set(1.5,1.5);
            _s_anim_stars.animation.timeScale = 3;
            //_s_anim_sp.scale.set(1.5,1.5);
            STARS_ANIM_POOL.add(_s_anim_stars);

        }

        for(let elname in ELEMENTS){
            let _e = new PIXI.Sprite(res.others.textures[elname]);
            _e.name = elname;
            _e.anchor.set(0.5, 0.7);
            _e.parentGroup = this.stage.UP_SPLASH.group;
            ELEMENTS[elname] = _e;
        }


        //this.StartPeriod();
    	this.isInit = true;
    }

    this.ThrowElements = function(obj, names) {

        let _start = obj.position;

        let s_angle = -Math.PI;
        let e_angle = 0;

        for(let j = 0; j < names.length; j++){
            
            let _en = names[j];

            let angle = s_angle + j * (e_angle - s_angle) / names.length;

            let target = {
                x: Math.cos(angle) * ELEMENTS_DISTANCE + _start.x,
                y: Math.sin(angle) * ELEMENTS_DISTANCE + _start.y,  
            }

            let t_angle = (angle + Math.PI/2) * 0.25;

            let e = ELEMENTS[_en];
            
            if(e) {
                e.target = target;
                e.target_angle = t_angle;
                //e.visible = true;
                e.alpha = 1;
                e.position.copy(_start);
                
                this.stage.addChild(e);
                let _this = this;
                
                if(e.tween){
                    e.tween.kill();
                }

                e.tween = TweenLite.to(e, ELEMENTS_LIVE_TIME, {
                    pixi:{
                        positionX:e.target.x,
                        positionY:e.target.y,
                        rotation: e.target_angle,
                        alpha:0
                    },
                    onComplete: function() {
                        //e.visible = false;
                        _this.stage.removeChild(e);
                    }
                })
            } 
        }
    }

    this.AddSplash = function(obj) {

        let splash;
        let mode = obj.spriteData.splash;
        let _this = this;
        if(mode == "normal"){
           
            splash = SPLASH_BG_POOL.last;
            splash.alpha = 1;
            if(splash){
                TweenLite.to(splash, SPLASH_LIVE_TIME, {
                    pixi:{
                        alpha:0,
                    },
                    onComplete: function(){
                        _this.stage.removeChild(splash);
                        splash.Return();
                    }
                });
            }

        }
        if(mode == "normal" || mode == "top"){

            let _animSplash = SPLASH_ANIM_POOL.last;
            _animSplash.position.copy(obj.position);
            _animSplash.animation.play("show", 1);
            _animSplash.filter.color = obj.spriteData.color;
            _animSplash.rotation = obj.phBody.sliceAngle;
            //_animSplash.visible = true;
            this.stage.addChild(_animSplash);
        }

       // if()/!obj.spriteData.isBad){

            let _stars = STARS_ANIM_POOL.last;
            _stars.position.copy(obj.position);

            if(obj.spriteData.score == 10){
                _stars.animation.play("show_10",1);
            }

            if(obj.spriteData.score == 50){
                _stars.animation.play("show_50",1);
            }

            if(obj.spriteData.score == -10){
                _stars.animation.play("show_m50",1);
            }
            
            
            //_stars.visible = true;
            this.stage.addChild(_stars);
        //}

        if(mode == "boom"){
            
            splash = SPLASH_BOOM_POOL.last;

            if(BOOM_FREEZ_TIME > 0){
                this.sliceManager.updatePhysics = false;
                TweenLite.delayedCall(BOOM_FREEZ_TIME, 
                    () => { 
                        this.sliceManager.updatePhysics = true;
                        if(splash){

                            _this.stage.removeChild(splash);
                            splash.Return();
                        }
                    }
                );
            }
        }

        if(splash){

            splash.name = "SPLASH:" + obj.spriteData.name; 
            splash.tint = obj.spriteData.color;
            splash.position.copy(obj.position);
           
            this.stage.addChild(splash);
        }
    }

    this.SliceCallback = function(arr){
        
        let totalAddScore = 0;
        let collectElements = [];
        let isBoomFired = false, isNormalFired = false;

        for(let i = 0; i < arr.length; i++) {
            
            let data = arr[i].spriteData;
            collectElements = collectElements.concat(arr[i].spriteData.elements);

            if(data.isBad && !isBoomFired){
            
                this.AddSplash(arr[i]);
                isBoomFired = true;
            
            } else if(!isNormalFired) {
            
                this.AddSplash(arr[i]);
                isNormalFired = true;
            
            }

            totalAddScore += data.score;
            TOTAL_SLISES[data.name] ++;
            SUMMARY_SLICES ++;
        }

        collectElements = unique(collectElements);
        this.ThrowElements(arr[arr.length - 1], collectElements);
        //console.log(collectElements);

        this.UpdatePeriod(this.base.app.ticker);
        this.AddScore(totalAddScore);
        
        PIXI.sound.play("slice");
    }

    let keyNames;
    let lastFiredObj;

    this.FireNext = function(skip){
        if(!keyNames){
            keyNames = Object.keys(this.objectsPreparedData);
        }
        let  relNames = [];

        if(skip){
            for(let j = 0; j < keyNames.length; j++){
                let obj = this.objectsPreparedData[keyNames[j]];
                
                if(skip === "bad" && obj.isBad){
                    continue;
                }else if(!obj.isBad && skip !== "bad") {
                    continue;
                }

                relNames.push(keyNames[j]);
            }
        } else {
            relNames = keyNames;
        }

        if(relNames.length == 0){
            console.warn("Fire quiue empty!");
            return;
        }

        let index = relNames.length * Math.random() << 0;
        let next_name = relNames[index];
        let next_obj = this.objectsPreparedData[next_name];

        while (lastFiredObj && !skip) {
            if((lastFiredObj.isBad && next_obj.isBad) || (!next_obj.isBad && lastFiredObj.name === next_obj.name)){
                next_name = relNames[(relNames.length * Math.random() << 0)];
                next_obj = this.objectsPreparedData[next_name];
            } else {
                break;
            }
        }

        lastFiredObj = next_obj;
        
        this.sliceManager.FireObject(next_obj);
    }

    let _periodIsPaused = false;

    let lastFireTime;

    this.StartPeriod = function(restart){
        
        if(restart){
            this.currentPeriod = null;
            lastFireTime = undefined;
            periodIndex = 0;
        }

        _periodIsPaused = false;
    }

    this.UpdatePeriod = function(ticker){
        if(_periodIsPaused)
            return;

        if(!this.currentPeriod){
            this.currentPeriod = this.NextPeriod(ticker);
        }

        let p = this.currentPeriod;
        
        if(p.duration){
        
            if(!(p.duration <= 0 || p.startSliceCount + p.duration >= SUMMARY_SLICES)){
                this.currentPeriod = this.NextPeriod(ticker);
                return;
            }
        
        } else {

            if(!(p.timeDuration && ((p.timeDuration * 1000 + p.startTime) > ticker.lastTime))){

                this.currentPeriod = this.NextPeriod(ticker);
                return;   
            }
        }

        let skip = (p.fruits == false) ? "fruits" : null;
            skip = (p.badThings == false) ? "bad" : skip;

        let actobj = this.sliceManager.GetActiveObjectsCount();
        if(actobj < p.maxObjects) {
            
            if(!lastFireTime ||  ticker.lastTime > (lastFireTime + p.maxPeriod * 1000)){
                this.FireNext(skip);
                lastFireTime = ticker.lastTime;
            }
        }

        //this.currentPeriod = p;

    }

    let periodIndex = 0;
    this.NextPeriod = function(ticker){

        periodIndex = Math.min(periodIndex, this.base.buildConfig.periods.length-1);

        let p = this.base.buildConfig.periods[periodIndex];

        p.maxPeriod = p.maxPeriod || 0.1;
        p.maxObjects = p.maxObjects == undefined ? 5: p.maxObjects;
        p.startTime = ticker.lastTime;
        
        if(typeof p.duration === "string"){
            p.timeDuration = parseFloat(p.duration.replace("sec",""));
            p.duration = undefined;
        }
        p.startSliceCount = SUMMARY_SLICES;
        periodIndex ++;
        return p;
    }

    let GetRandomProperty = function(obj){
        let keys = Object.keys(obj);
        return keys[keys.length * Math.random() << 0];
    }

    this.Update = function(ticker)
    {
        this.UpdatePeriod(ticker);
        if(this.sliceManager.Update) {
            this.sliceManager.Update(ticker);
        }
    }

    let unique = function unique(arr) {
        var obj = {};

          for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            obj[str] = true; // запомнить строку в виде свойства объекта
          }

          return Object.keys(obj); // или собрать ключи перебором для IE8-
   }

}