
var xcoord = [], ycoord = [];

function gameInit(){

  var stage = new createjs.Stage("gameCanvas");

  $("#gameCanvas").css("backgroundColor", "black");

/*  var circle = new createjs.Shape();
  circle.graphics.beginFill("red").drawCircle(0, 0, 50);
  circle.x = stage.canvas.width/2;
  circle.y = stage.canvas.height/2;
  stage.addChild(circle);
*/
  var polygon = new createjs.Shape();
  polygon.graphics.beginFill("red");
  polygon.graphics.moveTo(0, 60).lineTo(60, 60).lineTo(30, 90).lineTo(0, 60);
  polygon.x = stage.canvas.width/2 - 30;
  polygon.y = stage.canvas.height/2 - 1;
  polygon.regX = polygon.width/2;
  polygon.regY = polygon.height/2;

  var text = new createjs.Text("Game - Test Title", "36px Arial", "white");
  text.x = stage.canvas.width/2 - 140;
  text.y = stage.canvas.height/2 - 250;
  stage.addChild(text);

  var text2 = new createjs.Text("Game - Test Title", "36px Arial", "white");
  text2.x = stage.canvas.width/2 - 140;
  text2.y = stage.canvas.height/2 - 350;
  stage.addChild(text2);

  var xMax = window.innerWidth, yMax = window.innerHeight;

  alert(xMax +  ' - ' + yMax);

  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", function(event){

    polygon.rotation++;
    if(polygon.rotation > 360){
      polygon.rotation = 0;
    }

    text.text = "rotation: " + polygon.rotation;
    text2.text = "fps: " + Math.round(createjs.Ticker.getMeasuredFPS());

    stage.update(event);

    gameCanvas.addEventListener("stagemousemove", mouseLoc);

  });

  stage.on("stagemousemove", function(evt){

    xcoord.push(event.stageX - xMax/2);
    ycoord.push(event.stageY - yMax/2);

    //console.log(event.stageX + ' - ' + event.stageY);

    console.log("stageX/Y: "+evt.stageX+","+evt.stageY); // always in bounds
    console.log("rawX/Y: "+evt.rawX+","+evt.rawY); // could be < 0, or > width/height

  });

  stage.addChild(polygon);
  stage.update();

}

function mouseLoc(event){

  xcoord.push(event.stageX - Game.xMax/2);
  ycoord.push(event.stageY - Game.yMax/2);

  console.log(event.stageX + ' - ' + event.stageY);

}
