/**
 * Created by Sofie on 08-12-2016.
 */

"use strict";

var youAreGameover = false, speed = 4, birdieAltitude, birdieIsHome = false, birdieStille = false, birdieSkills, birdieFriends =[], birdieFriend;
var pointText, pointScore = 0, countDown, pointsGainedText, currentlyInGame = false;
var denmark = document.getElementById("DK"), germany = document.getElementById("DE"), france = document.getElementById("FR"),
    spain = document.getElementById("ES"), morocco = document.getElementById("MA");
var roadThroughEurope = [denmark, germany, france, spain, morocco]
var canvas = document.getElementById("myCanvas"), mapSvg = document.getElementById("Layer_1");
var GRIDSIZE = 64;
var key = {
    right:false,
    left:false,
    up:false,
    down:false,
    space:false
};

function init() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tock);

    pointText = new createjs.Text(
        "Points: " + pointScore,
        "18px Montserrat",
        "#FFF");
    pointText.textAlign = "center";
    pointText.x = 400;

    countDown = new createjs.Text(
        "Time: " + remainingTime,
        "18px Montserrat",
        "#FFF");
    countDown.x = 0;

    stage.addChild(pointText, countDown);
    
    console.log(currentlyInGame);
    
}

function tock (e) {
    stage.update(e);

    if (!youAreGameover) {
        checkForGameover();
    }
    
    isBirdiecurrentlyInGame();

    if(!youAreGameover && !birdieIsHome){
        birdie.move();
        birdie.updateDirection();
    }

    if(!birdieIsHome){
    checkIfBirdiereachGoal();
    }

    moveWater();
    moveBackgrounds();
    moveObstacles();
}

birdieSkills = {
    move: function() {
        birdieAltitude = this.y;

        if(key.space && (this.y - speed) >= 0){
            this.y -= speed;
        }

        if(this.direction === "right" && (this.x + speed) < (stage.canvas.width - GRIDSIZE) && !birdieStille){
            this.x += speed;
            if(birdieAltitude <= (stage.canvas.height - GRIDSIZE)){
                this.y += (birdieAltitude/100);
            }
            if(this.currentAnimation !== "right"){
                this.gotoAndPlay('right');
            }
        }else if (this.direction === "left" && (this.x - speed) >= 0 && !birdieStille){
            this.x -= speed;
            if(birdieAltitude <= (stage.canvas.height - GRIDSIZE)){
                this.y += (birdieAltitude/100);
            }
            if(this.currentAnimation !== "left"){
                this.gotoAndPlay('left');
            }
        }else if(this.direction === "up" && (this.y - speed) >= 0){
            this.y -= speed;
            if(this.currentAnimation !== "up"){
                this.gotoAndPlay('up');
            }
        }else if(this.direction === "down" && (this.y + speed) < stage.canvas.height - GRIDSIZE){
            this.y += speed;
            if(this.currentAnimation !== "up"){
                this.gotoAndPlay('up');
            }
        }
    },

    updateDirection: function(){

        if (key.right && (this.x + speed) < stage.canvas.width - GRIDSIZE) {
            this.direction = "right";
        }
        if (key.left && (this.x - speed) >= 0) {
            this.direction = "left";
        }
        if (key.up && (this.y - speed) >= 0) {
            this.direction = "up";
        }
        if (key.down && (this.y + speed) < stage.canvas.height - GRIDSIZE) {
            this.direction = "down";
        }
    },

    scared: function(){
        this.direction = "left";
        this.gotoAndPlay('scared');

        createjs.Tween.get(this).to(
            {
                x:-150, y:-129
            },
            2000,
            createjs.Ease.easeInQuart
        )
            .call(
                function (e){
                    stage.removeChild(this);
                }
            );
        showPointsGained(-10);
    },

    drowning: function() {
        this.gotoAndPlay('drowning');

        createjs.Tween.get(this).to(
            {
                y:600
            },
            2000,
            createjs.Ease.easeInElastic
        )
            .call(
                function (e){
                    stage.removeChild(this);
                }
            );
        showPointsGained(-10);
    }
}

function hitTest(rect1,rect2) {
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y )
    {
        return false;
    }
    return true;
}

function isBirdiecurrentlyInGame(){
    if (canvas.style.display == "block"){
        currentlyInGame=true;
    }else{
        currentlyInGame=true; //SKAL BEGGE VÆRE TRUE?
    }
}

/*********** HITTESTS ***********/

function checkIfBirdiereachGoal() {
    if(hitTest(birdie, islandMushroomFeet) && !youAreGameover){
        createjs.Sound.play("audioHome");
        birdie.direction = "sitting";
        birdie.gotoAndStop('sitting');
        birdieIsHome = true;
        console.log("Birdie is home");
        showPointsGained(remainingTime);

        if (currentLevel !== levelData.levels.length-1){
            currentLevel++;
            setTimeout(clearLevel, 2000);
        }else{
            var youMadeItText = new createjs.Text(
                "You reached Morroc",
                "20px Montserrat",
                "#bd5b5b");
            youMadeItText.lineWidth = 300;
            youMadeItText.textAlign = "center";
            youMadeItText.textBaseline = "middle";
            youMadeItText.x = 400;
            youMadeItText.y = 250;

            stage.addChild(youMadeItText);

            var birdiesheet = new createjs.SpriteSheet(queue.getResult('birdsheet'));

                birdieFriend = new createjs.Sprite(birdiesheet, "left");

                birdieFriend.direction = "left";
                birdieFriend.gotoAndPlay('left');

                birdieFriend.x = 1000 + ( 30);
                birdieFriend.y = 300 - (30);

                birdieFriends.push(birdieFriend);
                stage.addChild(birdieFriend);

                createjs.Tween.get(birdieFriend).to(
                    {
                        x:600, y:366
                    },
                    2000,
                    createjs.Ease.easeInQuart
                )
                    .call(
                        function (e){
                            birdieFriend.gotoAndPlay("downLeft");
                        }
                    );
        }
    }
}

function checkForGameover() {
    for (var i=0; i<=forhindringer.length-1; i++){
        if( hitTest(birdie,forhindringer[i]) ){
            youAreGameover = true;
            createjs.Sound.play("audioGO2");

            var gameoverText = new createjs.Text(
                "OH NO! YOU HIT THE SCARECROW",
                "20px Montserrat",
                "#bd5b5b");
            gameoverText.lineWidth = 300;
            gameoverText.textAlign = "center";
            gameoverText.textBaseline = "middle";
            gameoverText.x = 400;
            gameoverText.y = 250;

            stage.addChild(gameoverText);

            birdie.scared();

            setTimeout(clearLevel,2500);
        }
    }

    if(farligtVand.length) {
        if (hitTest(birdie, farligtVand[0]) || hitTest(birdie, farligtVand[1])) {
            youAreGameover = true;
            createjs.Sound.play("audioGO1");
            birdie.gotoAndStop("drowning");

            var gameoverTextDrowning = new createjs.Text(
                "OH NO! YOU DROWNED BIRDIE",
                "20px Montserrat",
                "#bd5b5b");
            gameoverTextDrowning.lineWidth = 300;
            gameoverTextDrowning.textAlign = "center";
            gameoverTextDrowning.textBaseline = "middle";
            gameoverTextDrowning.x = 400;
            gameoverTextDrowning.y = 250;

            stage.addChild(gameoverTextDrowning);
            
            birdie.drowning();

            setTimeout(clearLevel, 2500);
        }
    }

    if(remainingTime<=0){
        youAreGameover = true;
        createjs.Sound.play("audioGO1");

        var gameoverTextDrowning = new createjs.Text(
            "Time's up, you need to hurry a bit more next time",
            "20px Montserrat",
            "#bd5b5b");
        gameoverTextDrowning.lineWidth = 300;
        gameoverTextDrowning.textAlign = "center";
        gameoverTextDrowning.textBaseline = "middle";
        gameoverTextDrowning.x = 400;
        gameoverTextDrowning.y = 250;

        stage.addChild(gameoverTextDrowning);

        setTimeout(clearLevel, 2500);
    }
}


/********** MOVE THE ELEMENTS OF THE GAME ***********/

//MAKE THIS INTO AN OBJECT THAT YOU CAN ASSIGN TO ANY OBJECT?
function moveObstacles() {
    for (var i = 0; i <= forhindringer.length-1; i++){
        forhindringer[i].x -= forhindringsfart;
    }
}

function moveWater() {
    for (var i = 0; i < vand.length; i++){
        vand[i].x-=0.5;
        if(vand[i].x <= -800){
            vand[i].x = 800;
        }
    }

    for (var j = 0; j < farligtVand.length; j++){
        farligtVand[j].x--;
        if(farligtVand[j].x <= -800){
            farligtVand[j].x = 800;
        }
    }
}

function moveBackgrounds() {
    if (birdie.x > 400 && (islandMushroom.x + islandMushroom.width) > 800 && birdie.direction == "right"){
        if(birdie.currentAnimation !== "right"){
            birdie.gotoAndPlay('right');
        }
        birdieStille = true;
        birdie.x += 0;
        for(var i = 0; i < backgrounds.length; i++){
            backgrounds[i].x -= speed;
        }
    }else if (birdie.x < 400 && islandTree.x < 0 && birdie.direction == "left"){
        if(birdie.currentAnimation !== "left"){
            birdie.gotoAndPlay('left');
        }
        birdieStille = true;
        birdie.x += 0;
        for(var j = 0; j < backgrounds.length; j++){
            backgrounds[j].x += speed;
        }
    }else{
        birdieStille = false;
    }
}

function moveBirdieFriends(){
    for (var i = 0; i < birdieFriends.length; i++){
        birdieFriends[i].x-=0.5;
    }
}


/********* CONTROL THE COUNTDOWN *********/

function countDownTimer() {
    if(!youAreGameover){
        setInterval( decreaseTime, 1000 );
    }
}

function decreaseTime(){
    if(!youAreGameover && !birdieIsHome && currentlyInGame){
        updateCountDown( -1 );
    }
}

function updateCountDown( timeDescrease ) {
    remainingTime += timeDescrease;
    countDown.text = "Time: " + remainingTime;

    if (remainingTime <= 5){
        countDown.color = "#bd5b5b";
    }
}


/******** UPDATE THE SCORE ********/

function showPointsGained(pointIncrease) {
    pointsGainedText = new createjs.Text(
        "Points +" + pointIncrease,
        "35px Montserrat",
        "#FFF");
    pointsGainedText.lineWidth = 800;
    pointsGainedText.textAlign = "center";
    pointsGainedText.textBaseline = "middle";
    pointsGainedText.x = 400;
    pointsGainedText.y = 150;

    stage.addChild(pointsGainedText);

    setTimeout(movePointsGainedText,500);
}

function movePointsGainedText() {
    createjs.Tween.get(pointsGainedText)
        .to({x:400, y:-100},500, createjs.Ease.easeInQuart);
    updatePoint(remainingTime);
}

function updatePoint(pointIncrease) {
    pointScore+=pointIncrease;
    pointText.text = "Points: " + pointScore;

    createjs.Tween.get(pointText)
        .to({scaleX:2, scaleY:2},500, createjs.Ease.easeInQuart).wait(500)
        .to({scaleX:1, scaleY:1},500, createjs.Ease.easeInQuart).wait(500);
}


/****** DETECTS WHICH KEYS ARE PRESSED *******/

function keyIsPressed(evt) {

    if(evt.code === "ArrowRight" && !youAreGameover){
        key.right=true;
    }

    if(evt.code === "ArrowLeft" && !youAreGameover){
        key.left=true;
    }

    if(evt.code === "ArrowUp" && !youAreGameover){
        key.up=true;
    }

    if(evt.code === "ArrowDown" && !youAreGameover){
        key.down=true;
    }

    if(evt.code === "Space" && !youAreGameover){
        key.space=true;
    }
}

function keyIsLifted(evt) {

    if(evt.code === "ArrowRight"){
        key.right=false;
    }

    if(evt.code === "ArrowLeft"){
        key.left=false;
    }

    if(evt.code === "ArrowUp"){
        key.up=false;
    }

    if(evt.code === "ArrowDown"){
        key.down=false;
    }

    if(evt.code === "Space" && !youAreGameover){
        key.space=false;
    }

}


window.addEventListener("keydown",keyIsPressed);
window.addEventListener("keyup",keyIsLifted);