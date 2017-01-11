var introText, keyControls, controlText, textFormation;


function introText(evt) {

    introText = new createjs.Text(
        "It is getting cold in the North. Birdie was supposed to head South months ago. Are you ready to help him get safe to Morroc?",
        "18px Montserrat",
        "#000");
    introText.textAlign = "center";
    introText.lineWidth = 400;
    introText.x = 400;
    introText.y = 200;
    Object.assign(introText, textFormation);

    controlText = new createjs.Text(
        "(press enter for next)",
        "14px Montserrat",
        "#000");
    controlText.textAlign = "center";
    controlText.x = 400;
    controlText.y = 300;

    stage.addChild(introText, controlText);
    stage.update(evt);

    window.addEventListener("keyup", function(evt) {
        evt.preventDefault();

        if (evt.key == "Enter") {
            stage.removeAllChildren();
            controls();
        }

        if (evt.key == "Escape") {
            canvas.style.display = "none";
            mapSvg.style.display = "block";

            stage.removeAllChildren();
            loadMap();
        }
    });
}

function controls(evt){
    
    keyControls = new createjs.Bitmap(queue.getResult("keyControls"));
    keyControls.x = (800-283)/2;
    keyControls.y = 150;

    controlText.text = "(press enter to play)";
    
    stage.addChild(keyControls, controlText);
    stage.update(evt);

    window.addEventListener("keyup", function(evt) {
        evt.preventDefault();
        if (evt.key == "Enter") {
            canvas.style.display = "none";
            mapSvg.style.display = "block";

            stage.removeAllChildren();
            loadMap();
        }
    });
}