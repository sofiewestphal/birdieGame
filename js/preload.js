/**
 * Created by Sofie on 08-12-2016.
 */

"use strict";

/******** VARIABLES ********/

var stage, queue, preloadText, islandTree, islandMushroom, mutebutton, map;
var currentLevel = 0, levelData, backgrounds = [], islands=[], forhindringer =[], vand = [], farligtVand =[], countryElements = [],
    islandFeet=[], islandTreeFeet, islandMushroomFeet, goalPosition, forhindringsfart;
var islandWidth = 270, islandHeight = 345, birdie, remainingTime, countDownTimerStartet = false, gameSatUp = false;


/******** ONLY RUN WHEN YOU INITIALLY LOAD THE GAME *********/

window.addEventListener("load", preload);

function preload(){
    stage = new createjs.Stage("myCanvas");

    preloadText = new createjs.Text("Loading", "30px Montserrat", "#FFF");
    preloadText.textBaseline="middle";
    preloadText.textAlign="center";
    preloadText.x=stage.canvas.width/2;
    preloadText.y=stage.canvas.height/2;
    stage.addChild(preloadText);

    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", progress);
    queue.on("complete", startGame);

    queue.loadManifest(
        [
            "js/script.js",
            "js/intro.js",
            {"id": "birdsheet", "src": "spritesheet/animation.json"},
            {"id": "levelData", "src": "spritesheet/levels.json"},
            {"id": "islandsheet", "src": "spritesheet/islands.json"},
            {"id": "islandFeetsheet", "src": "spritesheet/islandFeet.json"},
            {"id": "countryElementSheet", "src": "spritesheet/country_elements.json"},
            {"id": "audioGO1", "src": "audio/gameover1.wav"},
            {"id": "audioGO2", "src": "audio/gameover2.wav"},
            {"id": "audioHome", "src": "audio/home.ogg"},
            {"id": "muteIcon", "src": "img/muteIcon.png"},
            {"id": "speakerIcon", "src": "img/speakerIcon.png"},
            {"id": "map", "src": "img/worldLow.svg"},
            {"id": "keyControls", "src": "img/keys.png"}
        ]
    );
}

function progress(e){
    var percent = Math.round(e.progress*100);
    preloadText.text = "Loading: " + percent + "%";
    stage.update(e);
}

function startGame(e) {
    stage.removeChild(preloadText);
    //loadMap();
    introText();
    stage.update(e);
}


/********** NAVIGATE FROM LEVEL TO LEVEL **********/

function loadMap(e){
    stage.removeChild(keyControls, controlText);
    
    for(var i = 0; i < currentLevel+1 ; i++){
        roadThroughEurope[i].style.fill = "#5bbd8f";
        roadThroughEurope[i].style.cursor = "pointer";

        roadThroughEurope[i].addEventListener("click", function(){
            currentLevel = roadThroughEurope.indexOf(this);
            canvas.style.display = "block";
            if(!gameSatUp){
                setupLevel();
            }
        });
    }

    setTimeout(scalemap, 500);
}

function scalemap(){
    mapSvg.style.transition = "transform 1.5s";
    mapSvg.style.transform = "scale(2)";
}

function setupLevel() {
    youAreGameover = false;
    birdieIsHome = false;
    key.space = false;
    gameSatUp = true;

    levelData = queue.getResult('levelData');

    var timer = levelData.levels[currentLevel].time;
    remainingTime = timer.time;

    if(!countDownTimerStartet){
        countDownTimer();
        countDownTimerStartet = true;
    }

    addMutebutton();

    getWater();
    getPlatforms();
    getplatformFeet();
    getObstacles();
    getCountryElement();
    getBirdie();
    getDeadlyWater();

    init();
}

function clearLevel(){
    stage.removeAllChildren();
    backgrounds.splice(0,backgrounds.length);
    islands.splice(0,islands.length);
    islandFeet.splice(0, islandFeet.length);
    vand.splice(0, vand.length);
    forhindringer.splice(0, forhindringer.length);
    farligtVand.splice(0, farligtVand.length);
    
    canvas.style.display = "none";
    gameSatUp = false;
    
    loadMap();
}


/********* CREATE THE ELEMENTS OF THE GAME **********/

function addMutebutton () {
    mutebutton = new createjs.Bitmap(queue.getResult("speakerIcon"));
    mutebutton.x = stage.canvas.width - 32;
    mutebutton.class = "mutebutton";
    mutebutton.style.cursor = "pointer";
    stage.addChild(mutebutton);

    mutebutton.addEventListener("click", function(){
        if(createjs.Sound.muted){
            createjs.Sound.muted = false;
        }else{
            createjs.Sound.muted = true;
        }
    });
}

function getWater() {
    var water = levelData.levels[currentLevel].water;

    for (var k=0; k < water.length; k++){
        var wat = water[k];
        var w = new createjs.Bitmap(wat.image);
        var ratioWater = wat.scaleX;

        w.x = wat.x;
        w.y = 376;
        w.scaleX = ratioWater;
        w.scaleY = ratioWater;

        vand.push(w);
        stage.addChild(w);
    }
}

function getPlatforms() {
    var platforms = levelData.levels[currentLevel].platforms;

    var islandresult = queue.getResult('islandsheet');
    var islandsheet = new createjs.SpriteSheet(islandresult);

    for (var i = 0; i < platforms.length; i++){
        var plat = platforms[i];
        //var ratio = plat.scaleX;
        //var islandDiff = stage.canvas.height - islandHeight;

        for (var z = 0; z < plat.repeat; z++){
            var p = new createjs.Sprite(islandsheet, plat.sprite);

            //IF THE PLATFORM SHOULD BE REPEATET right after each other p.x SHOULD = plat.x + width of the platform *z
            p.x = plat.x;
            p.y = stage.canvas.height- islandHeight/2;
            p.regX = 0;
            p.regY = islandHeight/2;
            p.width = islandWidth;
            p.height = islandHeight/2;
            p.id = plat.id;

            islands.push(p);
            backgrounds.push(p);

            stage.addChild(p);

            goalPosition = plat.x;
        }
    }

    islandTree = islands[0];
    islandMushroom = islands[1];
}

function getplatformFeet() {
    var platformfeet = levelData.levels[currentLevel].platformfeet;

    var islandFeetresult = queue.getResult('islandFeetsheet');
    var islandFeetsheet = new createjs.SpriteSheet(islandFeetresult);

    for (var i=0; i < platformfeet.length; i++){
        var feet = platformfeet[i];

        for (var z=0; z < feet.repeat; z++){
            var f = new createjs.Sprite(islandFeetsheet, feet.sprite);

            //IF THE PLATFORM SHOULD BE REPEATET right after each other p.x SHOULD = plat.x + width of the platform *z
            f.x = feet.x;
            f.y = stage.canvas.height-60;
            f.regX = 0;
            f.regY = 0;
            f.width = islandWidth;
            f.height = islandHeight/2;
            f.id = feet.id;

            islandFeet.push(f);
            backgrounds.push(f);

            stage.addChild(f);
        }
    }
    islandTreeFeet = islandFeet[0];
    islandMushroomFeet = islandFeet[1];
}

function getCountryElement() {
    var countryelement = levelData.levels[currentLevel].countryelement;
    
    var countryElementSheetresult = queue.getResult('countryElementSheet');
    var countryElementSheet = new createjs.SpriteSheet(countryElementSheetresult);
    
    for (var i=0; i < countryelement.length; i++){
        var countrye = countryelement[i];

        var ce = new createjs.Sprite(countryElementSheet, countrye.sprite);
        var ratioce = countrye.scaleX;

        ce.x = countrye.x;
        ce.y = countrye.y;
        ce.scaleX = ratioce;
        ce.scaleY = ratioce;
        ce.width = 300;
        ce.height = 332;
        ce.opacity = 0.5;

        countryElements.push(ce);
        backgrounds.push(ce);    
        stage.addChild(ce);
    }
}

function getObstacles() {
    var obstacles = levelData.levels[currentLevel].obstacles;

    for (var j=0; j < obstacles.length; j++){
        var obst = obstacles[j];
        var o = new createjs.Bitmap(obst.image);
        var ratioObst = obst.scaleX;
        forhindringsfart = obst.speed;

        o.x = obst.x;
        o.y = obst.y - 345*ratioObst;
        o.scaleX = ratioObst;
        o.scaleY = ratioObst;
        o.rotation = obst.rotation;

        if(o.rotation == 0){
            o.width = 291*ratioObst;
            o.height =345*ratioObst;
        }else if (o.rotation == -90){
            o.width = 345*ratioObst;
            o.height =100*ratioObst;
        }

        forhindringer.push(o);
        backgrounds.push(o);
        stage.addChild(o);
    }
}

function getBirdie() {
    var birdieInfo = levelData.levels[currentLevel].birdie;

    var birdiesheet = new createjs.SpriteSheet(queue.getResult('birdsheet'));
    birdie = new createjs.Sprite(birdiesheet, birdieInfo.sprite);
    Object.assign(birdie, birdieSkills);

    birdie.direction = birdieInfo.sprite;
    birdie.gotoAndPlay('downRight');
    birdie.width = GRIDSIZE;
    birdie.height = GRIDSIZE;
    birdie.x = birdieInfo.x;
    birdie.y = birdieInfo.y-GRIDSIZE;

    stage.addChild(birdie);
}

function getDeadlyWater() {
    var dWater = levelData.levels[currentLevel].deadlyWater;

    for (var i=0; i < dWater.length; i++){
        var dWat =dWater[i];
        var dw = new createjs.Bitmap(dWat.image);
        var ratiodw = dWat.scaleX;

        dw.x = dWat.x;
        dw.y = 457;
        dw.scaleX = ratiodw;
        dw.scaleY = ratiodw;
        dw.width = 800;
        dw.height = 43;

        farligtVand.push(dw);
        stage.addChild(dw);
    }
}

 
