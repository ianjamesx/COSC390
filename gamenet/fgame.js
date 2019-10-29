

var mouseX, mouseY;
var xMax, yMax;
var gameStage;
var mfield, lfield, pfield;

var players = [];

class Player {

	constructor(id){

			this.id = id || 0;

			//x and y coordinates
			this.xc = 0;
			this.yc = 0;

			//directional x and y values
			this.dx = 0;
			this.dy = 0;

			//x and y viewpoint (-x and -y with account for screen size)
			this.xView = 0;
			this.yView = 0;

			this.maxSpeed = 5;
			this.color = 0;
			this.image;

      this.lastUpdate = Date.now();

	}

		calcPosition(){

			//divide canvas-style grid by fourths

			var radians = Math.atan2(mouseY, mouseX), speed;

			//divide canvas-style grid by fourths

			var mouseDistX = Math.abs(mouseX / (xMax/4));
			var mouseDistY = Math.abs(mouseY / (yMax/4));

			if(mouseDistX > 1){ mouseDistX = 1; }
			if(mouseDistY > 1){ mouseDistY = 1; }

			//find best speed

			var xSpd = mouseDistX * this.maxSpeed;
			var ySpd = mouseDistY * this.maxSpeed;
			xSpd > ySpd ? speed = xSpd : speed = ySpd;

			this.dx = Math.cos(radians) * speed;
			this.dy = Math.sin(radians) * speed;

      //if(!((this.xc + this.dx + 25) > xMax || (this.xc + this.dx - 25) < 0)){
        this.xc += this.dx;
      //}

    //  if(!((this.yc + this.dy + 25) > yMax || (this.yc + this.dy - 25) < 0)){
        this.yc += this.dy;
    //  }

      lfield.text = "dx: " + this.dx + " | dy: " + this.dy;
      pfield.text = "xc: " + this.xc + " | yc: " + this.yc;

		}

		render(xc, yc){

      this.image = new createjs.Shape();
      this.image.graphics.beginFill("red").drawCircle(xc, yc, 50);
      this.image.x = xc;
      this.image.y = yc;
      this.image.regX = 25;
      this.image.regY = 25;
      gameStage.addChild(this.image);

			this.image.x = xc;
			this.image.y = yc;

			this.image.regX = 30;
			this.image.regY = 30;

		}

		//called from ticker

	updatePosition(){

		this.image.x = this.xc;
		this.image.y = this.yc;

	}

}

function mouseLoc(event){

  mouseX = (event.stageX - xMax/2);
  mouseY = (event.stageY - yMax/2);

  mfield.text = "mX: " + mouseX + " | mY: " + mouseY;

}

function gameLoop(event){

  var i;
  for(i in players){
    players[i].calcPosition();
    players[i].updatePosition();
  }

  gameStage.update(event);

}

function startGame(){

  xMax = window.innerWidth;
  yMax = window.innerHeight;

  gameStage = new createjs.Stage("gameCanvas");
  gameStage.addEventListener("stagemousemove", mouseLoc);
  gameStage.canvas.width = xMax;
  gameStage.canvas.height = yMax;
  $("#gameCanvas").css("backgroundColor", "#090909");

  //some debugging text fields
  mfield = new createjs.Text("mX: | mY: ", "20px Arial", "#FFFFFF");
  lfield = new createjs.Text("dx: | dy: ", "20px Arial", "#FFFFFF");
  pfield = new createjs.Text("xc: | yc: ", "20px Arial", "#FFFFFF");
  mfield.x = 200;
  mfield.y = 200;
  lfield.x = 200;
  lfield.y = 300;
  pfield.x = 200;
  pfield.y = 400;
  gameStage.addChild(mfield);
  gameStage.addChild(lfield);
  gameStage.addChild(pfield);

  createjs.Ticker.framerate = 66;
  createjs.Ticker.addEventListener("tick", gameLoop);

  //create a player
  var p1 = new Player();
  p1.render(xMax/2, yMax/2);
  players.push(p1);

}
