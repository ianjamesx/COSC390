/*
core gameplay mechanics
movement, collision, etc
*/

var mechanics = {

  movePlayer: function(player){

    var now = Date.now();                               //get new timestamp
    player.delta = now - player.lastUpdate;             //update time since last frame
    player.lastUpdate = now;                            //update players last timestamp
    var delta = player.maxSpeed * (player.delta/1000);  //get time since last frame
    this.calculatePlayerPosition(player, delta);        //move player to next position, adjusting for time since last frame

  },

  calculatePlayerPosition: function(player, deltaSpeed){

    var radians = Math.atan2(player.mouseY, player.mouseX), speed;

    //if mouse is closer to player, slow down
    var mouseDistX = Math.abs(player.mouseX / (player.xMax/4));
    var mouseDistY = Math.abs(player.mouseY / (player.yMax/4));

    if(mouseDistX > 1) mouseDistX = 1;
    if(mouseDistY > 1) mouseDistY = 1;

    //find best speed (depending on if mouseX or mouseY is further, and on time since last frame)
    var xSpd = mouseDistX * deltaSpeed;
    var ySpd = mouseDistY * deltaSpeed;
    xSpd > ySpd ? speed = xSpd : speed = ySpd;

    //find new directional value increments
    player.dx = Math.trunc(Math.cos(radians) * speed);
    player.dy = Math.trunc(Math.sin(radians) * speed);

    //do not allow player to move in direction if it is out of bounds

    if(!((player.xc + player.dx + 25) > this.arenaSize || //leaving by going too far right
        (player.xc + player.dx - 25) < 0)){               //leaving by going too far left

      this.xc += player.dx;

    }

    if(!((player.yc + player.dy + 25) > this.arenaSize || //leaving by going too far down
        (player.yc + player.dy - 25) < 0)){               //leaving by going too far up

      player.yc += player.dy;

    }

  },

  proximity: function(obj1, obj2, range){

    proximObj = this.getProximityObj(obj1, range); //convert object to proximity object

    if(proximObj.pnx < obj2.xc && obj2.xc < proximObj.ppx &&
       proximObj.pny < obj2.yc && obj2.yc < proximObj.ppy){
      return true; //in range
    }

    return false; //out of range

  },

  getProximityObj: function(obj, range){

    var negX = obj.xc - proximity,
        posX = obj.xc + proximity,
        negY = obj.yc - proximity,
        posY = obj.yc + proximity;

    return {

      pnx: negX,
      ppx: posX,
      pny: negY,
      ppy: posY

    };

  },

  circularCollision: function(x1, y1, r1, x2, y2, r2){

    var dx = x1 - x2,
        dy = y1 - y2;

    var distance = Math.sqrt((dx * dx) + (dy * dy)); //distance formula (kinda)

    if (distance < r1 + r2){
      return true;
    }
    return false;

  },

  circleRectangleCollision: function(cx, cy, radius, rx, ry, rw, rh){

    // temporary variables to set edges for testing
    var testX = cx, testY = cy;

    // which edge is closest?
    if (cx < rx) testX = rx;               // test left edge
    else if (cx > rx+rw) testX = rx+rw;   // right edge

    if (cy < ry) testY = ry;              // top edge
    else if (cy > ry+rh) testY = ry+rh;   // bottom edge

    // get distance from closest edges
    var distX = cx - testX,
        distY = cy - testY,
        distance = Math.sqrt((distX*distX) + (distY*distY));

    // if the distance is less than the radius, collision!
    if (distance <= radius){
      return true;
    }
    return false;

  },

  rectangleCollision: function(r1x, r2x, r1w, r1h, r2x, r2y, r2w, r2h){

    if(r1x < r2x + r2w &&
       r1x + r1w > r2x &&
       r1y < r2y + r2h &&
       r1y + r1h > r2y){
      return true;
    }
    return false;

  },

};

module.exports = mechanics;
