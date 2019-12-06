
class Player {

	constructor(id){

			this.id = id;
			this.mainPlayer = true;

			//x and y coordinates

			this.xc = 0;
			this.yc = 0;

			//directional x and y values

			this.dx = 0;
			this.dy = 0;

			//x and y viewpoint (-x and -y with account for screen size)

			this.xView = 0;
			this.yView = 0;

			this.camera = false;
			this.maxSpeed = 360;
			this.alive = false;
			this.active = false;
			this.color = 0;
			this.image;
			this.name = "";
			this.started = false;
			this.orbitCount = 0;
			this.orbitMax = 5;

	}

	deltaPosition(){

			this.lastUpdate = Date.now();

	    var self = this;

	    this.calcInterval = setInterval(function(){

	      var now = Date.now();

	      self.delta = now - self.lastUpdate;

	      self.lastUpdate = now;

	      var delta = self.maxSpeed * (self.delta/1000);

	      //update after we have the delta

	      self.calcPosition(delta);

	    }, 1000/Game.fps);

		}

		calcPosition(delta){

			//divide canvas-style grid by fourths

			var radians = Math.atan2(Game.mouseY, Game.mouseX), speed;

			//divide canvas-style grid by fourths

			var mouseDistX = Math.abs(Game.mouseX / (Game.xMax/4));
			var mouseDistY = Math.abs(Game.mouseY / (Game.yMax/4));

			if(mouseDistX > 1){ mouseDistX = 1; }
			if(mouseDistY > 1){ mouseDistY = 1; }

			//find best speed

			var xSpd = mouseDistX * delta;
			var ySpd = mouseDistY * delta;
			xSpd > ySpd ? speed = xSpd : speed = ySpd;

			this.dx = Math.cos(radians) * speed;
			this.dy = Math.sin(radians) * speed;

			//if they're going to go offscreen

			//but predict with their actual location (50ms in future)
			//not tweening location

			var numOfFrames = 25/(1000/Game.fps),
					futureX = this.xc + (this.dx * numOfFrames),
					futureY = this.yc + (this.dy * numOfFrames);

			if(((futureX + this.dx + 25) > Game.arenaSize || (futureX + this.dx - 25) < 0)){

				this.dx = 0;

	    }

			if(((futureY + this.dy + 25) > Game.arenaSize || (futureY + this.dy - 25) < 0)){

				this.dy = 0;

	    }

		}

		render(xc, yc){

			var color = Game.userColor;

			this.image = new createjs.Bitmap(Visuals.getPlayerImage(color));
			containers.playerHolder.addChild(this.image);

			this.image.x = xc;
			this.image.y = yc;

			this.image.regX = 30;
			this.image.regY = 30;

			if(settings.showNames){

				this.txt = new createjs.Text(this.name, "20px Helvetica", "#FFFFFF");
				this.txt.alpha = .4;
				this.txt.textAlign = "center";
				containers.nameHolder.addChild(this.txt);

				this.txt.x = xc;
				this.txt.y = yc + 75;

			}

			this.color = color;

		}

		//called from ticker

	updatePosition(stage){

		var image = this.image;

		image.x = this.xc;
		image.y = this.yc;

		//name field

		if(settings.showNames){

			var text = this.txt;
			text.x = this.xc;
			text.y = this.yc + 75;

			//small motion on name

			text.x += (-Game.mouseX / 240);
			text.y += (-Game.mouseY / 240);

		}

	}

	updateCameraPosition(stage){

		//set an offset for when the player zooms out

		var xOffset = -(this.xc * Game.zoom) + this.xc,
				yOffset = -(this.yc * Game.zoom) + this.yc;

		stage.x = this.xView + xOffset;
		stage.y = this.yView + yOffset;

	}

	updateToServerPosition(xc, yc, servTime){

		//player recieving regular updates

		createjs.Tween.removeTweens(this);

	  //get number of frames that pass in 50ms

	  var numOfFrames = 50/(1000/Game.fps);

	  //increment position of player to their estimated position in 50ms

	  var newX = xc + (this.dx * numOfFrames),
				newY = yc + (this.dy * numOfFrames),

				viewX = (-xc + (Game.xMax/2)) - (this.dx * numOfFrames),
				viewY = (-yc + (Game.yMax/2)) - (this.dy * numOfFrames),

				lag = Game.getLatency(servTime);

	  createjs.Tween.get(this).to({xc: newX, yc: newY, xView: viewX, yView: viewY}, (50 + lag), createjs.Ease.linear);

	}

	updateToSpawnPoint(xc, yc){

		//player recieving their respawn position

		var viewX = -xc + (Game.xMax/2),
				viewY = -yc + (Game.yMax/2);

		this.render(xc, yc);
		this.deltaPosition();

		this.camera = true;
		this.alive = true;

		this.xView = viewX;
		this.yView = viewY;
		this.xc = xc;
		this.yc = yc;

		//zoom in a little bit to look cool

		Game.scaleArena(1, 1600);

		setTimeout(function(){

			cacheStage.addEventListener("stagemousemove", Game.mouseLoc);
			cacheStage.addEventListener("stagemouseup", Game.fire);

		}, 250);

	}

	reset(){

		this.alive = false;
		this.dx = 0;
		this.dy = 0;
		this.orbitCount = 0;
		this.orbitMax = 5;
		this.maxSpeed = 360;
		this.active = false;

		containers.playerHolder.removeChild(this.image);
		containers.nameHolder.removeChild(this.txt);

		clearInterval(this.calcInterval);

		//put slight timeout on camera to let next interpolation finish

		setTimeout(() => {

			this.camera = false;

		}, 100);

	}

}

class Enemy {

	//enemy players

	constructor(name, color, id, xc, yc){

		this.xc = xc;
		this.yc = yc;
		this.id = id;
		this.color = color;
		this.name = name;
		this.showName = settings.showNames;

	}

	render(){

		this.image = new createjs.Bitmap(Visuals.getPlayerImage(this.color));
		containers.playerHolder.addChild(this.image);

		this.image.alpha = 0;
		Visuals.fadeImg(this.image, 1, 300);

		this.image.regX = 30;
		this.image.regY = 30;

		if(this.showName){

			this.renderName();

		}

	}

	renderName(){

		this.txt = new createjs.Text(this.name, "20px Helvetica", "#FFFFFF");
		this.txt.textAlign = "center";
		this.txt.alpha = .4;
		containers.nameHolder.addChild(this.txt);

	}

	removeName(){

		containers.nameHolder.removeChild(this.txt);

	}

	remove(){

		createjs.Tween.removeTweens(this);
		containers.playerHolder.removeChild(this.image);

		if(this.showName){

			this.removeName();

		}

		delete players[this.id];

	}

	updateToServerPosition(newX, newY, lag){

		createjs.Tween.removeTweens(this);

	  createjs.Tween.get(this).to({xc: newX, yc: newY}, (40 + lag), createjs.Ease.linear);

	}

	updatePosition(){

		var image = this.image;
		var text = this.txt;

		image.x = this.xc;
		image.y = this.yc;

		if(this.showName){

			text.x = this.xc;
			text.y = this.yc + 75;

		}

	}

}
