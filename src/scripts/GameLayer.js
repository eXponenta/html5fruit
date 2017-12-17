import {TimelineLite, TweenLite} from "gsap"
import PixiPlugin from "gsap/PixiPlugin"
import "gsap/EasePack"
import CircleArc from "./CircleArc";

export default function GameLayer(base, loader, callback) {
	this.stage = null;
	this.isInit = false;
	
	let _base = base;

    const UPDATE_PERIOD = 10;//sec
    const TOTAL_TIME = 60;//sec
    const SCORE_MASK_STEP = 50;
    const SCORE_MAX = 350;
    
    let GAME_RESULT = "none";

    let _timerProgressRing;
    let _timerProgressText;
    let _timeOverDesk;
    let _pauseButton;
    let _scoreStar;
    let _scoreText;
    let _scoreBGMask;

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

	//var loader = new PIXI.loaders.Loader();

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
        for(var f in TOTAL_SLISES){
            TOTAL_SLISES[f] = Math.round( Math.random() * 20 );
        }

        _timerStoped = false;
        if(!_timerIsPaused || restart){
            _timerTime = TOTAL_TIME;

            this.AddScore(-_totalScore); // update score
        }

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
        _timerIsPaused = true;
        _lastTweenTimer.kill();
        _pauseButton.texture = _pauseButton.normal;
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

        if(!win){
        
            _timerStoped = true;
            _timeOverDesk.visible = true;
            TweenLite.to(_timeOverDesk, 0.25,{
                pixi: {
                    positionY: _timeOverDesk.startPos
                }
            });
        
        } else {
            base.SetStage("Result",TOTAL_SLISES);
            //PIXI.sound.stop("base");
            PIXI.sound.play("win");

        }
    }

    //stage callbacks
    this.OnAdd = function() {
    	if(!this.isInit)
    		this.Init();


        this.StartTimer(true);
    }

    this.OnRemove = function() {

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

                if(_timerIsPaused)
                    this.StartTimer();
                else
                    this.PausingTimer();
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


        this.stage.interactive = true;
        this.stage.on("pointertap", () => {
            this.AddScore(10);
        });

    	this.isInit = true;
    }

    this.Update = function(ticker)
    {

    }

}